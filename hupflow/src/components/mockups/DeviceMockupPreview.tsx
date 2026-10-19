'use client';

import React, { useState, useRef } from 'react';
import {
  DeviceType,
  DeviceOrientation,
  MockupTheme,
  ShadowStyle,
  MediaType,
} from '@/lib/mockups/types';
import {
  calculateDeviceDimensions,
  getDeviceColors,
} from '@/lib/mockups/mockups-utils';
import {
  Smartphone,
  Tablet,
  Laptop,
  RotateCw,
  Copy,
  Check,
  Download,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface DeviceMockupPreviewProps {
  deviceType: DeviceType;
  orientation?: DeviceOrientation;
  finishColor?: MockupTheme;
  shadowStyle?: ShadowStyle;
  mediaType?: MediaType;
  mediaUrl: string;
  backgroundColorHex?: string;
  perspectiveTiltX?: number;
  perspectiveTiltY?: number;
  onExportPng?: () => void;
}

export function DeviceMockupPreview({
  deviceType,
  orientation = 'portrait',
  finishColor = 'titanium_black',
  shadowStyle = 'floating_3d',
  mediaType = 'image',
  mediaUrl,
  backgroundColorHex = '#09090b',
  perspectiveTiltX = 0,
  perspectiveTiltY = 0,
}: DeviceMockupPreviewProps) {
  const [tiltX, setTiltX] = useState(perspectiveTiltX);
  const [tiltY, setTiltY] = useState(perspectiveTiltY);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dim = calculateDeviceDimensions(deviceType, orientation);
  const colors = getDeviceColors(finishColor);
  const screenX = (dim.outerWidth - dim.screenWidth) / 2;
  const screenY = (dim.outerHeight - dim.screenHeight) / 2;

  const shadowClass =
    shadowStyle === 'floating_3d'
      ? 'shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8),0_20px_25px_-5px_rgba(0,0,0,0.4)]'
      : shadowStyle === 'soft'
      ? 'shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)]'
      : 'shadow-none';

  const copySvg = () => {
    const svgStr = containerRef.current?.querySelector('svg')?.outerHTML;
    if (svgStr) {
      navigator.clipboard.writeText(svgStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 3D Canvas Container */}
      <div
        className="w-full flex items-center justify-center p-8 rounded-2xl border border-zinc-800 transition-all overflow-hidden min-h-[500px]"
        style={{
          backgroundColor: backgroundColorHex,
          perspective: '1200px',
        }}
      >
        <div
          ref={containerRef}
          className={`relative transition-transform duration-200 ease-out select-none ${shadowClass}`}
          style={{
            width: dim.outerWidth,
            height: dim.outerHeight,
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Base SVG Frame */}
          <svg
            viewBox={`0 0 ${dim.outerWidth} ${dim.outerHeight}`}
            width={dim.outerWidth}
            height={dim.outerHeight}
            className="w-full h-full"
          >
            <defs>
              <clipPath id={`previewClip-${deviceType}-${orientation}`}>
                <rect
                  x={screenX}
                  y={screenY}
                  width={dim.screenWidth}
                  height={dim.screenHeight}
                  rx={dim.screenBorderRadius}
                />
              </clipPath>
              <linearGradient id="glossHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Chassis Shell */}
            <rect
              x="2"
              y="2"
              width={dim.outerWidth - 4}
              height={dim.outerHeight - 4}
              rx={dim.borderRadius}
              fill={colors.bodyFill}
              stroke={colors.borderStroke}
              strokeWidth="3.5"
            />

            {/* Inner Dark Bezel */}
            <rect
              x={screenX - 2}
              y={screenY - 2}
              width={dim.screenWidth + 4}
              height={dim.screenHeight + 4}
              rx={dim.screenBorderRadius + 2}
              fill={colors.innerBezel}
            />

            {/* Screen Media */}
            <g clipPath={`url(#previewClip-${deviceType}-${orientation})`}>
              {mediaType === 'video' ? (
                <foreignObject
                  x={screenX}
                  y={screenY}
                  width={dim.screenWidth}
                  height={dim.screenHeight}
                >
                  <video
                    src={mediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </foreignObject>
              ) : (
                <image
                  href={mediaUrl}
                  x={screenX}
                  y={screenY}
                  width={dim.screenWidth}
                  height={dim.screenHeight}
                  preserveAspectRatio="xMidYMid slice"
                />
              )}

              {/* Glossy Overlay */}
              <rect
                x={screenX}
                y={screenY}
                width={dim.screenWidth}
                height={dim.screenHeight}
                fill="url(#glossHighlight)"
                pointerEvents="none"
              />
            </g>

            {/* Hardware: iPhone Dynamic Island */}
            {deviceType === 'iphone_16_pro' && orientation === 'portrait' && (
              <rect
                x={dim.outerWidth / 2 - 55}
                y={screenY + 12}
                width="110"
                height="30"
                rx="15"
                fill="#000000"
              />
            )}

            {/* Hardware: MacBook Air Notch */}
            {deviceType === 'macbook_air' && (
              <path
                d={`M ${dim.outerWidth / 2 - 40} ${screenY} h 80 v 14 a 4 4 0 0 1 -4 4 h -72 a 4 4 0 0 1 -4 -4 Z`}
                fill="#000000"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Perspective Quick Controls */}
      <div className="flex items-center gap-4 text-xs text-zinc-400 bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <span>Inclinação X:</span>
          <input
            type="range"
            min="-20"
            max="20"
            value={tiltX}
            onChange={e => setTiltX(Number(e.target.value))}
            className="w-20 accent-indigo-500 cursor-pointer"
          />
          <span className="font-mono text-white w-6">{tiltX}°</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Inclinação Y:</span>
          <input
            type="range"
            min="-25"
            max="25"
            value={tiltY}
            onChange={e => setTiltY(Number(e.target.value))}
            className="w-20 accent-indigo-500 cursor-pointer"
          />
          <span className="font-mono text-white w-6">{tiltY}°</span>
        </div>

        <button
          onClick={() => {
            setTiltX(0);
            setTiltY(0);
          }}
          className="p-1 hover:text-white transition text-zinc-500"
          title="Resetar perspectiva"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-zinc-700" />

        <button
          onClick={copySvg}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          Copiar SVG
        </button>
      </div>
    </div>
  );
}
