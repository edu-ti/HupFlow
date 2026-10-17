'use client';

import React, { useState } from 'react';
import { ListeningMentionItem } from '@/lib/listening/types';
import {
  AlertOctagon,
  Copy,
  Check,
  CheckCircle2,
  MessageSquareShare,
  Trash2,
  Flame,
  Users,
  Sparkles,
} from 'lucide-react';

interface ListeningMentionCardProps {
  mention: ListeningMentionItem;
  onAction: (
    id: string,
    action: 'engage' | 'resolve' | 'ignore' | 'delete'
  ) => void;
  busy?: boolean;
}

const CATEGORY_BADGES: Record<
  ListeningMentionItem['category'],
  { label: string; className: string }
> = {
  crisis_risk: {
    label: 'Risco de Crise / RP',
    className: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  competitor_complaint: {
    label: 'Queixa Concorrente (Lead)',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  brand_mention: {
    label: 'Menção à Marca',
    className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  industry_trend: {
    label: 'Tendência do Nicho',
    className: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  },
};

const CRISIS_BADGES: Record<
  ListeningMentionItem['crisisLevel'],
  { label: string; className: string }
> = {
  critical_crisis: {
    label: 'Crise Crítica',
    className: 'bg-rose-600/25 text-rose-200 border-rose-500/50',
  },
  elevated: {
    label: 'Urgência Elevada',
    className: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  },
  watch: {
    label: 'Em Observação',
    className: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
  },
  normal: {
    label: 'Risco Normal',
    className: 'bg-slate-800 text-slate-300 border-slate-700',
  },
};

export function ListeningMentionCard({
  mention,
  onAction,
  busy = false,
}: ListeningMentionCardProps) {
  const [copied, setCopied] = useState(false);
  const catBadge = CATEGORY_BADGES[mention.category];
  const crisisBadge = CRISIS_BADGES[mention.crisisLevel];

  function handleCopyReply() {
    navigator.clipboard?.writeText(mention.playbook.suggestedPublicReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`rounded-2xl border p-5 space-y-4 transition-all ${
        mention.crisisLevel === 'critical_crisis' && mention.status === 'open'
          ? 'border-rose-500/50 bg-gradient-to-br from-rose-950/20 to-[#0B0F17]/95'
          : 'border-slate-800/80 bg-[#0B0F17]/95 hover:border-indigo-500/40'
      }`}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-white">
              {mention.authorName}
            </span>
            <span className="text-xs font-mono text-indigo-400">
              {mention.authorHandle}
            </span>
            <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {mention.channel}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catBadge.className}`}
            >
              {catBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" />
              {mention.authorFollowers.toLocaleString('pt-BR')} seguidores
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              {mention.velocityPerHour} interações/h
            </span>
            <span className="text-indigo-300 font-mono">
              Keyword: &ldquo;{mention.keywordMatched}&rdquo;
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${crisisBadge.className}`}
          >
            {crisisBadge.label} ({mention.urgencyScore}/100)
          </span>
        </div>
      </div>

      {/* Captured Content */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-sm text-slate-200">
        &ldquo;{mention.content}&rdquo;
      </div>

      {/* Strategic Response Playbook IA */}
      <div className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-950/15 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Playbook IA: {mention.playbook.strategyLabel}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Status: {mention.status.toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-slate-300">
          <strong className="text-slate-200">Ação Recomendada:</strong>{' '}
          {mention.playbook.recommendedAction}
        </p>

        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-indigo-100 italic">
          &ldquo;{mention.playbook.suggestedPublicReply}&rdquo;
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopyReply}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Resposta Estratégica Copiada!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Resposta Pública
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {mention.status === 'open' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAction(mention.id, 'engage')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all disabled:opacity-50"
            >
              <MessageSquareShare className="w-3.5 h-3.5" />
              Marcar Engajado
            </button>
          )}

          {mention.status !== 'resolved' && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onAction(mention.id, 'resolve')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolver
            </button>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => onAction(mention.id, 'delete')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all disabled:opacity-50"
            title="Remover Sinal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
