'use client';

import React from 'react';
import { CrisisIncidentLog } from '@/lib/brandsafety/types';
import { AlertOctagon, CheckCircle2, Shield, User, Clock, Layers } from 'lucide-react';

interface CrisisIncidentCardProps {
  incident: CrisisIncidentLog;
}

export function CrisisIncidentCard({ incident }: CrisisIncidentCardProps) {
  const isActivation = incident.action === 'kill_switch_activated';

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      isActivation
        ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
        : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isActivation ? (
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertOctagon className="w-4 h-4" />
            </span>
          ) : (
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          )}
          <span className="font-semibold text-xs tracking-wide uppercase">
            {isActivation ? 'Kill Switch Ativado' : 'Operações Retomadas'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-zinc-500" />
          {new Date(incident.createdAt).toLocaleString('pt-BR')}
        </span>
      </div>

      <p className="text-xs text-zinc-300 mt-2.5 font-medium leading-relaxed">
        "{incident.reason}"
      </p>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-3 pt-2.5 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span>{incident.activatedByUserName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
            Escopo: {incident.scope === 'global' ? 'Toda a Organização' : incident.scope}
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
            {incident.affectedPostsCount} posts protegidos
          </span>
        </div>
      </div>
    </div>
  );
}
