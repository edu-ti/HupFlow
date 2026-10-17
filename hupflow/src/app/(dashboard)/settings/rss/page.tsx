'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Rss,
  Plus,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  FileText,
  Copy,
  Check,
  X as CloseIcon,
} from 'lucide-react';
import { RssFeed, RssFeedItem } from '@/lib/rss/types';
import { AddFeedModal } from '@/components/rss/AddFeedModal';

export default function RssSettingsPage() {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [recentItems, setRecentItems] = useState<RssFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'feeds'>('items');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draftModalItem, setDraftModalItem] = useState<{
    title: string;
    content: string;
    hashtags: string[];
  } | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<string | null>(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rss');
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
        setRecentItems(data.recentItems || []);
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/rss/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Sincronização concluída com sucesso!');
        await loadData();
      } else {
        throw new Error(data.error || 'Erro na sincronização');
      }
    } catch (err: any) {
      showToast(err.message || 'Falha ao sincronizar', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteFeed = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente remover o feed "${name}" e seus artigos?`)) return;

    try {
      const res = await fetch(`/api/rss?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('Feed RSS removido com sucesso.');
        setFeeds((prev) => prev.filter((f) => f.id !== id));
        setRecentItems((prev) => prev.filter((i) => i.feedId !== id));
      } else {
        throw new Error(data.error || 'Erro ao excluir');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir', 'error');
    }
  };

  const handleGenerateDraft = async (item: RssFeedItem, network: string = 'linkedin') => {
    setIsGeneratingDraft(item.id);
    try {
      const res = await fetch('/api/rss/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, network }),
      });

      const data = await res.json();
      if (res.ok && data.draft) {
        setDraftModalItem(data.draft);
        // Atualiza status localmente para drafted
        setRecentItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'drafted' } : i))
        );
      } else {
        throw new Error(data.error || 'Erro ao sintetizar post com IA');
      }
    } catch (err: any) {
      showToast(err.message || 'Falha ao gerar rascunho', 'error');
    } finally {
      setIsGeneratingDraft(null);
    }
  };

  const copyDraftToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDraft(true);
      showToast('Post copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedDraft(false), 2500);
    } catch {
      showToast('Falha ao copiar', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Rss className="w-6 h-6 text-amber-500" />
            Integrador de Feeds RSS & IA
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Transforme automaticamente novos artigos do seu blog em publicações de alto engajamento no LinkedIn, X e Threads.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncing || feeds.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
            Sincronizar Agora
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Conectar Feed RSS
          </button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
            <Rss className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Feeds Conectados</p>
            <p className="text-2xl font-bold text-foreground">{feeds.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Artigos Importados</p>
            <p className="text-2xl font-bold text-foreground">{recentItems.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Rascunhos com IA</p>
            <p className="text-2xl font-bold text-foreground">
              {recentItems.filter((i) => i.status === 'drafted' || i.status === 'published').length}
            </p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'items'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Artigos Detectados ({recentItems.length})
        </button>
        <button
          onClick={() => setActiveTab('feeds')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeTab === 'feeds'
              ? 'bg-primary text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Rss className="w-3.5 h-3.5" />
          Feeds Cadastrados ({feeds.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">Carregando artigos e fontes RSS...</p>
        </div>
      ) : activeTab === 'items' ? (
        recentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border/70 text-center">
            <div className="p-4 rounded-full bg-muted/40 text-muted-foreground mb-4">
              <Rss className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Nenhum artigo detectado ainda
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
              Conecte um feed RSS ou clique em sincronizar para importar os últimos posts do seu blog.
            </p>
            {feeds.length === 0 ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Conectar Primeiro Feed
              </button>
            ) : (
              <button
                onClick={handleSyncAll}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sincronizar Feeds Ativos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recentItems.map((item) => {
              const isDrafting = isGeneratingDraft === item.id;
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          item.status === 'drafted'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.status === 'drafted' ? 'Rascunho Gerado' : 'Novo Artigo'}
                      </span>
                      {item.pubDate && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.pubDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-foreground truncate">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.summary}
                      </p>
                    )}

                    <div className="pt-1">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        <span>Ver artigo original</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleGenerateDraft(item, 'linkedin')}
                      disabled={isDrafting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isDrafting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Sintetizando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Gerar Post com IA
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Aba Feeds Cadastrados */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feeds.map((feed) => (
            <div
              key={feed.id}
              className="p-5 rounded-xl border border-border/60 bg-card flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                      <Rss className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{feed.name}</h3>
                      <p className="text-[11px] font-mono text-muted-foreground truncate max-w-xs">
                        {feed.url}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFeed(feed.id, feed.name)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Excluir feed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono uppercase">
                    {feed.status}
                  </span>
                  <span>•</span>
                  <span>
                    Último check:{' '}
                    {feed.lastFetchedAt
                      ? new Date(feed.lastFetchedAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Nunca'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs text-muted-foreground">
                <span className="capitalize">
                  Canais: {feed.targetNetworks?.join(', ') || 'LinkedIn, X'}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {feed.autoPublish ? 'Auto-Publish Ativo' : 'Rascunho Manual'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      <AddFeedModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onFeedAdded={loadData}
      />

      {/* Modal de Rascunho Sintetizado */}
      {draftModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Post Social Sintetizado com IA
                </h3>
              </div>
              <button
                onClick={() => setDraftModalItem(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border font-sans text-xs text-foreground whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {draftModalItem.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => copyDraftToClipboard(draftModalItem.content)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border"
              >
                {copiedDraft ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar Texto
                  </>
                )}
              </button>

              <Link
                href="/composer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
              >
                <span>Abrir no Compositor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
