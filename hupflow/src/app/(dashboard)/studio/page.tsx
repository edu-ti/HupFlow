'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Layers,
  Palette,
  Send,
  Loader2,
  Type,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AspectRatio, SlideData, ColorPalette } from '@/lib/canvas/types';
import { getDimensionsForAspectRatio } from '@/lib/canvas/canvas-utils';
import { renderSlideToCanvas } from '@/lib/canvas/canvas-renderer';
import { exportCarouselToPdf, exportSingleSlideToPng } from '@/lib/canvas/pdf-exporter';

export default function StudioPage() {
  const router = useRouter();

  // Estados do Gerador IA
  const [topicPrompt, setTopicPrompt] = useState('5 Princípios para Escalar um SaaS Bootstrapped');
  const [targetAudience, setTargetAudience] = useState('Fundadores e Desenvolvedores');
  const [slideCount, setSlideCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados do Design do Carrossel
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Paleta de cores
  const [palette, setPalette] = useState<ColorPalette>({
    background: '#0B0F17',
    primaryText: '#F8FAFC',
    accentColor: '#6366F1',
  });

  // Deck de slides
  const [slides, setSlides] = useState<SlideData[]>([
    {
      slideNumber: 1,
      type: 'cover',
      headline: '5 Princípios para Escalar um SaaS Bootstrapped',
      bodyText: 'Sem depender de rodadas de venture capital e mantendo o controle total da sua operação.',
      highlightText: 'Deslize para aprender ➔',
      suggestedIcon: 'Sparkles',
    },
    {
      slideNumber: 2,
      type: 'content',
      headline: '1. Foco Obsessivo em ICP',
      bodyText: 'Tentar vender para todo mundo é a forma mais rápida de falir. Escolha um nicho com dor urgente e dinheiro para pagar.',
      highlightText: 'Nicho > Generalismo',
      suggestedIcon: 'Target',
    },
    {
      slideNumber: 3,
      type: 'statistic',
      headline: '2. Retenção é o Novo Crescimento',
      bodyText: 'Diminuir o Churn em 5% pode aumentar a lucratividade final entre 25% e 95%.',
      highlightText: '+95% Lucro Líquido',
      suggestedIcon: 'TrendingUp',
    },
    {
      slideNumber: 4,
      type: 'content',
      headline: '3. Automação de Processos',
      bodyText: 'Elimine tarefas repetitivas usando filas inteligentes e agentes modernos para focar em produto e vendas.',
      highlightText: 'Alavancagem Máxima',
      suggestedIcon: 'Cpu',
    },
    {
      slideNumber: 5,
      type: 'cta',
      headline: 'Gostou dos insights?',
      bodyText: 'Salve este carrossel para consultar na sua próxima sprint e compartilhe com sua rede!',
      highlightText: 'Salvar & Compartilhar',
      suggestedIcon: 'Bookmark',
    },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentSlide = slides[currentSlideIndex] || slides[0];

  // Renderização 2D no Canvas
  const drawCurrentSlide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentSlide) return;

    renderSlideToCanvas({
      slide: currentSlide,
      totalSlides: slides.length,
      aspectRatio,
      palette,
      canvas,
    });
  }, [currentSlide, slides.length, aspectRatio, palette]);

  useEffect(() => {
    drawCurrentSlide();
  }, [drawCurrentSlide]);

  // Atalhos de teclado (Setas Esquerda e Direita)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em um input ou textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  // Ação de Geração com IA
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topicPrompt,
          targetAudience,
          slideCount,
        }),
      });
      const data = await res.json();
      if (data.slides && data.slides.length > 0) {
        setSlides(data.slides);
        setCurrentSlideIndex(0);
        if (data.colorPalette) {
          setPalette({
            background: data.colorPalette.background || '#0B0F17',
            primaryText: data.colorPalette.primaryText || '#F8FAFC',
            accentColor: data.colorPalette.accentColor || '#6366F1',
          });
        }
        showFeedback('Carrossel gerado com sucesso via IA!');
      }
    } catch (err) {
      console.error('Falha ao gerar carrossel:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Exportar Slide Atual em PNG
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    exportSingleSlideToPng(canvas, currentSlideIndex);
    showFeedback('Slide PNG baixado com sucesso!');
  };

  // Exportar Carrossel Completo em PDF para LinkedIn
  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    try {
      await exportCarouselToPdf(
        {
          topic: topicPrompt,
          targetAudience,
          aspectRatio,
          colorPalette: palette,
          slides,
        },
        {
          fileName: `hupflow-${topicPrompt.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`,
        }
      );
      showFeedback('Documento PDF (Carrossel LinkedIn) gerado com sucesso!');
    } catch (err) {
      console.error('Erro na exportação de PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Manipulação de Slides
  const handleAddSlide = () => {
    const newSlide: SlideData = {
      slideNumber: slides.length + 1,
      type: 'content',
      headline: 'Novo Tópico Importante',
      bodyText: 'Insira aqui a explicação detalhada deste slide...',
      highlightText: 'Insight Chave',
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  const handleDuplicateSlide = () => {
    const duplicated: SlideData = {
      ...currentSlide,
      slideNumber: slides.length + 1,
      headline: `${currentSlide.headline} (Cópia)`,
    };
    setSlides([...slides, duplicated]);
    setCurrentSlideIndex(slides.length);
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) return;
    const filtered = slides.filter((_, idx) => idx !== currentSlideIndex);
    const renumbered = filtered.map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    setSlides(renumbered);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  // Feedback Toast sutil
  const showFeedback = (msg: string) => {
    setExportFeedback(msg);
    setTimeout(() => setExportFeedback(null), 3500);
  };

  // Atualizar campo do slide ativo
  const updateActiveSlide = (key: keyof SlideData, val: any) => {
    setSlides((prev) => {
      const next = [...prev];
      next[currentSlideIndex] = { ...next[currentSlideIndex], [key]: val };
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {exportFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Top Banner / IA Generator Bar */}
      <div className="p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Gerador Inteligente de Carrossel (IA)</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="input-ai-topic"
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="Digite o tema ou assunto do carrossel..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              id="input-ai-audience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Público-alvo..."
              className="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          id="btn-generate-carousel"
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="w-full lg:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gerando Estrutura...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Criar com IA</span>
            </>
          )}
        </button>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Prancheta / Canvas Studio Preview */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          {/* Ratio Selector & Slide Controls */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              {(['1:1', '4:5', '9:16'] as const).map((ratio) => (
                <button
                  key={ratio}
                  id={`btn-ratio-${ratio.replace(':', '-')}`}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    aspectRatio === ratio
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ratio === '1:1' ? '1:1 Quadrado' : ratio === '4:5' ? '4:5 Retrato' : '9:16 Stories'}
                </button>
              ))}
            </div>

            {/* Slide Navigation & Management */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
              <button
                id="btn-prev-slide"
                onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                title="Slide Anterior (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-200 px-2">
                {currentSlideIndex + 1} / {slides.length}
              </span>
              <button
                id="btn-next-slide"
                onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlideIndex === slides.length - 1}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                title="Próximo Slide (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-slate-700 mx-1" />

              <button
                id="btn-add-slide"
                onClick={handleAddSlide}
                className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/20"
                title="Adicionar Novo Slide"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                id="btn-duplicate-slide"
                onClick={handleDuplicateSlide}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                title="Duplicar Slide Atual"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-delete-slide"
                onClick={handleDeleteSlide}
                disabled={slides.length <= 1}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 disabled:opacity-30"
                title="Excluir Slide"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Canvas Container */}
          <div className="relative w-full max-w-[500px] flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 shadow-2xl">
            <canvas
              ref={canvasRef}
              className="w-full max-w-full rounded-xl shadow-2xl border border-slate-800/50 object-contain"
              style={{ maxHeight: '520px' }}
            />
          </div>

          {/* Canvas Export Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                id="btn-export-png"
                onClick={handleExportPNG}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Slide (PNG)
              </button>

              <button
                id="btn-export-pdf"
                onClick={handleExportPDF}
                disabled={isExportingPdf}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold transition-all disabled:opacity-50"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Compilando PDF...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Baixar Carrossel (PDF LinkedIn)</span>
                  </>
                )}
              </button>
            </div>

            <button
              id="btn-send-to-composer"
              onClick={() => router.push('/composer')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar para Agendamento
            </button>
          </div>
        </div>

        {/* Right: Slide Editor & Visual Styling Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Editar Conteúdo do Slide */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-slate-200">Conteúdo do Slide {currentSlideIndex + 1}</h4>
              </div>
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                {currentSlide.type}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Título / Headline</label>
                <textarea
                  id="input-slide-headline"
                  rows={2}
                  value={currentSlide.headline}
                  onChange={(e) => updateActiveSlide('headline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Texto Explicativo</label>
                <textarea
                  id="input-slide-body"
                  rows={3}
                  value={currentSlide.bodyText}
                  onChange={(e) => updateActiveSlide('bodyText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Destaque / Tag</label>
                <input
                  id="input-slide-highlight"
                  type="text"
                  value={currentSlide.highlightText || ''}
                  onChange={(e) => updateActiveSlide('highlightText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Card: Paleta Visual & Cores */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Palette className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-semibold text-slate-200">Identidade Visual & Cores</h4>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Fundo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={palette.background}
                    onChange={(e) => setPalette({ ...palette, background: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{palette.background}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={palette.primaryText}
                    onChange={(e) => setPalette({ ...palette, primaryText: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{palette.primaryText}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Acento</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={palette.accentColor}
                    onChange={(e) => setPalette({ ...palette, accentColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-300">{palette.accentColor}</span>
                </div>
              </div>
            </div>

            {/* Presets de Temas */}
            <div className="pt-2">
              <label className="text-[11px] text-slate-400 block mb-2">Paletas Prontas</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setPalette({
                      background: '#0B0F17',
                      primaryText: '#F8FAFC',
                      accentColor: '#6366F1',
                    });
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 text-xs text-slate-300"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#6366F1]" />
                  <span>Midnight Indigo</span>
                </button>
                <button
                  onClick={() => {
                    setPalette({
                      background: '#0F172A',
                      primaryText: '#F1F5F9',
                      accentColor: '#06B6D4',
                    });
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 text-xs text-slate-300"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#06B6D4]" />
                  <span>Cyber Cyan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
