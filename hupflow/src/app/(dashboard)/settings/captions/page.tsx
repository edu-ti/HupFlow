'use client';

import React, { useEffect, useState } from 'react';
import {
  CaptionCue,
  CaptionLanguage,
  CaptionPreset,
  CaptionProjectStats,
  CaptionSafeZone,
  VideoCaptionProject,
} from '@/lib/captions/types';
import {
  getCaptionPresetConfig,
  segmentTranscriptToCues,
  exportToSrt,
  exportToVtt,
} from '@/lib/captions/captions-utils';
import { VideoCaptionPreview } from '@/components/captions/VideoCaptionPreview';
import {
  Subtitles,
  Sparkles,
  Download,
  Plus,
  Trash2,
  Save,
  Copy,
  Check,
  Wand2,
  Clock,
  Layers,
  Type,
  AlignVerticalSpaceAround,
} from 'lucide-react';

const PRESET_OPTIONS: Array<{ id: CaptionPreset; badge: string }> = [
  { id: 'hormozi_bold', badge: 'Mais Usado' },
  { id: 'karaoke_glow', badge: 'Reels / TikTok' },
  { id: 'minimal_pill', badge: 'LinkedIn B2B' },
  { id: 'neon_cyber', badge: 'Podcasts' },
  { id: 'editorial_serif', badge: 'Cinema' },
];

export default function CaptionsStudioPage() {
  const [projects, setProjects] = useState<VideoCaptionProject[]>([]);
  const [stats, setStats] = useState<CaptionProjectStats>({
    totalProjects: 0,
    totalCues: 0,
    totalDurationSec: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<'srt' | 'vtt' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Active Project Form State
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState('Reels: 3 Segredos de Retenção com IA');
  const [language, setLanguage] = useState<CaptionLanguage>('pt-BR');
  const [durationMs, setDurationMs] = useState<number>(12000);
  const [preset, setPreset] = useState<CaptionPreset>('hormozi_bold');
  const [safeZonePosition, setSafeZonePosition] =
    useState<CaptionSafeZone>('bottom_safe');
  const [rawTranscript, setRawTranscript] = useState(
    'Mais de 80% dos vídeos no Reels e TikTok são assistidos sem som! Use legendas dinâmicas com IA no HupFlow para triplicar sua retenção nos primeiros 3 segundos e vender muito mais todos os dias.'
  );
  const [maxWordsPerCue, setMaxWordsPerCue] = useState<number>(4);
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch('/api/captions');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setStats(
          data.stats || { totalProjects: 0, totalCues: 0, totalDurationSec: 0 }
        );
        if (data.projects && data.projects.length > 0) {
          selectProject(data.projects[0]);
        } else {
          handleGenerateCuesFromText();
        }
      }
    } catch (err) {
      console.error('Erro ao carregar legendas:', err);
    } finally {
      setLoading(false);
    }
  }

  function selectProject(proj: VideoCaptionProject) {
    setActiveId(proj.id);
    setTitle(proj.title);
    setLanguage(proj.language || 'pt-BR');
    setDurationMs(proj.durationMs || 12000);
    setPreset(proj.preset || 'hormozi_bold');
    setSafeZonePosition(proj.safeZonePosition || 'bottom_safe');
    setRawTranscript(proj.rawTranscript || '');
    setCues(proj.cues || []);
    setCurrentTimeMs(0);
  }

  function handleGenerateCuesFromText() {
    if (!rawTranscript.trim()) return;
    const generated = segmentTranscriptToCues(rawTranscript, {
      maxWordsPerCue,
      totalDurationMs: durationMs,
      autoEmoji: true,
    });
    setCues(generated);
    if (generated.length > 0) {
      setDurationMs(generated[generated.length - 1].endMs);
    }
    setCurrentTimeMs(0);
    setFeedback('Segmentos gerados e sincronizados com sucesso!');
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleSaveProject() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeId,
          title,
          language,
          durationMs,
          preset,
          safeZonePosition,
          rawTranscript,
          cues,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setActiveId(data.project.id);
        }
        await loadProjects();
        setFeedback('Projeto de legendas salvo no workspace!');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Erro ao salvar projeto:', err);
    } finally {
      setSaving(false);
    }
  }

  function handleUpdateCue(
    cueId: string,
    field: keyof CaptionCue,
    value: string | number
  ) {
    setCues((prev) =>
      prev.map((c) => (c.id === cueId ? { ...c, [field]: value } : c))
    );
  }

  function handleAddCue() {
    const lastEnd = cues.length > 0 ? cues[cues.length - 1].endMs : 0;
    const newEnd = lastEnd + 2000;
    const newCue: CaptionCue = {
      id: `cue_${Date.now()}`,
      index: cues.length + 1,
      startMs: lastEnd,
      endMs: newEnd,
      text: 'Novo bloco de legenda',
      highlightWord: 'legenda',
      emoji: '✨',
    };
    setCues((prev) => [...prev, newCue]);
    setDurationMs((prev) => Math.max(prev, newEnd));
  }

  function handleRemoveCue(cueId: string) {
    setCues((prev) => prev.filter((c) => c.id !== cueId));
  }

  function handleDownloadFile(format: 'srt' | 'vtt') {
    const content = format === 'vtt' ? exportToVtt(cues) : exportToSrt(cues);
    const blob = new Blob([content], {
      type: format === 'vtt' ? 'text/vtt;charset=utf-8' : 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'legendas'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCopyContent(format: 'srt' | 'vtt') {
    const content = format === 'vtt' ? exportToVtt(cues) : exportToSrt(cues);
    await navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Subtitles className="w-3.5 h-3.5" />
              Feature 032 • Clean-Room Video Subtitles
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Estúdio de Legendas Animadas & Transcrição (SRT / VTT)
          </h1>
          <p className="text-sm text-slate-400">
            Gere micro-legendas de alta retenção estilo Hormozi e Karaoke para Reels, TikTok, Shorts e LinkedIn com sincronização em milissegundos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleDownloadFile('srt')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            Baixar .SRT
          </button>
          <button
            type="button"
            onClick={() => handleDownloadFile('vtt')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Baixar .VTT
          </button>
          <button
            type="button"
            onClick={handleSaveProject}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Salvando...' : 'Salvar Projeto'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {feedback}
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Projetos de Legendas</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.totalProjects}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Blocos Sincronizados (Cues)</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {cues.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
            <Type className="w-5 h-5 text-purple-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Duração do Vídeo Ativo</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {(durationMs / 1000).toFixed(1)}s
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Editor on Left, 9:16 Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator, Presets & Cue Timeline Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. AI Script / Transcript Segmenter */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                1. Roteiro & Transcrição Inteligente IA
              </h2>
              <span className="text-[11px] text-slate-400">
                Quebra automática em micro-blocos de alta retenção
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Título do Vídeo / Reels
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Ex: Reels 3 Dicas de IA..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Idioma da Legenda
                </label>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as CaptionLanguage)
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="pt-BR">Português (pt-BR)</option>
                  <option value="en-US">Inglês (en-US)</option>
                  <option value="es-ES">Espanhol (es-ES)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Texto da Fala / Transcrição do Vídeo
              </label>
              <textarea
                rows={3}
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                placeholder="Cole aqui o roteiro ou transcrição do vídeo curto..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400">
                    Palavras por Bloco
                  </label>
                  <select
                    value={maxWordsPerCue}
                    onChange={(e) => setMaxWordsPerCue(Number(e.target.value))}
                    className="mt-0.5 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value={3}>3 palavras (Rápido / Hormozi)</option>
                    <option value={4}>4 palavras (Equilibrado)</option>
                    <option value={5}>5 palavras (Editorial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400">
                    Duração Alvo (segundos)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={180}
                    value={Math.round(durationMs / 1000)}
                    onChange={(e) =>
                      setDurationMs(Math.max(3, Number(e.target.value)) * 1000)
                    }
                    className="mt-0.5 w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateCuesFromText}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sincronizar & Destacar Palavras com IA
              </button>
            </div>
          </div>

          {/* 2. Burn-in Visual Preset & Safe Zone Selector */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <AlignVerticalSpaceAround className="w-4 h-4 text-purple-400" />
                2. Estilo de Legenda Queimada & Safe Zone 9:16
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {PRESET_OPTIONS.map((opt) => {
                const cfg = getCaptionPresetConfig(opt.id);
                const selected = preset === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPreset(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                      {opt.badge}
                    </span>
                    <p className="text-xs font-bold text-white mt-2">
                      {cfg.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                      {cfg.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Safe Zone Position */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
              <span className="text-xs text-slate-300 font-medium">
                Posição Vertical no Vídeo (Proteção contra UI do Reels/TikTok):
              </span>
              <div className="flex items-center gap-2">
                {(
                  [
                    { id: 'top_safe', label: 'Topo Seguro (16%)' },
                    { id: 'center', label: 'Centro (50%)' },
                    { id: 'bottom_safe', label: 'Base Segura (78%)' },
                  ] as const
                ).map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setSafeZonePosition(pos.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      safeZonePosition === pos.id
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Interactive Cue Timeline List */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">
                  3. Linha do Tempo de Segmentos ({cues.length} Cues)
                </h2>
                <p className="text-xs text-slate-400">
                  Clique em qualquer bloco para testar no simulador ao lado ou ajuste a palavra em destaque.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyContent('srt')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
                >
                  {copiedFormat === 'srt' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  Copiar SRT
                </button>
                <button
                  type="button"
                  onClick={handleAddCue}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Bloco
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {cues.map((cue, idx) => {
                const isActive =
                  currentTimeMs >= cue.startMs && currentTimeMs <= cue.endMs;
                return (
                  <div
                    key={cue.id}
                    onClick={() => setCurrentTimeMs(cue.startMs + 50)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Index & Timestamps */}
                    <div className="md:col-span-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-mono flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                        <input
                          type="number"
                          step={100}
                          value={cue.startMs}
                          onChange={(e) =>
                            handleUpdateCue(
                              cue.id,
                              'startMs',
                              Number(e.target.value)
                            )
                          }
                          className="w-16 px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-center"
                          title="Início (ms)"
                        />
                        <span>→</span>
                        <input
                          type="number"
                          step={100}
                          value={cue.endMs}
                          onChange={(e) =>
                            handleUpdateCue(
                              cue.id,
                              'endMs',
                              Number(e.target.value)
                            )
                          }
                          className="w-16 px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-center"
                          title="Fim (ms)"
                        />
                      </div>
                    </div>

                    {/* Text Input */}
                    <div className="md:col-span-5">
                      <input
                        type="text"
                        value={cue.text}
                        onChange={(e) =>
                          handleUpdateCue(cue.id, 'text', e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Texto do segmento..."
                      />
                    </div>

                    {/* Highlight Word & Emoji */}
                    <div className="md:col-span-3 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={cue.highlightWord || ''}
                        onChange={(e) =>
                          handleUpdateCue(
                            cue.id,
                            'highlightWord',
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs text-amber-300 placeholder:text-slate-600"
                        placeholder="Destaque"
                        title="Palavra destacada em cor vibrante"
                      />
                      <input
                        type="text"
                        value={cue.emoji || ''}
                        onChange={(e) =>
                          handleUpdateCue(cue.id, 'emoji', e.target.value)
                        }
                        className="w-11 px-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-center"
                        placeholder="🔥"
                        title="Emoji automático"
                      />
                    </div>

                    {/* Delete button */}
                    <div className="md:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCue(cue.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Remover segmento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky 9:16 Live Preview Simulator */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col items-center">
          <VideoCaptionPreview
            title={title}
            cues={cues}
            durationMs={durationMs}
            preset={preset}
            safeZonePosition={safeZonePosition}
            currentTimeMs={currentTimeMs}
            onTimeChange={setCurrentTimeMs}
          />
        </div>
      </div>
    </div>
  );
}
