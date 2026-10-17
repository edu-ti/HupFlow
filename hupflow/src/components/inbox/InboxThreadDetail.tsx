'use client';

import React, { useEffect, useState } from 'react';
import {
  SavedReplyMacro,
  SocialInboxMessage,
} from '@/lib/inbox/types';
import {
  generateSmartReplies,
  interpolateReplyTemplate,
} from '@/lib/inbox/inbox.test';
import {
  Sparkles,
  Send,
  Archive,
  CheckCircle2,
  Flame,
  AlertCircle,
  MessageSquare,
  Zap,
} from 'lucide-react';

interface InboxThreadDetailProps {
  message: SocialInboxMessage | null;
  macros: SavedReplyMacro[];
  onSubmitAction: (
    messageId: string,
    action: 'reply' | 'archive' | 'mark_unread',
    replyText?: string
  ) => Promise<void>;
}

export function InboxThreadDetail({
  message,
  macros,
  onSubmitAction,
}: InboxThreadDetailProps) {
  const [replyDraft, setReplyDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (message) {
      setReplyDraft(message.replyText || '');
    } else {
      setReplyDraft('');
    }
  }, [message]);

  if (!message) {
    return (
      <div className="h-full min-h-[420px] rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-400">
          Selecione uma conversa ou comentário à esquerda
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Use as sugestões de IA em 1 clique para responder leads e seguidores.
        </p>
      </div>
    );
  }

  const suggestions = generateSmartReplies(message, 'HupFlow');

  function applyMacro(macro: SavedReplyMacro) {
    if (!message) return;
    const text = interpolateReplyTemplate(macro.template, {
      authorName: message.authorName,
      brandName: 'HupFlow',
      channel: message.channel.toUpperCase(),
    });
    setReplyDraft(text);
  }

  async function handleSendReply() {
    if (!message || !replyDraft.trim()) return;
    setSending(true);
    try {
      await onSubmitAction(message.id, 'reply', replyDraft);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-6 border-b border-slate-800/80 flex flex-wrap items-start justify-between gap-4 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            {message.authorName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {message.authorName}
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {message.authorHandle}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono uppercase text-indigo-300">
                {message.channel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Em: <span className="text-slate-300">{message.postTitle || 'Post Social'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {message.intent === 'lead_intent' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              Oportunidade Comercial (Lead)
            </span>
          )}
          {message.intent === 'support' && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Suporte Prioritário
            </span>
          )}
          <button
            type="button"
            onClick={() => onSubmitAction(message.id, 'archive')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1.5 transition-all"
          >
            <Archive className="w-3.5 h-3.5" />
            Arquivar
          </button>
        </div>
      </div>

      {/* Incoming Message Bubble */}
      <div className="p-6 space-y-6">
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Comentário / Menção Recebida</span>
            <span>
              Prioridade:{' '}
              <strong className="uppercase text-slate-200">
                {message.priority}
              </strong>
            </span>
          </div>
          <p className="text-sm text-white leading-relaxed">{message.content}</p>
        </div>

        {message.status === 'replied' && message.replyText && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5 ml-6">
            <div className="flex items-center justify-between text-[11px] text-indigo-300">
              <span className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Respondido por {message.repliedBy || 'Equipe HupFlow'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {message.replyText}
            </p>
          </div>
        )}

        {/* AI Smart Replies Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Sugestões de Resposta IA (1-Click Smart Replies)
            </span>
            <span className="text-[10px] text-slate-400">
              Adaptado para {message.channel.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((sug) => (
              <button
                key={sug.id}
                type="button"
                onClick={() => setReplyDraft(sug.text)}
                className="p-3 rounded-xl bg-slate-950/70 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {sug.label}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-indigo-300">
                    Usar esta resposta →
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sug.text}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Saved Macros Bar */}
        {macros.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Macros Salvas (Com variáveis dinâmicas):
            </span>
            <div className="flex flex-wrap gap-2">
              {macros.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => applyMacro(m)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-all"
                >
                  {m.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer Box */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <textarea
            rows={3}
            value={replyDraft}
            onChange={(e) => setReplyDraft(e.target.value)}
            placeholder={`Escreva sua resposta para ${message.authorName} no ${message.channel.toUpperCase()}...`}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              {replyDraft.length} caracteres
              {message.channel === 'x' ? ' / 280 máx' : ''}
            </span>

            <button
              type="button"
              disabled={sending || !replyDraft.trim()}
              onClick={handleSendReply}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Publicando Resposta...' : 'Publicar Resposta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
