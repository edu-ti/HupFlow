'use client';

import React from 'react';
import { VoiceoverTrackItem } from '@/lib/voiceover/types';
import { Mic, Play, Pause, Clock, Trash2 } from 'lucide-react';

interface VoiceoverTrackCardProps {
  track: VoiceoverTrackItem;
  onDelete?: (id: string) => void;
}

export function VoiceoverTrackCard({ track, onDelete }: VoiceoverTrackCardProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const statusBadgeColor: Record<string, string> = {
    ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    generating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const badgeClass = statusBadgeColor[track.status] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Mic className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-zinc-100 line-clamp-1">{track.title}</h3>
          </div>
          <p className="text-xs text-zinc-400 line-clamp-2 italic pl-8">
            "{track.scriptText}"
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeClass}`}>
            {track.status === 'ready' ? 'Pronto' : track.status === 'generating' ? 'Sintetizando...' : 'Falha'}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(track.id)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Excluir faixa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Voice info & Audio bar */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-200">{track.voiceName}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              {track.language} • {track.persona.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>{track.speed}x vel</span>
            <span>{track.pitch}</span>
          </div>
        </div>

        {/* Fake / Interactive Waveform Preview */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow transition-transform active:scale-95 shrink-0"
            title={isPlaying ? 'Pausar áudio' : 'Ouvir amostra'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <div className="flex-1 flex items-center gap-1 h-6">
            {[40, 65, 30, 85, 95, 50, 75, 100, 60, 45, 80, 70, 90, 55, 35, 75, 85, 40, 60, 30, 70, 90, 45, 60, 80, 50].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-zinc-700'
                }`}
                style={{ height: `${h}%`, animationDelay: `${i * 45}ms` }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono shrink-0">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>{track.durationSeconds}s</span>
          </div>
        </div>
      </div>

      {/* Meta tags and word count */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          {track.tags.map((tag: string) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400">
              #{tag}
            </span>
          ))}
        </div>
        <div className="text-[11px]">
          {track.wordCount} palavras
        </div>
      </div>
    </div>
  );
}
