'use client';

import { useState } from 'react';
import {
  Send,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
  Loader2,
  Eye,
  Edit3,
  FileText,
  Trash2,
  Plus,
} from 'lucide-react';
import { SocialNetwork, NETWORK_CONFIGS, AttachedMedia } from '@/lib/composer/types';
import { checkCharLimit } from '@/lib/composer/text-utils';
import { TipTapToolbar } from '@/components/composer/TipTapToolbar';
import { PlatformPreview } from '@/components/composer/PlatformPreview';

interface HookOption {
  category: 'curiosity' | 'counter_intuitive' | 'direct_result';
  label: string;
  text: string;
}

export default function ComposerPage() {
  // Redes ativas selecionadas
  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetwork[]>(['linkedin', 'x']);

  // Modo de exibição: Edição ou Preview Fiel
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  // Conteúdo do post
  const [content, setContent] = useState(
    'Construir consistência em mídias sociais não é sobre publicar todo dia — é sobre relevância repetida.\n\nAqui estão 3 princípios práticos que aprendi nos últimos anos:\n\n1. Clareza antes de complexidade\n2. Design limpo retém atenção\n3. Uma chamada para ação clara por post\n\nQual desses pontos mais desafia sua rotina hoje?'
  );

  // Variações personalizadas por rede (se houver)
  const [networkCustomContent, setNetworkCustomContent] = useState<Partial<Record<SocialNetwork, string>>>({});
  const [activeTab, setActiveTab] = useState<SocialNetwork>('linkedin');

  // Mídias anexadas
  const [attachedMedia, setAttachedMedia] = useState<AttachedMedia[]>([
    {
      id: 'm1',
      url: '/carrossel-saas.pdf',
      type: 'carousel',
      fileName: 'carrossel-5-principios-saas.pdf',
      slideCount: 5,
    },
  ]);

  // IA Copywriter Assistant
  const [aiTopic, setAiTopic] = useState('Estratégia de conteúdo sem burnout');
  const [aiTone, setAiTone] = useState<'educational' | 'professional' | 'provocative' | 'casual'>('educational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hooks, setHooks] = useState<HookOption[]>([
    {
      category: 'curiosity',
      label: 'Curiosidade / Ponto Cego',
      text: 'O erro sutil que faz 85% dos criadores abandonarem suas estratégias no primeiro mês...',
    },
    {
      category: 'counter_intuitive',
      label: 'Contrário ao Senso Comum',
      text: 'Pare de tentar postar 3x ao dia. Faça isso no lugar e veja seu engajamento dobrar:',
    },
    {
      category: 'direct_result',
      label: 'Resultado Direto',
      text: 'Como estruturar semanas de conteúdo relevante em apenas 45 minutos (passo a passo):',
    },
  ]);
  const [hashtags, setHashtags] = useState<string[]>([
    'Produtividade',
    'MarketingDigital',
    'CriadoresDeConteudo',
    'GestaoDeMidias',
    'Empreendedorismo',
  ]);

  // Agendamento
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 16);
  });
  const [scheduleStatus, setScheduleStatus] = useState<'idle' | 'success'>('idle');

  // Alternar seleção de rede social
  const toggleNetwork = (id: SocialNetwork) => {
    setSelectedNetworks((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((n) => n !== id) : prev) : [...prev, id]
    );
  };

  const currentText = networkCustomContent[activeTab] ?? content;
  const charStats = checkCharLimit(currentText, activeTab);

  // Formatação Toolbar
  const handleFormat = (command: 'bold' | 'italic' | 'bullet' | 'ordered' | 'quote' | 'undo' | 'redo') => {
    // Aplicação rápida de markdown/unicode no texto ativo
    let updated = currentText;
    switch (command) {
      case 'bold':
        updated = `**${currentText}**`;
        break;
      case 'italic':
        updated = `*${currentText}*`;
        break;
      case 'bullet':
        updated = `${currentText}\n• `;
        break;
      case 'ordered':
        updated = `${currentText}\n1. `;
        break;
      case 'quote':
        updated = `> ${currentText}`;
        break;
    }
    updateCurrentText(updated);
  };

  const handleInsertEmoji = (emoji: string) => {
    updateCurrentText(`${currentText} ${emoji}`);
  };

  const updateCurrentText = (newVal: string) => {
    if (networkCustomContent[activeTab] !== undefined) {
      setNetworkCustomContent((prev) => ({ ...prev, [activeTab]: newVal }));
    } else {
      setContent(newVal);
    }
  };

  // Gerar Copy com IA
  const handleGenerateCopy = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiTopic, tone: aiTone }),
      });
      const data = await res.json();
      if (data.mainCaption) {
        setContent(data.mainCaption);
        if (data.hooks) setHooks(data.hooks);
        if (data.hashtags) setHashtags(data.hashtags);
        if (data.networkVariations) {
          setNetworkCustomContent({
            linkedin: data.networkVariations.linkedin || '',
            x: data.networkVariations.x_twitter || '',
            instagram: data.networkVariations.instagram || '',
            threads: data.networkVariations.threads || '',
          });
        }
      }
    } catch (err) {
      console.error('Falha ao gerar copy:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Aplicar gancho selecionado no início do texto
  const applyHook = (hookText: string) => {
    const lines = currentText.split('\n');
    lines[0] = hookText;
    updateCurrentText(lines.join('\n'));
  };

  // Adicionar hashtag
  const appendHashtag = (tag: string) => {
    updateCurrentText(`${currentText} #${tag}`);
  };

  // Disparo / Agendamento
  const handleSchedulePost = () => {
    setScheduleStatus('success');
    setTimeout(() => {
      setScheduleStatus('idle');
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Networks Selector & View Toggle */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Canais de Publicação</h3>
          <p className="text-xs text-slate-400">Selecione onde seu post será distribuído simultaneamente</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Redes */}
          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(NETWORK_CONFIGS) as SocialNetwork[]).map((netId) => {
              const cfg = NETWORK_CONFIGS[netId];
              const isSelected = selectedNetworks.includes(netId);
              return (
                <button
                  key={netId}
                  id={`btn-channel-${netId}`}
                  type="button"
                  onClick={() => toggleNetwork(netId)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? `border-indigo-500/80 bg-gradient-to-r ${cfg.color} text-white shadow-md shadow-indigo-500/20`
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cfg.name}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-6 bg-slate-800 hidden sm:block" />

          {/* Toggle Edição / Preview */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'editor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Fiel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Composer & AI Copywriter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Editor ou Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
            {/* Abas por rede */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                {selectedNetworks.map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => setActiveTab(net)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                      activeTab === net
                        ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {NETWORK_CONFIGS[net]?.name || net}
                  </button>
                ))}
              </div>

              {/* Character Limit Badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className={charStats.isOver ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {charStats.length}
                </span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-500">{charStats.limit}</span>
              </div>
            </div>

            {viewMode === 'editor' ? (
              <div className="space-y-3">
                {/* TipTap Toolbar */}
                <TipTapToolbar onFormat={handleFormat} onInsertEmoji={handleInsertEmoji} />

                {/* Editor Textarea */}
                <textarea
                  id="input-post-content"
                  rows={11}
                  value={currentText}
                  onChange={(e) => updateCurrentText(e.target.value)}
                  placeholder="Escreva sua publicação aqui..."
                  className={`w-full p-4 rounded-xl border bg-slate-950/80 text-sm text-slate-100 font-sans leading-relaxed focus:outline-none transition-all ${
                    charStats.isOver
                      ? 'border-rose-500/80 focus:border-rose-500'
                      : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />

                {charStats.isOver && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Limite de caracteres excedido para {NETWORK_CONFIGS[activeTab]?.name}.
                  </p>
                )}
              </div>
            ) : (
              /* Platform Preview Mockup */
              <div className="py-2">
                <PlatformPreview network={activeTab} content={currentText} media={attachedMedia} />
              </div>
            )}

            {/* Galeria de Mídias Anexadas */}
            {attachedMedia.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Mídias Anexadas ({attachedMedia.length})
                </span>
                <div className="flex flex-wrap gap-3">
                  {attachedMedia.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-slate-300"
                    >
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <div className="max-w-[200px] truncate">
                        <p className="font-medium truncate">{m.fileName}</p>
                        <p className="text-[10px] text-slate-500">
                          {m.type === 'carousel' ? `Carrossel (${m.slideCount} slides)` : 'Imagem'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedMedia(attachedMedia.filter((x) => x.id !== m.id))}
                        className="text-slate-500 hover:text-rose-400 ml-1 p-1"
                        title="Remover anexo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agendamento & Disparo */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  id="input-schedule-date"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                id="btn-schedule-post"
                type="button"
                onClick={handleSchedulePost}
                disabled={charStats.isOver}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                <Calendar className="w-3.5 h-3.5" />
                Agendar com BullMQ
              </button>
            </div>

            {scheduleStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Post agendado na fila com sucesso! Idempotência e delayed job gerados.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Copywriter & Hooks Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Generator Box */}
          <div className="p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-slate-200">AI Copywriter Assistant</h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tema ou Pauta</label>
                <input
                  id="input-ai-copy-prompt"
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Como evitar burnout na criação de conteúdo..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Tom de Voz</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="educational">Educativo & Didático</option>
                  <option value="professional">Profissional & Corporativo</option>
                  <option value="provocative">Provocativo & Disruptivo</option>
                  <option value="casual">Casual & Conversacional</option>
                </select>
              </div>

              <button
                id="btn-run-ai-copywriter"
                type="button"
                onClick={handleGenerateCopy}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Redigindo com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gerar Legenda & Ganchos</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Ganchos Magnéticos */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Ganchos Magnéticos (Hooks de Abertura)
            </h4>
            <p className="text-[11px] text-slate-400">Clique para substituir a 1ª linha do seu post:</p>

            <div className="space-y-2">
              {hooks.map((h, i) => (
                <div
                  key={i}
                  onClick={() => applyHook(h.text)}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/40 hover:bg-slate-900 cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {h.label}
                  </span>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">&ldquo;{h.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags Estratégicas */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Hashtags Estratégicas
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => appendHashtag(tag)}
                  className="px-2.5 py-1 rounded-lg border border-slate-800 bg-slate-950 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-xs font-mono text-cyan-300 transition-all"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
