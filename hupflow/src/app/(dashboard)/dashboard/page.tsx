'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2,
  TrendingUp,
  Plus,
  Palette,
  List,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react';
import { WeeklyCalendarView } from '@/components/calendar/WeeklyCalendarView';
import { RescheduleModal, CalendarPost } from '@/components/calendar/RescheduleModal';
import { BulkCampaignModal } from '@/components/campaign/BulkCampaignModal';

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedNetworkFilter, setSelectedNetworkFilter] = useState<string>('all');
  const [selectedPostToReschedule, setSelectedPostToReschedule] = useState<CalendarPost | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lista dinâmica de posts
  const [postsList, setPostsList] = useState<CalendarPost[]>([
    {
      id: 'p1',
      topic: 'Carrossel: 5 Princípios para Escalar SaaS',
      preview: 'Sem depender de rodadas de venture capital e mantendo o controle total da sua operação...',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // Hoje mais tarde
      networks: ['linkedin', 'x'],
      status: 'scheduled',
    },
    {
      id: 'p2',
      topic: 'Guia de Produtividade com IA',
      preview: 'Construir consistência em mídias sociais não é sobre postar em excesso — é sobre relevância...',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
      networks: ['linkedin', 'threads'],
      status: 'scheduled',
    },
    {
      id: 'p3',
      topic: 'Lançamento HupFlow v1.0',
      preview: 'Apresentando o novo estúdio clean-room de automação e carrosséis 2D para criadores modernos...',
      scheduledAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Hoje mais cedo
      networks: ['linkedin', 'x', 'instagram'],
      status: 'published',
    },
    {
      id: 'p4',
      topic: 'Estratégia de Aquisição Orgânica',
      preview: 'Como converter visualizações de carrossel em leads qualificados no funil de vendas...',
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Em 2 dias
      networks: ['instagram', 'linkedin'],
      status: 'scheduled',
    },
  ]);

  // Filtragem de Posts
  const filteredPosts = postsList.filter((post) => {
    if (selectedNetworkFilter === 'all') return true;
    return post.networks.includes(selectedNetworkFilter as any);
  });

  // Reprogramar Post
  const handleSaveReschedule = (postId: string, newDate: Date) => {
    setPostsList((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, scheduledAt: newDate } : p))
    );
    showToast('Horário da publicação reprogramado com sucesso no BullMQ!');
  };

  // Cancelar Post
  const handleCancelPost = (postId: string) => {
    setPostsList((prev) => prev.filter((p) => p.id !== postId));
    showToast('Publicação cancelada e removida da fila.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal de Reprogramação */}
      <RescheduleModal
        post={selectedPostToReschedule}
        isOpen={!!selectedPostToReschedule}
        onClose={() => setSelectedPostToReschedule(null)}
        onSave={handleSaveReschedule}
        onCancelPost={handleCancelPost}
      />

      {/* Modal de Campanha com IA em Lote */}
      <BulkCampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSuccess={() => {
          showToast('Campanha em lote agendada com sucesso no calendário!');
        }}
      />

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Painel de Operações</h1>
          <p className="text-sm text-slate-400">
            Acompanhe a cadência semanal, gerencie agendamentos e monitore a fila BullMQ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-dash-ai-campaign"
            onClick={() => setIsCampaignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 text-xs font-semibold transition-all shadow-md shadow-indigo-600/10"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Campanha com IA
          </button>
          <Link
            id="btn-dash-studio"
            href="/studio"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            Criar Carrossel
          </Link>
          <Link
            id="btn-dash-composer"
            href="/composer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Novo Post
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Posts na Fila</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {postsList.filter((p) => p.status === 'scheduled').length}
            </span>
            <span className="text-xs font-medium text-emerald-400">Próximos 7 dias</span>
          </div>
          <p className="text-[11px] text-slate-500">Delayed jobs ativos no BullMQ</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Publicados com Sucesso</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">49</span>
            <span className="text-xs font-medium text-emerald-400">100% no prazo</span>
          </div>
          <p className="text-[11px] text-slate-500">Zero falhas de execução</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Confiabilidade Fila</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">99.8%</span>
            <span className="text-xs font-medium text-cyan-400">BullMQ Active</span>
          </div>
          <p className="text-[11px] text-slate-500">Backoff exponencial configurado</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Canais Conectados</span>
            <Share2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">4</span>
            <span className="text-xs font-medium text-purple-400">4 Redes</span>
          </div>
          <p className="text-[11px] text-slate-500">LinkedIn, X, Instagram & Threads</p>
        </div>
      </div>

      {/* Main Content Area: Calendar vs Queue Table */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-6">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Calendário Semanal</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Lista de Fila</span>
              </button>
            </div>
          </div>

          {/* Social Network Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', name: 'Todas as Redes' },
              { id: 'linkedin', name: 'LinkedIn' },
              { id: 'x', name: 'X / Twitter' },
              { id: 'instagram', name: 'Instagram' },
              { id: 'threads', name: 'Threads' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedNetworkFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  selectedNetworkFilter === f.id
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Component */}
        {viewMode === 'calendar' ? (
          <WeeklyCalendarView
            posts={filteredPosts}
            onSelectPost={(post) => setSelectedPostToReschedule(post)}
          />
        ) : (
          /* List Mode */
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const timeStr = new Date(post.scheduledAt).toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              });

              return (
                <div
                  key={post.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700/80 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200">{post.topic}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          post.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {post.status === 'published' ? 'Publicado' : 'Agendado'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{post.preview}</p>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-1.5">
                      {post.networks.map((net) => (
                        <span
                          key={net}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 uppercase"
                        >
                          {net}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{timeStr}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPostToReschedule(post)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Reprogramar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
