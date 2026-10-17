'use client';

import React, { useEffect, useState } from 'react';
import {
  CompetitorChannel,
  CompetitorContentFormat,
  CompetitorRadarOverview,
} from '@/lib/competitors/types';
import { CompetitorRadarCard } from '@/components/competitors/CompetitorRadarCard';
import {
  Radar,
  Sparkles,
  Plus,
  TrendingUp,
  Award,
  Copy,
  Check,
  Target,
  BarChart2,
} from 'lucide-react';

export default function CompetitorBenchmarkPage() {
  const [overview, setOverview] = useState<CompetitorRadarOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedGapId, setCopiedGapId] = useState<string | null>(null);

  // New competitor form state
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [channel, setChannel] = useState<CompetitorChannel>('instagram');
  const [niche, setNiche] = useState('SaaS & Marketing Digital');
  const [followersCount, setFollowersCount] = useState('45000');
  const [engagementRatePct, setEngagementRatePct] = useState('4.7');
  const [postsPerWeek, setPostsPerWeek] = useState('6');
  const [growth30dPct, setGrowth30dPct] = useState('9.2');
  const [topFormat, setTopFormat] = useState<CompetitorContentFormat>('reel_video');
  const [topTopics, setTopTopics] = useState(
    'Funil de Conversão por DM, Engajamento com IA, Estudos de Caso Reais'
  );
  const [submitting, setSubmitting] = useState(false);

  async function loadRadar(selectedChannel = channelFilter) {
    setLoading(true);
    try {
      const query =
        selectedChannel && selectedChannel !== 'all'
          ? `?channel=${encodeURIComponent(selectedChannel)}`
          : '';
      const res = await fetch(`/api/competitors${query}`);
      const data = await res.json();
      if (res.ok) {
        setOverview(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRadar(channelFilter);
  }, [channelFilter]);

  async function handleCreateCompetitor(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          handle,
          channel,
          niche,
          followersCount: Number(followersCount),
          engagementRatePct: Number(engagementRatePct),
          postsPerWeek: Number(postsPerWeek),
          growth30dPct: Number(growth30dPct),
          topFormat,
          topTopics: topTopics
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      if (res.ok) {
        setName('');
        setHandle('');
        await loadRadar(channelFilter);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSync(competitorId: string) {
    setBusyId(competitorId);
    try {
      await fetch('/api/competitors/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId, action: 'sync' }),
      });
      await loadRadar(channelFilter);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(competitorId: string) {
    setBusyId(competitorId);
    try {
      await fetch('/api/competitors/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId, action: 'delete' }),
      });
      await loadRadar(channelFilter);
    } finally {
      setBusyId(null);
    }
  }

  function handleCopyHook(gapId: string, hookText: string) {
    navigator.clipboard?.writeText(hookText);
    setCopiedGapId(gapId);
    setTimeout(() => setCopiedGapId(null), 2000);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Radar className="w-3.5 h-3.5" />
            <span>Feature 036 • Inteligência Competitiva & Share of Voice</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Radar de Benchmarking & Content Gaps IA
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare seu Share of Voice orgânico, cadência e engajamento contra os líderes do seu nicho e descubra pautas inexploradas.
          </p>
        </div>

        {/* Channel Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'instagram', 'linkedin', 'tiktok', 'youtube'] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                channelFilter === ch
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ch === 'all' ? 'Todos' : ch}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>Share of Voice da Sua Marca</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {overview.comparison.brandShareOfVoicePct}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {overview.workspaceBaseline.weeklyEngagedReach.toLocaleString('pt-BR')} interações/sem em{' '}
              <span className="text-indigo-300 font-mono">
                {overview.workspaceBaseline.handle}
              </span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Engajamento vs. Média do Nicho</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {overview.workspaceBaseline.engagementRatePct}%
            </p>
            <p className="text-xs mt-1">
              <span
                className={
                  overview.comparison.engagementDeltaPct >= 0
                    ? 'text-emerald-400 font-semibold'
                    : 'text-rose-400 font-semibold'
                }
              >
                {overview.comparison.engagementDeltaPct >= 0
                  ? `+${overview.comparison.engagementDeltaPct}% acima`
                  : `${overview.comparison.engagementDeltaPct}% abaixo`}
              </span>{' '}
              <span className="text-slate-500">
                da média ({overview.comparison.nicheAvgEngagementPct}%)
              </span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Cadência Semanal vs. Nicho</span>
              <BarChart2 className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {overview.workspaceBaseline.postsPerWeek} posts/sem
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Média dos concorrentes:{' '}
              <span className="text-white font-semibold">
                {overview.comparison.nicheAvgPostsPerWeek} posts/sem
              </span>
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
              <span>Content Gaps IA Detectados</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {overview.contentGaps.length} pautas
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Formato vencedor no nicho:{' '}
              <span className="text-purple-300 font-semibold uppercase">
                {overview.comparison.winningFormatInNiche}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Content Gap Analysis Section */}
      {overview && overview.contentGaps.length > 0 && (
        <section className="rounded-2xl border border-purple-500/25 bg-[#0B0F17]/95 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Oportunidades de Conteúdo Inexploradas (Content Gap Analysis IA)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tópicos que estão gerando alto engajamento nos seus concorrentes e ainda não foram abordados pela sua marca.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overview.contentGaps.map((gap) => (
              <div
                key={gap.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Score {gap.opportunityScore}/100
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Fonte: {gap.competitorSource}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2.5">#{gap.topic}</h3>
                  <p className="text-xs text-slate-400 mt-1">{gap.rationale}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-indigo-200 italic">
                    &ldquo;{gap.suggestedHook}&rdquo;
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyHook(gap.id, gap.suggestedHook)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-all"
                >
                  {copiedGapId === gap.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Gancho Copiado para o Compositor!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Gancho IA ({gap.recommendedFormat})
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Grid: Tracked Competitors + Add Competitor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competitor Cards List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white">
            Concorrentes Monitorados ({overview?.competitors.length || 0})
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Calculando Share of Voice e Content Gaps do nicho...
            </div>
          ) : overview && overview.competitors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {overview.competitors.map((comp) => (
                <CompetitorRadarCard
                  key={comp.id}
                  competitor={comp}
                  baseline={overview.workspaceBaseline}
                  onSync={handleSync}
                  onDelete={handleDelete}
                  busy={busyId === comp.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Nenhum concorrente encontrado para este filtro de canal.
            </div>
          )}
        </div>

        {/* Add New Competitor Form */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-6 h-fit space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Monitorar Novo Concorrente</h2>
          </div>

          <form onSubmit={handleCreateCompetitor} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nome da Marca / Criador</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: ScaleSocial Brasil"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">@Handle</label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@scalesocial"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Rede Social</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as CompetitorChannel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="x">X / Twitter</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Seguidores</label>
                <input
                  type="number"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Engajamento (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={engagementRatePct}
                  onChange={(e) => setEngagementRatePct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Posts / Semana</label>
                <input
                  type="number"
                  value={postsPerWeek}
                  onChange={(e) => setPostsPerWeek(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Crescimento 30d (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={growth30dPct}
                  onChange={(e) => setGrowth30dPct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Formato Dominante</label>
              <select
                value={topFormat}
                onChange={(e) => setTopFormat(e.target.value as CompetitorContentFormat)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              >
                <option value="reel_video">Reels / Vídeo Curto</option>
                <option value="carousel">Carrossel Educativo</option>
                <option value="text_thread">Thread / Texto</option>
                <option value="single_image">Imagem Estática</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Tópicos de Alta Tração (separados por vírgula)
              </label>
              <textarea
                rows={2}
                value={topTopics}
                onChange={(e) => setTopTopics(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Adicionando ao Radar...' : 'Adicionar ao Radar Competitivo'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
