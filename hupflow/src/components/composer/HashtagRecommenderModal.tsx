'use client';

import { useState, useEffect } from 'react';
import {
  Hash,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X as CloseIcon,
  Check,
  TrendingUp,
  Info,
} from 'lucide-react';
import {
  HashtagRecommendation,
  NetworkGuidance,
  SocialNetwork,
  HashtagSet,
} from '@/lib/hashtags/types';

interface HashtagRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertHashtags: (tags: string[]) => void;
  currentContent: string;
  activeNetwork: SocialNetwork;
}

export function HashtagRecommenderModal({
  isOpen,
  onClose,
  onInsertHashtags,
  currentContent,
  activeNetwork,
}: HashtagRecommenderModalProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'sets'>('ai');
  const [topicInput, setTopicInput] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [recommendations, setRecommendations] = useState<HashtagRecommendation[]>([]);
  const [guidance, setGuidance] = useState<NetworkGuidance | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Coleções salvas
  const [savedSets, setSavedSets] = useState<HashtagSet[]>([]);
  const [isLoadingSets, setIsLoadingSets] = useState(false);

  // Carrega coleções salvas
  const loadSavedSets = async () => {
    setIsLoadingSets(true);
    try {
      const res = await fetch('/api/hashtags/sets');
      if (res.ok) {
        const data = await res.json();
        setSavedSets(data.sets || []);
      }
    } catch (err) {
      console.error('[HashtagModal] Erro ao carregar coleções:', err);
    } finally {
      setIsLoadingSets(false);
    }
  };

  // Recomenda tags com IA
  const fetchRecommendations = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentContent,
          topic: topicInput.trim() || undefined,
          network: activeNetwork,
          limit: 12,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendations(data.recommendations || []);
        setGuidance(data.guidance || null);

        // Seleciona automaticamente as top tags de acordo com a recomendação da rede
        const recCount = data.guidance?.recommendedCount || 5;
        const topTags = (data.recommendations || [])
          .slice(0, recCount)
          .map((r: HashtagRecommendation) => r.formattedTag);
        setSelectedTags(topTags);
      }
    } catch (err) {
      console.error('[HashtagModal] Erro ao buscar recomendações:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecommendations();
      loadSavedSets();
    }
  }, [isOpen, activeNetwork]);

  if (!isOpen) return null;

  const toggleTagSelection = (formattedTag: string) => {
    setSelectedTags((prev) =>
      prev.includes(formattedTag)
        ? prev.filter((t) => t !== formattedTag)
        : [...prev, formattedTag]
    );
  };

  const handleSelectBest = (count: number) => {
    const top = recommendations.slice(0, count).map((r) => r.formattedTag);
    setSelectedTags(top);
  };

  const handleInsert = () => {
    if (selectedTags.length > 0) {
      onInsertHashtags(selectedTags);
      onClose();
    }
  };

  const handleInjectSet = async (set: HashtagSet) => {
    const formatted = set.tags.map((t) => (t.startsWith('#') ? t : `#${t}`));
    onInsertHashtags(formatted);

    // Incrementa contagem de uso em background
    try {
      fetch('/api/hashtags/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'increment_usage', setId: set.id }),
      });
    } catch {
      // Falha silenciosa de métrica secundária
    }

    onClose();
  };

  const recommendedLimit = guidance?.recommendedCount || 5;
  const isOverLimit = selectedTags.length > recommendedLimit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-5 flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                Recomendador de Hashtags
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono capitalize">
                  {activeNetwork}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tags estratégicas ranqueadas por relevância e diretrizes algorítmicas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'ai'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Recomendações IA
          </button>
          <button
            onClick={() => setActiveTab('sets')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'sets'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Coleções Salvas ({savedSets.length})
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {activeTab === 'ai' && (
            <>
              {/* Filtro por tema específico */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Foco temático específico (opcional)..."
                  className="flex-1 px-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={fetchRecommendations}
                  disabled={isLoadingAi}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoadingAi ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Recalcular
                </button>
              </div>

              {/* Dica da Rede Social */}
              {guidance && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground">Diretriz Algorítmica:</span>{' '}
                    {guidance.tip}
                  </div>
                </div>
              )}

              {/* Ações de Seleção Rápida */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Clique nas tags para selecionar:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectBest(guidance?.recommendedCount || 5)}
                    className="text-primary hover:underline font-medium text-[11px]"
                  >
                    Top {guidance?.recommendedCount || 5} Recomendadas
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setSelectedTags([])}
                    className="hover:text-foreground text-[11px]"
                  >
                    Desmarcar Todas
                  </button>
                </div>
              </div>

              {/* Lista de Recomendações */}
              {isLoadingAi ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                  <p className="text-xs">Analisando semântica e calculando relevância...</p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  Nenhuma recomendação encontrada. Tente adicionar texto ao post ou definir um foco temático.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {recommendations.map((item) => {
                    const isSelected = selectedTags.includes(item.formattedTag);
                    return (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => toggleTagSelection(item.formattedTag)}
                        className={`p-2.5 rounded-lg border text-left transition-all relative flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-primary/10 border-primary text-foreground shadow-sm'
                            : 'bg-card hover:bg-muted/30 border-border text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-semibold truncate ${
                              isSelected ? 'text-primary' : 'text-foreground'
                            }`}
                          >
                            {item.formattedTag}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded uppercase font-mono tracking-wider ${
                              item.tier === 'broad'
                                ? 'bg-amber-500/10 text-amber-400'
                                : item.tier === 'niche'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-indigo-500/10 text-indigo-400'
                            }`}
                          >
                            {item.tier}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {item.relevanceScore}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'sets' && (
            <div className="space-y-3">
              {isLoadingSets ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                  <p className="text-xs">Carregando coleções salvas...</p>
                </div>
              ) : savedSets.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg space-y-2">
                  <p>Nenhuma coleção de hashtags cadastrada no workspace.</p>
                  <p className="text-[11px] text-muted-foreground/80">
                    Crie coleções temáticas em <span className="font-semibold text-foreground">Configurações &gt; Hashtags</span> para reutilizar em múltiplos posts.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedSets.map((set) => (
                    <div
                      key={set.id}
                      className="p-3.5 rounded-lg border border-border bg-card hover:border-primary/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-foreground truncate">{set.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase font-mono">
                            {set.category}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {set.tags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
                        </p>
                      </div>

                      <button
                        onClick={() => handleInjectSet(set)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shrink-0 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Injetar ({set.tags.length})
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé com Contador e Ação de Inserção */}
        {activeTab === 'ai' && (
          <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Selecionadas:</span>
              <span className={`font-semibold ${isOverLimit ? 'text-amber-400' : 'text-foreground'}`}>
                {selectedTags.length} de {recommendedLimit} recomendadas
              </span>
              {isOverLimit && (
                <span className="text-[11px] text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Pode saturar o alcance
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInsert}
                disabled={selectedTags.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Inserir {selectedTags.length} {selectedTags.length === 1 ? 'Tag' : 'Tags'} no Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
