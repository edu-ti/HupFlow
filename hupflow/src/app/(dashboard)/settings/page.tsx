'use client';

import { useState } from 'react';
import { Settings, Building, Users, Key, ShieldCheck, Check } from 'lucide-react';

export default function SettingsPage() {
  const [orgName, setOrgName] = useState('HupFlow Workspace');
  const [apiKey, setApiKey] = useState('sk-••••••••••••••••••••••••••••');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Workspace</h1>
        <p className="text-sm text-slate-400">
          Gerencie permissões multi-tenancy, chaves de IA e segurança da sua organização.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organização */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Building className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-200">Organização & Tenant</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nome do Workspace</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Slug do Workspace (URL)</label>
              <input
                type="text"
                disabled
                value="hupflow-workspace"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950/50 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Chaves de IA */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Key className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-200">Chaves de IA (BYOK - Bring Your Own Key)</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Chave OpenAI / Groq (Opcional)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Se não configurada, o HupFlow utiliza o gerador inteligente integrado com respostas pré-otimizadas.
              </p>
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <span>Salvar Alterações</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
