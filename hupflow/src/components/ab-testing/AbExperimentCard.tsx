'use client';

import React from 'react';
import { AbTestExperiment } from '@/lib/ab-testing/types';
import {
  Trophy,
  FlaskConical,
  Trash2,
  Zap,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

interface AbExperimentCardProps {
  experiment: AbTestExperiment;
  onSimulateTraffic: (id: string) => void;
  onDeclareWinner: (id: string) => void;
  onDelete: (id: string) => void;
  busy?: boolean;
}

const TEST_TYPE_LABELS: Record<AbTestExperiment['testType'], string> = {
  hook_copy: 'Gancho 1ª Linha',
  carousel_cover: 'Capa de Carrossel',
  cta_button: 'Chamada de Ação (CTA)',
};

export function AbExperimentCard({
  experiment,
  onSimulateTraffic,
  onDeclareWinner,
  onDelete,
  busy = false,
}: AbExperimentCardProps) {
  const { variantA, variantB, stats } = experiment;
  const isWinnerA =
    experiment.winningVariantId === 'A' ||
    stats.recommendedOutcome === 'winner_a';
  const isWinnerB =
    experiment.winningVariantId === 'B' ||
    stats.recommendedOutcome === 'winner_b';

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-5 space-y-4 hover:border-indigo-500/40 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white">{experiment.title}</h3>
            <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {experiment.channel}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {TEST_TYPE_LABELS[experiment.testType]}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hipótese: <span className="text-indigo-300 font-mono">{experiment.hypothesisAngle}</span> • Amostra mín.: {experiment.minSampleSize} impr./variante
          </p>
        </div>

        <div className="flex items-center gap-2">
          {experiment.status === 'completed' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Vencedora: Variante {experiment.winningVariantId}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <FlaskConical className="w-3.5 h-3.5" />
              Coletando Amostra
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Variants A vs B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Variant A */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isWinnerA
              ? 'border-emerald-500/50 bg-emerald-950/15'
              : 'border-slate-800 bg-slate-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-[11px]">
                A
              </span>
              {variantA.label}
            </span>
            {isWinnerA && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Líder
              </span>
            )}
          </div>
          <p className="text-xs text-slate-200 italic bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 min-h-[52px]">
            &ldquo;{variantA.hookText}&rdquo;
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/70 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Impressões</span>
              <span className="text-xs font-bold text-white">
                {variantA.impressions.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Conversões</span>
              <span className="text-xs font-bold text-white">
                {variantA.conversions.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Taxa Conv.</span>
              <span className="text-xs font-extrabold text-indigo-300">
                {stats.rateAPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Variant B */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isWinnerB
              ? 'border-emerald-500/50 bg-emerald-950/15'
              : 'border-slate-800 bg-slate-900/50'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-mono text-[11px]">
                B
              </span>
              {variantB.label}
            </span>
            {isWinnerB && (
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> Vencedora (+{stats.relativeLiftPct}%)
              </span>
            )}
          </div>
          <p className="text-xs text-indigo-100 italic bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 min-h-[52px]">
            &ldquo;{variantB.hookText}&rdquo;
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/70 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Impressões</span>
              <span className="text-xs font-bold text-white">
                {variantB.impressions.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Conversões</span>
              <span className="text-xs font-bold text-white">
                {variantB.conversions.toLocaleString('pt-BR')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Taxa Conv.</span>
              <span className="text-xs font-extrabold text-emerald-400">
                {stats.rateBPct}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistical Confidence Bar */}
      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300 font-medium">
              Confiança Estatística (Z = {stats.zScore}):
            </span>
            <span
              className={`font-bold ${
                stats.confidencePct >= experiment.targetConfidencePct
                  ? 'text-emerald-400'
                  : 'text-amber-300'
              }`}
            >
              {stats.confidencePct}% (Alvo: {experiment.targetConfidencePct}%)
            </span>
          </div>

          <span
            className={`font-mono text-xs font-bold ${
              stats.relativeLiftPct >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            Lift B vs A: {stats.relativeLiftPct >= 0 ? `+${stats.relativeLiftPct}%` : `${stats.relativeLiftPct}%`}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              stats.isStatisticallySignificant
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, stats.confidencePct))}%` }}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {stats.hasMinSample
            ? '✅ Amostra mínima atingida em ambas as variantes'
            : '⏳ Aguardando amostra mínima por variante'}
        </span>

        <div className="flex items-center gap-2">
          {experiment.status === 'running' && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onSimulateTraffic(experiment.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                Simular +250 Impressões
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => onDeclareWinner(experiment.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Promover Líder
              </button>
            </>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(experiment.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all disabled:opacity-50"
            title="Excluir Experimento"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
