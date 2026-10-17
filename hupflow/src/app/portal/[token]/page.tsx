'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicPortalView } from '@/lib/portals/types';
import {
  CheckCircle2,
  Clock,
  MessageSquareWarning,
  Lock,
  Sparkles,
  Calendar,
  Layers,
  Send,
} from 'lucide-react';

export default function PublicClientPortalPage() {
  const params = useParams<{ token: string }>();
  const token = params?.token || '';

  const [portal, setPortal] = useState<PublicPortalView | null>(null);
  const [pinLocked, setPinLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reviewer modal / inline state
  const [reviewerName, setReviewerName] = useState('');
  const [notesByItem, setNotesByItem] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchPortal();
    }
  }, [token]);

  async function fetchPortal(pinCode?: string) {
    setLoading(true);
    setError(null);
    try {
      const url = pinCode
        ? `/api/portals/public/${encodeURIComponent(token)}?pin=${encodeURIComponent(pinCode)}`
        : `/api/portals/public/${encodeURIComponent(token)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Portal não encontrado');
        return;
      }
      setPortal(data.portal);
      setPinLocked(Boolean(data.pinLocked));
    } catch {
      setError('Falha ao conectar com o portal de aprovação.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewDecision(
    deliverableId: string,
    decision: 'approved' | 'changes_requested'
  ) {
    setSubmittingId(deliverableId);
    setActionMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/portals/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          pin: pinInput || null,
          deliverableId,
          decision,
          reviewerName: reviewerName.trim() || 'Cliente Aprovador',
          feedbackNote: notesByItem[deliverableId] || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Não foi possível registrar sua avaliação.');
        return;
      }
      setPortal(data.portal);
      setActionMessage(
        decision === 'approved'
          ? 'Publicação aprovada com sucesso! A agência já foi notificada.'
          : 'Solicitação de ajuste registrada e enviada para a equipe criativa.'
      );
    } catch {
      setError('Erro de conexão ao registrar avaliação.');
    } finally {
      setSubmittingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-slate-400">
            Carregando Portal de Aprovação...
          </p>
        </div>
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <h1 className="text-lg font-bold text-white">Portal Indisponível</h1>
          <p className="text-xs text-slate-400">
            {error || 'Este link de aprovação expirou ou foi desativado.'}
          </p>
        </div>
      </div>
    );
  }

  const brandColor = portal.brandColor || '#6366F1';

  if (pinLocked) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-6">
        <div className="max-w-sm w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-center">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">
              {portal.clientName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Digite o PIN numérico de acesso fornecido pela agência.
            </p>
          </div>
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="••••"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-lg tracking-widest font-mono text-white"
          />
          <button
            type="button"
            onClick={() => fetchPortal(pinInput)}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all"
            style={{ backgroundColor: brandColor }}
          >
            Desbloquear Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col justify-between">
      <div>
        {/* White-Label Top Header */}
        <header
          className="border-b border-slate-800/80 py-8 px-6"
          style={{
            background: `linear-gradient(135deg, ${brandColor}25 0%, rgba(10,13,20,0.95) 100%)`,
          }}
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {portal.clientName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Portal de Aprovação Externa
                </span>
                <h1 className="text-xl font-bold text-white">
                  {portal.clientName} — {portal.projectTitle}
                </h1>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-950/70 border border-slate-800 text-right">
              <span className="text-sm font-bold text-white">
                {portal.metrics.approvalRate}% Concluído
              </span>
              <p className="text-[11px] text-slate-400">
                {portal.metrics.approved} de {portal.metrics.total} aprovados
              </p>
            </div>
          </div>

          {portal.welcomeMessage && (
            <p className="max-w-4xl mx-auto text-xs text-slate-300 mt-4 leading-relaxed">
              {portal.welcomeMessage}
            </p>
          )}
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Reviewer Identity Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-bold text-white">
                Sua Identificação de Aprovador
              </label>
              <p className="text-[11px] text-slate-400">
                Seu nome ficará registrado no histórico de aprovação de cada peça.
              </p>
            </div>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Ex: Mariana (Diretora de Marketing)"
              className="sm:w-72 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>

          {actionMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              {actionMessage}
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Deliverables Cards */}
          <div className="space-y-4">
            {portal.deliverables.map((item) => {
              const isApproved = item.status === 'approved';
              const isChanges = item.status === 'changes_requested';

              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                          {item.channel}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          {item.mediaType === 'carousel'
                            ? `Carrossel (${item.slideCount || 5} slides)`
                            : item.mediaType === 'short_video'
                            ? 'Reels / Vídeo Curto'
                            : 'Post Único'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.scheduledDate?.slice(0, 10)}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white mt-1.5">
                        {item.title}
                      </h2>
                    </div>

                    {isApproved ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprovado
                      </span>
                    ) : isChanges ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                        <MessageSquareWarning className="w-3.5 h-3.5" />
                        Ajustes Solicitados
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Aguardando Aprovação
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                    {item.caption}
                  </div>

                  {item.feedbackNote && (
                    <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300">
                      <span className="font-bold text-white">
                        Último registro ({item.reviewedBy || 'Cliente'}):
                      </span>{' '}
                      {item.feedbackNote}
                    </div>
                  )}

                  {/* Feedback Note Input + 1-Click Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <input
                      type="text"
                      value={notesByItem[item.id] ?? ''}
                      onChange={(e) =>
                        setNotesByItem((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Comentário ou observação para a agência (obrigatório ao pedir ajustes)..."
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={submittingId === item.id}
                        onClick={() => handleReviewDecision(item.id, 'approved')}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5"
                        style={{ backgroundColor: brandColor }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprovar Publicação
                      </button>
                      <button
                        type="button"
                        disabled={submittingId === item.id}
                        onClick={() =>
                          handleReviewDecision(item.id, 'changes_requested')
                        }
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Solicitar Ajuste
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {!portal.hideHupflowBranding && (
        <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by HupFlow Clean Social Studio</span>
        </footer>
      )}
    </div>
  );
}
