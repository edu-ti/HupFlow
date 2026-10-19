'use client';

import React from 'react';
import { PortalDeliverable } from '@/lib/portals/types';
import { calculatePortalMetrics } from '@/lib/portals/portals-utils';
import {
  CheckCircle2,
  Clock,
  MessageSquareWarning,
  Lock,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

interface ClientPortalPreviewProps {
  clientName: string;
  projectTitle: string;
  brandColor: string;
  welcomeMessage?: string | null;
  accessPin?: string | null;
  hideHupflowBranding: boolean;
  deliverables: PortalDeliverable[];
  onSimulateDecision?: (
    deliverableId: string,
    decision: 'approved' | 'changes_requested'
  ) => void;
}

export function ClientPortalPreview({
  clientName,
  projectTitle,
  brandColor,
  welcomeMessage,
  accessPin,
  hideHupflowBranding,
  deliverables,
  onSimulateDecision,
}: ClientPortalPreviewProps) {
  const metrics = calculatePortalMetrics(deliverables);
  const safeColor = /^#[0-9A-Fa-f]{6}$/.test(brandColor)
    ? brandColor
    : '#6366F1';

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-[#0B0E17] shadow-2xl overflow-hidden">
      {/* Browser Bar Simulation */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          {accessPin ? (
            <Lock className="w-3 h-3 text-amber-400" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
          <span>portal.agencia.com/portal/ptl_...</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
          Live Preview
        </span>
      </div>

      {/* White-Label Header */}
      <div
        className="p-6 border-b border-slate-800/80 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${safeColor}22 0%, rgba(15,23,42,0.95) 100%)`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-lg"
              style={{ backgroundColor: safeColor }}
            >
              {(clientName || 'CL').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Portal Exclusivo do Cliente
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {clientName || 'Nome do Cliente'}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-white">
              {metrics.approvalRate}% Aprovado
            </span>
            <p className="text-[10px] text-slate-400">
              {metrics.approved}/{metrics.total} entregas
            </p>
          </div>
        </div>

        <p className="text-xs font-semibold text-slate-200 mt-3">
          {projectTitle || 'Cronograma de Conteúdo'}
        </p>
        {welcomeMessage && (
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
            {welcomeMessage}
          </p>
        )}
      </div>

      {/* Deliverables List */}
      <div className="p-4 space-y-3 max-h-[380px] overflow-y-auto">
        {deliverables.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            Nenhuma entrega adicionada a este portal ainda.
          </div>
        ) : (
          deliverables.map((item) => {
            const isApproved = item.status === 'approved';
            const isChanges = item.status === 'changes_requested';

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.channel}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {item.mediaType === 'carousel'
                          ? `Carrossel (${item.slideCount || 5} slides)`
                          : item.mediaType === 'short_video'
                          ? 'Reels / Vídeo Curto'
                          : 'Post Único'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1">
                      {item.title}
                    </h4>
                  </div>

                  {isApproved ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                      Aprovado
                    </span>
                  ) : isChanges ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
                      <MessageSquareWarning className="w-3 h-3" />
                      Ajuste Pedido
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      Pendente
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>

                {item.feedbackNote && (
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300">
                    <span className="font-semibold text-white">
                      {item.reviewedBy || 'Cliente'}:
                    </span>{' '}
                    {item.feedbackNote}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.scheduledDate?.slice(0, 10) || 'Sem data'}
                  </span>

                  {onSimulateDecision && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSimulateDecision(item.id, 'approved')}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: safeColor }}
                      >
                        Aprovar 1-Click
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onSimulateDecision(item.id, 'changes_requested')
                        }
                        className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                      >
                        Pedir Ajuste
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Branding */}
      {!hideHupflowBranding && (
        <div className="py-2.5 px-4 bg-slate-950 border-t border-slate-900 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>Powered by HupFlow Clean Social Studio</span>
        </div>
      )}
    </div>
  );
}
