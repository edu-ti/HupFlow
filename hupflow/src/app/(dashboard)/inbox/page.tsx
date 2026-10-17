'use client';

import React, { useEffect, useState } from 'react';
import {
  InboxChannel,
  InboxStats,
  SavedReplyMacro,
  SocialInboxMessage,
} from '@/lib/inbox/types';
import { InboxThreadDetail } from '@/components/inbox/InboxThreadDetail';
import {
  Inbox,
  Flame,
  CheckCircle2,
  MessageSquarePlus,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function UnifiedSocialInboxPage() {
  const [messages, setMessages] = useState<SocialInboxMessage[]>([]);
  const [macros, setMacros] = useState<SavedReplyMacro[]>([]);
  const [stats, setStats] = useState<InboxStats>({
    totalMessages: 0,
    unreadCount: 0,
    leadIntentCount: 0,
    repliedCount: 0,
    responseRate: 100,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [intentFilter, setIntentFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quick simulate incoming mention modal state
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simAuthor, setSimAuthor] = useState('Gabriel Nogueira');
  const [simChannel, setSimChannel] = useState<InboxChannel>('linkedin');
  const [simContent, setSimContent] = useState(
    'Parabéns pelo post! Qual o preço do plano Agency para 20 contas e como funciona a demonstração?'
  );

  useEffect(() => {
    loadInbox();
  }, [statusFilter, channelFilter, intentFilter]);

  async function loadInbox() {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (channelFilter !== 'all') params.set('channel', channelFilter);
      if (intentFilter !== 'all') params.set('intent', intentFilter);

      const res = await fetch(`/api/inbox?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const list: SocialInboxMessage[] = data.messages || [];
        setMessages(list);
        setMacros(data.macros || []);
        setStats(
          data.stats || {
            totalMessages: 0,
            unreadCount: 0,
            leadIntentCount: 0,
            repliedCount: 0,
            responseRate: 100,
          }
        );
        if (list.length > 0 && (!selectedId || !list.some((m) => m.id === selectedId))) {
          setSelectedId(list[0].id);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar Social Inbox:', err);
    }
  }

  async function handleAction(
    messageId: string,
    action: 'reply' | 'archive' | 'mark_unread',
    replyText?: string
  ) {
    try {
      const res = await fetch('/api/inbox/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, action, replyText }),
      });
      if (res.ok) {
        await loadInbox();
        setFeedback(
          action === 'reply'
            ? 'Resposta enviada e publicada com sucesso!'
            : 'Conversa arquivada no Inbox!'
        );
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Erro ao responder:', err);
    }
  }

  async function handleSimulateIncoming() {
    if (!simAuthor.trim() || !simContent.trim()) return;
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: simChannel,
          authorName: simAuthor,
          content: simContent,
          postTitle: 'Carrossel Recente no HupFlow',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setShowSimulateModal(false);
        await loadInbox();
        if (data.message) {
          setSelectedId(data.message.id);
        }
        setFeedback('Nova interação recebida e classificada pela IA!');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Erro ao simular menção:', err);
    }
  }

  const activeMessage = messages.find((m) => m.id === selectedId) || null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Inbox className="w-3.5 h-3.5" />
              Feature 034 • Unified Social Inbox & AI Smart Replies
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Social Inbox Unificado & Triagem de Leads com IA
          </h1>
          <p className="text-sm text-slate-400">
            Responda comentários e menções do LinkedIn, Instagram, Threads e X em um único lugar com detecção automática de intenção de compra.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSimulateModal((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Simular Novo Comentário
        </button>
      </div>

      {feedback && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {feedback}
        </div>
      )}

      {/* Simulate Modal / Inline Box */}
      {showSimulateModal && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Testar Classificador de Intenção & Sentimento em Tempo Real
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={simAuthor}
              onChange={(e) => setSimAuthor(e.target.value)}
              placeholder="Nome do seguidor/lead"
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
            <select
              value={simChannel}
              onChange={(e) => setSimChannel(e.target.value as InboxChannel)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            >
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="x">X / Twitter</option>
              <option value="threads">Threads</option>
            </select>
            <button
              type="button"
              onClick={handleSimulateIncoming}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              Ingerir & Classificar com IA
            </button>
          </div>
          <textarea
            rows={2}
            value={simContent}
            onChange={(e) => setSimContent(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
          />
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Aguardando Resposta</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.unreadCount}
            </p>
          </div>
          <Clock className="w-6 h-6 text-indigo-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Leads Comerciais Detectados</p>
            <p className="text-2xl font-bold text-amber-300 mt-0.5">
              {stats.leadIntentCount}
            </p>
          </div>
          <Flame className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Interações Respondidas</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">
              {stats.repliedCount}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Taxa de Resposta (SLA)</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.responseRate}%
            </p>
          </div>
          <Sparkles className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'unread', label: 'Não Lidas' },
            { id: 'replied', label: 'Respondidas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
          >
            <option value="all">Todas as Intenções</option>
            <option value="lead_intent">🔥 Apenas Leads Comerciais</option>
            <option value="support">🛠️ Suporte & Dúvidas Críticas</option>
            <option value="question">❓ Perguntas Gerais</option>
            <option value="praise">🙌 Elogios</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
          >
            <option value="all">Todas as Redes</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="x">X / Twitter</option>
            <option value="threads">Threads</option>
          </select>
        </div>
      </div>

      {/* Main Split Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Conversations */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {messages.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-md'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {item.channel}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {item.authorName}
                    </span>
                  </div>

                  {item.intent === 'lead_intent' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Lead
                    </span>
                  ) : item.intent === 'support' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Suporte
                    </span>
                  ) : item.status === 'replied' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300">
                      Respondido
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate max-w-[200px]">
                    {item.postTitle}
                  </span>
                  <span>
                    {item.status === 'replied' ? '✓ Respondido' : 'Pendente'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail & Smart Reply Console */}
        <div className="lg:col-span-7">
          <InboxThreadDetail
            message={activeMessage}
            macros={macros}
            onSubmitAction={handleAction}
          />
        </div>
      </div>
    </div>
  );
}
