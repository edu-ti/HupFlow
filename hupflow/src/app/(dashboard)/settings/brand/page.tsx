'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Palette,
  Plus,
  Trash2,
  Check,
  Star,
  Copy,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Type,
} from 'lucide-react';
import { BrandKit, BrandColors, BrandTypography, BrandKitPreset } from '@/lib/brand/types';
import { DEFAULT_BRAND_PRESETS } from '@/lib/brand/presets';
import { isValidHexColor } from '@/lib/brand/service';

const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Outfit',
  'Poppins',
  'Montserrat',
  'Space Grotesk',
  'Playfair Display',
  'Merriweather',
  'Plus Jakarta Sans',
];

export default function BrandKitsPage() {
  const [kits, setKits] = useState<BrandKit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados do Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKitId, setEditingKitId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formHandle, setFormHandle] = useState('@empresa');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [formColors, setFormColors] = useState<BrandColors>({
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#06B6D4',
    background: '#0B0F17',
    text: '#F8FAFC',
  });
  const [formTypography, setFormTypography] = useState<BrandTypography>({
    fontFamilyHeading: 'Inter',
    fontFamilyBody: 'Inter',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadKits = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/brand-kits');
      if (!res.ok) throw new Error('Falha ao carregar kits');
      const data = await res.json();
      setKits(data.brandKits || []);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar identidades', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKits();
  }, []);

  const openCreateModal = () => {
    setEditingKitId(null);
    setFormName('Nova Identidade Visual');
    setFormHandle('@suaempresa');
    setFormLogoUrl('');
    setFormIsDefault(kits.length === 0);
    setFormColors({
      primary: '#6366F1',
      secondary: '#818CF8',
      accent: '#06B6D4',
      background: '#0B0F17',
      text: '#F8FAFC',
    });
    setFormTypography({
      fontFamilyHeading: 'Inter',
      fontFamilyBody: 'Inter',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (kit: BrandKit) => {
    setEditingKitId(kit.id);
    setFormName(kit.name);
    setFormHandle(kit.handle || '');
    setFormLogoUrl(kit.logoUrl || '');
    setFormIsDefault(kit.isDefault);
    setFormColors({ ...kit.colors });
    setFormTypography({ ...kit.typography });
    setIsModalOpen(true);
  };

  const handleClonePreset = async (presetId: string) => {
    const preset = DEFAULT_BRAND_PRESETS.find((p: BrandKitPreset) => p.id === presetId);
    if (!preset) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/brand-kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${preset.name} (Cópia)`,
          colors: preset.colors,
          typography: preset.typography,
          handle: '@minhamarca',
          isDefault: kits.length === 0,
        }),
      });

      if (!res.ok) throw new Error('Falha ao clonar preset');
      showToast(`Preset "${preset.name}" clonado com sucesso!`);
      loadKits();
    } catch (err: any) {
      showToast(err.message || 'Erro ao clonar preset', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (kitId: string) => {
    try {
      const res = await fetch('/api/brand-kits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: kitId,
          isDefault: true,
        }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar kit');
      showToast('Kit de Marca padrão atualizado!');
      loadKits();
    } catch (err: any) {
      showToast(err.message || 'Erro ao definir padrão', 'error');
    }
  };

  const handleDelete = async (kitId: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o kit de marca "${name}"?`)) return;

    try {
      const res = await fetch(`/api/brand-kits?id=${encodeURIComponent(kitId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Falha ao excluir kit');
      showToast(`Kit "${name}" excluído.`);
      loadKits();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir kit', 'error');
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('O nome do kit é obrigatório', 'error');
      return;
    }

    // Validar cores hexadecimais
    for (const [key, val] of Object.entries(formColors)) {
      if (!isValidHexColor(val)) {
        showToast(`Cor "${key}" (${val}) não é um hexadecimal válido`, 'error');
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formName.trim(),
        colors: formColors,
        typography: formTypography,
        handle: formHandle.trim() || undefined,
        logoUrl: formLogoUrl.trim() || undefined,
        isDefault: formIsDefault,
      };

      let res: Response;
      if (editingKitId) {
        res = await fetch('/api/brand-kits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingKitId, ...payload }),
        });
      } else {
        res = await fetch('/api/brand-kits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erro ao salvar kit de marca');
      }

      showToast(editingKitId ? 'Identidade visual atualizada!' : 'Kit de Marca criado com sucesso!');
      setIsModalOpen(false);
      loadKits();
    } catch (err: any) {
      showToast(err.message || 'Erro na gravação do kit', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-fade-in text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header com Navegação e Ação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/settings" className="hover:text-slate-200 transition-colors">
              Configurações
            </Link>
            <span>/</span>
            <span className="text-slate-200">Identidade & Marca</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-indigo-400" />
            Kits de Marca & Identidade Visual
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Padronize cores corporativas, fontes e assinaturas para aplicação automática no Estúdio de Carrosséis e nos posts da organização.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Ver no Estúdio
          </Link>

          <button
            id="btn-create-brand-kit"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Novo Kit de Marca
          </button>
        </div>
      </div>

      {/* Seção 1: Kits Salvos da Organização */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <span>Kits da Organização</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {kits.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">Carregando kits de marca...</span>
          </div>
        ) : kits.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
            <Palette className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Nenhum Kit de Marca cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Crie o kit de identidade da sua empresa ou comece clonando um dos nossos presets corporativos abaixo.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Criar Primeiro Kit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kits.map((kit) => (
              <div
                key={kit.id}
                className={`relative rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  kit.isDefault
                    ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/20 via-slate-900/60 to-slate-900/80 ring-1 ring-indigo-500/30'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar do Card */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{kit.name}</h3>
                        {kit.isDefault && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                            <Star className="w-3 h-3 fill-indigo-400 text-indigo-400" />
                            Padrão
                          </span>
                        )}
                      </div>
                      {kit.handle && (
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{kit.handle}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(kit)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors"
                        title="Editar Kit"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(kit.id, kit.name)}
                        className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Excluir Kit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amostras de Cores */}
                  <div className="space-y-2 mt-4">
                    <span className="text-[11px] font-medium text-slate-400 block">Paleta de Cores</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg border border-white/10 shadow-inner"
                          style={{ backgroundColor: kit.colors.primary }}
                          title={`Primária: ${kit.colors.primary}`}
                        />
                        <span className="text-[9px] font-mono text-slate-400 truncate block">Prim</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg border border-white/10 shadow-inner"
                          style={{ backgroundColor: kit.colors.secondary }}
                          title={`Secundária: ${kit.colors.secondary}`}
                        />
                        <span className="text-[9px] font-mono text-slate-400 truncate block">Sec</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg border border-white/10 shadow-inner"
                          style={{ backgroundColor: kit.colors.accent }}
                          title={`Acento: ${kit.colors.accent}`}
                        />
                        <span className="text-[9px] font-mono text-slate-400 truncate block">Acen</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg border border-white/10 shadow-inner"
                          style={{ backgroundColor: kit.colors.background }}
                          title={`Fundo: ${kit.colors.background}`}
                        />
                        <span className="text-[9px] font-mono text-slate-400 truncate block">Fund</span>
                      </div>
                      <div className="space-y-1 text-center">
                        <div
                          className="h-8 rounded-lg border border-white/10 shadow-inner"
                          style={{ backgroundColor: kit.colors.text }}
                          title={`Texto: ${kit.colors.text}`}
                        />
                        <span className="text-[9px] font-mono text-slate-400 truncate block">Text</span>
                      </div>
                    </div>
                  </div>

                  {/* Tipografia */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-slate-500" />
                      <span>{kit.typography.fontFamilyHeading} / {kit.typography.fontFamilyBody}</span>
                    </div>
                  </div>
                </div>

                {/* Ações Inferiores */}
                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  {!kit.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(kit.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                      Tornar Padrão
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Ativo como Padrão
                    </span>
                  )}

                  <Link
                    href="/studio"
                    className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <span>Usar no Estúdio</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção 2: Presets Corporativos Prontos */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Presets Corporativos de Fábrica
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Paletas e tipografias criadas por designers para alta conversão e legibilidade em carrosséis e posts sociais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_BRAND_PRESETS.map((preset: BrandKitPreset) => (
            <div
              key={preset.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-white">{preset.name}</h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Preset
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{preset.description}</p>

                {/* Cores do Preset */}
                <div className="grid grid-cols-5 gap-1.5 mb-4">
                  <div
                    className="h-8 rounded-lg border border-white/10"
                    style={{ backgroundColor: preset.colors.primary }}
                    title={`Primária: ${preset.colors.primary}`}
                  />
                  <div
                    className="h-8 rounded-lg border border-white/10"
                    style={{ backgroundColor: preset.colors.secondary }}
                    title={`Secundária: ${preset.colors.secondary}`}
                  />
                  <div
                    className="h-8 rounded-lg border border-white/10"
                    style={{ backgroundColor: preset.colors.accent }}
                    title={`Acento: ${preset.colors.accent}`}
                  />
                  <div
                    className="h-8 rounded-lg border border-white/10"
                    style={{ backgroundColor: preset.colors.background }}
                    title={`Fundo: ${preset.colors.background}`}
                  />
                  <div
                    className="h-8 rounded-lg border border-white/10"
                    style={{ backgroundColor: preset.colors.text }}
                    title={`Texto: ${preset.colors.text}`}
                  />
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-slate-500" />
                  <span>{preset.typography.fontFamilyHeading} + {preset.typography.fontFamilyBody}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleClonePreset(preset.id)}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-all hover:scale-[1.01]"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  Clonar como meu Brand Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6 my-8 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {editingKitId ? 'Editar Kit de Marca' : 'Novo Kit de Marca'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-5">
              {/* Nome e Handle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Nome da Marca / Identidade <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: HupFlow Principal, Linha B2B..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Identificador Social (@handle)
                  </label>
                  <input
                    type="text"
                    value={formHandle}
                    onChange={(e) => setFormHandle(e.target.value)}
                    placeholder="@seuperfil"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  URL do Logotipo (Opcional)
                </label>
                <input
                  type="url"
                  value={formLogoUrl}
                  onChange={(e) => setFormLogoUrl(e.target.value)}
                  placeholder="https://suaempresa.com/logo.png"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Seletor de Cores */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-300 block">
                  Paleta de Cores Corporativa (Hexadecimal)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Primária */}
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <label className="text-[11px] text-slate-400 block mb-1">Primária</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColors.primary}
                        onChange={(e) => setFormColors({ ...formColors, primary: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formColors.primary}
                        onChange={(e) => setFormColors({ ...formColors, primary: e.target.value })}
                        className="w-20 px-1.5 py-1 text-xs font-mono rounded bg-slate-950 border border-slate-700 text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Secundária */}
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <label className="text-[11px] text-slate-400 block mb-1">Secundária</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColors.secondary}
                        onChange={(e) => setFormColors({ ...formColors, secondary: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formColors.secondary}
                        onChange={(e) => setFormColors({ ...formColors, secondary: e.target.value })}
                        className="w-20 px-1.5 py-1 text-xs font-mono rounded bg-slate-950 border border-slate-700 text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Acento */}
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <label className="text-[11px] text-slate-400 block mb-1">Acento</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColors.accent}
                        onChange={(e) => setFormColors({ ...formColors, accent: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formColors.accent}
                        onChange={(e) => setFormColors({ ...formColors, accent: e.target.value })}
                        className="w-20 px-1.5 py-1 text-xs font-mono rounded bg-slate-950 border border-slate-700 text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Fundo */}
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <label className="text-[11px] text-slate-400 block mb-1">Fundo Slide</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColors.background}
                        onChange={(e) => setFormColors({ ...formColors, background: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formColors.background}
                        onChange={(e) => setFormColors({ ...formColors, background: e.target.value })}
                        className="w-20 px-1.5 py-1 text-xs font-mono rounded bg-slate-950 border border-slate-700 text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Texto */}
                  <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
                    <label className="text-[11px] text-slate-400 block mb-1">Texto Principal</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColors.text}
                        onChange={(e) => setFormColors({ ...formColors, text: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formColors.text}
                        onChange={(e) => setFormColors({ ...formColors, text: e.target.value })}
                        className="w-20 px-1.5 py-1 text-xs font-mono rounded bg-slate-950 border border-slate-700 text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipografia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Fonte dos Títulos (Heading)
                  </label>
                  <select
                    value={formTypography.fontFamilyHeading}
                    onChange={(e) =>
                      setFormTypography({ ...formTypography, fontFamilyHeading: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Fonte do Corpo (Body)
                  </label>
                  <select
                    value={formTypography.fontFamilyBody}
                    onChange={(e) =>
                      setFormTypography({ ...formTypography, fontFamilyBody: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkbox Tornar Padrão */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="check-default-kit"
                  checked={formIsDefault}
                  onChange={(e) => setFormIsDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-700 bg-slate-900 focus:ring-indigo-500"
                />
                <label htmlFor="check-default-kit" className="text-xs text-slate-300 cursor-pointer">
                  Definir este kit como padrão para todo o workspace da organização
                </label>
              </div>

              {/* Footer do Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Salvar Kit de Marca</span>
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
