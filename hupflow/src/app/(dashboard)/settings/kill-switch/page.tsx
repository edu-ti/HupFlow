'use client';

import React, { useState, useEffect } from 'react';
import {
  BrandSafetyConfig,
  CrisisIncidentLog,
  summarizeBrandSafetyHealth,
} from '@/lib/brandsafety/types';
import { CrisisIncidentCard } from '@/components/brandsafety/CrisisIncidentCard';
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function KillSwitchPage() {
  const [config, setConfig] = useState<BrandSafetyConfig | null>(null);
  const [incidents, setIncidents] = useState<CrisisIncidentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal / Form state para Ativação
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activateReason, setActivateReason] = useState('');
  const [confirmationInput, setConfirmationInput] = useState('');

  // Form state para Retomada / Desativação
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeReason, setResumeReason] = useState('');
  const [expiredStrategy, setExpiredStrategy] = useState<'hold_for_review' | 'reschedule_next_day' | 'discard'>('hold_for_review');

  const fetchBrandSafetyData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/brand-safety');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setIncidents(data.recentIncidents || []);
      }
    } catch {
      // Falha silenciosa
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandSafetyData();
  }, []);

  const handleActivateKillSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationInput.trim().toUpperCase() !== 'CONFIRMAR PAUSA') {
      setErrorMsg('Digite exatamente "CONFIRMAR PAUSA" para prosseguir.');
      return;
    }
    if (!activateReason.trim()) {
      setErrorMsg('Informe o motivo ou contexto do incidente de crise.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/brand-safety/kill-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate',
          reason: activateReason,
          confirmationText: confirmationInput,
          scope: 'global',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao acionar Kill Switch.');
      }

      setSuccessMsg(data.message);
      setShowActivateModal(false);
      setActivateReason('');
      setConfirmationInput('');
      fetchBrandSafetyData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado ao ativar Kill Switch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivateKillSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeReason.trim()) {
      setErrorMsg('Informe a justificativa para desativar a pausa e retomar operações.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/brand-safety/kill-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deactivate',
          reason: resumeReason,
          expiredPostStrategy: expiredStrategy,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao desativar Kill Switch.');
      }

      setSuccessMsg(data.message);
      setShowResumeModal(false);
      setResumeReason('');
      fetchBrandSafetyData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado ao desativar Kill Switch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const health = config ? summarizeBrandSafetyHealth(config) : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-zinc-100">Kill Switch & Brand Safety</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Mecanismo de proteção institucional com interrupção instantânea em 1 clique de toda a fila de posts em caso de crise de imagem.
          </p>
        </div>

        {config && (
          <div>
            {config.isEmergencyPaused ? (
              <button
                onClick={() => setShowResumeModal(true)}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Despausar Fila & Retomar Operações</span>
              </button>
            ) : (
              <button
                onClick={() => setShowActivateModal(true)}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all animate-pulse"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>🚨 ATIVAR KILL SWITCH DE EMERGÊNCIA</span>
              </button>
            )}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Status Hero Card */}
      {config && (
        <div className={`p-6 rounded-2xl border transition-all ${
          config.isEmergencyPaused
            ? 'bg-gradient-to-b from-rose-950/40 via-zinc-900 to-zinc-950 border-rose-600/50 ring-1 ring-rose-500/30'
            : 'bg-gradient-to-b from-emerald-950/20 via-zinc-900 to-zinc-950 border-emerald-600/30'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${
                  config.isEmergencyPaused ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                }`} />
                <h2 className="text-xl font-bold text-zinc-100">
                  {config.isEmergencyPaused
                    ? 'ESTADO DE EMERGÊNCIA ATIVO — TODAS AS POSTAGENS SUSPENSAS'
                    : 'OPERAÇÕES NOMINAIS — FILA ATIVA E SEGURA'}
                </h2>
              </div>
              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                {config.isEmergencyPaused
                  ? `Pausa acionada por ${config.pausedByUserName || 'Administrador'} em ${new Date(config.pausedAt!).toLocaleString('pt-BR')}. Motivo: "${config.pauseReason}". Todas as tentativas de postagem automática estão sendo barradas.`
                  : 'Nenhum bloqueio emergencial em vigor. Os canais sociais continuam publicando conforme o cronograma e os filtros de palavras sensíveis estão operantes.'}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="text-center">
                <p className="text-xs text-zinc-500 font-medium">Posts Protegidos</p>
                <p className="text-3xl font-bold text-zinc-100 mt-0.5">{config.affectedPostsCount}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500 font-medium">Índice de Segurança</p>
                <p className="text-3xl font-bold text-emerald-400 mt-0.5">{health?.healthScore}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Configurações de Brand Safety & Histórico de Incidentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Termos Sensíveis & Canais de Contingência (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm border-b border-zinc-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Regras Permanentes de Brand Safety</span>
            </div>

            <div className="space-y-3 text-xs text-zinc-400">
              <div>
                <span className="font-medium text-zinc-300 block mb-1">Palavras-chave Sensíveis Restritas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {config?.restrictedKeywords.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      "{k}"
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Posts contendo estes termos exigem aprovação manual obrigatória.</p>
              </div>

              <div className="pt-3 border-t border-zinc-800">
                <span className="font-medium text-zinc-300 block mb-1">Canais com Exceção de Crise:</span>
                <div className="flex flex-wrap gap-1.5">
                  {config?.allowedChannels.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">Permite publicar notas de posicionamento oficial mesmo com o Kill Switch ativo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Registro de Auditoria e Incidentes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span>Registro de Auditoria de Crises & Incidentes</span>
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {incidents.length} {incidents.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-xl">
              Carregando histórico de auditoria...
            </div>
          ) : incidents.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm">
              Nenhum incidente registrado. As operações permanecem estáveis.
            </div>
          ) : (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <CrisisIncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Ativar Kill Switch */}
      {showActivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-rose-600/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertOctagon className="w-7 h-7 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Ativação do Kill Switch de Emergência</h3>
                <p className="text-xs text-rose-300">Todas as publicações agendadas da organização serão interrompidas imediatamente.</p>
              </div>
            </div>

            <form onSubmit={handleActivateKillSwitch} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Motivo da Crise / Contexto Operacional
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Anúncio de recall internacional de produto; cancelamento preventivo de campanhas festivas por 48h."
                  value={activateReason}
                  onChange={(e) => setActivateReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="bg-rose-950/40 border border-rose-900/60 p-3.5 rounded-xl space-y-2">
                <p className="text-xs text-rose-300 font-semibold">Trava de Segurança Anti-Erro:</p>
                <p className="text-[11px] text-zinc-400">
                  Para confirmar que você compreende que todos os posts da agência serão congelados, digite <span className="font-mono font-bold text-rose-400">CONFIRMAR PAUSA</span> no campo abaixo:
                </p>
                <input
                  type="text"
                  required
                  placeholder="CONFIRMAR PAUSA"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-rose-700/60 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActivateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || confirmationInput.trim().toUpperCase() !== 'CONFIRMAR PAUSA'}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/30"
                >
                  {isSubmitting ? 'Acionando Kill Switch...' : 'CONGELAR TODA A FILA AGORA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Desativar Kill Switch / Retomar Fila */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-emerald-600/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <RotateCcw className="w-7 h-7 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Retomar Operações & Despausar Fila</h3>
                <p className="text-xs text-zinc-400">Desative o modo de crise com proteção contra disparo desordenado (efeito avalanche).</p>
              </div>
            </div>

            <form onSubmit={handleDeactivateKillSwitch} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Justificativa de Retomada
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ex: Comunicado de esclarecimento veiculado e situação estabilizada."
                  value={resumeReason}
                  onChange={(e) => setResumeReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Estratégia para Posts Vencidos durante a Crise:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-zinc-300 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                    <input
                      type="radio"
                      name="strategy"
                      value="hold_for_review"
                      checked={expiredStrategy === 'hold_for_review'}
                      onChange={() => setExpiredStrategy('hold_for_review')}
                      className="accent-emerald-500"
                    />
                    <div>
                      <span className="font-semibold block text-zinc-200">Reter para Revisão Manual (Recomendado)</span>
                      <span className="text-[11px] text-zinc-500">Impede disparos automáticos retroativos para você revisar a pertinência do conteúdo.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-zinc-300 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 cursor-pointer">
                    <input
                      type="radio"
                      name="strategy"
                      value="reschedule_next_day"
                      checked={expiredStrategy === 'reschedule_next_day'}
                      onChange={() => setExpiredStrategy('reschedule_next_day')}
                      className="accent-emerald-500"
                    />
                    <div>
                      <span className="font-semibold block text-zinc-200">Reagendar para as próximas 24h</span>
                      <span className="text-[11px] text-zinc-500">Distribui os posts acumulados no dia seguinte sem sobrecarregar a audiência.</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !resumeReason}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/30"
                >
                  {isSubmitting ? 'Normalizando Fila...' : 'Confirmar Retomada da Fila'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
