'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  User,
  Send,
  Calendar,
  Share2,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { PostWithApproval, PostApprovalStatus, ApprovalCounts } from '@/lib/approvals/types';

export default function ApprovalsPage() {
  const [posts, setPosts] = useState<PostWithApproval[]>([]);
  const [counts, setCounts] = useState<ApprovalCounts>({
    all: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
  });
  const [activeTab, setActiveTab] = useState<PostApprovalStatus | 'all'>('in_review');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados do Modal de Rejeição
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadData = async (tab: PostApprovalStatus | 'all' = activeTab) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/approval?status=${tab}`);
      if (!res.ok) throw new Error('Falha ao carregar aprovações');
      const data = await res.json();
      setPosts(data.posts || []);
      if (data.counts) setCounts(data.counts);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const handleAction = async (postId: string, action: 'approve' | 'submit' | 'reset') => {
    setActionLoadingId(postId);
    try {
      const res = await fetch('/api/posts/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao processar ação');

      const actionLabels = {
        approve: 'Publicação aprovada com sucesso!',
        submit: 'Post submetido para revisão editorial!',
        reset: 'Status revertido para rascunho.',
      };
      showToast(actionLabels[action]);
      loadData(activeTab);
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (postId: string) => {
    setSelectedPostId(postId);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !rejectReason.trim() || rejectReason.trim().length < 5) {
      showToast('Por favor, informe uma justificativa com no mínimo 5 caracteres', 'error');
      return;
    }

    setActionLoadingId(selectedPostId);
    try {
      const res = await fetch('/api/posts/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: selectedPostId,
          action: 'reject',
          feedback: rejectReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao rejeitar');

      showToast('Publicação devolvida ao autor com apontamentos de ajuste.');
      setIsRejectModalOpen(false);
      loadData(activeTab);
    } catch (err: any) {
      showToast(err.message || 'Erro na devolução', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-fade-in text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header com Navegação e Ação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Aprovações & Revisão</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-amber-400" />
            Central de Revisão & Aprovações
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Valide copies e mídias da equipe antes do agendamento nas redes sociais para garantir conformidade e qualidade editorial.
          </p>
        </div>

        <Link
          href="/composer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0 self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          Novo Post no Compositor
        </Link>
      </div>

      {/* Tabs com Contadores */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('in_review')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'in_review'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Em Revisão</span>
          <span
            className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
              counts.inReview > 0
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {counts.inReview}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'approved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Aprovados</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px]">
            {counts.approved}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'rejected'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Necessitam Ajustes</span>
          <span
            className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
              counts.rejected > 0
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {counts.rejected}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('draft')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'draft'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Rascunhos</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 font-mono text-[10px]">
            {counts.draft}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <span>Todos</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
            {counts.all}
          </span>
        </button>
      </div>

      {/* Lista de Publicações */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 rounded-2xl border border-slate-800/80 bg-slate-900/40">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          <span className="ml-2 text-xs text-slate-400">Carregando fila editorial...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
          <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">
            {activeTab === 'in_review'
              ? 'Nenhuma publicação pendente de revisão!'
              : 'Nenhum post encontrado nesta categoria.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeTab === 'in_review'
              ? 'Excelente trabalho! Todas as postagens submetidas pela equipe já foram analisadas.'
              : 'Crie novos conteúdos no Compositor para acompanhar o fluxo de aprovação.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isLoadingAction = actionLoadingId === post.id;
            return (
              <div
                key={post.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Cabeçalho do Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                      {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {post.authorName || 'Autor Desconhecido'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Criado em {new Date(post.createdAt).toLocaleDateString()} às{' '}
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {post.approvalStatus === 'in_review' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        Em Revisão
                      </span>
                    )}
                    {post.approvalStatus === 'approved' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aprovado
                      </span>
                    )}
                    {post.approvalStatus === 'rejected' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        Necessita Ajustes
                      </span>
                    )}
                    {post.approvalStatus === 'draft' && (
                      <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Rascunho
                      </span>
                    )}
                  </div>
                </div>

                {/* Conteúdo do Post */}
                <div className="text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                  {post.content}
                </div>

                {/* Justificativa de Rejeição (Se houver) */}
                {post.approvalStatus === 'rejected' && post.rejectionReason && (
                  <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-950/30 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                      <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                      <span>Feedback do Revisor:</span>
                    </div>
                    <p className="text-xs text-rose-200/90 pl-5">{post.rejectionReason}</p>
                  </div>
                )}

                {/* Rodapé: Canais e Ações */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  {/* Canais Sociais */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Destinos:</span>
                    {post.channels.length === 0 ? (
                      <span className="text-xs text-slate-500 font-mono">Nenhum canal selecionado</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {post.channels.map((ch) => (
                          <span
                            key={ch.id}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono uppercase border border-slate-700"
                          >
                            {ch.provider}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex items-center gap-2">
                    {post.approvalStatus === 'in_review' && (
                      <>
                        <button
                          onClick={() => handleAction(post.id, 'approve')}
                          disabled={isLoadingAction}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                        >
                          {isLoadingAction ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ThumbsUp className="w-3.5 h-3.5" />
                          )}
                          <span>Aprovar Publicação</span>
                        </button>

                        <button
                          onClick={() => openRejectModal(post.id)}
                          disabled={isLoadingAction}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold transition-all disabled:opacity-50"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Solicitar Ajustes</span>
                        </button>
                      </>
                    )}

                    {(post.approvalStatus === 'draft' || post.approvalStatus === 'rejected') && (
                      <button
                        onClick={() => handleAction(post.id, 'submit')}
                        disabled={isLoadingAction}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all disabled:opacity-50"
                      >
                        {isLoadingAction ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Submeter para Revisão</span>
                      </button>
                    )}

                    <Link
                      href="/composer"
                      className="p-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center gap-1 px-2.5"
                    >
                      <span>Abrir</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Rejeição com Feedback */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Solicitar Ajustes na Publicação</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Informe ao autor o que precisa ser ajustado (ex: tom de voz, erros gramaticais, troca de hashtags ou imagens).
              </p>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Justificativa / Apontamentos <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: Favor ajustar o título para focar mais na dor do cliente e corrigir a menção na terceira linha..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoadingId !== null}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
                >
                  {actionLoadingId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ThumbsDown className="w-3.5 h-3.5" />
                  )}
                  <span>Devolver para Ajustes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
