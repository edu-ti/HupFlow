'use client';

import React, { useState } from 'react';
import { DailyMetricPoint } from '@/lib/analytics/types';

interface Props {
  data: DailyMetricPoint[];
  height?: number;
}

export function AnalyticsAreaChart({ data, height = 300 }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    point: DailyMetricPoint;
    x: number;
    y: number;
  } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="w-full flex items-center justify-center text-xs text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800"
      >
        Nenhum dado para o período selecionado
      </div>
    );
  }

  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  // Encontra os valores máximos para escala Y
  const maxImpressions = Math.max(...data.map((d) => d.impressions), 10);
  const maxReach = Math.max(...data.map((d) => d.reach), 10);
  const maxY = Math.ceil(Math.max(maxImpressions, maxReach) * 1.15);

  const getX = (index: number) => {
    if (data.length <= 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingY + chartHeight - (val / maxY) * chartHeight;
  };

  // Monta os paths de SVG para Impressões e Alcance
  const buildPath = (values: number[]) => {
    return values.reduce((acc, val, i) => {
      const x = getX(i);
      const y = getY(val);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const impressionsLinePath = buildPath(data.map((d) => d.impressions));
  const reachLinePath = buildPath(data.map((d) => d.reach));

  const impressionsAreaPath = `${impressionsLinePath} L ${getX(data.length - 1)} ${paddingY + chartHeight} L ${getX(0)} ${paddingY + chartHeight} Z`;
  const reachAreaPath = `${reachLinePath} L ${getX(data.length - 1)} ${paddingY + chartHeight} L ${getX(0)} ${paddingY + chartHeight} Z`;

  // Rótulos do Eixo X (amostragem uniforme de 5 pontos)
  const step = Math.max(1, Math.floor(data.length / 5));
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
          <span className="text-zinc-300 font-medium">Impressões</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
          <span className="text-zinc-300 font-medium">Alcance</span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <defs>
          <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Linhas de Grade Horizontais */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = paddingY + chartHeight * (1 - pct);
          const labelVal = Math.round(maxY * pct);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={paddingX + chartWidth}
                y2={y}
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 10}
                y={y + 3}
                fill="#71717a"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal}
              </text>
            </g>
          );
        })}

        {/* Áreas preenchidas com gradientes */}
        <path d={impressionsAreaPath} fill="url(#impressionsGrad)" />
        <path d={reachAreaPath} fill="url(#reachGrad)" />

        {/* Linhas de traçado */}
        <path
          d={impressionsLinePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={reachLinePath}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pontos Interativos com Hover */}
        {data.map((point, i) => {
          const cx = getX(i);
          const cyImp = getY(point.impressions);
          const isHovered = hoveredPoint?.point.date === point.date;

          return (
            <g
              key={point.date}
              className="cursor-pointer"
              onMouseEnter={() =>
                setHoveredPoint({
                  point,
                  x: cx,
                  y: cyImp,
                })
              }
            >
              {/* Círculo invisível maior para facilitar hover */}
              <circle cx={cx} cy={cyImp} r="16" fill="transparent" />

              {/* Ponto visível quando hovered ou em destaques */}
              {(isHovered || i === data.length - 1) && (
                <>
                  <circle
                    cx={cx}
                    cy={cyImp}
                    r={isHovered ? 6 : 4}
                    fill="#6366f1"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                  <circle
                    cx={cx}
                    cy={getY(point.reach)}
                    r={isHovered ? 6 : 4}
                    fill="#22d3ee"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                </>
              )}
            </g>
          );
        })}

        {/* Rótulos de Data no Eixo X */}
        {xLabels.map((item) => {
          const index = data.findIndex((d) => d.date === item.date);
          const x = getX(index);
          const dateFormatted = `${item.date.slice(8, 10)}/${item.date.slice(5, 7)}`;
          return (
            <text
              key={item.date}
              x={x}
              y={svgHeight - 6}
              fill="#a1a1aa"
              fontSize="10"
              textAnchor="middle"
              className="font-mono"
            >
              {dateFormatted}
            </text>
          );
        })}
      </svg>

      {/* Tooltip Dinâmico */}
      {hoveredPoint && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 bg-zinc-900/95 border border-zinc-700/80 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md text-xs space-y-1"
          style={{
            left: `${(hoveredPoint.x / svgWidth) * 100}%`,
            top: `${(hoveredPoint.y / svgHeight) * 100}%`,
          }}
        >
          <p className="font-semibold text-zinc-300 border-b border-zinc-800 pb-1">
            {hoveredPoint.point.date}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-indigo-400">Impressões:</span>
            <span className="font-mono text-zinc-100 font-bold">
              {hoveredPoint.point.impressions.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-cyan-400">Alcance:</span>
            <span className="font-mono text-zinc-100 font-bold">
              {hoveredPoint.point.reach.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-emerald-400">Interações:</span>
            <span className="font-mono text-zinc-100 font-bold">
              {hoveredPoint.point.engagements.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
