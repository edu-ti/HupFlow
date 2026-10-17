'use client';

import React, { useState } from 'react';
import { SocialCommerceProductItem } from '@/lib/commerce/types';
import {
  ShoppingBag,
  Copy,
  Check,
  PlusCircle,
  Trash2,
  Tag,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface SocialProductCardProps {
  product: SocialCommerceProductItem;
  onSimulateOrder: (id: string) => void;
  onDelete: (id: string) => void;
  busy?: boolean;
}

const CATEGORY_LABELS: Record<SocialCommerceProductItem['category'], string> = {
  saas_plan: 'Assinatura SaaS',
  digital_course: 'Infoproduto / Pack',
  physical_product: 'Produto Físico',
  consulting_service: 'Consultoria High-Ticket',
};

const TIER_BADGES: Record<
  SocialCommerceProductItem['metrics']['velocityTier'],
  { label: string; className: string }
> = {
  bestseller: {
    label: 'Best-Seller Social',
    className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  high_margin: {
    label: 'Alta Margem / RPM',
    className: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/35',
  },
  steady: {
    label: 'Conversão Estável',
    className: 'bg-amber-500/20 text-amber-300 border-amber-500/35',
  },
  needs_optimization: {
    label: 'Otimizar CTA',
    className: 'bg-slate-800 text-slate-300 border-slate-700',
  },
};

export function SocialProductCard({
  product,
  onSimulateOrder,
  onDelete,
  busy = false,
}: SocialProductCardProps) {
  const [copied, setCopied] = useState(false);
  const tierBadge = TIER_BADGES[product.metrics.velocityTier];

  function handleCopyShoppable() {
    navigator.clipboard?.writeText(product.shoppableCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-[#0B0F17]/95 p-5 space-y-4 hover:border-indigo-500/40 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-white">{product.name}</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
              {product.sku}
            </span>
            <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {product.channel}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {CATEGORY_LABELS[product.category]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
              <Tag className="w-3 h-3" />
              Ticket: R$ {product.priceBrl.toLocaleString('pt-BR')}
            </span>
            <span>• {product.taggedPostsCount} posts marcados</span>
            <span>
              • {product.taggedImpressions.toLocaleString('pt-BR')} impressões
            </span>
          </div>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${tierBadge.className}`}
        >
          {tierBadge.label}
        </span>
      </div>

      {/* Financial Attribution Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            Receita Atribuída
          </span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
            R$ {product.metrics.totalRevenueBrl.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            Pedidos / Cliques
          </span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            {product.ordersCount} / {product.productClicks.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            Conv. Checkout / EPC
          </span>
          <span className="text-sm font-bold text-indigo-300 mt-0.5 block">
            {product.metrics.checkoutConversionPct}% • R$ {product.metrics.epcBrl}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <span className="text-[11px] text-slate-400 block">
            RPM Social (1k views)
          </span>
          <span className="text-sm font-bold text-amber-300 mt-0.5 block">
            R$ {product.metrics.socialRpmBrl}
          </span>
        </div>
      </div>

      {/* Shoppable Copy Box */}
      <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-950/15 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Legenda Shoppable IA + Tag de Checkout
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            Pronto para o Compositor
          </span>
        </div>
        <p className="text-xs text-slate-300 italic">{product.shoppableCopy}</p>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopyShoppable}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Legenda Shoppable Copiada!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar Legenda Shoppable
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onSimulateOrder(product.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Simular +3 Vendas Sociais
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(product.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all disabled:opacity-50"
            title="Remover Produto"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
