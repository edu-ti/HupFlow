'use client';

import React, { useState, useEffect } from 'react';
import {
  GeneratedClientReport,
  ReportsPortfolioSummary,
} from '@/lib/reports/types';
import { ClientReportCard } from '@/components/reports/ClientReportCard';
import {
  FileText,
  Sparkles,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Building2,
  Users,
} from 'lucide-react';

export default function ReportsDashboardPage() {
  const [reports, setReports] = useState<GeneratedClientReport[]>([]);
  const [metrics, setMetrics] = useState<ReportsPortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State para Geração Manual
  const [showModal, setShowModal] = useState(false);
  const [brandSlug, setBrandSlug] = useState('hupflow-growth');
  const [reportTitle, setReportTitle] = useState('Relatório Semanal de Social Media & ROI');
  const [daysRange, setDaysRange] = useState(7);
  const [includeAiSummary, setIncludeAiSummary] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
        setMetrics(data.metrics || null);
      }
    } catch {
      // Falha silenciosa
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      setErrorMsg('Informe o título do relatório.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandSlug,
          reportTitle,
          daysRange,
          includeAiSummary,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Falha ao compilar relatório executivo.');
      }

      setSuccessMsg('Relatório executivo em PDF compilado com sucesso!');
      setShowModal(false);
      fetchReports();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-zinc-100">Relatórios Executivos em PDF para Clientes</h1>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Geração vetorial elegante com análise sintética por IA, ranking de melhores posts e KPIs consolidados para envio semanal.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Gerar Novo Relatório em PDF</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Relatórios Emitidos</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{metrics.totalReportsGenerated}</p>
            <p className="text-[11px] text-zinc-500">Histórico de entregas de agência</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Clientes Cobertos</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{metrics.totalClientsCovered}</p>
            <p className="text-[11px] text-zinc-500">Marcas com relatórios ativos</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Horas Poupadas</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">~{metrics.estimatedHoursSaved}h</p>
            <p className="text-[11px] text-zinc-500">Automação de relatórios manuais</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Engajamento Médio</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-100">{metrics.averageEngagementAcrossClients}%</p>
            <p className="text-[11px] text-zinc-500">Média em todos os clientes</p>
          </div>
        </div>
      )}

      {/* Reports Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-indigo-400" />
            <span>Biblioteca de Relatórios Executivos</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            {reports.length} {reports.length === 1 ? 'edição' : 'edições'}
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-xl">
            Carregando relatórios...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
            <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-sm font-medium text-zinc-300">Nenhum relatório gerado ainda</p>
            <p className="text-xs text-zinc-500">
              Clique em "Gerar Novo Relatório em PDF" para criar seu primeiro compilado executivo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <ClientReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* Modal: Gerar Relatório */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-indigo-400">
              <Sparkles className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Gerar Relatório Executivo em PDF</h3>
                <p className="text-xs text-zinc-400">Compilação instantânea com gráficos vetoriais e análise de IA.</p>
              </div>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Marca / Cliente
                </label>
                <select
                  value={brandSlug}
                  onChange={(e) => setBrandSlug(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="hupflow-growth">HupFlow Growth (Cliente Principal)</option>
                  <option value="aurora-fashion">Aurora Fashion (E-commerce)</option>
                  <option value="nexus-tech">Nexus Tech (B2B SaaS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Título do Relatório
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Período Analisado
                </label>
                <select
                  value={daysRange}
                  onChange={(e) => setDaysRange(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value={7}>Últimos 7 dias (Semanal)</option>
                  <option value={15}>Últimos 15 dias (Quinzenal)</option>
                  <option value={30}>Últimos 30 dias (Mensal)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="includeAiSummary"
                  checked={includeAiSummary}
                  onChange={(e) => setIncludeAiSummary(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="includeAiSummary" className="text-xs text-zinc-300 cursor-pointer">
                  Incluir parágrafo de resumo executivo sintetizado por IA
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !reportTitle}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-lg shadow-indigo-600/20"
                >
                  {isSubmitting ? 'Gerando PDF...' : 'Gerar e Baixar PDF'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
