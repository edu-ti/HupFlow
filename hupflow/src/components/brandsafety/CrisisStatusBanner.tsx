'use client';

import React from 'react';
import { BrandSafetyConfig } from '@/lib/brandsafety/types';
import { AlertTriangle, ShieldCheck, Flame, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CrisisStatusBannerProps {
  config: BrandSafetyConfig;
}

export function CrisisStatusBanner({ config }: CrisisStatusBannerProps) {
  if (!config.isEmergencyPaused) {
    return null;
  }

  return (
    <div className="bg-rose-950/80 border-b border-rose-800/80 px-4 py-3 text-rose-200 sticky top-0 z-50 backdrop-blur shadow-lg shadow-rose-950/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-full bg-rose-500 animate-ping" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-100 uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-rose-900/80 border border-rose-700/60">
              🚨 MODO DE CRISE ATIVO
            </span>
            <span className="text-rose-200">
              O Kill Switch está ativado. Toda a fila de agendamento de posts foi congelada preventivamente.
            </span>
          </div>
        </div>

        <Link
          href="/settings/kill-switch"
          className="shrink-0 flex items-center gap-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-500 px-3 py-1.5 rounded-lg transition-colors shadow"
        >
          <span>Gerenciar Emergência</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
