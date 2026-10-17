'use client';

import React, { useState } from 'react';
import {
  ContentRepurposingKit,
  RepurposingKitStatus,
} from '@/lib/repurpose/types';
import {
  Layers,
  Twitter,
  Video,
  Mail,
  Clock,
  Sparkles,
  Copy,
  Check,
  Trash2,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface RepurposingKitCardProps {
  kit: ContentRepurposingKit;
  onStatusChange?: (id: string, newStatus: RepurposingKitStatus) => void;
  onDelete?: (id: string) => void;
}

type TabType = 'carousel' | 'x_thread' | 'reel_script' | 'newsletter';

export function RepurposingKitCard({ kit, onStatusChange, onDelete }: RepurposingKitCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('carousel');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getStatusBadge = (status: RepurposingKitStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Publicado</span>;
      case 'approved':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Aprovado</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Agendado</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Rascunho</span>;
    }
  };

  const getSourceIconLabel = (source: string) => {
    switch (source) {
      case 'youtube_transcript':
        return 'YouTube Transcrito';
      case 'podcast_audio':
        return 'Podcast Áudio';
      case 'blog_post':
        return 'Artigo / Blog';
      case 'pdf_whitepaper':
        return 'Whitepaper / PDF';
      case 'webinar_notes':
        return 'Notas de Webinar';
      default:
        return 'Conteúdo Base';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl transition-all hover:border-zinc-700 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {getSourceIconLabel(kit.sourceType)}
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              ~{kit.estimatedTimeSavedMinutes} min economizados
            </span>
            {getStatusBadge(kit.status)}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{kit.title}</h3>
          {kit.sourceUrl && (
            <a
              href={kit.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 inline-flex"
            >
              <ExternalLink className="w-3 h-3" /> Ver fonte original
            </a>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {kit.status !== 'approved' && (
            <button
              onClick={() => onStatusChange?.(kit.id, 'approved')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600/20 text-sky-300 hover:bg-sky-600/30 border border-sky-500/30 flex items-center gap-1.5 transition"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Aprovar Kit
            </button>
          )}
          {kit.status === 'approved' && (
            <button
              onClick={() => onStatusChange?.(kit.id, 'published')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 flex items-center gap-1.5 transition"
            >
              <Check className="w-3.5 h-3.5" /> Marcar Publicado
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(kit.id)}
              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              title="Excluir kit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 gap-1 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('carousel')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition border-b-2 ${
            activeTab === 'carousel'
              ? 'border-purple-500 text-purple-400 bg-purple-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          Carrossel ({kit.carouselSlides?.length || 7} Slides)
        </button>

        <button
          onClick={() => setActiveTab('x_thread')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition border-b-2 ${
            activeTab === 'x_thread'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Twitter className="w-4 h-4" />
          Thread X ({kit.xThread?.length || 5} Tweets)
        </button>

        <button
          onClick={() => setActiveTab('reel_script')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition border-b-2 ${
            activeTab === 'reel_script'
              ? 'border-pink-500 text-pink-400 bg-pink-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Video className="w-4 h-4" />
          Roteiro Reel (60s)
        </button>

        <button
          onClick={() => setActiveTab('newsletter')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition border-b-2 ${
            activeTab === 'newsletter'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          Newsletter Executiva
        </button>
      </div>

      {/* Tab 1: Carrossel */}
      {activeTab === 'carousel' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Slide {activeSlideIndex + 1} de {kit.carouselSlides.length}
            </span>
            <div className="flex items-center gap-1.5">
              {kit.carouselSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    activeSlideIndex === idx ? 'bg-purple-500 w-6' : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {kit.carouselSlides[activeSlideIndex] && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">
                  {kit.carouselSlides[activeSlideIndex].badge}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  {kit.carouselSlides[activeSlideIndex].headline}
                </h4>
                <p className="text-sm text-zinc-300 mt-3 whitespace-pre-line leading-relaxed">
                  {kit.carouselSlides[activeSlideIndex].body}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span className="italic">🎨 {kit.carouselSlides[activeSlideIndex].visualCue}</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${kit.carouselSlides[activeSlideIndex].headline}\n\n${kit.carouselSlides[activeSlideIndex].body}`,
                      `slide-${activeSlideIndex}`
                    )
                  }
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                >
                  {copiedSection === `slide-${activeSlideIndex}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  Copiar Slide
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <button
              disabled={activeSlideIndex === 0}
              onClick={() => setActiveSlideIndex(i => Math.max(0, i - 1))}
              className="px-3 py-1 text-xs rounded bg-zinc-800 text-zinc-300 disabled:opacity-30 hover:bg-zinc-700"
            >
              Anterior
            </button>
            <button
              disabled={activeSlideIndex === kit.carouselSlides.length - 1}
              onClick={() => setActiveSlideIndex(i => Math.min(kit.carouselSlides.length - 1, i + 1))}
              className="px-3 py-1 text-xs rounded bg-zinc-800 text-zinc-300 disabled:opacity-30 hover:bg-zinc-700 flex items-center gap-1"
            >
              Próximo <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: X Thread */}
      {activeTab === 'x_thread' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => {
                const fullThreadText = kit.xThread.map(t => t.content).join('\n\n---\n\n');
                copyToClipboard(fullThreadText, 'full-thread');
              }}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
            >
              {copiedSection === 'full-thread' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copiar Thread Completa
            </button>
          </div>

          <div className="space-y-3">
            {kit.xThread.map(tweet => (
              <div
                key={tweet.tweetNumber}
                className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-4 space-y-2 relative"
              >
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-semibold text-sky-400">
                    Tweet {tweet.tweetNumber} de {kit.xThread.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{tweet.charCount}/280 chars</span>
                    <button
                      onClick={() => copyToClipboard(tweet.content, `tweet-${tweet.tweetNumber}`)}
                      className="text-zinc-400 hover:text-zinc-200"
                    >
                      {copiedSection === `tweet-${tweet.tweetNumber}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                  {tweet.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reel Script */}
      {activeTab === 'reel_script' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
              Roteiro Vertical 9:16 ({kit.reelScript.durationSeconds}s)
            </span>
            <button
              onClick={() => {
                const scriptText =
                  `HOOK (0-3s):\nFala: ${kit.reelScript.hook.spokenLine}\nTexto: ${kit.reelScript.hook.onScreenText}\n\n` +
                  kit.reelScript.keyPoints
                    .map(kp => `[${kp.timestampSec}s] ${kp.title}: ${kp.spokenText}`)
                    .join('\n\n') +
                  `\n\nCTA: ${kit.reelScript.callToAction.spokenLine}`;
                copyToClipboard(scriptText, 'reel-full');
              }}
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 font-medium"
            >
              {copiedSection === 'reel-full' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copiar Roteiro
            </button>
          </div>

          {/* Hook Block */}
          <div className="border-l-2 border-pink-500 pl-4 py-1 space-y-1 bg-pink-500/5 rounded-r">
            <span className="text-xs font-bold text-pink-400">
              ⚡ Hook Hipnótico (0-{kit.reelScript.hook.durationSec}s)
            </span>
            <p className="text-sm font-semibold text-white">
              "{kit.reelScript.hook.spokenLine}"
            </p>
            <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4">
              <span>Texto na tela: <strong className="text-zinc-200">{kit.reelScript.hook.onScreenText}</strong></span>
              <span>Visual: <em className="text-zinc-400">{kit.reelScript.hook.bRollVisual}</em></span>
            </div>
          </div>

          {/* Keypoints */}
          <div className="space-y-3 pt-2">
            {kit.reelScript.keyPoints.map((kp, idx) => (
              <div key={idx} className="border-l-2 border-zinc-700 pl-4 py-1 space-y-1">
                <span className="text-xs font-bold text-zinc-400">
                  ⏱️ {kp.timestampSec}s - {kp.title}
                </span>
                <p className="text-sm text-zinc-200 leading-relaxed">
                  "{kp.spokenText}"
                </p>
                <span className="text-xs text-zinc-500 italic block">
                  Ação visual: {kp.actionCue}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Block */}
          <div className="border-l-2 border-emerald-500 pl-4 py-1 space-y-1 bg-emerald-500/5 rounded-r pt-2">
            <span className="text-xs font-bold text-emerald-400">
              🎯 Chamada Para Ação Final ({kit.reelScript.callToAction.durationSec}s)
            </span>
            <p className="text-sm font-semibold text-white">
              "{kit.reelScript.callToAction.spokenLine}"
            </p>
            <span className="text-xs text-zinc-400 block">
              Elemento visual: {kit.reelScript.callToAction.stickerOrGraphic}
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Newsletter */}
      {activeTab === 'newsletter' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Newsletter Executiva ({kit.newsletter.readingTimeMinutes} min de leitura)
            </span>
            <button
              onClick={() => {
                const mailText =
                  `Assunto: ${kit.newsletter.subjectLine}\nPreview: ${kit.newsletter.previewText}\n\n` +
                  `${kit.newsletter.greeting}\n\n${kit.newsletter.coreInsight}\n\n` +
                  kit.newsletter.keyBulletTakeaways.join('\n') +
                  `\n\n[CTA: ${kit.newsletter.ctaButtonText} -> ${kit.newsletter.ctaUrl}]`;
                copyToClipboard(mailText, 'newsletter-full');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              {copiedSection === 'newsletter-full' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copiar E-mail
            </button>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg space-y-3">
            <div>
              <span className="text-xs text-zinc-500 block">Assunto:</span>
              <p className="text-sm font-semibold text-white">{kit.newsletter.subjectLine}</p>
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">Pré-visualização:</span>
              <p className="text-xs text-zinc-400">{kit.newsletter.previewText}</p>
            </div>
            <div className="pt-2 border-t border-zinc-800 space-y-3 text-sm text-zinc-200">
              <p>{kit.newsletter.greeting}</p>
              <p className="leading-relaxed">{kit.newsletter.coreInsight}</p>
              <div className="space-y-1.5 pl-2">
                {kit.newsletter.keyBulletTakeaways.map((bullet, idx) => (
                  <p key={idx} className="text-xs text-zinc-300">
                    {bullet}
                  </p>
                ))}
              </div>
              <div className="pt-3">
                <a
                  href={kit.newsletter.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 text-xs font-semibold rounded bg-amber-500 text-zinc-950 hover:bg-amber-400 transition"
                >
                  {kit.newsletter.ctaButtonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags footer */}
      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-zinc-800/60">
        <span className="text-xs text-zinc-500">Tags:</span>
        {kit.tags.map(t => (
          <span
            key={t}
            className="px-2 py-0.5 text-[11px] rounded bg-zinc-800 text-zinc-400"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}
