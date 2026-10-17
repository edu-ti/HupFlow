'use client';

import React, { useState } from 'react';
import { CreatorPartnershipItem } from '@/lib/creators/types';
import {
  Copy,
  Check,
  PlusCircle,
  ArrowRightCircle,
  Trash2,
  Users,
  Ticket,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface CreatorPartnershipCardProps {
  creator: CreatorPartnershipItem;
  onAction: (
    id: string,
    action: 'log_deliverable' | 'advance_stage' | 'delete'
  ) => void;
  busy?: boolean;
}

const STAGE_LABELS: Record<CreatorPartnershipItem['stage'], string> = {
  prospecting: 'Prospecção',
  negotiating: 'Em Negociação',
  contracted: 'Contratado',
  content_review: 'Em Revisão UGC',
  published: 'Campanha Publicada',
};

const TIER_BADGES: Record<
  CreatorPartnershipItem['metrics']['performanceTier'],
  { label: string; className: string }
> = {
  elite_roi: {
    label: 'ROI Elite (+200%)',
    className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  profitable: {
    label: 'Lucrativo',
    className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/35',
  },
  break_even: {
    label: 'Break-Even',
    className: 'bg-amber-500/20 text-amber-300 border-amber-500/35',
  },
  underperforming: {
    label: 'Em Maturação',
    className: 'bg-slate-800 text-slate-300 border-slate-700',
  },
};

export function CreatorPartnershipCard({
  creator,
  onAction,
  busy = false,
}: CreatorPartnershipCardProps) {
  const [copied, setCopied] = useState(false);
  const tierBadge = TIER_BADGES[creator.metrics.performanceTier];
  const progressPct = Math.min(
    100,
    Math.round((creator.deliverablesCompleted / creator.deliverablesTotal) * 100)
  );

  function handleCopyBriefing() {
    navigator.clipboard?.writeText(creator.ugcBriefing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-5 space-y-4 hover:border-indigo-500/40 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white">
              {creator.creatorName}
            </h3>
            <span className="text-xs font-mono text-indigo-400">
              {creator.handle}
            </span>
            <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {creator.channel}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {STAGE_LABELS[creator.stage]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              {creator.followersCount.toLocaleString('pt-BR')} seguidores
            </span>
            <span>• {creator.niche}</span>
            <span className="inline-flex items-center gap-1 text-emerald-300 font-mono">
              <Ticket className="w-3 h-3" />
              Cupom: {creator.couponCode}
            </span>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${tierBadge.className}`}
        >
          {tierBadge.label} • ROI {creator.metrics.roiPct}%
        </span>
      </div>

      {/* Deliverables Progress Bar */}
      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/70">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium">
            Progresso de Entregáveis UGC
          </span>
          <span className="text-white font-bold">
            {creator.deliverablesCompleted} / {creator.deliverablesTotal} peças ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
            style={{ width: `${Math.max(8, progressPct)}%` }}
          />
        </div>
      </div>

      {/* Financial & Performance Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">Cachê Acordado</span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            R$ {creator.agreedFeeBrl.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            Receita + EMV Gerado
          </span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
            R${' '}
            {(
              creator.generatedRevenueBrl + creator.metrics.emvBrl
            ).toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            CPE (Custo/Engaj.)
          </span>
          <span className="text-sm font-bold text-indigo-300 mt-0.5 block">
            R$ {creator.metrics.cpeBrl.toFixed(2)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            Views / Interações
          </span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            {(creator.totalViews / 1000).toFixed(1)}k /{' '}
            {creator.totalEngagements.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* UGC Briefing Box */}
      <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/15 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Roteiro & Briefing UGC IA (3 Atos)
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            EMV: R$ {creator.metrics.emvBrl.toLocaleString('pt-BR')}
          </span>
        </div>
        <p className="text-xs text-slate-300 italic">{creator.ugcBriefing}</p>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopyBriefing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Briefing Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Briefing UGC
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(creator.id, 'log_deliverable')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Registrar Entregável (+Views/ROI)
          </button>

          {creator.stage !== 'published' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAction(creator.id, 'advance_stage')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all disabled:opacity-50"
            >
              <ArrowRightCircle className="w-3.5 h-3.5" />
              Avançar Estágio
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(creator.id, 'delete')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all disabled:opacity-50"
            title="Remover Parceria"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
