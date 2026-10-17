'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Smartphone,
  Square,
  Shield,
  Layers,
} from 'lucide-react';
import {
  WatermarkPosition,
  WatermarkType,
} from '@/lib/watermark/types';

interface WatermarkPreviewCardProps {
  position: WatermarkPosition;
  watermarkType: WatermarkType;
  opacity: number; // 10 a 100
  scalePercent: number; // 5 a 35
  marginPx: number;
  customText?: string | null;
  logoUrl?: string | null;
}

export function WatermarkPreviewCard({
  position,
  watermarkType,
  opacity,
  scalePercent,
  marginPx,
  customText,
  logoUrl,
}: WatermarkPreviewCardProps) {
  const [aspectMode, setAspectMode] = useState<'1:1' | '9:16'>('1:1');

  // Mapeamento CSS de posicionamento
  const getPositionClasses = () => {
    switch (position) {
      case 'top_left':
        return 'top-0 left-0 items-start justify-start';
      case 'top_right':
        return 'top-0 right-0 items-start justify-end';
      case 'bottom_left':
        return 'bottom-0 left-0 items-end justify-start';
      case 'bottom_right':
        return 'bottom-0 right-0 items-end justify-end';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center';
    }
  };

  const displayText = customText || '@hupflow';
  const effectiveMargin = Math.max(8, Math.min(48, Math.round(marginPx * 0.75)));
  const effectiveScale = Math.max(0.6, Math.min(1.4, scalePercent / 15));

  return (
    <div className="space-y-3">
      {/* Seletor de Formato */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary" />
          Simulação de Mídia
        </span>
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setAspectMode('1:1')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              aspectMode === '1:1'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Square className="w-3 h-3" />
            1:1 Feed
          </button>
          <button
            type="button"
            onClick={() => setAspectMode('9:16')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              aspectMode === '9:16'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            9:16 Stories
          </button>
        </div>
      </div>

      {/* Caixa do Preview */}
      <div className="flex items-center justify-center p-6 rounded-xl border border-border/80 bg-slate-950/80 overflow-hidden">
        <div
          className={`relative rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all ${
            aspectMode === '1:1' ? 'w-72 h-72' : 'w-56 h-96'
          }`}
          style={{
            background:
              'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
          }}
        >
          {/* Mockup de Imagem de Fundo (Grades e Iluminação) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Conteúdo central decorativo do post */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/40 pointer-events-none space-y-2">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400/60" />
            </div>
            <p className="text-xs font-medium tracking-wide uppercase text-white/50">
              Sua Publicação
            </p>
          </div>

          {/* Selo de Marca d'Água Overlay */}
          <div
            className={`absolute flex transition-all pointer-events-none ${getPositionClasses()}`}
            style={{
              padding: position === 'center' ? '0px' : `${effectiveMargin}px`,
              opacity: opacity / 100,
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg transition-transform"
              style={{
                transform: `scale(${effectiveScale})`,
                transformOrigin:
                  position === 'top_left'
                    ? 'top left'
                    : position === 'top_right'
                    ? 'top right'
                    : position === 'bottom_left'
                    ? 'bottom left'
                    : position === 'bottom_right'
                    ? 'bottom right'
                    : 'center center',
              }}
            >
              {/* Logotipo */}
              {(watermarkType === 'logo' || watermarkType === 'combined') && (
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-md"
                    />
                  ) : (
                    <Shield className="w-3 h-3 text-white" />
                  )}
                </div>
              )}

              {/* Texto / Handle */}
              {(watermarkType === 'text' || watermarkType === 'combined') && (
                <span className="text-[11px] font-semibold tracking-tight text-white whitespace-nowrap">
                  {displayText}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
