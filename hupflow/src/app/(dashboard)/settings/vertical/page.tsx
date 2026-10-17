'use client';

import React, { useState, useEffect } from 'react';
import {
  VerticalVideoPost,
  VerticalPublishSummary,
  VerticalChannelType,
  VerticalPrivacyLevel,
} from '@/lib/vertical/types';
import { VerticalVideoPostCard } from '@/components/vertical/VerticalVideoPostCard';
import {
  Clapperboard,
  Video,
  Plus,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function VerticalVideosStudioPage() {
  const [posts, setPosts] = useState<VerticalVideoPost[]>([]);
  const [summary, setSummary] = useState<VerticalPublishSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-man-working-on-his-laptop-42999-large.mp4'
  );
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [channels, setChannels] = useState<VerticalChannelType[]>(['tiktok', 'youtube_shorts']);
  const [durationSeconds, setDurationSeconds] = useState(45);
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);
  const [privacyLevel, setPrivacyLevel] = useState<VerticalPrivacyLevel>('public');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(true);
  const [disableComments, setDisableComments] = useState(false);
  const [disableDuet, setDisableDuet] = useState(false);
  const [disableStitch, setDisableStitch] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedChannelFilter !== 'all') params.set('channel', selectedChannelFilter);

      const res = await fetch(`/api/vertical?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error('Falha ao buscar vídeos verticais:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedChannelFilter]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim() || channels.length === 0) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/vertical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          caption,
          videoUrl,
          thumbnailUrl: thumbnailUrl.trim() || undefined,
          channels,
          durationSeconds: Number(durationSeconds) || 30,
          width: Number(width) || 1080,
          height: Number(height) || 1920,
          privacyLevel,
          tiktokSettings: {
            disableComments,
            disableDuet,
            disableStitch,
            isAiGenerated,
          },
          youtubeSettings: {
            isMadeForKids: false,
            containsPaidPromotion: false,
          },
          scheduledAt: scheduledAt || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao agendar vídeo');
      }

      setTitle('');
      setCaption('');
      setShowCreateModal(false);
      await fetchPosts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao salvar publicação vertical');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishNow = async (id: string) => {
    try {
      const res = await fetch('/api/vertical', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'published' }),
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (err) {
      console.error('Falha ao publicar:', err);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Deseja excluir este vídeo da fila?')) return;
    try {
      const res = await fetch(`/api/vertical?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (err) {
      console.error('Falha ao excluir:', err);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5" />
              Esteira Vertical 9:16
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Agendador Nativo de TikTok & YouTube Shorts
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Programe e publique vídeos verticais em lote. Verificação prévia de aspecto 9:16, compliance com Content Posting API do TikTok e auto-tagging de Shorts no YouTube.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPosts()}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg border border-zinc-700 transition"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-rose-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Novo Vídeo Vertical 9:16
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Total de Vídeos</span>
            <span className="text-2xl font-bold text-white mt-1 block">{summary.totalPosts}</span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Na Esteira</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Fila Agendada</span>
            <span className="text-2xl font-bold text-sky-400 mt-1 block">
              {summary.scheduledCount}
            </span>
            <span className="text-[11px] text-sky-500 mt-1 block">Prontos p/ Envio</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Publicados</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {summary.publishedCount}
            </span>
            <span className="text-[11px] text-emerald-500 mt-1 block">No Ar</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Fila TikTok</span>
            <span className="text-2xl font-bold text-pink-400 mt-1 block">
              {summary.tiktokPostsCount}
            </span>
            <span className="text-[11px] text-pink-500 mt-1 block">Content API</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">YouTube Shorts</span>
            <span className="text-2xl font-bold text-red-400 mt-1 block">
              {summary.youtubeShortsCount}
            </span>
            <span className="text-[11px] text-red-500 mt-1 block">Data API v3</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Duração Média</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">
              {summary.averageDurationSeconds}s
            </span>
            <span className="text-[11px] text-purple-500 mt-1 block">Média da Fila</span>
          </div>
        </div>
      )}

      {/* Filter Tabs and Listing */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto">
            {[
              { id: 'all', label: 'Todos os Canais' },
              { id: 'tiktok', label: 'Apenas TikTok' },
              { id: 'youtube_shorts', label: 'Apenas Shorts' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedChannelFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  selectedChannelFilter === tab.id
                    ? 'bg-rose-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-500">
            {posts.length} publicações verticais encontradas
          </span>
        </div>

        {loading && posts.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-rose-400" />
            <p className="text-xs">Carregando fila de vídeos verticais...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
            <Clapperboard className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-white">Nenhum vídeo vertical nesta fila</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map(post => (
              <VerticalVideoPostCard
                key={post.id}
                post={post}
                onPublishNow={handlePublishNow}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating New Vertical Video */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-rose-400" />
                Agendar Vídeo Vertical 9:16
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 3 Segredos de Escala para 2026"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Legenda / Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Digite a legenda com hashtags..."
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  URL do Vídeo MP4 (Nuvem ou Presigned R2) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Channels Selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  Canais de Publicação
                </label>
                <div className="flex items-center gap-4 text-xs text-white">
                  <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
                    <input
                      type="checkbox"
                      checked={channels.includes('tiktok')}
                      onChange={e => {
                        if (e.target.checked) setChannels([...channels, 'tiktok']);
                        else setChannels(channels.filter(c => c !== 'tiktok'));
                      }}
                      className="accent-pink-500"
                    />
                    <span>TikTok Content Posting</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800">
                    <input
                      type="checkbox"
                      checked={channels.includes('youtube_shorts')}
                      onChange={e => {
                        if (e.target.checked) setChannels([...channels, 'youtube_shorts']);
                        else setChannels(channels.filter(c => c !== 'youtube_shorts'));
                      }}
                      className="accent-red-500"
                    />
                    <span>YouTube Shorts</span>
                  </label>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Duração (Segundos)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={600}
                    value={durationSeconds}
                    onChange={e => setDurationSeconds(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Largura (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={e => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Altura (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              {/* Schedule Date */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Agendar Para (Opcional - deixe vazio para rascunho)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* TikTok Compliance Options */}
              {channels.includes('tiktok') && (
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 space-y-2 text-xs">
                  <span className="font-bold text-pink-400 block">Opções TikTok Content API:</span>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={isAiGenerated}
                      onChange={e => setIsAiGenerated(e.target.checked)}
                      className="accent-pink-500"
                    />
                    <span>Marcar conteúdo como gerado por IA (AIGC Disclosure)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={disableComments}
                      onChange={e => setDisableComments(e.target.checked)}
                      className="accent-pink-500"
                    />
                    <span>Desativar comentários</span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Validando e Salvando...' : 'Agendar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
