'use client';

import React, { useEffect, useState } from 'react';
import {
  CaptionCue,
  CaptionPreset,
  CaptionSafeZone,
  CaptionStyleConfig,
} from '@/lib/captions/types';
import {
  getActiveCueAtTime,
  getCaptionPresetConfig,
  getSafeZoneAnchorClass,
} from '@/lib/captions/captions.test';
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  MessageCircle,
  Share2,
  Music2,
  Eye,
  ShieldAlert,
} from 'lucide-react';

interface VideoCaptionPreviewProps {
  title: string;
  cues: CaptionCue[];
  durationMs: number;
  preset: CaptionPreset;
  safeZonePosition: CaptionSafeZone;
  styleConfig?: Partial<CaptionStyleConfig>;
  currentTimeMs: number;
  onTimeChange: (ms: number) => void;
}

export function VideoCaptionPreview({
  title,
  cues,
  durationMs,
  preset,
  safeZonePosition,
  styleConfig,
  currentTimeMs,
  onTimeChange,
}: VideoCaptionPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);

  const safeDuration = Math.max(2000, durationMs || 12000);
  const presetConfig = getCaptionPresetConfig(preset);
  const anchorClass = getSafeZoneAnchorClass(safeZonePosition);
  const activeCue = getActiveCueAtTime(cues, currentTimeMs);

  const mergedStyle: CaptionStyleConfig = {
    ...presetConfig.style,
    ...(styleConfig || {}),
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onTimeChange((currentTimeMs + 100) % safeDuration);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, currentTimeMs, safeDuration, onTimeChange]);

  const renderHighlightedText = (cue: CaptionCue) => {
    const rawWords = cue.text.split(' ');
    const targetClean = (cue.highlightWord || '')
      .toLowerCase()
      .replace(/[.,!?;:"'()[\]]/g, '');

    return (
      <>
        {rawWords.map((word, idx) => {
          const cleanWord = word.toLowerCase().replace(/[.,!?;:"'()[\]]/g, '');
          const isHighlighted =
            targetClean.length > 0 && cleanWord === targetClean;

          return (
            <React.Fragment key={idx}>
              <span
                className={
                  isHighlighted
                    ? `${presetConfig.highlightClass} inline-block transform scale-105 transition-transform`
                    : ''
                }
                style={
                  isHighlighted && styleConfig?.highlightColor
                    ? { color: styleConfig.highlightColor }
                    : undefined
                }
              >
                {mergedStyle.uppercase ? word.toUpperCase() : word}
              </span>
              {idx < rawWords.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        })}
        {mergedStyle.autoEmoji && cue.emoji ? (
          <span className="ml-1.5 inline-block animate-bounce">{cue.emoji}</span>
        ) : null}
      </>
    );
  };

  const formatSec = (ms: number) => (ms / 1000).toFixed(1) + 's';

  return (
    <div className="flex flex-col items-center">
      {/* Top Controls above Phone Frame */}
      <div className="w-full max-w-[320px] flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          Simulador 9:16 (Reels / Shorts)
        </span>
        <button
          type="button"
          onClick={() => setShowSafeZones((prev) => !prev)}
          className={`text-[11px] px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${
            showSafeZones
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          Safe Zones
        </button>
      </div>

      {/* 9:16 Smartphone Frame */}
      <div className="relative w-[310px] h-[550px] rounded-[36px] border-[6px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
        {/* Dynamic Visual Background simulating vertical video */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-12 -right-12 w-56 h-56 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Speaker Notch */}
        <div className="relative z-20 flex justify-center pt-2.5">
          <div className="w-24 h-4 rounded-full bg-black/80 border border-slate-800/80" />
        </div>

        {/* Safe Zone Top Indicator */}
        {showSafeZones && (
          <div className="absolute top-0 inset-x-0 h-[14%] border-b border-dashed border-amber-400/40 bg-amber-500/5 z-10 flex items-end justify-center pb-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-amber-300/80">
              Topo da Rede Social (Evitar)
            </span>
          </div>
        )}

        {/* Active Burn-in Caption Layer */}
        <div
          className={`absolute inset-x-4 z-30 flex justify-center pointer-events-none transition-all duration-150 ${anchorClass}`}
        >
          {activeCue ? (
            <div
              className={`${presetConfig.containerClass} max-w-[92%] text-center transition-all duration-150`}
            >
              <p
                className={`${presetConfig.textClass} leading-snug`}
                style={{ fontSize: `${mergedStyle.fontSizePx}px` }}
              >
                {renderHighlightedText(activeCue)}
              </p>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-[11px] text-slate-400">
              (Sem fala neste instante)
            </div>
          )}
        </div>

        {/* Right Side Social Action Icons (Safe Zone Simulation) */}
        <div
          className={`absolute right-2.5 bottom-24 z-20 flex flex-col items-center gap-4 ${
            showSafeZones
              ? 'p-1.5 rounded-xl border border-dashed border-amber-400/40 bg-amber-500/5'
              : 'opacity-70'
          }`}
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </div>
            <span className="text-[9px] text-white/80 font-medium">14.2K</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-[9px] text-white/80 font-medium">842</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[9px] text-white/80 font-medium">3.1K</span>
          </div>
        </div>

        {/* Bottom Metadata Overlay (Safe Zone Footer) */}
        <div
          className={`relative z-20 p-3.5 pt-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${
            showSafeZones ? 'border-t border-dashed border-amber-400/40' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
              HF
            </div>
            <span className="text-xs font-bold text-white">@hupflow.studio</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/15 text-white">
              Seguir
            </span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-1 pr-10">
            {title || 'Vídeo curto com legendas dinâmicas IA'}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
            <Music2 className="w-3 h-3 text-indigo-400" />
            <span>Áudio Original • HupFlow AI Subtitles</span>
          </div>
        </div>
      </div>

      {/* Player Transport & Scrubber Bar */}
      <div className="w-full max-w-[320px] mt-4 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onTimeChange(0)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Reiniciar em 0s"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs font-mono text-slate-300">
            <span className="text-indigo-400 font-bold">
              {formatSec(currentTimeMs)}
            </span>{' '}
            / {formatSec(safeDuration)}
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={safeDuration}
          step={50}
          value={Math.min(currentTimeMs, safeDuration)}
          onChange={(e) => {
            setIsPlaying(false);
            onTimeChange(Number(e.target.value));
          }}
          className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Preset: {presetConfig.label}</span>
          <span>{cues.length} blocos sincronizados</span>
        </div>
      </div>
    </div>
  );
}
