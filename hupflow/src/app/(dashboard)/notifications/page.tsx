'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  Flame,
  Users,
  CheckCheck,
  Loader2,
  RefreshCw,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { NotificationItem, NotificationType } from '@/lib/notifications/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const showToast = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const url = unreadOnly ? '/api/notifications?unreadOnly=true&limit=100' : '/api/notifications?limit=100';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao carregar notificações');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [unreadOnly]);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      if (linkUrl) {
        router.push(linkUrl);
      }
    } catch (err) {
      console.error('Erro ao marcar notificação:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      showToast('Todas as notificações foram marcadas como lidas.');
    } catch (err) {
      console.error('Erro ao marcar todas:', err);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'post_published':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'post_failed':
        return <Flame className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'approval_requested':
      case 'approval_reviewed':
        return <CheckSquare className="w-5 h-5 text-indigo-400 shrink-0" />;
      case 'quota_warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case 'member_joined':
        return <Users className="w-5 h-5 text-purple-400 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400 shrink-0" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'posts') return n.type === 'post_published' || n.type === 'post_failed';
    if (filterType === 'approvals') return n.type === 'approval_requested' || n.type === 'approval_reviewed';
    if (filterType === 'system') return n.type === 'quota_warning' || n.type === 'member_joined' || n.type === 'general';
    return true;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-indigo-500/40 bg-indigo-950/90 text-indigo-200 text-xs font-medium shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header com Navegação e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Notificações</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-400" />
            Central de Notificações
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Histórico completo de alertas, aprovações editoriais, publicações e comunicados do workspace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Marcar todas como lidas</span>
            </button>
          )}

          <button
            onClick={loadNotifications}
            className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Atualizar"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('posts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'posts'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Publicações
          </button>
          <button
            onClick={() => setFilterType('approvals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'approvals'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Aprovações
          </button>
          <button
            onClick={() => setFilterType('system')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'system'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sistema & Equipe
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Apenas não lidas</span>
          </label>
        </div>
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">Carregando notificações...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Nenhuma notificação encontrada</h3>
            <p className="text-xs text-slate-500">
              Você está em dia com todas as atualizações do workspace!
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id, n.linkUrl)}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                !n.isRead
                  ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-500/60'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="mt-0.5">{getIcon(n.type)}</div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm ${
                        !n.isRead ? 'font-bold text-white' : 'font-semibold text-slate-300'
                      }`}
                    >
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold border border-indigo-500/30">
                        NOVA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {n.linkUrl && (
                <div className="shrink-0 pt-1 text-slate-500 hover:text-indigo-400 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
