'use client';

import React, { useEffect, useState } from 'react';
import {
  CommerceProductCategory,
  CommerceSocialChannel,
  SocialCommerceCatalogSummary,
  SocialCommerceProductItem,
} from '@/lib/commerce/types';
import { SocialProductCard } from '@/components/commerce/SocialProductCard';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  PackageCheck,
} from 'lucide-react';

export default function SocialCommerceCatalogPage() {
  const [products, setProducts] = useState<SocialCommerceProductItem[]>([]);
  const [summary, setSummary] =
    useState<SocialCommerceCatalogSummary | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // New product form state
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] =
    useState<CommerceProductCategory>('saas_plan');
  const [channel, setChannel] = useState<CommerceSocialChannel>('instagram');
  const [priceBrl, setPriceBrl] = useState('497');
  const [checkoutUrl, setCheckoutUrl] = useState(
    'https://hupflow.app/checkout/oferta?utm_medium=social_tag'
  );
  const [submitting, setSubmitting] = useState(false);

  async function loadCatalog(selectedCategory = categoryFilter) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/commerce?category=${encodeURIComponent(selectedCategory)}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
        setSummary(data.summary || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog(categoryFilter);
  }, [categoryFilter]);

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !checkoutUrl.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/commerce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: sku.trim() || undefined,
          name,
          category,
          channel,
          priceBrl: Number(priceBrl),
          checkoutUrl,
        }),
      });
      if (res.ok) {
        setSku('');
        setName('');
        await loadCatalog(categoryFilter);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(
    productId: string,
    action: 'simulate_order' | 'delete'
  ) {
    setBusyId(productId);
    try {
      await fetch('/api/commerce/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action }),
      });
      await loadCatalog(categoryFilter);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Feature 041 • Catálogo Social Commerce, Tags & RPM Social</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Catálogo Social Commerce & Atribuição de Receita
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Vincule tags de produtos e ofertas a Reels, Carrosséis e Posts, meça o RPM Social (Receita por 1k Impressões) e gere legendas Shoppable.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'saas_plan', label: 'Planos SaaS' },
              { id: 'digital_course', label: 'Infoprodutos' },
              { id: 'consulting_service', label: 'Consultoria' },
              { id: 'physical_product', label: 'Físicos' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/35 to-slate-900/80">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
              <span>Receita Social Atribuída</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              R$ {summary.totalRevenueBrl.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Vendas diretas via Tags & Links Sociais
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
              <span>RPM Social Médio</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              R$ {summary.avgSocialRpmBrl}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Receita gerada a cada 1.000 impressões
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-indigo-500/30 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold">
              <span>Conversão Média Checkout</span>
              <Percent className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.avgCheckoutConversionPct}%
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Cliques na tag convertidos em pedidos
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0B0F17]/90">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Total de Pedidos Pagos</span>
              <PackageCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white mt-2">
              {summary.totalOrders}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Em {summary.totalProducts} ofertas ativas no catálogo
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Products List + Add Product Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white">
            Ofertas & Produtos Compráveis ({products.length})
          </h2>

          {loading ? (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Calculando atribuição de receita, EPC e RPM Social...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {products.map((p) => (
                <SocialProductCard
                  key={p.id}
                  product={p}
                  onSimulateOrder={(id) => handleAction(id, 'simulate_order')}
                  onDelete={(id) => handleAction(id, 'delete')}
                  busy={busyId === p.id}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center text-sm text-slate-400">
              Nenhum produto encontrado para esta categoria.
            </div>
          )}
        </div>

        {/* Add Product Form */}
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-6 h-fit space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">
              Nova Oferta / Produto Shoppable
            </h2>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-3.5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Nome Comercial da Oferta
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mentoria Escala B2B com IA"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Código SKU
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="MENTORIA-B2B"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white uppercase"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  value={priceBrl}
                  onChange={(e) => setPriceBrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as CommerceProductCategory)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                >
                  <option value="saas_plan">Assinatura SaaS</option>
                  <option value="digital_course">Infoproduto / Pack</option>
                  <option value="consulting_service">Consultoria</option>
                  <option value="physical_product">Produto Físico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Canal Principal
                </label>
                <select
                  value={channel}
                  onChange={(e) =>
                    setChannel(e.target.value as CommerceSocialChannel)
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
                >
                  <option value="instagram">Instagram Shop</option>
                  <option value="tiktok">TikTok Shop</option>
                  <option value="linkedin">LinkedIn B2B</option>
                  <option value="youtube">YouTube Shopping</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                URL de Checkout / Página de Vendas
              </label>
              <input
                type="url"
                required
                value={checkoutUrl}
                onChange={(e) => setCheckoutUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {submitting
                ? 'Criando Tag Shoppable...'
                : 'Cadastrar Produto & Gerar Copy IA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
