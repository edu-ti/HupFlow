'use client';

import React, { useState, useEffect } from 'react';
import {
  VoiceoverTrackItem,
  VoiceoverStudioMetrics,
  VoiceProfile,
  VoicePersona,
  VoicePitch,
  calculatePacingWordsPerMinute,
  estimateSpeechDurationSeconds,
  getAvailableVoicesCatalog,
} from '@/lib/voiceover/types';
import { VoiceoverTrackCard } from '@/components/voiceover/VoiceoverTrackCard';
import {
  Mic,
  Sparkles,
  Volume2,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  AudioLines,
  Radio,
} from 'lucide-react';

export default function VoiceoverStudioPage() {
  const [tracks, setTracks] = useState<VoiceoverTrackItem[]>([]);
  const [metrics, setMetrics] = useState<VoiceoverStudioMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const catalog = getAvailableVoicesCatalog();
  const [title, setTitle] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState(catalog[0]?.id || 'voice_pt_thiago');
  const [speedRatio, setSpeedRatio] = useState(1.0);
  const [pitch, setPitch] = useState<VoicePitch>('balanced');
  const [tagInput, setTagInput] = useState('reels, narração');

  const selectedVoice = catalog.find((v: VoiceProfile) => v.id === selectedVoiceId) || catalog[0];

  // Computed metrics for real-time script feedback
  const { wordCount, durationSeconds } = estimateSpeechDurationSeconds(
    scriptText,
    selectedVoice.persona,
    speedRatio
  );
  const wordsPerMinute = calculatePacingWordsPerMinute(selectedVoice.persona);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/voiceover');
      if (res.ok) {
        const data = await res.json();
        setTracks(data.tracks || []);
        setMetrics(data.metrics || null);
      }
    } catch {
      // In case of error, silent catch
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleCreateVoiceover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !scriptText.trim()) {
      setErrorMsg('Por favor informe o título e o roteiro da narração.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const tags = tagInput
        .split(',')
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch('/api/voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          scriptText,
          voiceId: selectedVoiceId,
          persona: selectedVoice.persona,
          language: selectedVoice.language,
          speed: speedRatio.toFixed(2),
          pitch,
          tags,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Falha ao sintetizar locução neural.');
      }

      setSuccessMsg('Locução neural sintetizada com sucesso!');
      setTitle('');
      setScriptText('');
      setSpeedRatio(1.0);
      setPitch('balanced');
      fetchTracks();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/voiceover?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTracks((prev: VoiceoverTrackItem[]) => prev.filter(t => t.id !== id));
      }
    } catch {
      // Error handling
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Mic className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-zinc-100">Estúdio de Narração & Vozes Neurais (TTS)</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Gere locuções realistas ultranaturais para Reels, TikTok, YouTube Shorts e anúncios com controle de ritmo e entonação.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Faixas Sintetizadas</span>
              <AudioLines className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{metrics.totalTracks}</p>
            <p className="text-[11px] text-zinc-500">Acervo gerado na organização</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Palavras Narradas</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{metrics.totalWordsSynthesized.toLocaleString('pt-BR')}</p>
            <p className="text-[11px] text-zinc-500">Total de script sintetizado</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Duração Total</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{metrics.totalDurationMinutes} min</p>
            <p className="text-[11px] text-zinc-500">Tempo de áudio no portfólio</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Persona Predominante</span>
              <Radio className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-base font-bold text-zinc-100 truncate">{metrics.mostUsedPersona.replace('_', ' ')}</p>
            <p className="text-[11px] text-zinc-500">Estilo neural favorito</p>
          </div>
        </div>
      )}

      {/* Main Studio Workspace: 2 Columns (Editor & Library) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Script Editor & Voice Config (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-zinc-100">Criador de Narração Neural</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {catalog.length} Vozes Disponíveis
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateVoiceover} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Título do Criativo / Spot
              </label>
              <input
                type="text"
                placeholder="Ex: Gancho TikTok - Promoção Fim de Ano 2026"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Persona Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Persona Vocal & Estilo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {catalog.map((v: VoiceProfile) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVoiceId(v.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVoiceId === v.id
                        ? 'bg-indigo-600/15 border-indigo-500 text-zinc-100 ring-1 ring-indigo-500/40'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-zinc-200">{v.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {v.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{v.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Input with Real-time Counters */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Roteiro da Narração
                </label>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span>{wordCount} palavras</span>
                  <span>~{durationSeconds}s áudio</span>
                  <span className="text-indigo-400">{wordsPerMinute} PPM base</span>
                </div>
              </div>
              <textarea
                rows={4}
                placeholder="Insira o texto para ser falado pela IA. Dica: use pontuações como vírgulas e pontos para orientar pausas naturais e respiração."
                value={scriptText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScriptText(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Audio Tuning Sliders (Speed & Pitch) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 border border-zinc-800 rounded-xl p-4">
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                  <span>Velocidade de Fala</span>
                  <span className="font-mono text-indigo-400 font-bold">{speedRatio.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.50"
                  step="0.05"
                  value={speedRatio}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpeedRatio(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>0.75x Lenta</span>
                  <span>1.0x Normal</span>
                  <span>1.5x Acelerada</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-zinc-300 mb-1">
                  <span>Tom / Afinação (Pitch)</span>
                  <span className="font-mono text-indigo-400 font-bold">{pitch}</span>
                </div>
                <select
                  value={pitch}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPitch(e.target.value as VoicePitch)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="deep">Grave (Deep)</option>
                  <option value="balanced">Natural / Equilibrado (Balanced)</option>
                  <option value="high">Agudo / Energético (High)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Tags Organizacionais (separadas por vírgula)
              </label>
              <input
                type="text"
                placeholder="reels, tiktok, gancho, promoção"
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !title || !scriptText}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Sintetizando Faixa Neural...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Gerar Áudio com {selectedVoice.name}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Audio Library (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <AudioLines className="w-5 h-5 text-indigo-400" />
              <span>Acervo de Locuções</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {tracks.length} {tracks.length === 1 ? 'faixa' : 'faixas'}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-xl">
              Carregando acervo de áudio...
            </div>
          ) : tracks.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
              <Volume2 className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-medium text-zinc-300">Nenhuma narração criada ainda</p>
              <p className="text-xs text-zinc-500">
                Escreva seu primeiro roteiro à esquerda e clique em "Gerar Áudio" para começar seu banco de vozes.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {tracks.map((track: VoiceoverTrackItem) => (
                <VoiceoverTrackCard
                  key={track.id}
                  track={track}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
