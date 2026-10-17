'use client';

import React, { useState, useEffect } from 'react';
import {
  AgencyBrandProfile,
  AgencyPortfolioSummary,
  BrandTier,
  BrandStatus,
} from '@/lib/agency/types';
import { AgencyBrandSwitcherModal } from '@/components/agency/AgencyBrandSwitcherModal';
import {
  Building2,
  Share2,
  Calendar,
  Star,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Zap,
  CheckCircle,
  Sliders,
  Layers,
} from 'lucide-react';

export default function AgencyBrandsManagementPage() {
  const [brands, setBrands] = useState<AgencyBrandProfile[]>([]);
  const [summary, setSummary] = useState<AgencyPortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSwitcherModal, setShowSwitcherModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [brandName, setBrandName] = useState('');
  const [slug, setSlug] = useState('');
  const [niche, setNiche] = useState('E-commerce');
  const [colorHex, setColorHex] = useState('#6366f1');
  const [tier, setTier] = useState<BrandTier>('standard');
  const [monthlyPostQuota, setMonthlyPostQuota] = useState(60);
  const [tagsInput, setTagsInput] = useState('social, growth');

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());

      const res = await fetch(`/api/agency/brands?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBrands(data.brands || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error('Falha ao buscar marcas da agência:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [query]);

  // Global listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSwitcherModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/agency/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          slug: slug || brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          niche,
          colorHex,
          tier,
          monthlyPostQuota: Number(monthlyPostQuota) || 60,
          tags,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao cadastrar marca');
      }

      setBrandName('');
      setSlug('');
      setShowCreateModal(false);
      await fetchBrands();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao salvar marca');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const res = await fetch('/api/agency/brands', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_favorite' }),
      });
      if (res.ok) {
        await fetchBrands();
      }
    } catch (err) {
      console.error('Falha ao favoritar:', err);
    }
  };

  const handleSwitchTenant = async (brandId: string) => {
    try {
      const res = await fetch('/api/agency/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetBrandId: brandId }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Falha ao alternar:', err);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!confirm('Deseja realmente remover esta marca do painel da agência?')) return;
    try {
      const res = await fetch(`/api/agency/brands?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchBrands();
      }
    } catch (err) {
      console.error('Falha ao deletar:', err);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Agency Command Center
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Gestão de Marcas & Clientes da Agência
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Visão consolidada de todas as contas clientes atendidas. Alterne instantaneamente o contexto de publicação sem relogin ou configure novas marcas com identidade própria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSwitcherModal(true)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 flex items-center gap-2 transition"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Alternador Rápido</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-900 rounded text-zinc-400">
              Cmd+K
            </kbd>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Nova Marca Cliente
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Total de Marcas</span>
            <span className="text-2xl font-bold text-white mt-1 block">{summary.totalBrands}</span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Na Carteira</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Marcas Ativas</span>
            <span className="text-2xl font-bold text-emerald-400 mt-1 block">
              {summary.activeBrands}
            </span>
            <span className="text-[11px] text-emerald-500 mt-1 block">Em Operação</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Canais Sociais</span>
            <span className="text-2xl font-bold text-sky-400 mt-1 block">
              {summary.totalConnectedChannels}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Conectados</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Fila Agendada</span>
            <span className="text-2xl font-bold text-purple-400 mt-1 block">
              {summary.totalScheduledPosts}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Posts Programados</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Favoritas (Pinned)</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">
              {summary.favoriteBrandsCount}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">Acesso Rápido</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <span className="text-xs text-zinc-400 block font-medium">Ocupação da Cota</span>
            <span className="text-2xl font-bold text-indigo-400 mt-1 block">
              {summary.averageQuotaUtilizationPct}%
            </span>
            <span className="text-[11px] text-indigo-500 mt-1 block">Média da Carteira</span>
          </div>
        </div>
      )}

      {/* Search & Listing */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar por nome, nicho ou tag..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <span className="text-xs text-zinc-500">
            Mostrando {brands.length} clientes cadastrados
          </span>
        </div>

        {loading && brands.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
            <p className="text-xs">Carregando carteira de marcas...</p>
          </div>
        ) : brands.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-800 rounded-xl space-y-2">
            <Building2 className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-white">Nenhum cliente encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map(brand => (
              <div
                key={brand.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-zinc-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-sm"
                      style={{ backgroundColor: brand.colorHex }}
                    >
                      {brand.brandName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{brand.brandName}</h3>
                      <span className="text-xs text-zinc-400">{brand.niche}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(brand.id)}
                    className="p-1.5 text-zinc-500 hover:text-amber-400 transition"
                    title="Favoritar marca"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        brand.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-zinc-800/80">
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 block">Canais Sociais</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-sky-400" />
                      {brand.connectedChannelsCount} conectados
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-zinc-500 block">Fila Programada</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-400" />
                      {brand.scheduledPostsCount} posts
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                      brand.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : brand.status === 'onboarding'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                    }`}
                  >
                    {brand.status.toUpperCase()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSwitchTenant(brand.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 flex items-center gap-1.5 transition"
                    >
                      <Zap className="w-3 h-3 text-indigo-400" />
                      Assumir Workspace
                    </button>

                    <button
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg transition"
                      title="Excluir marca"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Switcher (Cmd+K) */}
      <AgencyBrandSwitcherModal
        isOpen={showSwitcherModal}
        onClose={() => setShowSwitcherModal(false)}
      />

      {/* Modal for Creating New Brand */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Cadastrar Marca Cliente
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Nome da Marca / Cliente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Studio Bella Estética"
                  value={brandName}
                  onChange={e => {
                    setBrandName(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Slug / Identificador
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Segmento / Nicho
                  </label>
                  <input
                    type="text"
                    required
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Cor Visual da Marca
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colorHex}
                      onChange={e => setColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colorHex}
                      onChange={e => setColorHex(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-zinc-950 border border-zinc-800 rounded text-zinc-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Nível / Plano
                  </label>
                  <select
                    value={tier}
                    onChange={e => setTier(e.target.value as BrandTier)}
                    className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise_vip">Enterprise VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Tags (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="moda, reels, tiktok"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Marca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
