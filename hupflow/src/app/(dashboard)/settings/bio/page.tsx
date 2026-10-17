'use client';

import React, { useState, useEffect } from 'react';
import {
  BioLink,
  BioProfile,
  BioStats,
  BioThemePreset,
} from '@/lib/bio/types';
import { BioPhonePreview } from '@/components/bio/BioPhonePreview';
import {
  Smartphone,
  Copy,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  BarChart3,
  Palette,
  User,
  Share2,
  Check,
  AlertCircle,
  Eye,
  MousePointer,
} from 'lucide-react';

export default function BioSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'theme' | 'analytics'>('links');

  const [profile, setProfile] = useState<BioProfile>({
    id: '',
    workspaceId: '',
    handle: 'minhamarca',
    title: 'Minha Marca Oficial',
    bio: 'Carrosséis de alta performance e dicas diárias.',
    avatarUrl: '',
    theme: 'midnight',
    socialLinks: {
      instagram: 'hupflow',
      linkedin: 'hupflow-app',
      website: 'https://hupflow.com',
    },
    showPostsShowcase: true,
    isPublished: true,
    totalViews: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  const [links, setLinks] = useState<BioLink[]>([]);
  const [stats, setStats] = useState<BioStats>({
    totalViews: 0,
    totalClicks: 0,
    ctr: 0,
  });

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bio');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (data.links) setLinks(data.links);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Erro ao carregar bio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSavedSuccess(false);

      const res = await fetch('/api/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          links,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao salvar perfil de bio');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      fetchBioData();
    } catch (err: any) {
      alert(err.message || 'Falha ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyPublicUrl = () => {
    const fullUrl = `${window.location.origin}/bio/${profile.handle}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addLink = () => {
    const newLink: BioLink = {
      id: `temp_${Date.now()}`,
      profileId: profile.id,
      title: 'Novo Link Importante',
      subtitle: 'Clique para saber mais',
      url: 'https://hupflow.com',
      icon: 'Globe',
      isFeatured: false,
      isActive: true,
      sortOrder: links.length,
      clickCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (index: number, updates: Partial<BioLink>) => {
    const copy = [...links];
    copy[index] = { ...copy[index], ...updates };
    setLinks(copy);
  };

  const removeLink = (index: number) => {
    const copy = links.filter((_, i) => i !== index);
    setLinks(copy);
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === links.length - 1) return;

    const copy = [...links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Atualiza sortOrder
    copy.forEach((l, i) => {
      l.sortOrder = i;
    });

    setLinks(copy);
  };

  const themes: Array<{ id: BioThemePreset; name: string; preview: string }> = [
    { id: 'midnight', name: 'Midnight Dark', preview: 'bg-zinc-950 border-zinc-800' },
    { id: 'minimal_light', name: 'Minimal White', preview: 'bg-white border-zinc-300' },
    { id: 'sunset_gradient', name: 'Sunset Gradient', preview: 'bg-gradient-to-r from-amber-500 to-rose-600' },
    { id: 'ocean_breeze', name: 'Ocean Breeze', preview: 'bg-gradient-to-r from-cyan-500 to-blue-700' },
    { id: 'emerald_luxe', name: 'Emerald Luxe', preview: 'bg-gradient-to-b from-emerald-950 to-black' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Smart Link na Bio & Vitrine
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Página Pública
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
            <span>Link do seu perfil:</span>
            <code className="px-2 py-1 rounded bg-zinc-950 font-mono text-xs text-violet-300 border border-zinc-800">
              /bio/{profile.handle}
            </code>
            <button
              onClick={handleCopyPublicUrl}
              className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition-colors ml-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <a
              href={`/bio/${profile.handle}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors ml-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-all shadow-lg shadow-violet-600/20 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Salvando...' : savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Grid Principal: Editor (Esquerda) vs Live Preview (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna Esquerda: Abas e Controles */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navegação de Abas */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'links'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Links & Botões ({links.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Perfil & Redes
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'theme'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Temas & Vitrine
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Métricas
            </button>
          </div>

          {/* Conteúdo da Aba Links */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-200">
                  Botões de Acesso Rápido
                </h3>
                <button
                  onClick={addLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar Link
                </button>
              </div>

              {links.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center">
                  <p className="text-sm text-zinc-400">Nenhum botão cadastrado ainda.</p>
                  <button
                    onClick={addLink}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Criar Primeiro Botão
                  </button>
                </div>
              ) : (
                links.map((link, idx) => (
                  <div
                    key={link.id || idx}
                    className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveLink(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveLink(idx, 'down')}
                          disabled={idx === links.length - 1}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono text-zinc-500 ml-1">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.isFeatured}
                            onChange={(e) =>
                              updateLink(idx, { isFeatured: e.target.checked })
                            }
                            className="rounded border-zinc-700 text-violet-600 focus:ring-violet-500"
                          />
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Destaque
                        </label>

                        <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={link.isActive}
                            onChange={(e) =>
                              updateLink(idx, { isActive: e.target.checked })
                            }
                            className="rounded border-zinc-700 text-violet-600 focus:ring-violet-500"
                          />
                          Ativo
                        </label>

                        <button
                          onClick={() => removeLink(idx)}
                          className="p-1 rounded hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                          Título do Botão
                        </label>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateLink(idx, { title: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 mb-1">
                          Subtítulo (Opcional)
                        </label>
                        <input
                          type="text"
                          value={link.subtitle || ''}
                          onChange={(e) => updateLink(idx, { subtitle: e.target.value })}
                          placeholder="Ex: Últimas vagas com 50% OFF"
                          className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">
                        URL de Destino
                      </label>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(idx, { url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500 font-mono"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Conteúdo da Aba Perfil */}
          {activeTab === 'profile' && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-200">
                Informações da Página
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Handle Personalizado (/bio/seu-nome)
                  </label>
                  <input
                    type="text"
                    value={profile.handle}
                    onChange={(e) =>
                      setProfile({ ...profile, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">
                    Título / Nome de Exibição
                  </label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Biografia / Tagline Curta
                </label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  URL da Foto de Perfil / Avatar (Opcional)
                </label>
                <input
                  type="url"
                  value={profile.avatarUrl || ''}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300">
                  Links de Redes Sociais no Topo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Instagram (@usuario)
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks?.instagram || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      LinkedIn (in/usuario)
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      X / Twitter (@usuario)
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, twitter: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      WhatsApp (DDI + DDD + Número)
                    </label>
                    <input
                      type="text"
                      value={profile.socialLinks?.whatsapp || ''}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socialLinks: { ...profile.socialLinks, whatsapp: e.target.value },
                        })
                      }
                      placeholder="Ex: 5511999999999"
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conteúdo da Aba Temas */}
          {activeTab === 'theme' && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
              <h3 className="text-sm font-semibold text-zinc-200">
                Aparência & Estilos
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setProfile({ ...profile, theme: t.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      profile.theme === t.id
                        ? 'border-violet-500 ring-2 ring-violet-500/30'
                        : 'border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-full h-12 rounded-lg mb-2 border ${t.preview}`} />
                    <span className="text-xs font-medium text-zinc-200">
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.showPostsShowcase}
                    onChange={(e) =>
                      setProfile({ ...profile, showPostsShowcase: e.target.checked })
                    }
                    className="rounded border-zinc-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-medium text-zinc-200">
                      Exibir Vitrine de Carrosséis & Posts Recentes
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Mostra mini-cards dos últimos carrosséis publicados pelo HupFlow na página de bio.
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isPublished}
                    onChange={(e) =>
                      setProfile({ ...profile, isPublished: e.target.checked })
                    }
                    className="rounded border-zinc-700 text-violet-600 focus:ring-violet-500"
                  />
                  <div>
                    <span className="text-xs font-medium text-zinc-200">
                      Página de Bio Publicada
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Se desmarcado, visitantes externos verão uma página de manutenção.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Conteúdo da Aba Métricas */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Visualizações</span>
                  </div>
                  <div className="text-xl font-bold text-zinc-100">
                    {stats.totalViews}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                    <MousePointer className="w-3.5 h-3.5 text-violet-400" />
                    <span>Total de Cliques</span>
                  </div>
                  <div className="text-xl font-bold text-zinc-100">
                    {stats.totalClicks}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Taxa de CTR</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-400">
                    {stats.ctr}%
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-xs font-semibold text-zinc-300 mb-3">
                  Desempenho por Botão
                </h4>
                <div className="space-y-2">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs"
                    >
                      <div className="truncate max-w-[280px]">
                        <span className="font-medium text-zinc-200">
                          {link.title}
                        </span>
                        <div className="text-[10px] text-zinc-500 truncate font-mono">
                          {link.url}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-violet-400">
                          {link.clickCount} cliques
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Live Mobile Preview Sticky */}
        <div className="lg:col-span-5 sticky top-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-xs font-medium text-zinc-400">
            <Smartphone className="w-4 h-4 text-violet-400" />
            <span>Simulador em Tempo Real</span>
          </div>

          <BioPhonePreview
            profile={profile}
            links={links}
            recentPosts={[
              {
                id: '1',
                title: 'Guia de Carrosséis para LinkedIn',
                coverUrl:
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                publishedAt: Date.now(),
                channels: ['linkedin', 'instagram'],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
