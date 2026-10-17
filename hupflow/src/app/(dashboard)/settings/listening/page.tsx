'use client';

import React, { useEffect, useState } from 'react';
import {
  BrandHealthRadarSummary,
  ListeningCategory,
  ListeningChannel,
  ListeningMentionItem,
} from '@/lib/listening/types';
import { ListeningMentionCard } from '@/components/listening/ListeningMentionCard';
import {
  Radio,
  AlertOctagon,
  TrendingUp,
  HeartHandshake,
  Plus,
  Flame,
} from 'lucide-react';

export default function SocialListeningPage() {
  const [mentions, setMentions] = useState<ListeningMentionItem[]>([]);
  const [radar, setRadar] = useState<BrandHealthRadarSummary | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New listening signal form state
  const [keywordMatched, setKeywordMatched] = useState('');
  const [channel, setChannel] = useState<ListeningChannel>('x');
  const [category, setCategory] =
    useState<ListeningCategory>('competitor_complaint');
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [authorFollowers, setAuthorFollowers] = useState('18000');
  const [velocityPerHour, setVelocityPerHour] = useState('45');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadMentions(selectedCategory = categoryFilter) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/listening?category=${encodeURIComponent(selectedCategory)}`
      );
      const data = await res.json();
      if (res.ok) {
        setMentions(data.mentions || []);
        setRadar(data.radar || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMentions(categoryFilter);
  }, [categoryFilter]);

  async function handleCreateSignal(e: React.FormEvent) {
    e.preventDefault();
    if (!keywordMatched.trim() || !authorHandle.trim() || !content.trim())
      return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/listening', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywordMatched,
          channel,
          category,
          authorName: authorName.trim() || authorHandle.trim(),
          authorHandle,
          authorFollowers: Number(authorFollowers),
          velocityPerHour: Number(velocityPerHour),
          content,
        }),
      });
      if (res.ok) {
        setKeywordMatched('');
        setAuthorName('');
        setAuthorHandle('');
        setContent('');
        await loadMentions(categoryFilter);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(
    mentionId: string,
    action: 'engage' | 'resolve' | 'ignore' | 'delete'
  ) {
    setBusyId(mentionId);
    try {
      await fetch('/api/listening/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentionId, action }),
      });
      await loadMentions(categoryFilter);
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
            <Radio className="w-3.5 h-3.5" />
            <span>Feature 038 • Social Listening, Menções Indiretas & Crise RP</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Monitor de Social Listening & Radar de Crise IA
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Capture menções indiretas sem @tag, queixas sobre concorrentes (Social Selling) e sinais precoces de crise com Playbooks de resposta em 1 clique.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'crisis_risk', label: 'Risco Crise' },
              { id: 'competitor_complaint', label: 'Leads Concorrentes' },
              { id: 'brand_mention', label: 'Marca' },
              { id: 'industry_trend', label: 'Tendências' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Crisis Banner */}
      {radar && radar.crisisAlertActive && (
        <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-950/25 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-rose-200">
                Alerta de RP Ativo: {radar.criticalCrisisCount} sinal(is) de alta velocidade exigem contenção imediata
              </h3>
              <p className="text-xs text-rose-300/80">
                Utilize o Playbook de Contenção Proativa abaixo para responder em público e marcar o alerta como resolvido.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Brand Health KPI Cards */}
      {radar && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/35 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>Net Sentiment Score (NSS)</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {radar.netSentimentScore >= 0
                ? `+${radar.netSentimentScore}`
                : radar.netSentimentScore}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Escala de -100 a +100 ({radar.totalMentions} sinais)
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-rose-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-rose-300 font-semibold">
              <span>Alertas Críticos Abertos</span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {radar.criticalCrisisCount}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Sinais com Urgência de RP &ge; 75/100
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>Oportunidades Social Selling</span>
              <HeartHandshake className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {radar.competitorLeadOpportunities}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Usuários insatisfeitos com concorrentes
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Keyword / Tópico em Alta</span>
              <Flame className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-base font-extrabold text-white mt-2 truncate">
              {radar.topTrendingKeyword}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Maior velocidade de propagação/hora
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Mentions Feed + Simulate Signal Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white">
            Feed de Sinais Capturados ({mentions.length})
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Processando sinais de Social Listening e scores de urgência...
            </div>
          ) : mentions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {mentions.map((m) => (
                <ListeningMentionCard
                  key={m.id}
                  mention={m}
                  onAction={handleAction}
                  busy={busyId === m.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Nenhuma menção encontrada para esta categoria.
            </div>
          )}
        </div>

        {/* Simulate / Ingest New Mention Signal */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-6 h-fit space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Capturar / Simular Sinal Externo
            </h2>
          </div>

          <form onSubmit={handleCreateSignal} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Keyword / Termo Monitorado
              </label>
              <input
                type="text"
                required
                value={keywordMatched}
                onChange={(e) => setKeywordMatched(e.target.value)}
                placeholder="Ex: Alternativa Hootsuite Brasil"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rede</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as ListeningChannel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                >
                  <option value="x">X / Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="reddit">Reddit</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Categoria</label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as ListeningCategory)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <option value="competitor_complaint">Queixa Concorrente</option>
                  <option value="crisis_risk">Risco de Crise</option>
                  <option value="brand_mention">Menção à Marca</option>
                  <option value="industry_trend">Tendência do Nicho</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Nome do Autor
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ex: Thiago CMO"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  @Handle
                </label>
                <input
                  type="text"
                  required
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  placeholder="@thiago_cmo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Seguidores do Autor
                </label>
                <input
                  type="number"
                  value={authorFollowers}
                  onChange={(e) => setAuthorFollowers(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Velocidade (inter./h)
                </label>
                <input
                  type="number"
                  value={velocityPerHour}
                  onChange={(e) => setVelocityPerHour(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Texto Capturado na Rede
              </label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ex: Alguém recomenda uma alternativa rápida para aprovar posts com clientes sem precisar de login?"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {submitting
                ? 'Analisando Sentimento & RP...'
                : 'Analisar & Gerar Playbook IA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
