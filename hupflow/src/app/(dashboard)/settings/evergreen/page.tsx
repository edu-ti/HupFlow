'use client';

import React, { useEffect, useState } from 'react';
import {
  EvergreenCategory,
  EvergreenItem,
  EvergreenStats,
} from '@/lib/evergreen/types';
import { calculateEvergreenScore } from '@/lib/evergreen/evergreen-utils';
import { EvergreenVariationCard } from '@/components/evergreen/EvergreenVariationCard';
import {
  Repeat,
  Sparkles,
  Plus,
  Clock,
  Award,
  Layers,
} from 'lucide-react';

export default function EvergreenRecyclerPage() {
  const [items, setItems] = useState<EvergreenItem[]>([]);
  const [stats, setStats] = useState<EvergreenStats>({
    totalItems: 0,
    activeItems: 0,
    totalRecyclesExecuted: 0,
    averageEvergreenScore: 0,
    estimatedHoursSaved: 0,
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Evergreen Form State
  const [title, setTitle] = useState(
    'Guia Prático: Como Estruturar Carrosséis Técnicos no LinkedIn'
  );
  const [originalCaption, setOriginalCaption] = useState(
    '1. Abra com um problema real do seu ICP.\n2. Mostre o passo a passo sem jargões desnecessários.\n3. Feche com um checklist acionável para salvar.'
  );
  const [category, setCategory] = useState<EvergreenCategory>('educational');
  const [cooldownDays, setCooldownDays] = useState(30);
  const [maxRecycles, setMaxRecycles] = useState(12);

  const previewScore = calculateEvergreenScore(
    originalCaption,
    'carousel',
    5.0
  );

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const res = await fetch('/api/evergreen');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setStats(
          data.stats || {
            totalItems: 0,
            activeItems: 0,
            totalRecyclesExecuted: 0,
            averageEvergreenScore: 0,
            estimatedHoursSaved: 0,
          }
        );
      }
    } catch (err) {
      console.error('Erro ao carregar biblioteca Evergreen:', err);
    }
  }

  async function handleAddEvergreen() {
    if (!title.trim() || !originalCaption.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/evergreen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          originalCaption,
          category,
          cooldownDays,
          maxRecycles,
          channels: ['linkedin', 'instagram'],
          mediaType: 'carousel',
        }),
      });
      if (res.ok) {
        await loadItems();
        setFeedback(
          'Ativo perene adicionado com 3 variações de gancho geradas!'
        );
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error('Erro ao criar item Evergreen:', err);
    } finally {
      setSaving(false);
    }
  }

  async function handleRecycleItem(itemId: string, force: boolean) {
    try {
      const res = await fetch('/api/evergreen/recycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, force }),
      });
      const data = await res.json();
      if (res.ok) {
        await loadItems();
        setFeedback(
          `Ciclo reenfileirado com sucesso usando "${data.selectedVariation?.label || 'Variação Round-Robin'}"!`
        );
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch (err) {
      console.error('Erro ao reciclar item:', err);
    }
  }

  async function handleDeleteItem(itemId: string) {
    try {
      const res = await fetch(`/api/evergreen?id=${encodeURIComponent(itemId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadItems();
      }
    } catch (err) {
      console.error('Erro ao excluir item:', err);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5" />
              Feature 035 • Evergreen Content Recycler & Auto-Requeue
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Motor de Reciclagem Evergreen & Variações Round-Robin
          </h1>
          <p className="text-sm text-slate-400">
            Transforme seus melhores carrosséis e guias em ativos perpétuos com controle de Cooldown anti-saturação e rotação automática de ganchos.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {feedback}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Ativos Evergreen</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.activeItems}
            </p>
          </div>
          <Layers className="w-6 h-6 text-indigo-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Reciclagens Executadas</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">
              {stats.totalRecyclesExecuted}
            </p>
          </div>
          <Repeat className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Score Médio de Perenidade</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.averageEvergreenScore}/100
            </p>
          </div>
          <Award className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Horas Criativas Poupadas</p>
            <p className="text-2xl font-bold text-cyan-400 mt-0.5">
              {stats.estimatedHoursSaved}h
            </p>
          </div>
          <Clock className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Add to Evergreen Library */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Cadastrar Novo Ativo Perene
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Score Estimado: {previewScore}/100
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Título do Carrossel / Post Perene
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as EvergreenCategory)
                }
                className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="educational">Educativo</option>
                <option value="framework">Framework</option>
                <option value="case_study">Estudo de Caso</option>
                <option value="lead_magnet">Isca de Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Cooldown (Dias)
              </label>
              <input
                type="number"
                min={7}
                max={365}
                value={cooldownDays}
                onChange={(e) => setCooldownDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Máx. Ciclos
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxRecycles}
                onChange={(e) => setMaxRecycles(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Copy Base (Evite palavras como &quot;hoje&quot; ou &quot;ontem&quot;)
            </label>
            <textarea
              rows={4}
              value={originalCaption}
              onChange={(e) => setOriginalCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
            />
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleAddEvergreen}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {saving
              ? 'Gerando Variações...'
              : 'Gerar 3 Variações & Ativar Ciclo Evergreen'}
          </button>
        </div>

        {/* Right List: Evergreen Active Collection */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <EvergreenVariationCard
              key={item.id}
              item={item}
              onRecycle={handleRecycleItem}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
