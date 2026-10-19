'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Link2,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  MousePointerClick,
  Share2,
  BarChart3,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  X as CloseIcon,
} from 'lucide-react';
import { ShortLink, ShortLinkVariant, SocialNetwork } from '@/lib/shortlinks/types';
import { generateChannelVariants } from '@/lib/shortlinks/shortlinks-utils';

export default function ShortLinksPage() {
  const [linksList, setLinksList] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal de Criação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formDestinationUrl, setFormDestinationUrl] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCustomSlug, setFormCustomSlug] = useState('');
  const [formCampaign, setFormCampaign] = useState('');
  const [formMedium, setFormMedium] = useState('social');
  const [formContent, setFormContent] = useState('');
  const [formTerm, setFormTerm] = useState('');

  // Modal de Variantes por Canal
  const [selectedLinkForVariants, setSelectedLinkForVariants] = useState<ShortLink | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const copyToClipboard = async (text: string, keyIdentifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyIdentifier);
      showToast('Link copiado para a área de transferência!', 'success');
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      showToast('Falha ao copiar link', 'error');
    }
  };

  const loadShortLinks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/shortlinks');
      if (!res.ok) throw new Error('Falha ao carregar links encurtados');
      const data = await res.json();
      setLinksList(data.shortLinks || []);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShortLinks();
  }, []);

  const openCreateModal = () => {
    setFormDestinationUrl('');
    setFormTitle('');
    setFormCustomSlug('');
    setFormCampaign('');
    setFormMedium('social');
    setFormContent('');
    setFormTerm('');
    setIsCreateModalOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDestinationUrl.trim()) {
      showToast('A URL de destino é obrigatória', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/shortlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationUrl: formDestinationUrl.trim(),
          title: formTitle.trim() || formDestinationUrl.trim(),
          customSlug: formCustomSlug.trim() || undefined,
          utmCampaign: formCampaign.trim() || undefined,
          utmMedium: formMedium.trim() || 'social',
          utmContent: formContent.trim() || undefined,
          utmTerm: formTerm.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao criar link encurtado');
      }

      showToast('Link encurtado criado com sucesso!', 'success');
      setIsCreateModalOpen(false);
      await loadShortLinks();
    } catch (err: any) {
      showToast(err.message || 'Falha ao salvar link', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (linkId: string, title: string) => {
    if (!confirm(`Deseja realmente remover o link "${title}"? Esta ação desativará o redirecionamento.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/shortlinks?id=${linkId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir link');

      showToast('Link encurtado removido com sucesso.', 'success');
      setLinksList((prev) => prev.filter((l) => l.id !== linkId));
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir', 'error');
    }
  };

  // Métricas
  const totalClicksCount = useMemo(() => {
    return linksList.reduce((acc, curr) => acc + (curr.totalClicks || 0), 0);
  }, [linksList]);

  const topLink = useMemo(() => {
    if (linksList.length === 0) return null;
    return [...linksList].sort((a, b) => b.totalClicks - a.totalClicks)[0];
  }, [linksList]);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return linksList;
    const q = searchQuery.toLowerCase();
    return linksList.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        l.destinationUrl.toLowerCase().includes(q) ||
        (l.utmCampaign && l.utmCampaign.toLowerCase().includes(q))
    );
  }, [linksList, searchQuery]);

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const getVariantsForLink = (link: ShortLink): ShortLinkVariant[] => {
    return generateChannelVariants(link.destinationUrl, {
      utmCampaign: link.utmCampaign || undefined,
      utmMedium: link.utmMedium || 'social',
      utmContent: link.utmContent || undefined,
      utmTerm: link.utmTerm || undefined,
    });
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
            <Link2 className="w-6 h-6 text-primary" />
            Encurtador de Links & Tags UTM
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gere URLs curtas inteligentes com rastreamento UTM segmentado por rede social (Instagram, Threads, LinkedIn e X) e telemetria de cliques em tempo real.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Link Encurtado
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border/60 bg-card/50 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Links Ativos</p>
            <p className="text-2xl font-bold text-foreground">{linksList.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/50 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Cliques Acumulados</p>
            <p className="text-2xl font-bold text-foreground">{totalClicksCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card/50 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-muted-foreground">Link Mais Popular</p>
            <p className="text-sm font-bold text-foreground truncate">
              {topLink ? `${topLink.title} (${topLink.totalClicks} cliques)` : 'Nenhum clique ainda'}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, slug ou destino..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Exibindo {filteredLinks.length} de {linksList.length} links cadastrados
        </p>
      </div>

      {/* Listagem de Links */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">Carregando links e métricas...</p>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border/70 text-center">
          <div className="p-4 rounded-full bg-muted/40 text-muted-foreground mb-4">
            <Link2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {searchQuery ? 'Nenhum link encontrado para sua busca' : 'Nenhum link encurtado cadastrado'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
            {searchQuery
              ? 'Tente utilizar outros termos na barra de busca.'
              : 'Crie seu primeiro link curto com parâmetros UTM para rastrear a performance dos seus posts.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar Primeiro Link
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLinks.map((link) => {
            const shortUrl = `${originUrl}/l/${link.slug}`;
            return (
              <div
                key={link.id}
                className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground truncate">{link.title}</h3>
                    {link.utmCampaign && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                        {link.utmCampaign}
                      </span>
                    )}
                    {link.utmMedium && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                        {link.utmMedium}
                      </span>
                    )}
                  </div>

                  {/* URLs */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/15 w-fit">
                      <span>{shortUrl}</span>
                      <button
                        onClick={() => copyToClipboard(shortUrl, link.id)}
                        title="Copiar link curto"
                        className="p-1 hover:text-foreground transition-colors"
                      >
                        {copiedKey === link.id ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={`/l/${link.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Testar redirecionamento"
                        className="p-1 hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <span className="hidden sm:inline text-muted-foreground/40">→</span>

                    <span className="truncate max-w-md text-xs text-muted-foreground" title={link.destinationUrl}>
                      {link.destinationUrl}
                    </span>
                  </div>

                  {/* Informações de clique e data */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <MousePointerClick className="w-3.5 h-3.5 text-emerald-400" />
                      {link.totalClicks} {link.totalClicks === 1 ? 'clique' : 'cliques'}
                    </span>
                    {link.lastClickedAt && (
                      <span>
                        Último clique:{' '}
                        {new Date(link.lastClickedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    <span>
                      Criado em {new Date(link.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedLinkForVariants(link)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors border border-border"
                  >
                    <Share2 className="w-3.5 h-3.5 text-primary" />
                    Variantes por Canal
                  </button>

                  <button
                    onClick={() => handleDelete(link.id, link.title)}
                    className="p-2 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Excluir link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Link2 className="w-5 h-5 text-primary" />
                Criar Link Encurtado com UTM
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  URL de Destino *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://exemplo.com.br/pagina-de-destino"
                  value={formDestinationUrl}
                  onChange={(e) => setFormDestinationUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Título Identificador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campanha de Inverno 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Slug Personalizado (opcional)
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 text-xs font-mono bg-muted/60 border border-r-0 border-border rounded-l-lg text-muted-foreground">
                    /l/
                  </span>
                  <input
                    type="text"
                    placeholder="ex: inverno-2026 (deixe vazio para aleatório)"
                    value={formCustomSlug}
                    onChange={(e) => setFormCustomSlug(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-r-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Deixe em branco para gerar um identificador Base62 único com 6 caracteres.
                </p>
              </div>

              {/* Seção UTM */}
              <div className="pt-2 border-t border-border/40 space-y-3">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Parâmetros de Rastreamento (UTM Tags)
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Campanha (utm_campaign)
                    </label>
                    <input
                      type="text"
                      placeholder="black-friday"
                      value={formCampaign}
                      onChange={(e) => setFormCampaign(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Meio (utm_medium)
                    </label>
                    <input
                      type="text"
                      placeholder="social"
                      value={formMedium}
                      onChange={(e) => setFormMedium(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Conteúdo (utm_content)
                    </label>
                    <input
                      type="text"
                      placeholder="banner-carrossel"
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-muted-foreground mb-1">
                      Termo/Keyword (utm_term)
                    </label>
                    <input
                      type="text"
                      placeholder="desconto"
                      value={formTerm}
                      onChange={(e) => setFormTerm(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Salvar e Gerar Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE VARIANTES SOCIAIS */}
      {selectedLinkForVariants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Links Segmentados por Rede Social
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedLinkForVariants.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedLinkForVariants(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Cada canal possui parâmetros <code className="font-mono text-primary">utm_source</code> específicos injetados para rastreamento preciso no Google Analytics e relatórios de aquisição:
              </p>

              {getVariantsForLink(selectedLinkForVariants).map((variant) => (
                <div
                  key={variant.network}
                  className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {variant.label}
                    </span>
                    <button
                      onClick={() => copyToClipboard(variant.url, variant.network)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-foreground bg-muted hover:bg-muted/80 rounded transition-colors border border-border"
                    >
                      {copiedKey === variant.network ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar URL
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground break-all bg-card/60 p-2 rounded border border-border/40">
                    {variant.url}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border/50 flex justify-end">
              <button
                onClick={() => setSelectedLinkForVariants(null)}
                className="px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
