'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Sliders,
  ChevronRight,
  FileText,
  Send,
  Zap,
} from 'lucide-react';
import {
  CampaignRequest,
  CampaignResponse,
  GeneratedCampaignPost,
} from '@/lib/bulk-scheduler/types';

interface BulkCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BulkCampaignModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkCampaignModalProps) {
  const [step, setStep] = useState<'config' | 'preview' | 'success'>('config');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [theme, setTheme] = useState('');
  const [targetAudience, setTargetAudience] = useState('Profissionais e Empreendedores');
  const [postCount, setPostCount] = useState<number>(4);
  const [selectedDays, setSelectedDays] = useState<number[]>([2, 4]); // Terça e Quinta
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [includeCarousels, setIncludeCarousels] = useState(true);

  // Result State
  const [campaignData, setCampaignData] = useState<CampaignResponse | null>(null);

  if (!isOpen) return null;

  const daysList = [
    { id: 1, label: 'Seg' },
    { id: 2, label: 'Ter' },
    { id: 3, label: 'Qua' },
    { id: 4, label: 'Qui' },
    { id: 5, label: 'Sex' },
    { id: 6, label: 'Sáb' },
    { id: 0, label: 'Dom' },
  ];

  const toggleDay = (id: number) => {
    if (selectedDays.includes(id)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== id));
      }
    } else {
      setSelectedDays([...selectedDays, id].sort());
    }
  };

  const handleGeneratePreview = async () => {
    if (!theme.trim()) {
      setError('Por favor, informe o tema ou objetivo da campanha.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CampaignRequest = {
        mode: 'preview',
        theme,
        targetAudience,
        postCount,
        daysOfWeek: selectedDays,
        timeSlot,
        channels: ['acc_default'],
        includeCarousels,
      };

      const res = await fetch('/api/ai/bulk-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao gerar cronograma de campanha.');
      }

      setCampaignData(data);
      setStep('preview');
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao gerar campanha com IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommitSchedule = async () => {
    if (!campaignData) return;
    setLoading(true);
    setError(null);

    try {
      const payload: CampaignRequest = {
        mode: 'commit',
        theme,
        targetAudience,
        postCount,
        daysOfWeek: selectedDays,
        timeSlot,
        channels: ['acc_default'],
        includeCarousels,
      };

      const res = await fetch('/api/ai/bulk-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falha ao agendar posts da campanha.');
      }

      setStep('success');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Erro ao persistir agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#0A0D14] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Campanha com IA em Lote
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Bulk Scheduler
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gere e distribua semanas de conteúdo inteligente no calendário em 1 clique.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 'config' && (
            <div className="space-y-5">
              {/* Tema */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Tema Central ou Objetivo da Campanha *
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: Arquitetura Limpa para SaaS e Como Escalar sem AGPL"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Público */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Público Alvo
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Volume de Posts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Volume da Campanha ({postCount} posts)
                  </label>
                  <span className="text-xs text-indigo-400 font-medium">
                    {postCount === 4
                      ? '2 semanas (2x/sem)'
                      : postCount === 8
                      ? '1 mês (2x/sem)'
                      : 'Campanha estendida'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPostCount(num)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        postCount === num
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md shadow-indigo-600/10'
                          : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {num} Posts
                    </button>
                  ))}
                </div>
              </div>

              {/* Dias da Semana e Horário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Dias da Semana
                  </label>
                  <div className="flex gap-1.5">
                    {daysList.map((d) => {
                      const active = selectedDays.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDay(d.id)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            active
                              ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Horário Padrão de Publicação
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Carrosséis */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">
                    Incluir Carrosséis Multipáginas
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Alterna postagens de texto simples com carrosséis de 4 slides ideais para LinkedIn.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={includeCarousels}
                  onChange={(e) => setIncludeCarousels(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {step === 'preview' && campaignData && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                <span className="text-indigo-200">
                  Campanha: <strong>{campaignData.campaignTheme}</strong>
                </span>
                <span className="text-slate-400 font-mono">
                  {campaignData.posts.length} slots gerados
                </span>
              </div>

              <div className="space-y-3">
                {campaignData.posts.map((post) => (
                  <div
                    key={post.index}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          #{post.index}
                        </span>
                        <span className="text-xs text-indigo-400 font-medium">
                          {post.dayOfWeekName} •{' '}
                          {new Date(post.scheduledAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}{' '}
                          às{' '}
                          {new Date(post.scheduledAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {post.isCarousel ? 'Carrossel (4 slides)' : 'Post Texto'}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100">{post.headline}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Campanha Agendada com Sucesso!</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Todos os {postCount} posts foram distribuídos no calendário semanal da sua organização e estão prontos para publicação automática.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/40">
          {step === 'config' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                id="btn-generate-campaign-preview"
                type="button"
                onClick={handleGeneratePreview}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
                <span>Gerar Cronograma com IA</span>
              </button>
            </>
          )}

          {step === 'preview' && (
            <>
              <button
                type="button"
                onClick={() => setStep('config')}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Ajustar Configurações
              </button>
              <button
                id="btn-commit-campaign"
                type="button"
                onClick={handleCommitSchedule}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-60"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Calendar className="w-4 h-4 text-white" />
                )}
                <span>Aprovar & Agendar Todos</span>
              </button>
            </>
          )}

          {step === 'success' && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Concluir & Ver Calendário
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
