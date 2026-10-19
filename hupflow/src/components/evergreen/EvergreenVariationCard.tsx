'use client';

import React, { useState } from 'react';
import { EvergreenItem } from '@/lib/evergreen/types';
import {
  isEligibleForRecycle,
  pickNextVariationForCycle,
} from '@/lib/evergreen/evergreen-utils';
import {
  Repeat,
  Sparkles,
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface EvergreenVariationCardProps {
  item: EvergreenItem;
  onRecycle: (itemId: string, force: boolean) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
}

export function EvergreenVariationCard({
  item,
  onRecycle,
  onDelete,
}: EvergreenVariationCardProps) {
  const [selectedVarIdx, setSelectedVarIdx] = useState(
    item.recycleCount % Math.max(1, item.variations.length)
  );
  const [recycling, setRecycling] = useState(false);

  const eligibility = isEligibleForRecycle(item);
  const nextAutoVariation = pickNextVariationForCycle(
    item.variations,
    item.recycleCount
  );

  async function handleRecycleClick() {
    setRecycling(true);
    try {
      await onRecycle(item.id, true);
    } finally {
      setRecycling(false);
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
              {item.category}
            </span>
            {item.channels.map((ch) => (
              <span
                key={ch}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono uppercase"
              >
                {ch}
              </span>
            ))}
            <span className="text-xs text-slate-400">
              • Cooldown: <strong>{item.cooldownDays}d</strong>
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1.5">{item.title}</h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-right">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 block font-semibold">
              Evergreen Score
            </span>
            <span className="text-sm font-black text-emerald-400">
              {item.evergreenScore}/100
            </span>
          </div>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Remover da biblioteca Evergreen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Variations Tabs (Round-Robin Preview) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Variações Round-Robin Anti-Fadiga ({item.variations.length} Ângulos)
          </span>
          {nextAutoVariation && (
            <span className="text-[11px] text-indigo-300">
              Próxima na fila: <strong>{nextAutoVariation.label}</strong>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {item.variations.map((v, idx) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVarIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedVarIdx === idx
                  ? 'bg-indigo-600/25 border-indigo-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {item.variations[selectedVarIdx] && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
            {item.variations[selectedVarIdx].caption}
          </div>
        )}
      </div>

      {/* Footer Status & Recycle Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5 text-indigo-400" />
            Ciclos: <strong>{item.recycleCount}</strong> / {item.maxRecycles}
          </span>

          {eligibility.eligible ? (
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Pronto para reciclar
            </span>
          ) : (
            <span className="text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {eligibility.reason}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={recycling}
          onClick={handleRecycleClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Repeat className="w-3.5 h-3.5" />
          {recycling
            ? 'Reenfileirando...'
            : 'Reciclar Agora (Próxima Variação)'}
        </button>
      </div>
    </div>
  );
}
