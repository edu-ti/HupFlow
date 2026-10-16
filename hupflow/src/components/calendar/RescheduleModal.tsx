'use client';

import { useState } from 'react';
import { X, Calendar, Clock, AlertTriangle, Check, Trash2 } from 'lucide-react';

export interface CalendarPost {
  id: string;
  topic: string;
  preview: string;
  scheduledAt: Date;
  networks: ('linkedin' | 'x' | 'instagram' | 'threads')[];
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
}

interface RescheduleModalProps {
  post: CalendarPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (postId: string, newDate: Date) => void;
  onCancelPost?: (postId: string) => void;
}

export function RescheduleModal({
  post,
  isOpen,
  onClose,
  onSave,
  onCancelPost,
}: RescheduleModalProps) {
  if (!isOpen || !post) return null;

  const [selectedDateTime, setSelectedDateTime] = useState(() => {
    const d = new Date(post.scheduledAt);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const newDate = new Date(selectedDateTime);
    onSave(post.id, newDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Reprogramar Publicação</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info do Post */}
        <div className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-950/70 space-y-1">
          <p className="text-xs font-semibold text-slate-200">{post.topic}</p>
          <p className="text-[11px] text-slate-400 line-clamp-2">{post.preview}</p>
          <div className="flex items-center gap-1.5 pt-1">
            {post.networks.map((net) => (
              <span
                key={net}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase"
              >
                {net}
              </span>
            ))}
          </div>
        </div>

        {/* Formulário de Nova Data/Hora */}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Nova Data e Horário de Disparo
            </label>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              O atraso (delay) do job no BullMQ será recalculado automaticamente com idempotência.
            </p>
          </div>

          {/* Ações */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {onCancelPost && (
              <button
                type="button"
                onClick={() => {
                  onCancelPost(post.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancelar Post</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Fechar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Horário</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
