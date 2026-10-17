'use client';

import React from 'react';
import { GeneratedClientReport } from '@/lib/reports/types';
import { FileText, Download, Calendar, TrendingUp, Sparkles, Share2, Check } from 'lucide-react';

interface ClientReportCardProps {
  report: GeneratedClientReport;
}

export function ClientReportCard({ report }: ClientReportCardProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/api/reports/download?id=${report.id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedPeriod = `${new Date(report.periodStart).toLocaleDateString('pt-BR')} — ${new Date(report.periodEnd).toLocaleDateString('pt-BR')}`;
  const sizeKb = Math.round(report.fileSizeBytes / 1024);

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold text-zinc-100 line-clamp-1">{report.reportTitle}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 pl-8">
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
              {report.brandSlug.toUpperCase()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-500" />
              {formattedPeriod}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
            title="Copiar link público para o cliente"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
          <a
            href={`/api/reports/download?id=${report.id}`}
            download
            className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar PDF ({sizeKb} KB)</span>
          </a>
        </div>
      </div>

      {/* AI Executive Summary Snippet */}
      {report.aiExecutiveSummary && (
        <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2 leading-relaxed">
            {report.aiExecutiveSummary}
          </p>
        </div>
      )}

      {/* Mini KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2 border-t border-zinc-800/60">
        <div className="p-2 rounded bg-zinc-950/40">
          <p className="text-[10px] text-zinc-500">Impressões</p>
          <p className="text-xs font-bold text-zinc-200">{report.metricsSnapshot.totalImpressions.toLocaleString('pt-BR')}</p>
        </div>
        <div className="p-2 rounded bg-zinc-950/40">
          <p className="text-[10px] text-zinc-500">Alcance</p>
          <p className="text-xs font-bold text-zinc-200">{report.metricsSnapshot.totalReach.toLocaleString('pt-BR')}</p>
        </div>
        <div className="p-2 rounded bg-zinc-950/40">
          <p className="text-[10px] text-zinc-500">Engajamento Médio</p>
          <p className="text-xs font-bold text-emerald-400">{report.metricsSnapshot.averageEngagementRate}%</p>
        </div>
        <div className="p-2 rounded bg-zinc-950/40">
          <p className="text-[10px] text-zinc-500">Novos Seguidores</p>
          <p className="text-xs font-bold text-indigo-400">+{report.metricsSnapshot.newFollowers}</p>
        </div>
      </div>
    </div>
  );
}
