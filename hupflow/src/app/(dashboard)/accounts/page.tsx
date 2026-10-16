'use client';

import { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface AccountItem {
  id: string;
  provider: 'linkedin' | 'x' | 'instagram' | 'threads' | 'facebook';
  name: string;
  username: string;
  avatar: string;
  connectedAt: string;
  status: 'active' | 'expired';
}

export default function AccountsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [accounts, setAccounts] = useState<AccountItem[]>([
    {
      id: 'acc_1',
      provider: 'linkedin',
      name: 'Lucas Silva',
      username: 'lucas-silva-dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      connectedAt: '12 Out 2026',
      status: 'active',
    },
    {
      id: 'acc_2',
      provider: 'x',
      name: 'Lucas Silva',
      username: '@lucassilva_tech',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      connectedAt: '14 Out 2026',
      status: 'active',
    },
  ]);

  const availableProviders = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      desc: 'Perfis pessoais e Company Pages com carrosséis e posts',
      color: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      desc: 'Tweets, threads e publicações diretas de até 280 caracteres',
      color: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Posts no feed, carrosséis e reels para contas profissionais',
      color: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
    },
    {
      id: 'threads',
      name: 'Threads',
      desc: 'Publicações conversacionais e engajamento dinâmico',
      color: 'border-zinc-500/30 bg-zinc-500/10 text-zinc-300',
    },
  ];

  const handleConnectProvider = (providerId: string) => {
    // Adicionar conta simulada com tokens seguros
    const exists = accounts.find((a) => a.provider === providerId);
    if (exists) {
      showToast(`Conta de ${providerId} já está conectada no workspace.`);
      return;
    }

    const newAcc: AccountItem = {
      id: `acc_${Date.now()}`,
      provider: providerId as any,
      name: 'Lucas Silva (HupFlow)',
      username: `@lucas_${providerId}`,
      avatar:
        providerId === 'instagram'
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
      connectedAt: 'Hoje',
      status: 'active',
    };

    setAccounts([...accounts, newAcc]);
    showToast(`Conta de ${providerId.toUpperCase()} conectada com sucesso via OAuth 2.0!`);
  };

  const handleDisconnect = (id: string, name: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
    showToast(`Conta ${name} desconectada.`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-indigo-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contas Conectadas</h1>
          <p className="text-sm text-slate-400">
            Gerencie suas integrações OAuth 2.0 com segurança criptografada AES-256-GCM.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tokens 100% Criptografados (AES-256)</span>
        </div>
      </div>

      {/* Connected Accounts List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Contas Ativas no Workspace ({accounts.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between gap-4 hover:border-slate-700/80 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-12 h-12 rounded-full border-2 border-slate-700 object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-100">{acc.name}</h4>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {acc.provider}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{acc.username}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Conectado em {acc.connectedAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  title="Atualizar Conexão"
                  onClick={() => showToast(`Tokens da conta ${acc.name} renovados com sucesso.`)}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  title="Desconectar"
                  onClick={() => handleDisconnect(acc.id, acc.name)}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-950 hover:bg-rose-950/30 hover:border-rose-800 text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Integrations Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h3 className="text-sm font-semibold text-slate-200">Disponíveis para Conectar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableProviders.map((prov) => {
            const isConnected = accounts.some((a) => a.provider === prov.id);
            return (
              <div
                key={prov.id}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center font-bold text-xs mb-3 ${prov.color}`}
                  >
                    {prov.name[0]}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{prov.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{prov.desc}</p>
                </div>

                <button
                  id={`btn-connect-${prov.id}`}
                  onClick={() => handleConnectProvider(prov.id)}
                  disabled={isConnected}
                  className={`w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isConnected
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-default'
                      : 'border-slate-700 bg-slate-950 hover:bg-slate-850 text-slate-200 hover:border-indigo-500'
                  }`}
                >
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Conectado</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Conectar Conta</span>
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
