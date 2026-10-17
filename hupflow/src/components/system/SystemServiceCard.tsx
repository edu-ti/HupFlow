'use client';

import React from 'react';
import { ServiceHealthStatus } from '@/lib/system/types';
import { Database, HardDrive, Cpu, Radio, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SystemServiceCardProps {
  service: ServiceHealthStatus;
}

export function SystemServiceCard({ service }: SystemServiceCardProps) {
  const getIcon = () => {
    switch (service.name.toLowerCase()) {
      case 'postgresql 16 enterprise':
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 'redis 7 alpine':
        return <Cpu className="w-5 h-5 text-rose-400" />;
      case 'cloudflare r2 / minio s3':
        return <HardDrive className="w-5 h-5 text-cyan-400" />;
      default:
        return <Radio className="w-5 h-5 text-amber-400" />;
    }
  };

  const isUp = service.status === 'up';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
            {getIcon()}
          </span>
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">{service.name}</h4>
            <span className="text-[10px] text-zinc-400 font-mono">Latência: {service.latencyMs}ms</span>
          </div>
        </div>

        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
          isUp
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {isUp ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              <span>OPERACIONAL</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3" />
              <span>OFFLINE</span>
            </>
          )}
        </span>
      </div>

      {service.details && (
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          {Object.entries(service.details).map(([key, val]) => (
            <span key={key}>
              {key}: <strong className="text-zinc-400">{String(val)}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
