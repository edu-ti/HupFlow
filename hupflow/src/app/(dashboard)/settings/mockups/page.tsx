'use client';

import React, { useState, useEffect } from 'react';
import {
  DeviceType,
  DeviceOrientation,
  MockupTheme,
  ShadowStyle,
  MediaType,
  DeviceMockupItem,
  MockupSummaryMetrics,
} from '@/lib/mockups/types';
import { DeviceMockupPreview } from '@/components/mockups/DeviceMockupPreview';
import {
  Smartphone,
  Tablet,
  Laptop,
  Sparkles,
  Layers,
  Save,
  Download,
  Plus,
  RefreshCw,
  Trash2,
  ExternalLink,
  Check,
} from 'lucide-react';

export default function DeviceMockupsStudioPage() {
  const [mockups, setMockups] = useState<DeviceMockupItem[]>([]);
  const [metrics, setMetrics] = useState<MockupSummaryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Studio Active State
  const [title, setTitle] = useState('Meu Criativo em Destaque');
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone_16_pro');
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [finishColor, setFinishColor] = useState<MockupTheme>('titanium_black');
  const [shadowStyle, setShadowStyle] = useState<ShadowStyle>('floating_3d');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  );
  const [backgroundColorHex, setBackgroundColorHex] = useState('#09090b');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchMockups = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/mockups');
      if (res.ok) {
        const data = await res.json();
        setMockups(data.mockups || []);
        setMetrics(data.summary || null);
      }
    } catch (err) {
      console.error('Falha ao buscar mockups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockups();
  }, []);

  const handleSavePreset = async () => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/mockups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          deviceType,
          orientation,
          finishColor,
          shadowStyle,
          mediaType,
          mediaUrl,
          backgroundColorHex,
          perspectiveTiltX: 0,
          perspectiveTiltY: 0,
          tags: [deviceType, mediaType],
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
        await fetchMockups();
      }
    } catch (err) {
      console.error('Falha ao salvar mockup:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPreset = (m: DeviceMockupItem) => {
    setTitle(m.title);
    setDeviceType(m.deviceType);
    setOrientation(m.orientation);
    setFinishColor(m.finishColor);
    setShadowStyle(m.shadowStyle);
    setMediaType(m.mediaType);
    setMediaUrl(m.mediaUrl);
    setBackgroundColorHex(m.backgroundColorHex);
  };

  const handleDeleteMockup = async (id: string) => {
    if (!confirm('Deseja excluir este mockup salvo?')) return;
    try {
      const res = await fetch(`/api/mockups?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchMockups();
      }
    } catch (err) {
      console.error('Falha ao excluir mockup:', err);
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
              Estúdio de Mockups 3D
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Mockups Dinâmicos de Vídeo & Dispositivos
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Apresente seus criativos de forma fotorrealista. Encaixe vídeos e imagens automaticamente em molduras vetoriais de iPhone 16 Pro, iPad Pro e MacBook com perspectiva 3D e exportação em 1 clique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSavePreset}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-purple-600/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Salvo com Sucesso!
              </>
            ) : isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar Preset
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Total de Mockups</span>
            <span className="text-2xl font-bold text-white mt-1 block">{metrics.totalMockups}</span>
            <span className="text-[11px] text-purple-400 mt-1 block">Na Biblioteca</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">iPhone 16 Pro</span>
            <span className="text-2xl font-bold text-sky-400 mt-1 block">
              {metrics.iphoneCount}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Dynamic Island</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">iPad Pro</span>
            <span className="text-2xl font-bold text-indigo-400 mt-1 block">
              {metrics.ipadCount}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Carrosséis & B2B</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">MacBook Air</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {metrics.macbookCount}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">SaaS & Dashboards</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Vídeo Loop</span>
            <span className="text-2xl font-bold text-pink-400 mt-1 block">
              {metrics.videoMockupsCount}
            </span>
            <span className="text-[11px] text-pink-500 mt-1 block">MP4 & WebM</span>
          </div>
        </div>
      )}

      {/* Main Studio Editor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live 3D Interactive Canvas */}
        <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Preview Fotorrealista em Tempo Real
            </h2>
            <span className="text-xs text-zinc-500">
              Arraste os controles de ângulo para ajustar a perspectiva 3D
            </span>
          </div>

          <DeviceMockupPreview
            deviceType={deviceType}
            orientation={orientation}
            finishColor={finishColor}
            shadowStyle={shadowStyle}
            mediaType={mediaType}
            mediaUrl={mediaUrl}
            backgroundColorHex={backgroundColorHex}
          />
        </div>

        {/* Right Column: Controls Panel */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-zinc-800 pb-3">
            Ajustes do Aparelho & Mídia
          </h3>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Nome do Mockup
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Device Type */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Dispositivo
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeviceType('iphone_16_pro')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                  deviceType === 'iphone_16_pro'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                }`}
              >
                <Smartphone className="w-5 h-5 text-sky-400" />
                iPhone 16
              </button>

              <button
                type="button"
                onClick={() => setDeviceType('ipad_pro')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                  deviceType === 'ipad_pro'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                }`}
              >
                <Tablet className="w-5 h-5 text-indigo-400" />
                iPad Pro
              </button>

              <button
                type="button"
                onClick={() => setDeviceType('macbook_air')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-xs transition ${
                  deviceType === 'macbook_air'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800/60'
                }`}
              >
                <Laptop className="w-5 h-5 text-purple-400" />
                MacBook
              </button>
            </div>
          </div>

          {/* Orientation */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Orientação
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`py-1.5 rounded-lg border transition ${
                  orientation === 'portrait'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400'
                }`}
              >
                Retrato (Vertical)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`py-1.5 rounded-lg border transition ${
                  orientation === 'landscape'
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-zinc-800 text-zinc-400'
                }`}
              >
                Paisagem (Horizontal)
              </button>
            </div>
          </div>

          {/* Finish Material Theme */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Acabamento do Chassi
            </label>
            <select
              value={finishColor}
              onChange={e => setFinishColor(e.target.value as MockupTheme)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="titanium_black">Titânio Preto (Black Titanium)</option>
              <option value="natural_titanium">Titânio Natural (Warm Gray)</option>
              <option value="silver">Prata Alumínio (Silver)</option>
              <option value="midnight">Midnight Blue (Escuro)</option>
            </select>
          </div>

          {/* Shadow Style */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Sombra & Flutuação
            </label>
            <select
              value={shadowStyle}
              onChange={e => setShadowStyle(e.target.value as ShadowStyle)}
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="floating_3d">Flutuante 3D (Com Profundidade)</option>
              <option value="soft">Sombra Suave</option>
              <option value="none">Sem Sombra (Plano)</option>
            </select>
          </div>

          {/* Media URL */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              URL da Imagem ou Vídeo da Tela
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={e => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Cor do Fundo do Canvas
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColorHex}
                onChange={e => setBackgroundColorHex(e.target.value)}
                className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColorHex}
                onChange={e => setBackgroundColorHex(e.target.value)}
                className="w-full px-2 py-1 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-300 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Presets Gallery Row */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Mockups Salvos na Carteira ({mockups.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockups.map(m => (
            <div
              key={m.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition cursor-pointer"
              onClick={() => handleSelectPreset(m)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{m.title}</h4>
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono text-[10px]">
                    {m.deviceType} • {m.orientation}
                  </span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteMockup(m.id);
                  }}
                  className="p-1 text-zinc-500 hover:text-red-400 rounded transition"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                <span>{m.finishColor.replace('_', ' ')}</span>
                <span className="text-purple-400 font-medium hover:underline">
                  Carregar Preset →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
