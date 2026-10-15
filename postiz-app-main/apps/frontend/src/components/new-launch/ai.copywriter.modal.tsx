'use client';

import React, { FC, useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { CloseIcon } from '@gitroom/frontend/components/ui/icons';
import { Button } from '@gitroom/react/form/button';

export interface AiCopywriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  currentPlatform?: string;
  onApply: (content: string, mode: 'replace' | 'append') => void;
}

interface CopyResult {
  caption: string;
  hooks: string[];
  hashtags: string[];
  platformTip: string;
}

const PLATFORMS = [
  { id: 'generic', label: 'Todas as Redes', icon: '🌐' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'x', label: 'X (Twitter)', icon: '🐦' },
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'threads', label: 'Threads', icon: '🧵' },
  { id: 'facebook', label: 'Facebook', icon: '👥' },
];

const TONES = [
  { id: 'engaging', label: 'Engajador', desc: 'Perguntas e ganchos de interação', icon: '🎯' },
  { id: 'professional', label: 'Profissional', desc: 'Autoridade e dados de mercado', icon: '👔' },
  { id: 'casual', label: 'Descontraído', desc: 'Conversacional e acessível', icon: '☕' },
  { id: 'persuasive', label: 'Persuasivo', desc: 'Focado em conversão e ação', icon: '🔥' },
  { id: 'viral', label: 'Viral / Story', desc: 'Narrativa de alto impacto', icon: '🚀' },
];

export const AiCopywriterModal: FC<AiCopywriterModalProps> = ({
  isOpen,
  onClose,
  initialContent = '',
  currentPlatform = 'generic',
  onApply,
}) => {
  const t = useT();
  const fetch = useFetch();
  const toaster = useToaster();

  // Strip HTML tags for clean text prompt
  const cleanInitial = useMemo(() => {
    return initialContent
      .replace(/<p>/gi, '')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .trim();
  }, [initialContent]);

  const [tab, setTab] = useState<'idea' | 'improve'>(
    cleanInitial.length > 5 ? 'improve' : 'idea'
  );
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState(cleanInitial);
  const [platform, setPlatform] = useState(currentPlatform || 'generic');
  const [tone, setTone] = useState('engaging');
  const [customInstruction, setCustomInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopyResult | null>(null);
  const [editedCaption, setEditedCaption] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent(cleanInitial);
      if (cleanInitial.length > 5) {
        setTab('improve');
      }
      if (currentPlatform && currentPlatform !== 'global') {
        const matched = PLATFORMS.find((p) =>
          currentPlatform.toLowerCase().includes(p.id)
        );
        if (matched) {
          setPlatform(matched.id);
        }
      }
    }
  }, [isOpen, cleanInitial, currentPlatform]);

  if (!isOpen) {
    return null;
  }

  const handleGenerate = async (overrideMode?: 'caption' | 'hooks' | 'hashtags') => {
    const isImprove = tab === 'improve';
    if (isImprove && !content.trim()) {
      toaster.show(t('error_empty_content', 'Por favor, insira o texto a ser melhorado.'), 'warning');
      return;
    }
    if (!isImprove && !topic.trim()) {
      toaster.show(t('error_empty_topic', 'Por favor, insira uma ideia ou tópico para o post.'), 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await (
        await fetch('/copilot/copywriter', {
          method: 'POST',
          body: JSON.stringify({
            topic: isImprove ? undefined : topic,
            content: isImprove ? content : undefined,
            platform,
            tone,
            mode: overrideMode || (isImprove ? 'improve' : 'caption'),
            customInstruction: customInstruction.trim() || undefined,
          }),
        })
      ).json();

      setResult(response);
      setEditedCaption(response.caption || '');
      toaster.show(t('copy_success', 'Conteúdo gerado com sucesso!'), 'success');
    } catch (err) {
      toaster.show(t('copy_error', 'Erro ao gerar conteúdo. Tente novamente.'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyHook = (hook: string) => {
    if (!editedCaption) {
      setEditedCaption(hook);
      return;
    }
    const lines = editedCaption.split('\n');
    lines[0] = hook;
    setEditedCaption(lines.join('\n'));
    toaster.show(t('hook_applied', 'Gancho aplicado no início do post!'), 'success');
  };

  const handleToggleHashtag = (tag: string) => {
    if (editedCaption.includes(tag)) {
      setEditedCaption(editedCaption.replace(tag, '').replace(/\s{2,}/g, ' ').trim());
    } else {
      setEditedCaption(`${editedCaption.trim()}\n\n${tag}`);
    }
  };

  const handleCopy = () => {
    if (!editedCaption) return;
    navigator.clipboard.writeText(editedCaption);
    setCopied(true);
    toaster.show(t('copied_to_clipboard', 'Copiado para a área de transferência!'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToEditor = (mode: 'replace' | 'append') => {
    if (!editedCaption) return;
    onApply(editedCaption, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#18181B] border border-white/10 rounded-2xl shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#202024]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-lg shadow-lg shadow-purple-500/20">
              ✨
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight text-white flex items-center gap-2">
                AI Copywriter & Sugestão de Legendas
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  IA Pro
                </span>
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Crie ganchos magnéticos, legendas persuasivas e hashtags sob medida por canal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tabs: Nova Ideia vs Melhorar Atual */}
          <div className="flex bg-[#121214] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setTab('idea')}
              className={clsx(
                'flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2',
                tab === 'idea'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-[#A1A1AA] hover:text-white'
              )}
            >
              <span>💡</span> Nova Ideia do Zero
            </button>
            <button
              onClick={() => setTab('improve')}
              className={clsx(
                'flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2',
                tab === 'improve'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-[#A1A1AA] hover:text-white'
              )}
            >
              <span>✍️</span> Melhorar Texto Atual
            </button>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Principal */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-[#D4D4D8]">
                {tab === 'idea' ? 'Tópico ou Ideia do Post:' : 'Texto Atual a Ser Aprimorado:'}
              </label>
              {tab === 'idea' ? (
                <input
                  type="text"
                  placeholder="Ex: 5 erros comuns que líderes cometem ao gerenciar times remotos..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#27272A] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              ) : (
                <textarea
                  rows={4}
                  placeholder="Cole ou edite o rascunho do seu post aqui..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#27272A] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              )}
            </div>

            {/* Plataforma Alvo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#D4D4D8]">
                Rede Social Alvo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    className={clsx(
                      'px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all',
                      platform === p.id
                        ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                        : 'bg-[#27272A] border-white/5 text-[#A1A1AA] hover:bg-[#323238] hover:text-white'
                    )}
                  >
                    <span>{p.icon}</span>
                    <span className="truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tom de Voz */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#D4D4D8]">
                Tom de Voz:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TONES.map((tItem) => (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => setTone(tItem.id)}
                    className={clsx(
                      'px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all text-left',
                      tone === tItem.id
                        ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                        : 'bg-[#27272A] border-white/5 text-[#A1A1AA] hover:bg-[#323238] hover:text-white'
                    )}
                  >
                    <span>{tItem.icon}</span>
                    <span className="truncate">{tItem.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instrução Livre Adicional */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-[#A1A1AA]">
                Instrução Opcional (ex: &quot;Adicionar chamada para o link da bio&quot;, &quot;Incluir dados estatísticos&quot;):
              </label>
              <input
                type="text"
                placeholder="Ex: Focar em tom bem direto com no máximo 3 frases..."
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-[#27272A] border border-white/10 text-white placeholder-[#71717A] text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Botão de Geração */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => handleGenerate()}
              loading={loading}
              className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-500 hover:!to-indigo-500 !text-white !font-semibold !px-6 !py-2.5 !rounded-xl !shadow-lg !shadow-purple-500/25 flex items-center gap-2"
            >
              <span>✨</span>
              <span>{loading ? 'Criando mágica...' : 'Gerar com Inteligência Artificial'}</span>
            </Button>
          </div>

          {/* Resultados */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-white/10 animate-fadeIn">
              {/* Dica da plataforma */}
              {result.platformTip && (
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
                  <span className="text-base">💡</span>
                  <div>
                    <strong className="font-semibold text-purple-100">Dica Estratégica: </strong>
                    {result.platformTip}
                  </div>
                </div>
              )}

              {/* Ganchos Alternativos (Hooks) */}
              {result.hooks && result.hooks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#D4D4D8] flex items-center gap-1.5">
                      <span>🪝</span> Ganchos Alternativos (clique para trocar a abertura):
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {result.hooks.map((hook, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyHook(hook)}
                        className="p-2.5 rounded-xl bg-[#27272A] border border-white/10 hover:border-purple-500/50 text-left text-xs text-zinc-300 hover:text-white transition-all group flex flex-col justify-between"
                      >
                        <span className="line-clamp-3 leading-relaxed">{hook}</span>
                        <span className="text-[10px] text-purple-400 mt-2 font-medium opacity-75 group-hover:opacity-100">
                          + Usar Gancho
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Editor do Texto Gerado */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#D4D4D8] flex items-center gap-1.5">
                    <span>📝</span> Legenda Gerada (ajuste como desejar):
                  </label>
                  <span className="text-[11px] text-[#A1A1AA]">
                    {editedCaption.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#202024] border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
              </div>

              {/* Hashtags sugeridas */}
              {result.hashtags && result.hashtags.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#D4D4D8] flex items-center gap-1.5">
                    <span>#️⃣</span> Hashtags Recomendadas (clique para adicionar/remover):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {result.hashtags.map((tag, idx) => {
                      const isIncluded = editedCaption.includes(tag);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleHashtag(tag)}
                          className={clsx(
                            'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1',
                            isIncluded
                              ? 'bg-purple-600 text-white border-purple-400'
                              : 'bg-[#27272A] text-zinc-300 border-white/10 hover:border-white/30'
                          )}
                        >
                          <span>{tag}</span>
                          <span className="text-[10px] opacity-75">
                            {isIncluded ? '✓' : '+'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#202024]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A1A1AA] hover:text-white transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            {editedCaption && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-[#27272A] border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyToEditor('append')}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-[#27272A] border border-white/10 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all"
                >
                  ➕ Anexar ao Post
                </button>
                <Button
                  onClick={() => handleApplyToEditor('replace')}
                  className="!bg-purple-600 hover:!bg-purple-500 !text-white !font-semibold !px-5 !py-2 !rounded-xl !shadow-md"
                >
                  ✨ Substituir no Post
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
