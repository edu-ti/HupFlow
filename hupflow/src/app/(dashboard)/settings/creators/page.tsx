'use client';

import React, { useEffect, useState } from 'react';
import {
  CreatorChannel,
  CreatorPartnershipItem,
  CreatorPortfolioSummary,
} from '@/lib/creators/types';
import { CreatorPartnershipCard } from '@/components/creators/CreatorPartnershipCard';
import {
  Award,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Plus,
  Users,
} from 'lucide-react';

export default function InfluencerCreatorCrmPage() {
  const [creators, setCreators] = useState<CreatorPartnershipItem[]>([]);
  const [summary, setSummary] = useState<CreatorPortfolioSummary | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New creator form state
  const [creatorName, setCreatorName] = useState('');
  const [handle, setHandle] = useState('');
  const [channel, setChannel] = useState<CreatorChannel>('instagram');
  const [niche, setNiche] = useState('SaaS & Produtividade');
  const [followersCount, setFollowersCount] = useState('55000');
  const [agreedFeeBrl, setAgreedFeeBrl] = useState('2500');
  const [deliverablesTotal, setDeliverablesTotal] = useState('3');
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadCreators(selectedStage = stageFilter) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/creators?stage=${encodeURIComponent(selectedStage)}`
      );
      const data = await res.json();
      if (res.ok) {
        setCreators(data.creators || []);
        setSummary(data.summary || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCreators(stageFilter);
  }, [stageFilter]);

  async function handleCreateCreator(e: React.FormEvent) {
    e.preventDefault();
    if (!creatorName.trim() || !handle.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorName,
          handle,
          channel,
          niche,
          followersCount: Number(followersCount),
          agreedFeeBrl: Number(agreedFeeBrl),
          deliverablesTotal: Number(deliverablesTotal),
          couponCode: couponCode.trim() || undefined,
        }),
      });
      if (res.ok) {
        setCreatorName('');
        setHandle('');
        setCouponCode('');
        await loadCreators(stageFilter);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(
    creatorId: string,
    action: 'log_deliverable' | 'advance_stage' | 'delete'
  ) {
    setBusyId(creatorId);
    try {
      await fetch('/api/creators/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, action }),
      });
      await loadCreators(stageFilter);
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
            <Award className="w-3.5 h-3.5" />
            <span>Feature 039 • Creator CRM, Parcerias UGC & Calculadora ROI/EMV</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hub de Influenciadores, Parcerias & UGC
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie contratos com criadores de conteúdo, acompanhe entregáveis e meça CPE, Earned Media Value (EMV) e ROI por cupom/UTM.
          </p>
        </div>

        {/* Stage Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'contracted', label: 'Contratados' },
              { id: 'content_review', label: 'Em Revisão' },
              { id: 'published', label: 'Publicados' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStageFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                stageFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio KPI Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/35 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
              <span>ROI Consolidado da Carteira</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              +{summary.portfolioRoiPct}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Retorno sobre cachês investidos ({summary.totalCreators} criadores)
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>Valor Gerado (Vendas + EMV)</span>
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              R$ {summary.totalValueGeneratedBrl.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Investido: R$ {summary.totalInvestedBrl.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>CPE Médio da Carteira</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              R$ {summary.avgCpeBrl.toFixed(2)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Custo efetivo por interação orgânica
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-purple-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
              <span>Entregáveis Concluídos</span>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.deliverablesProgressPct}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Taxa de cumprimento dos contratos UGC
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Creator Cards + Add New Creator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white">
            Parcerias Ativas ({creators.length})
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Calculando métricas de CPE, EMV e ROI da carteira de criadores...
            </div>
          ) : creators.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {creators.map((c) => (
                <CreatorPartnershipCard
                  key={c.id}
                  creator={c}
                  onAction={handleAction}
                  busy={busyId === c.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Nenhum criador encontrado para este estágio.
            </div>
          )}
        </div>

        {/* Add Creator Partnership Form */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-6 h-fit space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Cadastrar Novo Criador / UGC
            </h2>
          </div>

          <form onSubmit={handleCreateCreator} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Nome do Influenciador / Criador
              </label>
              <input
                type="text"
                required
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Ex: Camila Marketing IA"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  @Handle
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@camila.ia"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Canal</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as CreatorChannel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Nicho da Audiência
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Seguidores
                </label>
                <input
                  type="number"
                  value={followersCount}
                  onChange={(e) => setFollowersCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Cachê Total (R$)
                </label>
                <input
                  type="number"
                  value={agreedFeeBrl}
                  onChange={(e) => setAgreedFeeBrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Qtd. Entregáveis
                </label>
                <input
                  type="number"
                  value={deliverablesTotal}
                  onChange={(e) => setDeliverablesTotal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Cupom / Código UTM
                </label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="CAMILA20"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {submitting
                ? 'Cadastrando Parceria...'
                : 'Adicionar Criador & Gerar Briefing IA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
