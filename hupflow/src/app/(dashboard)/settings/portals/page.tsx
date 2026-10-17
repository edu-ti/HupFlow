'use client';

import React, { useEffect, useState } from 'react';
import {
  ClientPortal,
  PortalDeliverable,
  PortalSocialChannel,
  PortalStats,
} from '@/lib/portals/types';
import { ClientPortalPreview } from '@/components/portals/ClientPortalPreview';
import {
  Building2,
  Copy,
  Check,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function ClientPortalsSettingsPage() {
  const [portals, setPortals] = useState<ClientPortal[]>([]);
  const [stats, setStats] = useState<PortalStats>({
    totalPortals: 0,
    totalDeliverables: 0,
    approvedCount: 0,
    pendingCount: 0,
    changesRequestedCount: 0,
    approvalRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Active portal form state
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [clientName, setClientName] = useState('Vortex Enterprise Tech');
  const [projectTitle, setProjectTitle] = useState(
    'Sprint Outubro — LinkedIn, Reels & X'
  );
  const [token, setToken] = useState('ptl_vortex2026demo8842a1b2c3');
  const [brandColor, setBrandColor] = useState('#6366F1');
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Olá equipe! Confira abaixo os carrosséis e vídeos da semana para aprovação em 1 clique.'
  );
  const [accessPin, setAccessPin] = useState('');
  const [hideHupflowBranding, setHideHupflowBranding] = useState(false);
  const [deliverables, setDeliverables] = useState<PortalDeliverable[]>([]);

  useEffect(() => {
    loadPortals();
  }, []);

  async function loadPortals() {
    setLoading(true);
    try {
      const res = await fetch('/api/portals');
      if (res.ok) {
        const data = await res.json();
        setPortals(data.portals || []);
        setStats(
          data.stats || {
            totalPortals: 0,
            totalDeliverables: 0,
            approvedCount: 0,
            pendingCount: 0,
            changesRequestedCount: 0,
            approvalRate: 0,
          }
        );
        if (data.portals && data.portals.length > 0) {
          selectPortal(data.portals[0]);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar portais:', err);
    } finally {
      setLoading(false);
    }
  }

  function selectPortal(p: ClientPortal) {
    setActiveId(p.id);
    setClientName(p.clientName);
    setProjectTitle(p.projectTitle);
    setToken(p.token);
    setBrandColor(p.brandColor || '#6366F1');
    setWelcomeMessage(p.welcomeMessage || '');
    setAccessPin(p.accessPin || '');
    setHideHupflowBranding(Boolean(p.hideHupflowBranding));
    setDeliverables(p.deliverables || []);
  }

  async function handleSavePortal(regenerateToken = false) {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeId,
          clientName,
          projectTitle,
          brandColor,
          welcomeMessage,
          accessPin: accessPin.trim() || null,
          hideHupflowBranding,
          regenerateToken,
          deliverables,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || 'Erro ao salvar portal');
        return;
      }
      if (data.portal) {
        selectPortal(data.portal);
      }
      await loadPortals();
      setFeedback(
        regenerateToken
          ? 'Novo link mágico gerado e portal atualizado!'
          : 'Portal White-Label salvo com sucesso!'
      );
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Erro ao salvar portal:', err);
    } finally {
      setSaving(false);
    }
  }

  function handleAddDeliverable() {
    const newItem: PortalDeliverable = {
      id: `deliv_${Date.now()}`,
      title: 'Novo Carrossel / Post para Aprovação',
      caption:
        'Escreva aqui a copy da publicação que o cliente deverá revisar e aprovar...',
      channel: 'linkedin',
      scheduledDate: new Date(Date.now() + 86400_000 * 2)
        .toISOString()
        .slice(0, 10),
      mediaType: 'carousel',
      slideCount: 6,
      status: 'pending_review',
    };
    setDeliverables((prev) => [newItem, ...prev]);
  }

  function handleUpdateDeliverable(
    id: string,
    field: keyof PortalDeliverable,
    value: any
  ) {
    setDeliverables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  function handleRemoveDeliverable(id: string) {
    setDeliverables((prev) => prev.filter((d) => d.id !== id));
  }

  function handleSimulateDecision(
    deliverableId: string,
    decision: 'approved' | 'changes_requested'
  ) {
    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === deliverableId
          ? {
              ...d,
              status: decision,
              reviewedBy: `${clientName} (Simulação)`,
              reviewedAt: Date.now(),
              feedbackNote:
                decision === 'approved'
                  ? 'Aprovado em 1 clique pelo cliente!'
                  : 'Por favor ajustar o título do slide de capa.',
            }
          : d
      )
    );
  }

  async function handleCopyMagicLink() {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://hupflow.com';
    const url = `${origin}/portal/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Feature 033 • White-Label Agency Portals
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Portais White-Label de Clientes & Aprovação Magic-Link
          </h1>
          <p className="text-sm text-slate-400">
            Compartilhe um link exclusivo (`/portal/[token]`) com a cor e marca do seu cliente para aprovação de carrosséis e Reels sem exigir login.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyMagicLink}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            {copiedToken ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
            )}
            {copiedToken ? 'Link Copiado!' : 'Copiar Magic-Link'}
          </button>

          <a
            href={`/portal/${token}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            Abrir Portal Público
          </a>

          <button
            type="button"
            onClick={() => handleSavePortal(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Salvando...' : 'Salvar Portal'}
          </button>
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
            <p className="text-xs text-slate-400">Portais Ativos</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.totalPortals}
            </p>
          </div>
          <Building2 className="w-6 h-6 text-indigo-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Entregas Aprovadas</p>
            <p className="text-2xl font-bold text-emerald-400 mt-0.5">
              {stats.approvedCount}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Aguardando Cliente</p>
            <p className="text-2xl font-bold text-amber-300 mt-0.5">
              {stats.pendingCount}
            </p>
          </div>
          <Clock className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Taxa de Aprovação</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              {stats.approvalRate}%
            </p>
          </div>
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Branding & Deliverables Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. White-Label Configuration */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">
                1. Identidade White-Label & Segurança Magic-Link
              </h2>
              <button
                type="button"
                onClick={() => handleSavePortal(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Rotacionar Token
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Nome do Cliente / Marca
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Título da Sprint / Cronograma
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Cor Primária da Marca (Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  PIN de Acesso (Opcional, 4-6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={accessPin}
                  onChange={(e) => setAccessPin(e.target.value)}
                  placeholder="Sem PIN (Acesso direto)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={hideHupflowBranding}
                    onChange={(e) => setHideHupflowBranding(e.target.checked)}
                    className="rounded accent-indigo-500"
                  />
                  <span>Ocultar selo HupFlow (Agency)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Mensagem de Boas-Vindas para o Cliente
              </label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
              />
            </div>
          </div>

          {/* 2. Deliverables Queue */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">
                  2. Peças e Entregas Submetidas ao Cliente ({deliverables.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Adicione carrosséis ou posts para o cliente aprovar no link externo.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDeliverable}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova Entrega
              </button>
            </div>

            <div className="space-y-3">
              {deliverables.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                    <div className="sm:col-span-6">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleUpdateDeliverable(
                            item.id,
                            'title',
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white"
                        placeholder="Título da peça..."
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={item.channel}
                        onChange={(e) =>
                          handleUpdateDeliverable(
                            item.id,
                            'channel',
                            e.target.value as PortalSocialChannel
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                      >
                        <option value="linkedin">LinkedIn</option>
                        <option value="instagram">Instagram</option>
                        <option value="x">X / Twitter</option>
                        <option value="threads">Threads</option>
                        <option value="tiktok">TikTok</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateDeliverable(
                            item.id,
                            'status',
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                      >
                        <option value="pending_review">Pendente</option>
                        <option value="approved">Aprovado</option>
                        <option value="changes_requested">Ajuste</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={item.caption}
                    onChange={(e) =>
                      handleUpdateDeliverable(item.id, 'caption', e.target.value)
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                    placeholder="Legenda / copy completa da publicação..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live White-Label Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ClientPortalPreview
            clientName={clientName}
            projectTitle={projectTitle}
            brandColor={brandColor}
            welcomeMessage={welcomeMessage}
            accessPin={accessPin}
            hideHupflowBranding={hideHupflowBranding}
            deliverables={deliverables}
            onSimulateDecision={handleSimulateDecision}
          />
        </div>
      </div>
    </div>
  );
}
