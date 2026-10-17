'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Webhook as WebhookIcon,
  Plus,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  Zap,
  Activity,
  Radio,
} from 'lucide-react';
import { Webhook, WebhookEventType, SUPPORTED_WEBHOOK_EVENTS } from '@/lib/webhooks/types';

interface WebhookDeliveryItem {
  id: string;
  webhookId: string;
  event: WebhookEventType;
  statusCode?: number | null;
  responseTimeMs?: number | null;
  errorMessage?: string | null;
  createdAt: string;
}

export default function WebhooksPage() {
  const [webhooksList, setWebhooksList] = useState<Webhook[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDeliveryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados do Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formEvents, setFormEvents] = useState<WebhookEventType[]>([
    'post.published',
    'post.failed',
  ]);
  const [formIsActive, setFormIsActive] = useState(true);
  const [createdSecretAlert, setCreatedSecretAlert] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/webhooks');
      if (!res.ok) throw new Error('Falha ao carregar webhooks');
      const data = await res.json();
      setWebhooksList(data.webhooks || []);
      setDeliveries(data.recentDeliveries || []);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormName('');
    setFormUrl('');
    setFormEvents(['post.published', 'post.failed']);
    setFormIsActive(true);
    setCreatedSecretAlert(null);
    setIsModalOpen(true);
  };

  const openEditModal = (wh: Webhook) => {
    setEditingId(wh.id);
    setFormName(wh.name);
    setFormUrl(wh.url);
    setFormEvents([...wh.events]);
    setFormIsActive(wh.isActive);
    setCreatedSecretAlert(null);
    setIsModalOpen(true);
  };

  const handleToggleEvent = (event: WebhookEventType) => {
    if (formEvents.includes(event)) {
      if (formEvents.length <= 1) {
        showToast('Pelo menos um evento deve ser selecionado', 'error');
        return;
      }
      setFormEvents(formEvents.filter((e) => e !== event));
    } else {
      setFormEvents([...formEvents, event]);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formUrl.trim()) {
      showToast('Nome e URL são obrigatórios', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await fetch('/api/webhooks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            name: formName.trim(),
            url: formUrl.trim(),
            events: formEvents,
            isActive: formIsActive,
          }),
        });
        if (!res.ok) throw new Error('Erro ao atualizar webhook');
        showToast('Webhook atualizado com sucesso!');
        setIsModalOpen(false);
        loadData();
      } else {
        const res = await fetch('/api/webhooks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            url: formUrl.trim(),
            events: formEvents,
            isActive: formIsActive,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Erro ao criar webhook');
        }
        const data = await res.json();
        showToast('Webhook criado com sucesso!');
        setCreatedSecretAlert(data.webhook.secret);
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Erro na gravação', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o webhook "${name}"?`)) return;
    try {
      const res = await fetch(`/api/webhooks?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Falha ao excluir');
      showToast(`Webhook "${name}" excluído.`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro ao excluir webhook', 'error');
    }
  };

  const handleTestWebhook = async (id: string) => {
    setTestingId(id);
    try {
      const res = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, event: 'test.ping' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Disparo de teste realizado! HTTP ${data.statusCode} em ${data.responseTimeMs}ms`);
      } else {
        showToast(`Falha no teste: ${data.error || 'Sem resposta do servidor'}`, 'error');
      }
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erro no disparo de teste', 'error');
    } finally {
      setTestingId(null);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copiado para a área de transferência!`);
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

      {/* Header com Navegação e Ação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link href="/settings" className="hover:text-slate-200 transition-colors">
              Configurações
            </Link>
            <span>/</span>
            <span className="text-slate-200">Webhooks & n8n</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <WebhookIcon className="w-6 h-6 text-indigo-400" />
            Webhooks Corporativos & Integrações
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Notifique automaticamente workflows no n8n, Zapier ou Make sobre eventos de publicação, falhas e novas mídias com assinatura criptográfica HMAC-SHA256.
          </p>
        </div>

        <button
          id="btn-create-webhook"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Webhook
        </button>
      </div>

      {/* Alerta Informativo de Integração com n8n */}
      <div className="p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-purple-950/20 to-slate-900/40 backdrop-blur-md flex items-start gap-3.5">
        <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-slate-200">Como validar a assinatura no n8n / Zapier</p>
          <p className="text-slate-400 leading-relaxed">
            Cada requisição enviada inclui o header <code className="text-indigo-300 font-mono">X-HupFlow-Signature: sha256=&lt;hash&gt;</code> e <code className="text-indigo-300 font-mono">X-HupFlow-Timestamp</code>. No nó Webhook do n8n, configure a opção &ldquo;HMAC Validation&rdquo; com o segredo exclusivo fornecido abaixo.
          </p>
        </div>
      </div>

      {/* Lista de Webhooks Cadastrados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <span>Endpoints Cadastrados</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {webhooksList.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">Carregando webhooks corporativos...</span>
          </div>
        ) : webhooksList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
            <WebhookIcon className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Nenhum webhook configurado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Conecte seus pipelines no n8n, Zapier ou servidores próprios para receber eventos em tempo real quando postagens forem publicadas.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Configurar Primeiro Webhook
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {webhooksList.map((wh) => {
              const isRevealed = !!revealedSecrets[wh.id];
              return (
                <div
                  key={wh.id}
                  className={`rounded-2xl border p-5 transition-all space-y-4 ${
                    wh.isActive
                      ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      : 'border-slate-800/40 bg-slate-950/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-white">{wh.name}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            wh.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {wh.isActive ? 'Ativo' : 'Pausado'}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-indigo-400/90 truncate max-w-xl">
                        {wh.url}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestWebhook(wh.id)}
                        disabled={testingId === wh.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold transition-all disabled:opacity-50"
                        title="Simular disparo de teste imediato"
                      >
                        {testingId === wh.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Testar Disparo</span>
                      </button>

                      <button
                        onClick={() => openEditModal(wh)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors"
                        title="Editar Webhook"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(wh.id, wh.name)}
                        className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Excluir Webhook"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges de Eventos e Segredo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Eventos Subscritos:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {wh.events.map((ev) => (
                          <span
                            key={ev}
                            className="px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 font-mono text-[10px] border border-slate-700/60"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Segredo de Assinatura HMAC:</span>
                      <div className="flex items-center gap-2 bg-slate-950 p-1.5 px-2.5 rounded-xl border border-slate-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-mono text-[11px] text-slate-300 truncate flex-1">
                          {isRevealed ? wh.secret : `${wh.secret.substring(0, 10)}••••••••••••••••`}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedSecrets({ ...revealedSecrets, [wh.id]: !isRevealed })
                          }
                          className="text-slate-400 hover:text-slate-200 p-1"
                          title={isRevealed ? 'Ocultar segredo' : 'Revelar segredo'}
                        >
                          {isRevealed ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(wh.secret, 'Segredo')}
                          className="text-slate-400 hover:text-slate-200 p-1"
                          title="Copiar segredo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico Recente de Entregas (Telemetria) */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Telemetria & Entregas Recentes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Histórico das últimas 20 tentativas de disparo executadas pelo motor de webhooks.
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 text-slate-300 text-xs transition-all"
          >
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <span>Atualizar</span>
          </button>
        </div>

        {deliveries.length === 0 ? (
          <div className="text-center py-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 text-xs text-slate-500">
            Nenhuma entrega registrada ainda. Clique em &ldquo;Testar Disparo&rdquo; para simular o primeiro envio.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Evento</th>
                  <th className="py-3 px-4">Tempo</th>
                  <th className="py-3 px-4">Horário</th>
                  <th className="py-3 px-4">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {deliveries.map((del) => {
                  const isSuccess = del.statusCode && del.statusCode >= 200 && del.statusCode < 300;
                  return (
                    <tr key={del.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                            isSuccess
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {del.statusCode ? `HTTP ${del.statusCode}` : 'FALHA'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-300">{del.event}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {del.responseTimeMs !== null ? `${del.responseTimeMs}ms` : '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(del.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                        {del.errorMessage || (isSuccess ? 'Entregue com sucesso' : '-')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Criação / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 my-8 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <WebhookIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {editingId ? 'Editar Webhook' : 'Novo Webhook Corporativo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Alerta de Segredo Criado com Sucesso */}
            {createdSecretAlert ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Webhook Registrado com Sucesso!</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Copie seu segredo HMAC agora para configurar a validação no n8n ou Zapier:
                  </p>
                  <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-xs text-emerald-300 select-all truncate flex-1">
                      {createdSecretAlert}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(createdSecretAlert, 'Segredo')}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveModal} className="space-y-5">
                {/* Nome */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Nome do Webhook <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: n8n Social Pipeline, Zapier Alerts..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    URL do Endpoint (HTTP POST) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://n8n.meuservidor.com/webhook/social"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Seleção de Eventos */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300 block">
                    Eventos Notificados <span className="text-rose-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {SUPPORTED_WEBHOOK_EVENTS.map((ev) => {
                      const isChecked = formEvents.includes(ev.event);
                      return (
                        <div
                          key={ev.event}
                          onClick={() => handleToggleEvent(ev.event)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                            isChecked
                              ? 'border-indigo-500/60 bg-indigo-950/30'
                              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div className="text-xs">
                            <span className="font-semibold text-slate-200 block">{ev.label}</span>
                            <span className="text-slate-400 text-[11px] leading-tight block mt-0.5">
                              {ev.description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Ativo */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="check-webhook-active"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="check-webhook-active" className="text-xs text-slate-300 cursor-pointer">
                    Habilitar envio imediato de eventos para este endpoint
                  </label>
                </div>

                {/* Footer do Modal */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Gravando...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Salvar Alterações' : 'Criar Webhook'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
