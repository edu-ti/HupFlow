'use client';

import React, { useEffect, useState } from 'react';
import {
  AbHypothesisAngle,
  AbTestChannel,
  AbTestExperiment,
  AbTestSummaryMetrics,
  AbTestType,
} from '@/lib/ab-testing/types';
import { AbExperimentCard } from '@/components/ab-testing/AbExperimentCard';
import {
  FlaskConical,
  Trophy,
  TrendingUp,
  Plus,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function AbTestingLaboratoryPage() {
  const [experiments, setExperiments] = useState<AbTestExperiment[]>([]);
  const [summary, setSummary] = useState<AbTestSummaryMetrics | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New A/B experiment form state
  const [title, setTitle] = useState('');
  const [channel, setChannel] = useState<AbTestChannel>('instagram');
  const [testType, setTestType] = useState<AbTestType>('hook_copy');
  const [hypothesisAngle, setHypothesisAngle] =
    useState<AbHypothesisAngle>('curiosity_gap');
  const [minSampleSize, setMinSampleSize] = useState('250');
  const [hookTextA, setHookTextA] = useState('');
  const [hookTextB, setHookTextB] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadExperiments(selectedStatus = statusFilter) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ab-tests?status=${encodeURIComponent(selectedStatus)}`
      );
      const data = await res.json();
      if (res.ok) {
        setExperiments(data.experiments || []);
        setSummary(data.summary || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperiments(statusFilter);
  }, [statusFilter]);

  async function handleCreateExperiment(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !hookTextA.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          channel,
          testType,
          hypothesisAngle,
          minSampleSize: Number(minSampleSize),
          hookTextA,
          hookTextB: hookTextB.trim() || undefined,
        }),
      });
      if (res.ok) {
        setTitle('');
        setHookTextA('');
        setHookTextB('');
        await loadExperiments(statusFilter);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(
    experimentId: string,
    action: 'simulate_traffic' | 'declare_winner' | 'delete'
  ) {
    setBusyId(experimentId);
    try {
      await fetch('/api/ab-tests/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experimentId, action }),
      });
      await loadExperiments(statusFilter);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Feature 037 • Laboratório de Testes A/B & Significância Z-Score</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Testes A/B de Ganchos & Capas de Carrossel
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Valide ganchos de primeira linha e capas de carrossel com cálculo de confiança estatística (Teste Z de Duas Proporções) e promoção automática da variante vencedora.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'running', label: 'Em Execução' },
              { id: 'completed', label: 'Vencedores' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Total de Experimentos</span>
              <FlaskConical className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.totalExperiments}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {summary.runningCount} em coleta ativa de amostra
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
              <span>Lift Médio das Variantes</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              +{summary.avgRelativeLiftPct}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Ganho relativo de conversão (B vs A)
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>Confiança Estatística Média</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.avgConfidencePct}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Teste Z Bicaudal (Limiar padrão 95%)
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/25 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>Vencedores Declarados</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.completedCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Promovidos com significância comprovada
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Active Experiments + New Experiment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experiments List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white">
            Experimentos A/B ({experiments.length})
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Calculando curvas Z-Score e intervalos de confiança...
            </div>
          ) : experiments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {experiments.map((exp) => (
                <AbExperimentCard
                  key={exp.id}
                  experiment={exp}
                  onSimulateTraffic={(id) => handleAction(id, 'simulate_traffic')}
                  onDeclareWinner={(id) => handleAction(id, 'declare_winner')}
                  onDelete={(id) => handleAction(id, 'delete')}
                  busy={busyId === exp.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Nenhum experimento encontrado para este filtro.
            </div>
          )}
        </div>

        {/* Create New A/B Experiment Form */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-6 h-fit space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Novo Experimento A/B</h2>
          </div>

          <form onSubmit={handleCreateExperiment} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Nome do Experimento
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Capa Carrossel: Prova Social vs Curiosidade"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Canal</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as AbTestChannel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="x">X / Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Elemento</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as AbTestType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                >
                  <option value="hook_copy">Gancho 1ª Linha</option>
                  <option value="carousel_cover">Capa de Carrossel</option>
                  <option value="cta_button">CTA Final</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Ângulo Psicológico (B)
                </label>
                <select
                  value={hypothesisAngle}
                  onChange={(e) =>
                    setHypothesisAngle(e.target.value as AbHypothesisAngle)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <option value="curiosity_gap">Lacuna de Curiosidade</option>
                  <option value="contrarian_shock">Quebra de Padrão</option>
                  <option value="social_proof_numbers">Prova Social + Números</option>
                  <option value="urgency_fomo">Urgência / FOMO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Amostra Mín. / Var.
                </label>
                <input
                  type="number"
                  value={minSampleSize}
                  onChange={(e) => setMinSampleSize(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Variante A — Gancho Controle (Obrigatório)
              </label>
              <textarea
                rows={2}
                required
                value={hookTextA}
                onChange={(e) => setHookTextA(e.target.value)}
                placeholder="Ex: Como estruturar um calendário editorial para clientes B2B"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 flex items-center justify-between">
                <span>Variante B — Desafiante (Opcional)</span>
                <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gerado por IA se vazio
                </span>
              </label>
              <textarea
                rows={2}
                value={hookTextB}
                onChange={(e) => setHookTextB(e.target.value)}
                placeholder="Deixe em branco para gerar automaticamente a desafiante pelo ângulo psicológico..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Iniciando Experimento...' : 'Iniciar Teste A/B'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
