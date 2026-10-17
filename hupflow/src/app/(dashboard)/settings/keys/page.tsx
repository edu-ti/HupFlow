'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Key,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Code2,
  Terminal,
  Calendar,
  Clock,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { ApiKey, ApiKeyScope, AVAILABLE_SCOPES } from '@/lib/api-keys/types';

export default function ApiKeysPage() {
  const [keysList, setKeysList] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal de Criação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formScopes, setFormScopes] = useState<ApiKeyScope[]>(['posts:read', 'posts:write']);
  const [formExpiresInDays, setFormExpiresInDays] = useState<number | undefined>(undefined);
  const [createdKeyResponse, setCreatedKeyResponse] = useState<{ apiKey: ApiKey; token: string } | null>(null);

  // Tab de Documentação
  const [activeTab, setActiveTab] = useState<'curl' | 'typescript'>('curl');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadKeys = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/api-keys');
      if (!res.ok) throw new Error('Falha ao buscar chaves de API');
      const data = await res.json();
      setKeysList(data.apiKeys || []);
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const openCreateModal = () => {
    setFormName('');
    setFormScopes(['posts:read', 'posts:write']);
    setFormExpiresInDays(undefined);
    setCreatedKeyResponse(null);
    setIsModalOpen(true);
  };

  const handleToggleScope = (scope: ApiKeyScope) => {
    if (formScopes.includes(scope)) {
      if (formScopes.length <= 1) {
        showToast('Pelo menos um escopo de permissão deve ser atribuído à chave.', 'error');
        return;
      }
      setFormScopes(formScopes.filter((s) => s !== scope));
    } else {
      setFormScopes([...formScopes, scope]);
    }
  };

  const handleSelectAllScopes = () => {
    if (formScopes.includes('*')) {
      setFormScopes(['posts:read', 'posts:write']);
    } else {
      setFormScopes(['*']);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('O nome identificador da chave é obrigatório', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          scopes: formScopes,
          expiresInDays: formExpiresInDays,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Erro ao gerar chave de API');
      }

      const data = await res.json();
      setCreatedKeyResponse(data);
      showToast('Chave de API gerada com sucesso!');
      loadKeys();
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar chave', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeKey = async (id: string, name: string) => {
    if (!confirm(`Atenção: Tem certeza que deseja revogar permanentemente a chave "${name}"?\nSistemas e scripts que a utilizam perderão o acesso imediatamente.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/api-keys?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Falha ao revogar chave');
      showToast(`Chave "${name}" revogada.`);
      loadKeys();
    } catch (err: any) {
      showToast(err.message || 'Erro ao revogar chave', 'error');
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copiado para a área de transferência!`);
  };

  const curlSnippet = `curl -X POST https://api.hupflow.com/api/posts \\
  -H "Authorization: Bearer hup_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Olá seguidores! Publicação enviada via API Oficial do HupFlow 🚀",
    "channels": ["linkedin", "instagram"],
    "publishNow": true
  }'`;

  const tsSnippet = `import { HupFlowClient } from '@hupflow/sdk';

const client = new HupFlowClient({
  apiKey: process.env.HUPFLOW_API_KEY, // 'hup_live_...'
});

const post = await client.posts.create({
  content: 'Post automatizado com alta performance no HupFlow!',
  channels: ['linkedin', 'threads'],
  scheduledAt: new Date(Date.now() + 3600000).toISOString(),
});

console.log('Post agendado:', post.id);`;

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
            <span className="text-slate-200">Chaves de API</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Key className="w-6 h-6 text-amber-400" />
            Chaves de API Públicas & Desenvolvedores
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gere tokens de autenticação seguros para integrar o HupFlow a sistemas corporativos, bots de publicação, scripts Python e automações personalizadas.
          </p>
        </div>

        <button
          id="btn-create-api-key"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Chave de API
        </button>
      </div>

      {/* Card Informativo com Snippets de Código (cURL / TypeScript) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Como Usar as Chaves de API</h3>
              <p className="text-xs text-slate-400">
                Envie o token no cabeçalho <code className="text-amber-300 font-mono">Authorization: Bearer hup_live_...</code> ou <code className="text-amber-300 font-mono">X-API-Key</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('curl')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'curl'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>cURL</span>
            </button>
            <button
              onClick={() => setActiveTab('typescript')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'typescript'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>TypeScript</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 relative">
          <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 leading-relaxed">
            {activeTab === 'curl' ? curlSnippet : tsSnippet}
          </pre>
          <button
            onClick={() => handleCopyText(activeTab === 'curl' ? curlSnippet : tsSnippet, 'Snippet')}
            className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
            title="Copiar código"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar</span>
          </button>
        </div>
      </div>

      {/* Lista de Chaves de API */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <span>Chaves Ativas</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {keysList.length}
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-2xl border border-slate-800/80 bg-slate-900/40">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            <span className="ml-2 text-xs text-slate-400">Carregando chaves de API...</span>
          </div>
        ) : keysList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 space-y-3">
            <Key className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Nenhuma chave de API gerada</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Crie tokens com escopos restritos para integrar pipelines de CI/CD, serviços externos ou automações sem expor sua senha.
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Gerar Primeira Chave
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {keysList.map((key) => {
              const isExpired = key.expiresAt && new Date(key.expiresAt).getTime() < Date.now();
              return (
                <div
                  key={key.id}
                  className={`rounded-2xl border p-5 transition-all space-y-4 ${
                    isExpired
                      ? 'border-rose-900/40 bg-rose-950/10 opacity-70'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-white">{key.name}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            isExpired
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isExpired ? 'Expirada' : 'Ativa'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{key.keyPrefix}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRevokeKey(key.id, key.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold transition-all"
                        title="Revogar chave permanentemente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revogar</span>
                      </button>
                    </div>
                  </div>

                  {/* Escopos e Metadados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1.5">Permissões Concedidas:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            className={`px-2 py-0.5 rounded-lg font-mono text-[10px] border ${
                              scope === '*'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                                : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                            }`}
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-1 text-slate-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Criada em: {new Date(key.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          Último uso:{' '}
                          {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Nunca utilizada'}
                        </span>
                      </div>
                      {key.expiresAt && (
                        <div className="flex items-center gap-1.5 text-amber-300/80">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Expira em: {new Date(key.expiresAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Criação de Chave */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0D111A] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 my-8 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Nova Chave de API Pública</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Tela de Exibição ÚNICA do Token Criado */}
            {createdKeyResponse ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Copie sua Chave de API agora!</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Por motivos estritos de segurança, este token em texto puro{' '}
                    <strong className="text-white">NUNCA MAIS será exibido</strong>. Se você perdê-lo, precisará gerar uma nova chave.
                  </p>
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-xs text-amber-300 select-all truncate flex-1">
                      {createdKeyResponse.token}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(createdKeyResponse.token, 'Chave de API')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-all shrink-0"
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
                  Concluir & Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateKey} className="space-y-5">
                {/* Nome Identificador */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Nome Identificador <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Pipeline CI/CD, Script de Automação, Bot Slack..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Validade / Expiração */}
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Período de Validade
                  </label>
                  <select
                    value={formExpiresInDays ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormExpiresInDays(val === '' ? undefined : Number(val));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Sem expiração (Recomendado apenas para servidores internos)</option>
                    <option value="30">30 dias</option>
                    <option value="90">90 dias</option>
                    <option value="180">180 dias</option>
                    <option value="365">1 ano (365 dias)</option>
                  </select>
                </div>

                {/* Seleção de Escopos Granulares */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-300 block">
                      Permissões & Escopos <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAllScopes}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                    >
                      {formScopes.includes('*') ? 'Limitar Escopos' : 'Acesso Total (*)'}
                    </button>
                  </div>

                  {formScopes.includes('*') ? (
                    <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 text-xs text-amber-200">
                      <strong>Escopo Universal Ativo:</strong> Esta chave terá permissão irrestrita em todos os endpoints da API da organização.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {AVAILABLE_SCOPES.map((sc) => {
                        const isChecked = formScopes.includes(sc.scope);
                        return (
                          <div
                            key={sc.scope}
                            onClick={() => handleToggleScope(sc.scope)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                              isChecked
                                ? 'border-amber-500/60 bg-amber-950/20'
                                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-600 focus:ring-amber-500"
                            />
                            <div className="text-xs">
                              <span className="font-semibold text-slate-200 block">{sc.label}</span>
                              <span className="text-slate-400 text-[11px] leading-tight block mt-0.5">
                                {sc.description}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Gerando...</span>
                      </>
                    ) : (
                      <span>Gerar Chave de API</span>
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
