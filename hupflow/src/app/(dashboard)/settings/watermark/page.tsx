'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Type,
  Layers,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import {
  WatermarkPosition,
  WatermarkType,
  WatermarkSettings,
} from '@/lib/watermark/types';
import { WatermarkPreviewCard } from '@/components/watermark/WatermarkPreviewCard';

export default function WatermarkSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados de Configuração
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('combined');
  const [position, setPosition] = useState<WatermarkPosition>('bottom_right');
  const [opacity, setOpacity] = useState(85);
  const [scalePercent, setScalePercent] = useState(15);
  const [marginPx, setMarginPx] = useState(24);
  const [customText, setCustomText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [autoApply, setAutoApply] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/watermark');
      if (res.ok) {
        const data = await res.json();
        const s: WatermarkSettings = data.settings;
        if (s) {
          setWatermarkType(s.watermarkType);
          setPosition(s.position);
          setOpacity(s.opacity);
          setScalePercent(s.scalePercent);
          setMarginPx(s.marginPx);
          setCustomText(s.customText || data.brandKitDefaults?.handle || '');
          setLogoUrl(s.logoUrl || data.brandKitDefaults?.logoUrl || '');
          setAutoApply(s.autoApply);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/watermark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watermarkType,
          position,
          opacity,
          scalePercent,
          marginPx,
          customText: customText.trim() || undefined,
          logoUrl: logoUrl.trim() || undefined,
          autoApply,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar preferências');

      showToast('Configurações de marca d\'água salvas com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Falha ao salvar', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const positionsList: { id: WatermarkPosition; label: string; gridArea: string }[] = [
    { id: 'top_left', label: 'Superior Esquerdo', gridArea: 'col-start-1 row-start-1' },
    { id: 'top_right', label: 'Superior Direito', gridArea: 'col-start-3 row-start-1' },
    { id: 'center', label: 'Centro', gridArea: 'col-start-2 row-start-2' },
    { id: 'bottom_left', label: 'Inferior Esquerdo', gridArea: 'col-start-1 row-start-3' },
    { id: 'bottom_right', label: 'Inferior Direito', gridArea: 'col-start-3 row-start-3' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-primary" />
            Marca d&apos;Água & Selos Corporativos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure o carimbo visual de logotipo e handle em imagens e carrosséis para garantir proteção e consistência de marca.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Preferências
            </>
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">Carregando preferências de marca d&apos;água...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controles (Esquerda) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Formato do Selo */}
              <div className="p-5 rounded-xl border border-border/60 bg-card space-y-3">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Tipo de Selo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setWatermarkType('combined')}
                    className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                      watermarkType === 'combined'
                        ? 'bg-primary/10 border-primary text-primary shadow-xs'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Logo + Handle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWatermarkType('logo')}
                    className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                      watermarkType === 'logo'
                        ? 'bg-primary/10 border-primary text-primary shadow-xs'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Apenas Logotipo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWatermarkType('text')}
                    className={`p-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-2 transition-all ${
                      watermarkType === 'text'
                        ? 'bg-primary/10 border-primary text-primary shadow-xs'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    <span>Apenas Texto</span>
                  </button>
                </div>
              </div>

              {/* Informações da Marca */}
              <div className="p-5 rounded-xl border border-border/60 bg-card space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Conteúdo da Marca
                </h3>

                {(watermarkType === 'text' || watermarkType === 'combined') && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Handle / Nome de Usuário
                    </label>
                    <input
                      type="text"
                      placeholder="@suaempresa"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                    />
                  </div>
                )}

                {(watermarkType === 'logo' || watermarkType === 'combined') && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      URL do Logotipo (PNG transparente ou SVG)
                    </label>
                    <input
                      type="url"
                      placeholder="https://exemplo.com.br/logo-white.png"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Recomendamos arquivos em PNG com fundo transparente ou SVG monocromático.
                    </p>
                  </div>
                )}
              </div>

              {/* Posicionamento */}
              <div className="p-5 rounded-xl border border-border/60 bg-card space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Posição na Mídia
                </h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Grid 3x3 Interativo */}
                  <div className="w-44 h-44 p-2 rounded-xl border border-border bg-muted/20 grid grid-cols-3 grid-rows-3 gap-2 shrink-0">
                    {positionsList.map((p) => {
                      const isSelected = position === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPosition(p.id)}
                          className={`${p.gridArea} rounded-lg border transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/40'
                              : 'bg-card border-border/80 text-muted-foreground hover:bg-muted/80'
                          }`}
                          title={p.label}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>
                      Selecione um dos 5 pontos estratégicos. A posição{' '}
                      <span className="font-semibold text-foreground">Inferior Direito</span> é a mais recomendada para posts de feed e carrosséis.
                    </p>
                    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs text-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary shrink-0" />
                      <span>
                        Posição ativa:{' '}
                        <strong>
                          {positionsList.find((p) => p.id === position)?.label}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ajustes de Opacidade, Escala e Margem */}
              <div className="p-5 rounded-xl border border-border/60 bg-card space-y-4">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Ajustes Finos de Escala & Transparência
                </h3>

                <div className="space-y-4">
                  {/* Opacidade */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Opacidade do Selo</span>
                      <span className="font-mono text-foreground font-semibold">{opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Escala */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Escala Relativa</span>
                      <span className="font-mono text-foreground font-semibold">{scalePercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={35}
                      value={scalePercent}
                      onChange={(e) => setScalePercent(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Margem */}
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Margem das Bordas</span>
                      <span className="font-mono text-foreground font-semibold">{marginPx}px</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={64}
                      value={marginPx}
                      onChange={(e) => setMarginPx(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Aplicação Automática */}
              <div className="p-5 rounded-xl border border-border/60 bg-card flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-foreground">
                    Aplicação Automática no Agendador
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Aplica automaticamente a marca d&apos;água em todas as imagens enviadas pelo Compositor.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoApply}
                    onChange={(e) => setAutoApply(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </form>
          </div>

          {/* Preview Interativo em Tempo Real (Direita) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-xl border border-border/60 bg-card sticky top-6 space-y-5">
              <WatermarkPreviewCard
                position={position}
                watermarkType={watermarkType}
                opacity={opacity}
                scalePercent={scalePercent}
                marginPx={marginPx}
                customText={customText}
                logoUrl={logoUrl}
              />

              {/* Dicas de Usabilidade */}
              <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-2 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-primary" />
                  Boas Práticas de Branding:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Evite opacidades acima de 90% para não competir visualmente com o conteúdo.</li>
                  <li>Em Stories e Reels (9:16), evite o canto superior direito (onde fica o botão de fechar) e a margem inferior extrema (onde ficam botões de mensagem).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
