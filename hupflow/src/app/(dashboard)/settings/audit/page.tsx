'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Activity,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Eye,
  Copy,
} from 'lucide-react';
import {
  AuditLogEntry,
  AuditCategory,
  AUDIT_CATEGORIES,
} from '@/lib/audit/types';
import { formatAuditAction } from '@/lib/audit/service';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AuditCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState<number | undefined>(30);
  const [activeLogModal, setActiveLogModal] = useState<AuditLogEntry | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedDays) params.set('days', String(selectedDays));

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error('Falha ao carregar trilha de auditoria');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedCategory, selectedDays]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedDays) params.set('days', String(selectedDays));
      params.set('export', 'csv');

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (!res.ok) throw new Error('Falha ao gerar arquivo CSV');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hupflow_audit_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('Relatório CSV baixado com sucesso!');
    } catch (err: any) {
      showToast(err.message || 'Erro ao exportar CSV', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const getCategoryBadge = (category: AuditCategory) => {
    switch (category) {
      case 'security':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'content':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'team':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'connectors':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'integrations':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleCopyJson = (details: any) => {
    navigator.clipboard.writeText(JSON.stringify(details, null, 2));
    showToast('Metadados JSON copiados para a área de transferência!');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md animate-fade-in text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header com Navegação e Botão de Exportação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/settings" className="hover:text-slate-200 transition-colors">
              Configurações
            </Link>
            <span>/</span>
            <span className="text-slate-200">Auditoria & Logs</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Trilha de Auditoria & Atividades
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registro imutável de eventos críticos para conformidade corporativa (SOC 2 / LGPD), rastreamento de publicações e gestão de acessos.
          </p>
        </div>

        <button
          id="btn-export-audit-csv"
          onClick={handleExportCsv}
          disabled={isExporting || logs.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-md transition-all disabled:opacity-50 shrink-0"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
          ) : (
            <Download className="w-4 h-4 text-emerald-400" />
          )}
          <span>Exportar Relatório CSV</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="space-y-4">
        {/* Pills de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas as Categorias
          </button>
          {AUDIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Linha de Busca Textual e Intervalo */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ator, e-mail ou tipo de entidade..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedDays ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDays(val === '' ? undefined : Number(val));
              }}
              className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="1">Hoje</option>
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="">Todo o Histórico</option>
            </select>

            <button
              onClick={loadLogs}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Recarregar logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Logs de Auditoria */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">Carregando trilha de auditoria...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Nenhum evento registrado no período</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Ações realizadas no workspace aparecerão aqui em tempo real.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium">
                <tr>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Ação</th>
                  <th className="py-3 px-4">Ator</th>
                  <th className="py-3 px-4">Entidade</th>
                  <th className="py-3 px-4">Horário</th>
                  <th className="py-3 px-4 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadge(
                          log.category
                        )}`}
                      >
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {formatAuditAction(log.action)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">{log.actorName}</span>
                        <span className="text-[10px] text-slate-500">{log.actorEmail}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      <span className="text-slate-300">{log.entityType}</span>
                      {log.entityId && (
                        <span className="text-slate-500 text-[10px] block">
                          {log.entityId.substring(0, 14)}...
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {log.details ? (
                        <button
                          onClick={() => setActiveLogModal(log)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes JSON do Evento */}
      {activeLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 my-8 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {formatAuditAction(activeLogModal.action)}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">ID: {activeLogModal.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveLogModal(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Ator:</span>
                  <span className="text-slate-200 font-medium">{activeLogModal.actorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">E-mail:</span>
                  <span className="text-slate-200 font-mono">{activeLogModal.actorEmail}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Entidade:</span>
                  <span className="text-slate-200 font-mono">{activeLogModal.entityType} ({activeLogModal.entityId || 'N/A'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Endereço IP:</span>
                  <span className="text-slate-200 font-mono">{activeLogModal.ipAddress || 'Não registrado'}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Metadados do Evento (JSON):</span>
                  <button
                    type="button"
                    onClick={() => handleCopyJson(activeLogModal.details)}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar JSON</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-60 leading-relaxed">
                  {JSON.stringify(activeLogModal.details, null, 2)}
                </pre>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveLogModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
