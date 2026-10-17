'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Plus, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { WorkspaceSummary } from '@/lib/auth/types';

export function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string>('org_default');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Busca os workspaces disponíveis
    fetch('/api/auth/workspaces')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.workspaces) {
          setWorkspaces(data.workspaces);
          setActiveOrgId(data.activeOrganizationId);
        }
      })
      .catch((err) => console.warn('Falha ao carregar workspaces:', err));
  }, []);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeWorkspace = workspaces.find((w) => w.id === activeOrgId) || {
    id: 'org_default',
    name: 'HupFlow Studio',
    slug: 'hupflow-studio',
    role: 'owner' as const,
    isActive: true,
  };

  const switchWorkspace = (orgId: string) => {
    // Define o cookie ativo
    document.cookie = `hupflow_active_org=${encodeURIComponent(orgId)}; path=/; max-age=2592000; SameSite=Lax`;
    setActiveOrgId(orgId);
    setIsOpen(false);
    // Recarrega a página para atualizar os dados do dashboard sob o novo tenant
    window.location.reload();
  };

  return (
    <div className="relative mb-6 px-1" ref={dropdownRef}>
      <button
        id="btn-workspace-selector"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850 transition-all text-left group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
            {activeWorkspace.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
              {activeWorkspace.name}
            </p>
            <p className="text-[10px] text-slate-400 capitalize font-medium flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-indigo-400" />
              {activeWorkspace.role}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-1 right-1 mt-1.5 rounded-xl border border-slate-800 bg-[#0C0F17] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
            Seus Workspaces
          </div>

          <div className="space-y-1">
            {workspaces.map((ws) => {
              const isSelected = ws.id === activeOrgId;
              return (
                <button
                  key={ws.id}
                  onClick={() => switchWorkspace(ws.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                    isSelected
                      ? 'bg-indigo-600/15 text-indigo-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-slate-800/80">
            <button
              onClick={() => {
                alert('Para adicionar um novo workspace, convide membros ou use a rota de organizações.');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
