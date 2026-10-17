'use client';

import React, { useState } from 'react';
import {
  VerticalVideoPost,
  VerticalPostStatus,
} from '@/lib/vertical/types';
import {
  Video,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertTriangle,
  Globe,
  Lock,
  Trash2,
  Send,
  Eye,
  Sparkles,
} from 'lucide-react';

interface VerticalVideoPostCardProps {
  post: VerticalVideoPost;
  onPublishNow?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function VerticalVideoPostCard({
  post,
  onPublishNow,
  onDelete,
}: VerticalVideoPostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadge = (status: VerticalPostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Publicado
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Agendado
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Erro no Envio
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            Rascunho
          </span>
        );
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl hover:border-zinc-700 transition flex flex-col justify-between">
      {/* 9:16 Video Player Thumbnail */}
      <div
        className="relative aspect-[9/16] max-h-[380px] w-full bg-black overflow-hidden group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        <video
          src={post.videoUrl}
          loop
          muted
          playsInline
          autoPlay={isPlaying}
          className="w-full h-full object-cover"
        />

        {/* Channel Badges on Top */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {post.channels.includes('tiktok') && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-black/80 text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
              TikTok
            </span>
          )}
          {post.channels.includes('youtube_shorts') && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-red-600/90 text-white border border-red-500/40 backdrop-blur-md">
              Shorts
            </span>
          )}
        </div>

        {/* Status Badge on Top Right */}
        <div className="absolute top-3 right-3 z-10">
          {getStatusBadge(post.status)}
        </div>

        {/* Play/Pause Overlay Indicator */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </div>
        </div>

        {/* Specs Pill at Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
          <span className="font-mono">{post.durationSeconds}s</span>
          <span className="font-mono">{post.width}x{post.height}</span>
          <span className="text-zinc-300 flex items-center gap-1">
            {post.privacyLevel === 'public' ? (
              <Globe className="w-3 h-3 text-emerald-400" />
            ) : (
              <Lock className="w-3 h-3 text-amber-400" />
            )}
            {post.privacyLevel}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-white line-clamp-1">{post.title}</h4>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
            {post.caption}
          </p>
        </div>

        {/* Scheduled date if any */}
        {post.scheduledAt && (
          <div className="text-[11px] text-sky-400 flex items-center gap-1 bg-sky-500/5 px-2 py-1 rounded border border-sky-500/10">
            <Clock className="w-3 h-3" />
            Agendado para: {new Date(post.scheduledAt).toLocaleString('pt-BR')}
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
          {post.status !== 'published' && onPublishNow ? (
            <button
              onClick={() => onPublishNow(post.id)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <Send className="w-3.5 h-3.5" /> Publicar Agora
            </button>
          ) : (
            <span className="text-zinc-500 text-[11px]">Sincronizado na nuvem</span>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded transition"
              title="Excluir vídeo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
