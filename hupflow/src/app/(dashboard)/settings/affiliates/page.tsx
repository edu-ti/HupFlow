'use client';

import React, { useState, useEffect } from 'react';
import {
  AffiliatePartner,
  AffiliateProgramSummary,
  AffiliateTier,
  PayoutMethod,
} from '@/lib/affiliates/types';
import { AffiliatePartnerCard } from '@/components/affiliates/AffiliatePartnerCard';
import {
  Handshake,
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
} from 'lucide-react';

export default function AffiliatesProgramPage() {
  const [partners, setPartners] = useState<AffiliatePartner[]>([]);
  const [summary, setSummary] = useState<AffiliateProgramSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('all');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [tier, setTier] = useState<AffiliateTier>('bronze');
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('pix');
  const [payoutKey, setPayoutKey] = useState('');

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTierFilter !== 'all') params.set('tier', selectedTierFilter);

      const res = await fetch(`/api/affiliates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error('Falha ao buscar afiliados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [selectedTierFilter]);

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !payoutKey.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          referralCode: referralCode.trim() || undefined,
          tier,
          payoutMethod,
          payoutKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao cadastrar parceiro');
      }

      setName('');
      setEmail('');
      setReferralCode('');
      setPayoutKey('');
      setShowCreateModal(false);
      await fetchPartners();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao salvar parceiro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayout = async (partnerId: string, amountBrl: number) => {
    try {
      const res = await fetch('/api/affiliates/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, amountBrl }),
      });
      if (res.ok) {
        await fetchPartners();
      }
    } catch (err) {
      console.error('Falha ao processar saque:', err);
    }
  };

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm('Deseja realmente remover este parceiro afiliado?')) return;
    try {
      const res = await fetch(`/api/affiliates?id=${encodeURIComponent(partnerId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchPartners();
      }
    } catch (err) {
      console.error('Falha ao excluir:', err);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" />
              Programa de Crescimento & Afiliados
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Portal de Afiliados & Parcerias Recorrentes
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Multiplique o crescimento do seu SaaS com criadores, consultores e parceiros. Comissionamento recorrente mensal de até 40% de MRR, links rastreados e liquidação automatizada via Pix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPartners()}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg border border-zinc-700 transition"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Novo Parceiro Afiliado
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Parceiros Totais</span>
            <span className="text-2xl font-bold text-white mt-1 block">{summary.totalPartners}</span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Na Rede</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Parceiros Ativos</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {summary.activePartners}
            </span>
            <span className="text-[11px] text-emerald-500 mt-1 block">Gerando Clientes</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">MRR de Afiliados</span>
            <span className="text-2xl font-bold text-sky-400 mt-1 block">
              R$ {summary.totalReferredMrrBrl.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-sky-500 mt-1 block">Receita Recorrente</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Comissões Pagas</span>
            <span className="text-2xl font-bold text-indigo-400 mt-1 block">
              R$ {summary.totalCommissionsPaidBrl.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Histórico Liquidado</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Saldo Pendente</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              R$ {summary.pendingPayoutsBrl.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-amber-500 mt-1 block">Aguardando Saque</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">LTV Médio Indicado</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">
              R$ {summary.averageCustomerLtvBrl.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-purple-400 mt-1 block">Estimado 8 Meses</span>
          </div>
        </div>
      )}

      {/* Filter and Listing */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto">
            {['all', 'diamond', 'gold', 'silver', 'bronze'].map(tierName => (
              <button
                key={tierName}
                onClick={() => setSelectedTierFilter(tierName)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedTierFilter === tierName
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tierName === 'all' ? 'Todos os Tiers' : tierName.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-500">
            {partners.length} parceiros listados
          </span>
        </div>

        {loading && partners.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
            <p className="text-xs">Carregando parceiros afiliados...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
            <Handshake className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-white">Nenhum parceiro encontrado nesta categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map(partner => (
              <AffiliatePartnerCard
                key={partner.id}
                partner={partner}
                onPayout={handlePayout}
                onDelete={handleDeletePartner}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating New Partner */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Handshake className="w-5 h-5 text-emerald-400" />
                Cadastrar Parceiro Afiliado
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Nome do Parceiro / Canal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedro Alcantara (Canal Escala SaaS)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  E-mail de Contato *
                </label>
                <input
                  type="email"
                  required
                  placeholder="pedro@parceiro.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Código de Indicação (Cupom/URL)
                  </label>
                  <input
                    type="text"
                    placeholder="PEDROSAAS"
                    value={referralCode}
                    onChange={e => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Nível Inicial (Tier)
                  </label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as AffiliateTier)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="bronze">Bronze (20% Recorrente)</option>
                    <option value="silver">Silver (25% Recorrente)</option>
                    <option value="gold">Gold (30% Recorrente)</option>
                    <option value="diamond">Diamond (40% Recorrente)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Método de Saque
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={e => setPayoutMethod(e.target.value as PayoutMethod)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pix">Pix</option>
                    <option value="bank_transfer">Transferência Bancária</option>
                    <option value="stripe_connect">Stripe Connect</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Chave Pix / Identificador de Pagamento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="pedro@pix.com.br"
                    value={payoutKey}
                    onChange={e => setPayoutKey(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Cadastrar Parceiro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
