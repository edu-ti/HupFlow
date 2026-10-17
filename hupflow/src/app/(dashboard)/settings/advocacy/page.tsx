'use client';

import React, { useEffect, useState } from 'react';
import {
  AdvocacyCampaignItem,
  AdvocacyChannel,
  AdvocacyLeaderboardMember,
  AdvocacyProgramSummary,
} from '@/lib/advocacy/types';
import { AdvocacyCampaignCard } from '@/components/advocacy/AdvocacyCampaignCard';
import {
  Megaphone,
  Trophy,
  DollarSign,
  Share2,
  Users,
  Plus,
} from 'lucide-react';

export default function EmployeeAdvocacyBoardPage() {
  const [campaigns, setCampaigns] = useState<AdvocacyCampaignItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<AdvocacyLeaderboardMember[]>(
    []
  );
  const [summary, setSummary] = useState<AdvocacyProgramSummary | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New campaign form state
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Produto & Growth');
  const [channel, setChannel] = useState<AdvocacyChannel>('linkedin');
  const [baseMessage, setBaseMessage] = useState('');
  const [targetUrl, setTargetUrl] = useState(
    'https://hupflow.app/novidade?utm_source=advocacy'
  );
  const [pointsReward, setPointsReward] = useState('75');
  const [submitting, setSubmitting] = useState(false);

  async function loadBoard(selectedChannel = channelFilter) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/advocacy?channel=${encodeURIComponent(selectedChannel)}`
      );
      const data = await res.json();
      if (res.ok) {
        setCampaigns(data.campaigns || []);
        setLeaderboard(data.leaderboard || []);
        setSummary(data.summary || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard(channelFilter);
  }, [channelFilter]);

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !baseMessage.trim() || !targetUrl.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/advocacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          department,
          channel,
          baseMessage,
          targetUrl,
          pointsReward: Number(pointsReward),
        }),
      });
      if (res.ok) {
        setTitle('');
        setBaseMessage('');
        await loadBoard(channelFilter);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(
    campaignId: string,
    action: 'record_share' | 'delete'
  ) {
    setBusyId(campaignId);
    try {
      await fetch('/api/advocacy/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, action }),
      });
      await loadBoard(channelFilter);
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
            <Megaphone className="w-3.5 h-3.5" />
            <span>Feature 040 • Employee Advocacy, Leaderboard & Ad Spend Saved</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Mural de Employee Advocacy & Amplificação de Equipe
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Amplifique o alcance orgânico com textos em 1ª pessoa personalizados por cargo, ranking gamificado de embaixadores e cálculo de economia em anúncios.
          </p>
        </div>

        {/* Channel Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'linkedin', 'instagram', 'x'] as const).map((ch) => (
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
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/35 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
              <span>Economia em Mídia Paga (Ads)</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              R$ {summary.totalAdSpendSavedBrl.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Equivalente em CPC + CPM B2B economizado
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>Alcance Orgânico da Equipe</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {(summary.totalOrganicReach / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Impressões qualificadas em perfis pessoais
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Total de Compartilhamentos</span>
              <Share2 className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.totalShares}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Em {summary.totalCampaigns} campanhas ativas no mural
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>Embaixadores no Leaderboard</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.activeAmbassadors}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Membros pontuando no ciclo atual
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Campaigns (2 cols) + Leaderboard & New Campaign Form (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white">
            Campanhas Prontas para Compartilhar ({campaigns.length})
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Carregando mural de Employee Advocacy e variações de persona...
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.map((c) => (
                <AdvocacyCampaignCard
                  key={c.id}
                  campaign={c}
                  onShare={(id) => handleAction(id, 'record_share')}
                  onDelete={(id) => handleAction(id, 'delete')}
                  busy={busyId === c.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Nenhuma campanha encontrada para este canal.
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard + Create Campaign Form */}
        <div className="space-y-6">
          {/* Gamified Leaderboard */}
          <div className="rounded-2xl border border-amber-500/25 bg-[#0B0F17]/95 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Leaderboard de Embaixadores
              </h2>
            </div>

            <div className="space-y-2.5">
              {leaderboard.map((member, index) => (
                <div
                  key={member.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        index === 0
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {member.memberName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {member.roleTitle} • {member.badge}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-amber-300 block">
                      {member.points} pts
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {member.sharesCount} shares
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Advocacy Campaign Form */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white">
                Publicar no Mural da Equipe
              </h2>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Título da Campanha
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Case de Sucesso Agência Alpha"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Canal
                  </label>
                  <select
                    value={channel}
                    onChange={(e) =>
                      setChannel(e.target.value as AdvocacyChannel)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">X / Twitter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Recompensa (Pts)
                  </label>
                  <input
                    type="number"
                    value={pointsReward}
                    onChange={(e) => setPointsReward(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Mensagem-Base (IA gerará 3 personas em 1ª pessoa)
                </label>
                <textarea
                  rows={3}
                  required
                  value={baseMessage}
                  onChange={(e) => setBaseMessage(e.target.value)}
                  placeholder="Ex: Publicamos nosso benchmark trimestral de retenção em carrosséis..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  URL de Destino com UTM
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                {submitting
                  ? 'Gerando 3 Personas IA...'
                  : 'Publicar no Mural & Gerar Personas'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
