'use client';

import { useState, useEffect } from 'react';
import {
  Hash,
  Plus,
  Trash2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Tag,
  X as CloseIcon,
  Sparkles,
} from 'lucide-react';
import { HashtagSet } from '@/lib/hashtags/types';

export default function HashtagsSettingsPage() {
  const [setsList, setSetsList] = useState<HashtagSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal de Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('marketing');
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadSets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/hashtags/sets');
      if (!res.ok) throw new Error('Falha ao buscar coleções de hashtags');
      const data = await res.json();
      setSetsList(data.sets || []);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar coleções', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSets();
  }, []);

  const openCreateModal = () => {
    setFormName('');
    setFormCategory('marketing');
    setCurrentTagInput('');
    setFormTags([]);
    setIsModalOpen(true);
  };

  const handleAddTag = () => {
    const trimmed = currentTagInput.trim().replace(/^#+/, '');
    if (!trimmed) return;
    if (formTags.includes(trimmed)) {
      showToast('Esta hashtag já foi adicionada à coleção.', 'error');
      return;
    }
    setFormTags([...formTags, trimmed]);
    setCurrentTagInput('');
  };

  const handleKeyDownTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(formTags.filter((t) => t !== tagToRemove));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('O nome da coleção é obrigatório', 'error');
      return;
    }
    if (formTags.length === 0) {
      showToast('Adicione ao menos uma hashtag para a coleção', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/hashtags/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          category: formCategory,
          tags: formTags,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar coleção');

      showToast('Coleção de hashtags criada com sucesso!', 'success');
      setIsModalOpen(false);
      await loadSets();
    } catch (err: any) {
      showToast(err.message || 'Falha ao salvar', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (setId: string, name: string) => {
    if (!confirm(`Deseja realmente remover a coleção "${name}"?`)) return;

    try {
      const res = await fetch(`/api/hashtags/sets?id=${setId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir');

      showToast('Coleção removida com sucesso.', 'success');
      setSetsList((prev) => prev.filter((s) => s.id !== setId));
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir', 'error');
    }
  };

  const filteredSets = setsList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <Hash className="w-6 h-6 text-primary" />
            Coleções de Hashtags Salvas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize grupos reutilizáveis de hashtags por nicho ou produto para injeção rápida no Compositor de Posts.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Coleção
        </button>
      </div>

      {/* Barra de Filtro */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, tag ou categoria..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {filteredSets.length} {filteredSets.length === 1 ? 'coleção cadastrada' : 'coleções cadastradas'}
        </p>
      </div>

      {/* Listagem */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">Carregando coleções de hashtags...</p>
        </div>
      ) : filteredSets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border/70 text-center">
          <div className="p-4 rounded-full bg-muted/40 text-muted-foreground mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {searchQuery ? 'Nenhuma coleção encontrada' : 'Nenhuma coleção de hashtags salva'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
            {searchQuery
              ? 'Tente utilizar outros termos na barra de busca.'
              : 'Agrupe hashtags estratégicas por nicho para acelerar a redação e garantir consistência nos posts.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar Primeira Coleção
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSets.map((set) => (
            <div
              key={set.id}
              className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{set.name}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
                      {set.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(set.id, set.name)}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Excluir coleção"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {set.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-mono rounded-md bg-muted/60 text-foreground border border-border/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                <span>Usada {set.usageCount} {set.usageCount === 1 ? 'vez' : 'vezes'} em posts</span>
                <span>Criada em {new Date(set.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Criação */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-primary" />
                Criar Coleção de Hashtags
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nome da Coleção *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SaaS & B2B Tech"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Categoria Temática
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="marketing">Marketing & Mídias</option>
                  <option value="tech">Tecnologia & SaaS</option>
                  <option value="business">Negócios & Gestão</option>
                  <option value="sales">Vendas & Comercial</option>
                  <option value="productivity">Produtividade</option>
                  <option value="general">Geral / Institucional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Adicionar Hashtags (digite e pressione Enter)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-xs">
                      #
                    </span>
                    <input
                      type="text"
                      placeholder="MarketingDigital"
                      value={currentTagInput}
                      onChange={(e) => setCurrentTagInput(e.target.value)}
                      onKeyDown={handleKeyDownTag}
                      className="w-full pl-7 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Tags adicionadas */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  Tags selecionadas ({formTags.length}):
                </p>
                {formTags.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Nenhuma tag adicionada ainda.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-muted/20 border border-border/50 max-h-36 overflow-y-auto">
                    {formTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-400 transition-colors ml-0.5"
                        >
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving || formTags.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Coleção'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
