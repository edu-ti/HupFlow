'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Archive,
  Edit3,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';
import { DlqIncident, DlqStatus, DlqCounts, DlqErrorCategory } from '@/lib/dlq/types';

export default function FailuresDlqPage() {
  const [incidents, setIncidents] = useState<DlqIncident[]>([]);
  const [counts, setCounts] = useState<DlqCounts>({
    pending: 0,
    retrying: 0,
    resolved: 0,
    dismissed: 0,
    total: 0,
  });
  const [activeTab, setActiveTab] = useState<DlqStatus | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);
  const [editingIncident, setEditingIncident] = useState<DlqIncident | null>(null);
  const [editText, setEditText] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const url = activeTab === 'all' ? '/api/posts/dlq' : `/api/posts/dlq?status=${activeTab}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Falha ao carregar incidentes da DLQ');
      const data = await res.json();
      setIncidents(data.incidents || []);
      if (data.counts) setCounts(data.counts);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar fila de falhas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleRetry = async (incidentId: string, updatedContent?: string) => {
    setActionLoadingId(incidentId);
    try {
      const res = await fetch('/api/posts/dlq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'retry',
          incidentId,
          updatedContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao reprocessar');

      showToast('Incidente reenfileirado para reprocessamento!');
      setEditingIncident(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro no retry', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDismiss = async (incidentId: string) => {
    if (!confirm('Deseja descartar este incidente da fila de atenção?')) return;
    setActionLoadingId(incidentId);
    try {
      const res = await fetch('/api/posts/dlq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'dismiss',
          incidentId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao descartar');

      showToast('Incidente arquivado com sucesso!');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao descartar', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const openEditModal = (inc: DlqIncident) => {
    setEditingIncident(inc);
    setEditText(inc.postContent || '');
  };

  const getCategoryBadge = (category: DlqErrorCategory) => {
    switch (category) {
      case 'AUTH_EXPIRED':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          label: 'Credencial Expirada',
        };
      case 'MEDIA_INVALID':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          label: 'Mídia / Aspecto Incompatível',
        };
      case 'RATE_LIMITED':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
          label: 'Rate Limit da Rede',
        };
      case 'CONTENT_REJECTED':
        return {
          bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          label: 'Conteúdo Rejeitado',
        };
      case 'NETWORK_TIMEOUT':
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          label: 'Timeout Transitório',
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          label: 'Erro Desconhecido',
        };
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
              Fila & Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Falhas & DLQ</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            Central de Reprocessamento & Dead-Letter Queue
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Diagnóstico inteligente e reprocessamento em 1 clique para publicações rejeitadas pelas APIs sociais (tokens expirados, proporção de mídia e limites de requisição).
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300 text-xs font-semibold transition-all shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar Fila</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-md">
          <span className="text-xs text-rose-300/80 font-medium block">Pendentes de Atenção</span>
          <span className="text-2xl font-bold text-rose-200 mt-1 block">{counts.pending}</span>
        </div>
        <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-md">
          <span className="text-xs text-blue-300/80 font-medium block">Em Reprocessamento</span>
          <span className="text-2xl font-bold text-blue-200 mt-1 block">{counts.retrying}</span>
        </div>
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md">
          <span className="text-xs text-emerald-300/80 font-medium block">Resolvidos com Sucesso</span>
          <span className="text-2xl font-bold text-emerald-200 mt-1 block">{counts.resolved}</span>
        </div>
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
          <span className="text-xs text-slate-400 font-medium block">Total Catalogado</span>
          <span className="text-2xl font-bold text-slate-200 mt-1 block">{counts.total}</span>
        </div>
      </div>

      {/* Tabs por Status */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'pending'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Pendentes</span>
          {counts.pending > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-mono">
              {counts.pending}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('retrying')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'retrying'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Em Reprocessamento</span>
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'resolved'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Resolvidos</span>
        </button>

        <button
          onClick={() => setActiveTab('dismissed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'dismissed'
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Descartados</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-800 text-slate-200 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Todos</span>
        </button>
      </div>

      {/* Lista de Incidentes */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <Loader2 className="w-6 h-6 text-rose-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">Carregando Dead-Letter Queue...</span>
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">
              {activeTab === 'pending'
                ? 'Nenhuma publicação com falha pendente!'
                : 'Nenhum incidente nesta visualização'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Todas as publicações agendadas foram entregues ou processadas com êxito.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((inc) => {
              const badge = getCategoryBadge(inc.errorCategory);
              const isActionRunning = actionLoadingId === inc.id;
              const isExpanded = expandedErrorId === inc.id;

              return (
                <div
                  key={inc.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  {/* Top Bar: Provedor, Conta e Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs uppercase text-slate-200 border border-slate-700">
                        {inc.provider.substring(0, 2)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{inc.accountName}</h3>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {inc.provider}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Falha registrada em: {new Date(inc.createdAt).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Diagnóstico & Ação Recomendada */}
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>Diagnóstico Recomendado:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-5">{inc.recommendedAction}</p>
                  </div>

                  {/* Conteúdo do Post e Erro da API */}
                  <div className="space-y-2 text-xs">
                    {inc.postContent && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 leading-relaxed">
                        <span className="text-[10px] text-slate-500 font-semibold block mb-1">
                          Texto da Publicação:
                        </span>
                        <p className="line-clamp-2">{inc.postContent}</p>
                      </div>
                    )}

                    <div>
                      <button
                        onClick={() =>
                          setExpandedErrorId(isExpanded ? null : inc.id)
                        }
                        className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 font-mono"
                      >
                        <span>Erro retornado pela API da rede social</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <pre className="mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-rose-300 whitespace-pre-wrap overflow-x-auto">
                          {inc.rawErrorMessage}
                        </pre>
                      )}
                    </div>
                  </div>

                  {/* Ações: Retry, Editar & Descartar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                    <span className="text-[11px] text-slate-500">
                      Tentativas de Reprocessamento: <strong className="text-slate-300 font-mono">{inc.retryCount}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      {inc.status === 'pending' && (
                        <>
                          <button
                            onClick={() => openEditModal(inc)}
                            disabled={isActionRunning}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Editar & Tentar</span>
                          </button>

                          <button
                            onClick={() => handleRetry(inc.id)}
                            disabled={isActionRunning}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
                          >
                            {isActionRunning ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            <span>Reprocessar Agora</span>
                          </button>

                          <button
                            onClick={() => handleDismiss(inc.id)}
                            disabled={isActionRunning}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                            title="Descartar da fila"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {inc.status === 'retrying' && (
                        <span className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Em fila para novo envio...</span>
                        </span>
                      )}

                      {inc.status === 'resolved' && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Publicado com êxito</span>
                        </span>
                      )}

                      {inc.status === 'dismissed' && (
                        <span className="text-xs text-slate-500 italic">Incidente arquivado</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Edição & Retry */}
      {editingIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 my-8 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Editar Post & Reprocessar</h3>
                  <span className="text-xs text-slate-400">Canal: {editingIncident.accountName} ({editingIncident.provider})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingIncident(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Texto Corrigido para este Canal:
                </label>
                <textarea
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingIncident(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={actionLoadingId === editingIncident.id}
                  onClick={() => handleRetry(editingIncident.id, editText)}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20"
                >
                  {actionLoadingId === editingIncident.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                  <span>Salvar & Reprocessar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
