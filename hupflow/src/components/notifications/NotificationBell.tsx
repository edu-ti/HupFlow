'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CheckSquare,
  AlertCircle,
  ExternalLink,
  CheckCheck,
  Loader2,
  Users,
  Flame,
} from 'lucide-react';
import { NotificationItem, NotificationType } from '@/lib/notifications/types';
import { getNotificationSeverity } from '@/lib/notifications/notifications-utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?limit=15');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('[NotificationBell] Erro ao carregar notificações:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Polling leve a cada 30s
    return () => clearInterval(interval);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });

      // Atualização otimista
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      if (linkUrl) {
        setIsOpen(false);
        router.push(linkUrl);
      }
    } catch (err) {
      console.error('[NotificationBell] Erro ao marcar leitura:', err);
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
    } catch (err) {
      console.error('[NotificationBell] Erro ao marcar todas como lidas:', err);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'post_published':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'post_failed':
        return <Flame className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'approval_requested':
      case 'approval_reviewed':
        return <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />;
      case 'quota_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'member_joined':
        return <Users className="w-4 h-4 text-purple-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão Sino */}
      <button
        id="btn-notification-bell"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) loadNotifications();
        }}
        className="relative p-2 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
        title="Notificações In-App"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-[#0D111A]/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
          {/* Header do Popover */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Notificações</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-semibold border border-rose-500/30">
                  {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                title="Marcar todas como lidas"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Ler todas</span>
              </button>
            )}
          </div>

          {/* Lista de Notificações */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                Nenhuma notificação por enquanto.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.linkUrl)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    !n.isRead
                      ? 'bg-indigo-950/20 hover:bg-indigo-950/30'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          !n.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'
                        }`}
                      >
                        {n.title}
                      </h4>
                      {!n.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-500 block pt-0.5">
                      {new Date(n.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer do Popover */}
          <div className="p-2.5 border-t border-slate-800 bg-slate-900/40 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold block py-1"
            >
              Ver Todas as Notificações &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
