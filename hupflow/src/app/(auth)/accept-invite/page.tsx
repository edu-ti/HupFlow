'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  LogIn,
} from 'lucide-react';

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token de convite ausente na URL.');
      setLoading(false);
      return;
    }

    const checkInvitation = async () => {
      try {
        const res = await fetch(`/api/auth/invitations/accept?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Convite inválido ou expirado.');
          setLoading(false);
          return;
        }

        setInvitation(data.invitation);
      } catch {
        setError('Erro de conexão ao verificar o convite.');
      } finally {
        setLoading(false);
      }
    };

    checkInvitation();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setNeedsAuth(true);
        setAccepting(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Não foi possível aceitar o convite.');
        setAccepting(false);
        return;
      }

      setSuccess(true);
      // Aguarda 1.5s e redireciona ao dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch {
      setError('Erro de rede ao aceitar o convite.');
      setAccepting(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'member':
        return 'Criador de Conteúdo';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800/90 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">HupFlow</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-sm text-zinc-400">Verificando convite...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Convite Inválido</h2>
              <p className="text-sm text-zinc-400 mt-1">{error}</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition"
            >
              Ir para o Login
            </Link>
          </div>
        )}

        {/* Success State */}
        {!loading && success && (
          <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Convite Aceito!</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Você agora faz parte do workspace <strong className="text-zinc-200">{invitation?.organizationName}</strong>.
              </p>
            </div>
            <p className="text-xs text-blue-400 animate-pulse">Redirecionando para o seu dashboard...</p>
          </div>
        )}

        {/* Needs Auth State */}
        {!loading && !success && needsAuth && (
          <div className="space-y-5 text-center animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <LogIn className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Autenticação Necessária</h2>
              <p className="text-sm text-zinc-400 mt-1">
                Faça login ou crie sua conta no HupFlow para ingressar no workspace <strong className="text-zinc-200">{invitation?.organizationName}</strong>.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/accept-invite?token=${token}`)}`}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition flex items-center justify-center gap-2"
              >
                Fazer Login
              </Link>
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(`/accept-invite?token=${token}`)}`}
                className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-sm rounded-xl transition flex items-center justify-center"
              >
                Criar Nova Conta
              </Link>
            </div>
          </div>
        )}

        {/* Ready to Accept State */}
        {!loading && !error && !success && !needsAuth && invitation && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-3">
                <Users className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">Convite para a Equipe</h2>
              <p className="text-sm text-zinc-400">
                Você foi convidado para colaborar no workspace:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Workspace</span>
                <span className="text-sm font-bold text-zinc-100">{invitation.organizationName}</span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-700/40 pt-2.5">
                <span className="text-xs text-zinc-400 font-medium">Papel Concedido</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {getRoleLabel(invitation.role)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-700/40 pt-2.5">
                <span className="text-xs text-zinc-400 font-medium">Destinado a</span>
                <span className="text-xs text-zinc-300 font-mono">{invitation.email}</span>
              </div>
            </div>

            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              {accepting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Aceitando Convite...
                </>
              ) : (
                <>
                  Aceitar e Entrar no Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-zinc-400">
          Carregando...
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
