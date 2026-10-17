'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  Share2,
  ThumbsUp,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { AnalyticsResponse, SocialProvider } from '@/lib/analytics/types';
import { AnalyticsAreaChart } from '@/components/analytics/AnalyticsAreaChart';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [provider, setProvider] = useState<'all' | SocialProvider>('all');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${period}&provider=${provider}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Falha ao carregar analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period, provider]);

  const getProviderBadge = (p: string) => {
    switch (p) {
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            Instagram
          </span>
        );
      case 'threads':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-700/30 text-zinc-300 border border-zinc-700/40">
            Threads
          </span>
        );
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            LinkedIn
          </span>
        );
      case 'x':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20">
            X (Twitter)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2.5">
            Métricas & Performance Social
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Multi-Canal
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Acompanhe o crescimento consolidado de alcance, impressões e taxas de engajamento do workspace.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Período */}
          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 rounded-xl p-1">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  period === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'}
              </button>
            ))}
          </div>

          {/* Seletor de Canal */}
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Todos os Canais</option>
            <option value="instagram">Instagram</option>
            <option value="threads">Threads</option>
            <option value="linkedin">LinkedIn</option>
            <option value="x">X (Twitter)</option>
          </select>

          {/* Refresh */}
          <button
            onClick={fetchAnalytics}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition"
            title="Atualizar Métricas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Impressões */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Impressões Totais</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-3 font-mono">
            {data ? data.kpis.totalImpressions.toLocaleString('pt-BR') : '—'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-semibold">{data?.kpis.impressionsTrend || '+0%'}</span>
            <span className="text-zinc-500">vs período anterior</span>
          </div>
        </div>

        {/* Alcance */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Alcance Único</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-3 font-mono">
            {data ? data.kpis.totalReach.toLocaleString('pt-BR') : '—'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-semibold">{data?.kpis.reachTrend || '+0%'}</span>
            <span className="text-zinc-500">vs período anterior</span>
          </div>
        </div>

        {/* Engajamentos */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Interações Totais</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-3 font-mono">
            {data ? data.kpis.totalEngagements.toLocaleString('pt-BR') : '—'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-semibold">{data?.kpis.engagementsTrend || '+0%'}</span>
            <span className="text-zinc-500">vs período anterior</span>
          </div>
        </div>

        {/* Taxa Média */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Taxa Média de Engajamento</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-zinc-100 mt-3 font-mono">
            {data ? `${data.kpis.averageEngagementRate}%` : '—'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-semibold">{data?.kpis.rateTrend || '+0%'}</span>
            <span className="text-zinc-500">benchmark do setor</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 colunas) */}
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-100">Evolução de Alcance & Impressões</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Visão temporal diária com gradientes comparativos</p>
            </div>
          </div>

          <div className="pt-2">
            {data && <AnalyticsAreaChart data={data.dailySeries} />}
          </div>
        </div>

        {/* Channel Breakdown (1 coluna) */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-zinc-100">Distribuição por Canal</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Participação no volume total de alcance</p>
          </div>

          <div className="space-y-4 pt-1">
            {data?.channelBreakdown.map((channel) => (
              <div key={channel.provider} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {getProviderBadge(channel.provider)}
                    <span className="font-medium text-zinc-200">{channel.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400 font-semibold">{channel.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      channel.provider === 'instagram'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : channel.provider === 'linkedin'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-500'
                        : channel.provider === 'threads'
                        ? 'bg-zinc-400'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${channel.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                  <span>{channel.totalPosts} posts publicados</span>
                  <span className="text-indigo-400 font-semibold">{channel.engagementRate}% engaj.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Posts Table */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">Top Publicações do Período</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Posts ordenados pela maior taxa de engajamento orgânico</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Conteúdo</th>
                <th className="px-4 py-3">Canal</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3 text-right">Alcance</th>
                <th className="px-4 py-3 text-right">Curtidas</th>
                <th className="px-4 py-3 text-right">Comentários</th>
                <th className="px-4 py-3 text-right">Taxa Engajamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {data?.topPosts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/30 transition">
                  <td className="px-4 py-4 max-w-xs">
                    <p className="font-medium text-zinc-200 line-clamp-2 text-xs">
                      {post.content}
                    </p>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {getProviderBadge(post.provider)}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-xs text-zinc-400">
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                  </td>

                  <td className="px-4 py-4 text-right font-mono text-xs text-zinc-300">
                    {post.reach.toLocaleString('pt-BR')}
                  </td>

                  <td className="px-4 py-4 text-right font-mono text-xs text-zinc-300">
                    {post.likes.toLocaleString('pt-BR')}
                  </td>

                  <td className="px-4 py-4 text-right font-mono text-xs text-zinc-300">
                    {post.comments.toLocaleString('pt-BR')}
                  </td>

                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {post.engagementRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
