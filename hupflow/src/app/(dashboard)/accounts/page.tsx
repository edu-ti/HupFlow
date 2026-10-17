'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Share2,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';
import { SocialAccountSummary, SocialProvider } from '@/lib/connectors/types';

interface AccountsApiResponse {
  accounts: SocialAccountSummary[];
  quota: {
    used: number;
    limit: number;
    canAddMore: boolean;
    planName: string;
  };
}

export default function AccountsPage() {
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<SocialAccountSummary[]>([]);
  const [quota, setQuota] = useState<{
    used: number;
    limit: number;
    canAddMore: boolean;
    planName: string;
  }>({
    used: 0,
    limit: 3,
    canAddMore: true,
    planName: 'Starter',
  });

  const availableProviders = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      desc: 'Perfis pessoais e Company Pages com suporte a Carrosséis PDF nativos',
      badge: 'Carrossel PDF',
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      desc: 'OAuth 2.0 PKCE, publicações diretas e threads encadeadas',
      badge: 'Threads PKCE',
      color: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Posts no feed, carrosséis e reels para contas profissionais',
      badge: 'Feed & Reels',
      color: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
    },
    {
      id: 'threads',
      name: 'Threads',
      desc: 'Publicações conversacionais e engajamento dinâmico Meta',
      badge: 'Meta Graph',
      color: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-300',
    },
  ];

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/connectors/accounts');
      if (res.ok) {
        const data: AccountsApiResponse = await res.json();
        setAccounts(data.accounts || []);
        if (data.quota) setQuota(data.quota);
      } else {
        showToast('Falha ao carregar contas conectadas', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Erro de conexão ao sincronizar contas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleConnectProvider = async (providerId: string) => {
    if (!quota.canAddMore) {
      showToast(
        `Limite de ${quota.limit} contas do plano ${quota.planName} atingido. Faça upgrade para expandir.`,
        'error'
      );
      return;
    }

    setConnectingProvider(providerId);
    try {
      const res = await fetch('/api/connectors/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          code: `mock_code_${providerId}_${Date.now()}`,
          redirectUri: window.location.origin + '/callback',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Conta de ${providerId.toUpperCase()} conectada com sucesso via OAuth 2.0!`, 'success');
        await loadAccounts();
      } else {
        showToast(data.error || 'Erro ao conectar conta social', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Falha na comunicação com o servidor', 'error');
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleDisconnect = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/connectors/accounts?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast(`Conta ${name} desconectada com sucesso.`);
        await loadAccounts();
      } else {
        showToast('Erro ao desconectar conta', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Falha ao comunicar exclusão de conta', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const calculatePercent = (used: number, limit: number) => {
    if (limit === -1 || limit === 0) return 0;
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="accounts-toast-alert"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs shadow-2xl backdrop-blur-md transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            Contas Conectadas
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              OAuth 2.0 PKCE
            </span>
          </h1>
          <p className="text-sm text-slate-400">
            Gerencie canais de publicação social com chaves criptografadas via AES-256-GCM.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tokens AES-256 Seguros</span>
        </div>
      </div>

      {/* Quota Progress Banner */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-[#0A0D14]/90 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Cota de Canais Sociais ({quota.planName})</span>
          </div>
          <p className="text-xs text-slate-400">
            {quota.limit === -1
              ? `Você possui ${quota.used} conta(s) conectada(s) (Ilimitado no plano Agency).`
              : `Você utilizou ${quota.used} de ${quota.limit} contas disponíveis no seu plano.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-48">
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Capacidade</span>
              <span className="font-semibold text-slate-200">
                {quota.limit === -1 ? 'Ilimitado' : `${quota.used}/${quota.limit}`}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                style={{
                  width: `${calculatePercent(quota.used, quota.limit)}%`,
                }}
              />
            </div>
          </div>

          {!quota.canAddMore && (
            <Link
              href="/settings/billing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Fazer Upgrade</span>
            </Link>
          )}
        </div>
      </div>

      {/* Connected Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200">
            Contas Ativas no Workspace ({accounts.length})
          </h3>
          <button
            onClick={loadAccounts}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 text-center space-y-2">
            <Share2 className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">Nenhuma rede social conectada</p>
            <p className="text-xs text-slate-500">
              Escolha uma das opções abaixo para autorizar publicações e carrosséis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc.id}
                id={`account-card-${acc.id}`}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between gap-4 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={acc.accountAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'}
                    alt={acc.accountName}
                    className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-100">{acc.accountName}</h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {acc.provider}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">ID: {acc.providerAccountId}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Conectado em {new Date(acc.connectedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    title="Desconectar"
                    id={`btn-disconnect-${acc.id}`}
                    disabled={deletingId === acc.id}
                    onClick={() => handleDisconnect(acc.id, acc.accountName)}
                    className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-rose-950/30 hover:border-rose-800 text-slate-400 hover:text-rose-400 transition-all disabled:opacity-50"
                  >
                    {deletingId === acc.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Integrations Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h3 className="text-sm font-semibold text-slate-200">Disponíveis para Conectar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableProviders.map((prov) => {
            const isConnected = accounts.some((a) => a.provider === prov.id);
            const isConnecting = connectingProvider === prov.id;

            return (
              <div
                key={prov.id}
                id={`provider-box-${prov.id}`}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs ${prov.color}`}
                    >
                      {prov.name[0]}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                      {prov.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{prov.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{prov.desc}</p>
                </div>

                <button
                  id={`btn-connect-${prov.id}`}
                  onClick={() => handleConnectProvider(prov.id)}
                  disabled={isConnected || isConnecting || !quota.canAddMore}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isConnected
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default'
                      : !quota.canAddMore
                      ? 'border-slate-800 bg-slate-900/40 text-slate-500 cursor-not-allowed'
                      : 'border-slate-700 bg-slate-950 hover:bg-slate-850 text-slate-200 hover:border-indigo-500'
                  }`}
                >
                  {isConnecting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  ) : isConnected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conectado</span>
                    </>
                  ) : !quota.canAddMore ? (
                    <span>Cota Esgotada</span>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Conectar Canal</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
