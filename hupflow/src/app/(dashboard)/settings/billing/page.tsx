'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Users,
  HardDrive,
  FileText,
  ExternalLink,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
  Crown,
} from 'lucide-react';
import { BillingDetailsResponse, PlanTier } from '@/lib/billing/types';

export default function BillingPage() {
  const [data, setData] = useState<BillingDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const loadBillingData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/subscription');
      if (res.ok) {
        const json: BillingDetailsResponse = await res.json();
        setData(json);
      } else {
        showToast('Falha ao carregar detalhes de faturamento', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro de conexão ao carregar planos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();

    // Notificação se retornou de checkout bem-sucedido
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('checkout') === 'success') {
        showToast('Assinatura atualizada com sucesso! Novo plano ativo.', 'success');
      } else if (urlParams.get('checkout') === 'cancelled') {
        showToast('O checkout foi cancelado. Nenhuma cobrança realizada.', 'error');
      }
    }
  }, []);

  const handleCheckout = async (planTier: PlanTier) => {
    setCheckoutLoading(planTier);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planTier }),
      });

      const result = await res.json();
      if (res.ok && result.url) {
        window.location.href = result.url;
      } else {
        showToast(result.error || 'Erro ao iniciar checkout', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro de comunicação com o servidor de faturamento', 'error');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleOpenPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      const result = await res.json();
      if (res.ok && result.url) {
        window.location.href = result.url;
      } else {
        showToast(result.error || 'Não foi possível abrir o Customer Portal', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro ao abrir portal de assinaturas', 'error');
    } finally {
      setPortalLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  const formatLimit = (limit: number, isBytes = false) => {
    if (limit === -1) return 'Ilimitado';
    if (isBytes) return formatBytes(limit);
    return limit.toString();
  };

  const calculatePercent = (usage: number, limit: number) => {
    if (limit === -1 || limit === 0) return 0;
    const pct = Math.round((usage / limit) * 100);
    return Math.min(pct, 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-slate-400 text-sm">Carregando planos e cotas da organização...</p>
      </div>
    );
  }

  const currentPlan = data?.subscription.plan || 'starter';
  const limits = data?.limits;
  const usage = data?.usage;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          id="billing-toast-alert"
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm backdrop-blur-md transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Planos & Faturamento
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Stripe Powered
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Acompanhe o consumo de limites, gerencie métodos de pagamento e evolua sua assinatura.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-open-stripe-portal"
            onClick={handleOpenPortal}
            disabled={portalLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-sm font-medium transition-all shadow-sm disabled:opacity-60"
          >
            {portalLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <ExternalLink className="w-4 h-4 text-slate-400" />
            )}
            <span>Portal do Cliente Stripe</span>
          </button>
        </div>
      </div>

      {/* Overview Cards: Plano Atual & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0A0D14]/90 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Plano Atual</span>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-3xl font-extrabold capitalize text-white tracking-tight">
              {currentPlan}
            </h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {data?.subscription.status === 'active' ? 'Ativo' : data?.subscription.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Renovação:{' '}
            <span className="text-slate-200 font-medium">
              {data?.subscription.currentPeriodEnd
                ? new Date(data.subscription.currentPeriodEnd).toLocaleDateString('pt-BR')
                : 'Mensal Automática'}
            </span>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0A0D14]/90 border border-slate-800/80 shadow-lg md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Capacidade do Workspace (Cotas em Tempo Real)
            </span>
            <span className="text-xs text-indigo-400 font-mono">Clean-Room Enforced</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contas Sociais */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Contas Conectadas
                </span>
                <span className="text-slate-200 font-semibold">
                  {usage?.socialAccounts} / {formatLimit(limits?.maxSocialAccounts ?? 3)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                  style={{
                    width: `${calculatePercent(
                      usage?.socialAccounts ?? 0,
                      limits?.maxSocialAccounts ?? 3
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Membros de Equipe */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Membros na Equipe
                </span>
                <span className="text-slate-200 font-semibold">
                  {usage?.teamMembers} / {formatLimit(limits?.maxTeamMembers ?? 1)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{
                    width: `${calculatePercent(
                      usage?.teamMembers ?? 1,
                      limits?.maxTeamMembers ?? 1
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Posts Agendados / Mês */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  Posts Agendados no Mês
                </span>
                <span className="text-slate-200 font-semibold">
                  {usage?.postsThisMonth} / {formatLimit(limits?.maxPostsPerMonth ?? 30)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                  style={{
                    width: `${calculatePercent(
                      usage?.postsThisMonth ?? 0,
                      limits?.maxPostsPerMonth ?? 30
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Armazenamento de Mídia */}
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                  Biblioteca de Mídia
                </span>
                <span className="text-slate-200 font-semibold">
                  {formatBytes(usage?.storageBytes ?? 0)} /{' '}
                  {formatLimit(limits?.maxStorageBytes ?? 5368709120, true)}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{
                    width: `${calculatePercent(
                      usage?.storageBytes ?? 0,
                      limits?.maxStorageBytes ?? 5368709120
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Planos Disponíveis</h2>
          <p className="text-sm text-slate-400">
            Selecione o plano ideal para a escala de produção da sua marca ou agência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.plans.map((p) => {
            const isCurrent = currentPlan === p.id;
            const isPopular = p.badge === 'Mais Popular';

            return (
              <div
                key={p.id}
                id={`plan-card-${p.id}`}
                className={`flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 relative ${
                  isCurrent
                    ? 'bg-slate-900/90 border-2 border-indigo-500/80 shadow-xl shadow-indigo-500/10'
                    : isPopular
                    ? 'bg-gradient-to-b from-indigo-950/40 to-slate-950/80 border-2 border-purple-500/60 shadow-lg shadow-purple-500/10'
                    : 'bg-[#0A0D14]/90 border border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{p.name}</h3>
                    {isCurrent && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 min-h-[36px]">{p.tagline}</p>

                  <div className="mt-4 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">R$ {p.priceMonthly}</span>
                      <span className="text-xs text-slate-400">/mês</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-800/60 text-slate-400 text-xs font-semibold border border-slate-700/40 cursor-default"
                    >
                      Plano Ativo
                    </button>
                  ) : (
                    <button
                      id={`btn-checkout-${p.id}`}
                      onClick={() => handleCheckout(p.id)}
                      disabled={checkoutLoading !== null}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
                        isPopular
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      {checkoutLoading === p.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                      )}
                      <span>
                        {p.priceMonthly > (data?.plans.find((x) => x.id === currentPlan)?.priceMonthly ?? 0)
                          ? `Fazer Upgrade para ${p.name}`
                          : `Alterar para ${p.name}`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
