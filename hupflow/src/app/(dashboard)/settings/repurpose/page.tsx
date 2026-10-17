'use client';

import React, { useState, useEffect } from 'react';
import {
  ContentRepurposingKit,
  RepurposingKitStatus,
  RepurposingSourceType,
  RepurposingSummaryMetrics,
  RepurposingTone,
} from '@/lib/repurpose/types';
import { RepurposingKitCard } from '@/components/repurpose/RepurposingKitCard';
import {
  Sparkles,
  Layers,
  Twitter,
  Video,
  Mail,
  Clock,
  Plus,
  RefreshCw,
  Send,
  Sliders,
  Flame,
  FileText,
} from 'lucide-react';

export default function RepurposeMatrixPage() {
  const [kits, setKits] = useState<ContentRepurposingKit[]>([]);
  const [metrics, setMetrics] = useState<RepurposingSummaryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState<RepurposingSourceType>('youtube_transcript');
  const [sourceUrl, setSourceUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [tone, setTone] = useState<RepurposingTone>('authoritative');
  const [tagsInput, setTagsInput] = useState('ia, omnicanal, escala');

  const fetchKits = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/repurpose');
      if (res.ok) {
        const data = await res.json();
        setKits(data.kits || []);
        setMetrics(data.metrics || null);
      }
    } catch (err) {
      console.error('Falha ao buscar matriz de reaproveitamento:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  const handleCreateKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sourceType,
          sourceUrl: sourceUrl.trim() || undefined,
          rawText,
          tone,
          tags,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao gerar kit');
      }

      // Reset form
      setTitle('');
      setRawText('');
      setSourceUrl('');
      setShowCreateModal(false);
      await fetchKits();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao processar reaproveitamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: RepurposingKitStatus) => {
    try {
      const res = await fetch('/api/repurpose', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        await fetchKits();
      }
    } catch (err) {
      console.error('Falha ao atualizar status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este kit de reaproveitamento?')) return;
    try {
      const res = await fetch(`/api/repurpose?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchKits();
      }
    } catch (err) {
      console.error('Falha ao deletar kit:', err);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Matriz Omnicanal IA
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Matriz de Reaproveitamento Multi-Formato
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Insira 1 conteúdo longo (Transcrição do YouTube, Episódio de Podcast, Artigo ou Whitepaper) e gere instantaneamente 4 formatos otimizados: Carrossel, Thread, Roteiro Reel 60s e Newsletter.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchKits()}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-purple-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Novo Kit Multi-Formato
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Kits Totais</span>
            <span className="text-2xl font-bold text-white mt-1 block">{metrics.totalKits}</span>
            <span className="text-[11px] text-purple-400 mt-1 block">Conteúdos Multiplicados</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Slides Carrossel</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">
              {metrics.totalSlidesGenerated}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">LinkedIn & Insta</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Tweets em Thread</span>
            <span className="text-2xl font-bold text-sky-400 mt-1 block">
              {metrics.totalTweetsGenerated}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Máx. 280 caracteres</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Roteiros Reel 60s</span>
            <span className="text-2xl font-bold text-pink-400 mt-1 block">
              {metrics.totalReelScriptsGenerated}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Hook + Ações Visuais</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Newsletters</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {metrics.totalNewslettersGenerated}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Alta Retenção</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Tempo Economizado</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {metrics.totalHoursSaved}h
            </span>
            <span className="text-[11px] text-emerald-500 mt-1 block">~4h poupadas/kit</span>
          </div>
        </div>
      )}

      {/* Main Kits Listing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Kits de Conteúdo Gerados ({kits.length})
          </h2>
          <span className="text-xs text-zinc-500">
            Renderização em abas: Carrossel, Thread, Reel e E-mail
          </span>
        </div>

        {loading && kits.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-zinc-800 space-y-3">
            <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            <p className="text-sm text-zinc-400">Carregando kits de reaproveitamento...</p>
          </div>
        ) : kits.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800 space-y-4">
            <Sparkles className="w-12 h-12 text-zinc-600 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Nenhum kit gerado ainda</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Clique em "Novo Kit Multi-Formato" para colar um texto longo ou transcrição e desdobrar 4 formatos instantaneamente.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Criar Primeiro Kit
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {kits.map(kit => (
              <RepurposingKitCard
                key={kit.id}
                kit={kit}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating New Kit */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Novo Kit de Reaproveitamento</h3>
                  <p className="text-xs text-zinc-400">
                    Insira o conteúdo bruto para a IA decompor em 4 formatos nativos.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateKit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Título do Conteúdo / Tese Principal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Como Reduzir CAC com Marketing Baseado em Conta (ABM)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tipo da Fonte Original
                  </label>
                  <select
                    value={sourceType}
                    onChange={e => setSourceType(e.target.value as RepurposingSourceType)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="youtube_transcript">Vídeo / Transcrição do YouTube</option>
                    <option value="podcast_audio">Podcast / Gravação de Áudio</option>
                    <option value="blog_post">Artigo / Post de Blog</option>
                    <option value="pdf_whitepaper">PDF / Whitepaper Técnico</option>
                    <option value="webinar_notes">Notas de Webinar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tom de Voz Pretendido
                  </label>
                  <select
                    value={tone}
                    onChange={e => setTone(e.target.value as RepurposingTone)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="authoritative">Autoritário / Executivo</option>
                    <option value="provocative_growth">Growth Provocativo / Contrário</option>
                    <option value="casual_storytelling">Storytelling Casual</option>
                    <option value="didactic_educational">Didático / Educacional</option>
                    <option value="minimalist_bullet">Minimalista / Bullet Points</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Link da Fonte Original (Opcional)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={sourceUrl}
                  onChange={e => setSourceUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Conteúdo Bruto / Transcrição Completa *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Cole aqui a transcrição do vídeo, notas da gravação ou o texto completo do artigo..."
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 leading-relaxed font-mono text-xs"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {rawText.trim().split(/\s+/).filter(Boolean).length} palavras detectadas
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Tags (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="ia, b2b, carrossel"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Decompondo e Gerando 4 Formatos...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Gerar Kit Multi-Formato IA
                    </>
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
