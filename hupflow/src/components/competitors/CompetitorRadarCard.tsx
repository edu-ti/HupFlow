'use client';

import React from 'react';
import {
  CompetitorProfile,
  WorkspaceBenchmarkBaseline,
} from '@/lib/competitors/types';
import {
  RefreshCw,
  Trash2,
  TrendingUp,
  Users,
  Flame,
  Calendar,
  Layers,
} from 'lucide-react';

interface CompetitorRadarCardProps {
  competitor: CompetitorProfile;
  baseline: WorkspaceBenchmarkBaseline;
  onSync: (id: string) => void;
  onDelete: (id: string) => void;
  busy?: boolean;
}

const THREAT_BADGE_MAP: Record<
  CompetitorProfile['threatLevel'],
  { label: string; className: string }
> = {
  critical: {
    label: 'Pressão Crítica',
    className: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  high: {
    label: 'Pressão Alta',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  moderate: {
    label: 'Pressão Moderada',
    className: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  },
  low: {
    label: 'Pressão Baixa',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
};

const FORMAT_LABELS: Record<CompetitorProfile['topFormat'], string> = {
  carousel: 'Carrossel Educativo',
  reel_video: 'Reels / Vídeo Curto',
  text_thread: 'Thread / Post Texto',
  single_image: 'Imagem Estática',
};

export function CompetitorRadarCard({
  competitor,
  baseline,
  onSync,
  onDelete,
  busy = false,
}: CompetitorRadarCardProps) {
  const threatBadge = THREAT_BADGE_MAP[competitor.threatLevel];
  const engDiff = Number(
    (competitor.engagementRatePct - baseline.engagementRatePct).toFixed(2)
  );

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/90 p-5 flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{competitor.name}</h3>
              <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {competitor.channel}
              </span>
            </div>
            <p className="text-xs text-indigo-400 font-mono mt-0.5">
              {competitor.handle} • <span className="text-slate-400">{competitor.niche}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${threatBadge.className}`}
            >
              {threatBadge.label} ({competitor.threatScore}/100)
            </span>
          </div>
        </div>

        {/* Share of Voice Bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/70 border border-slate-800/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Share of Voice no Radar</span>
            <span className="text-white font-bold">
              {competitor.shareOfVoicePct}%{' '}
              <span className="text-slate-500 font-normal">
                ({competitor.weeklyEngagedReach.toLocaleString('pt-BR')} interações/sem)
              </span>
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
              style={{ width: `${Math.min(100, Math.max(4, competitor.shareOfVoicePct))}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Seguidores</span>
            </div>
            <p className="text-sm font-bold text-white mt-1">
              {competitor.followersCount.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Engajamento</span>
            </div>
            <p className="text-sm font-bold text-white mt-1 flex items-center gap-1">
              {competitor.engagementRatePct}%
              <span
                className={`text-[10px] font-mono ${
                  engDiff > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                ({engDiff > 0 ? `+${engDiff}%` : `${engDiff}%`})
              </span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cadência</span>
            </div>
            <p className="text-sm font-bold text-white mt-1">
              {competitor.postsPerWeek} posts/sem
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cresc. 30d</span>
            </div>
            <p className="text-sm font-bold text-emerald-400 mt-1">
              +{competitor.growth30dPct}%
            </p>
          </div>
        </div>

        {/* Winning Format & Top Topics */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Formato Dominante:</span>
            <span className="font-semibold text-purple-300">
              {FORMAT_LABELS[competitor.topFormat]}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {competitor.topTopics.map((topic, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-500">
          Sync: {new Date(competitor.lastSyncedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onSync(competitor.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
            Atualizar Snapshot
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(competitor.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all disabled:opacity-50"
            title="Remover do Radar"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
