'use client';

import React, { useState } from 'react';
import {
  Rss,
  X as CloseIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Globe,
  Share2,
} from 'lucide-react';
import { CreateRssFeedInput } from '@/lib/rss/types';

interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedAdded: () => void;
}

export function AddFeedModal({ isOpen, onClose, onFeedAdded }: AddFeedModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [autoPublish, setAutoPublish] = useState(false);
  const [targetNetworks, setTargetNetworks] = useState<string[]>(['linkedin', 'x']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleNetwork = (netId: string) => {
    setTargetNetworks((prev) =>
      prev.includes(netId)
        ? prev.length > 1
          ? prev.filter((n) => n !== netId)
          : prev
        : [...prev, netId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!url.trim()) {
      setErrorMsg('A URL do feed RSS é obrigatória.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          url: url.trim(),
          autoPublish,
          targetNetworks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao conectar feed RSS');
      }

      onFeedAdded();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao conectar feed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableNetworks = [
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'threads', label: 'Threads' },
    { id: 'instagram', label: 'Instagram' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Rss className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Conectar Feed RSS/Atom</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monitore blogs ou sites de notícias para gerar posts sociais com IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              URL do Feed RSS ou Atom *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                required
                placeholder="https://exemplo.com.br/blog/feed/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Nome de Exibição (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Blog de Engenharia (deixe vazio para capturar automático)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Canais Alvo para Distribuição
            </label>
            <div className="flex flex-wrap gap-2">
              {availableNetworks.map((net) => {
                const isSelected = targetNetworks.includes(net.id);
                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => toggleNetwork(net.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary shadow-xs'
                        : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/60'
                    }`}
                  >
                    {net.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground">
                Publicação Automática Direta
              </span>
              <p className="text-[11px] text-muted-foreground">
                Se ativado, envia novos artigos direto para a fila de agendamento sem revisão manual.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPublish}
                onChange={(e) => setAutoPublish(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Conectando e Validando...
                </>
              ) : (
                <>
                  <Rss className="w-3.5 h-3.5" />
                  Testar & Salvar Feed
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
