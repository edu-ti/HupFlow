'use client';

import { useState } from 'react';
import {
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Heart,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { SocialNetwork, AttachedMedia } from '@/lib/composer/types';

interface PlatformPreviewProps {
  network: SocialNetwork;
  content: string;
  media?: AttachedMedia[];
  authorName?: string;
  authorHandle?: string;
  authorAvatar?: string;
}

export function PlatformPreview({
  network,
  content,
  media = [],
  authorName = 'Lucas Silva',
  authorHandle = '@lucassilva_dev',
  authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
}: PlatformPreviewProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  // 1. MOCKUP DO LINKEDIN
  if (network === 'linkedin') {
    return (
      <div className="rounded-2xl border border-slate-700/80 bg-[#1B1F23] text-slate-100 p-5 shadow-2xl space-y-4 max-w-lg mx-auto">
        {/* Cabeçalho do Perfil */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white hover:underline cursor-pointer">{authorName}</span>
                <span className="text-xs text-slate-400">• 1º</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">Founder & Tech Lead @ HupFlow • SaaS Creator</p>
              <p className="text-[10px] text-slate-500">1 h • Editado • 🌐</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo do Post */}
        <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
          {content || 'O texto da sua publicação aparecerá formatado aqui...'}
        </div>

        {/* Mídia / Carrossel em PDF */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 overflow-hidden">
          <div className="p-8 aspect-square flex flex-col items-center justify-center text-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/60 relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h5 className="text-base font-bold text-white">Carrossel HupFlow (Documento PDF)</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Slide {activeSlide + 1} de 5 • Deslize para ver o conteúdo formatado
            </p>

            {/* Controles de Navegação no Mockup */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => setActiveSlide((p) => Math.max(0, p - 1))}
                className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide((p) => Math.min(4, p + 1))}
                className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span className="font-mono">hupflow-carrossel.pdf</span>
            <span>{activeSlide + 1} / 5 páginas</span>
          </div>
        </div>

        {/* Barra de Reações do LinkedIn */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <button className="flex items-center gap-1.5 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-800/60">
            <ThumbsUp className="w-4 h-4" />
            <span>Gostei</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-800/60">
            <MessageSquare className="w-4 h-4" />
            <span>Comentar</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-800/60">
            <Repeat2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-indigo-400 p-2 rounded-lg hover:bg-slate-800/60">
            <Send className="w-4 h-4" />
            <span>Enviar</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. MOCKUP DO X / TWITTER
  if (network === 'x') {
    return (
      <div className="rounded-2xl border border-slate-800 bg-black text-slate-100 p-5 shadow-2xl space-y-3 max-w-lg mx-auto">
        <div className="flex items-start gap-3">
          <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white hover:underline cursor-pointer">{authorName}</span>
              <span className="text-xs text-slate-500">{authorHandle}</span>
              <span className="text-xs text-slate-500">• 12m</span>
            </div>

            <div className="text-sm leading-relaxed text-slate-200 mt-2 whitespace-pre-wrap font-sans">
              {content || 'Seu tweet conciso aparecerá aqui...'}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <span className="hover:text-cyan-400 flex items-center gap-1.5 cursor-pointer">
                <MessageSquare className="w-4 h-4" /> 18
              </span>
              <span className="hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer">
                <Repeat2 className="w-4 h-4" /> 42
              </span>
              <span className="hover:text-rose-400 flex items-center gap-1.5 cursor-pointer">
                <Heart className="w-4 h-4" /> 238
              </span>
              <span className="hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer">
                <Bookmark className="w-4 h-4" /> 67
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. MOCKUP DO INSTAGRAM
  if (network === 'instagram') {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden max-w-lg mx-auto">
        {/* Cabeçalho do Post */}
        <div className="p-3.5 flex items-center justify-between border-b border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-pink-500">
              <img src={authorAvatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-xs font-bold text-white">{authorHandle.replace('@', '')}</span>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* Imagem / Carrossel */}
        <div className="aspect-square bg-slate-900 flex items-center justify-center relative">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080"
            alt="Instagram Slide"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Ações e Legenda */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-200">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 hover:text-rose-500 cursor-pointer" />
              <MessageSquare className="w-5 h-5 cursor-pointer" />
              <Send className="w-5 h-5 cursor-pointer" />
            </div>
            <Bookmark className="w-5 h-5 cursor-pointer" />
          </div>

          <p className="text-xs font-bold text-white">1.482 curtidas</p>

          <div className="text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-white mr-1.5">{authorHandle.replace('@', '')}</span>
            <span className="whitespace-pre-wrap">{content}</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. MOCKUP DO THREADS
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#101010] text-slate-100 p-5 shadow-2xl max-w-lg mx-auto space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2">
          <img src={authorAvatar} alt={authorName} className="w-9 h-9 rounded-full object-cover" />
          <div className="w-[2px] h-16 bg-slate-800 rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">{authorHandle.replace('@', '')}</span>
            <span className="text-[11px] text-slate-500">14m</span>
          </div>
          <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
            {content || 'Texto da thread conversacional...'}
          </div>
          <div className="flex items-center gap-4 pt-1 text-slate-400">
            <Heart className="w-4 h-4 hover:text-rose-400 cursor-pointer" />
            <MessageSquare className="w-4 h-4 hover:text-cyan-400 cursor-pointer" />
            <Repeat2 className="w-4 h-4 hover:text-emerald-400 cursor-pointer" />
            <Send className="w-4 h-4 hover:text-indigo-400 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
