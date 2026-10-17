'use client';

import React, { useState } from 'react';
import {
  AdvocacyCampaignItem,
  AdvocacyPersonaType,
} from '@/lib/advocacy/types';
import {
  Share2,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Award,
  TrendingUp,
  MousePointerClick,
} from 'lucide-react';

interface AdvocacyCampaignCardProps {
  campaign: AdvocacyCampaignItem;
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
  busy?: boolean;
}

export function AdvocacyCampaignCard({
  campaign,
  onShare,
  onDelete,
  busy = false,
}: AdvocacyCampaignCardProps) {
  const [selectedPersona, setSelectedPersona] =
    useState<AdvocacyPersonaType>('executive_vision');
  const [copied, setCopied] = useState(false);

  const activeVariation =
    campaign.personaVariations.find((v) => v.persona === selectedPersona) ||
    campaign.personaVariations[0];

  function handleCopyAndShare() {
    if (activeVariation) {
      navigator.clipboard?.writeText(activeVariation.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onShare(campaign.id);
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-5 space-y-4 hover:border-indigo-500/40 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white">{campaign.title}</h3>
            <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {campaign.channel}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {campaign.department}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono truncate max-w-xl">
            URL: {campaign.targetUrl}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          +{campaign.pointsReward} pts / share
        </span>
      </div>

      {/* Persona Selector Tabs */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Escolha sua Variação em 1ª Pessoa (Anti-Duplicidade Algorítmica)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {campaign.personaVariations.map((v) => (
            <button
              key={v.persona}
              type="button"
              onClick={() => setSelectedPersona(v.persona)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedPersona === v.persona
                  ? 'bg-indigo-600/30 text-white border-indigo-500/50'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {activeVariation && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
            &ldquo;{activeVariation.copyText}&rdquo;
          </div>
        )}
      </div>

      {/* Impact Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Share2 className="w-3 h-3 text-indigo-400" />
            Shares / Alcance
          </span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            {campaign.sharesCount}x •{' '}
            {(campaign.impact.totalOrganicReach / 1000).toFixed(1)}k
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <MousePointerClick className="w-3 h-3 text-cyan-400" />
            Cliques Orgânicos
          </span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            {campaign.impact.estimatedClicks.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Economia Ads
          </span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
            R$ {campaign.impact.adSpendSavedBrl.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={handleCopyAndShare}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              Copy Copiado + Compartilhamento Pontuado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Persona & Registrar Meu Share (+{campaign.pointsReward} pts)
            </>
          )}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(campaign.id)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all disabled:opacity-50"
          title="Remover Campanha"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
