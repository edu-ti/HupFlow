import Link from 'next/link';
import { ArrowRight, Sparkles, LayoutDashboard, Palette, Send, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8 backdrop-blur-md animate-fade-in">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>HupFlow v1.0 • Clean Architecture & Zero Contaminação</span>
      </div>

      {/* Hero Title */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Crie, Redija e Agende Suas Redes com <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">Poder Total</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Plataforma moderna com estúdio de carrosséis 2D, IA de copywriting contextualizada e agendamento inteligente em filas confiáveis.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4 z-10">
        <Link
          id="btn-enter-dashboard"
          href="/dashboard"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <LayoutDashboard className="w-4 h-4" />
          Acessar Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          id="btn-open-studio"
          href="/studio"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-850 text-slate-200 font-semibold text-sm backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Palette className="w-4 h-4 text-purple-400" />
          Estúdio de Carrosséis
        </Link>
        <Link
          id="btn-open-composer"
          href="/composer"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-850 text-slate-200 font-semibold text-sm backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Send className="w-4 h-4 text-cyan-400" />
          Compositor de Posts
        </Link>
      </div>

      {/* Feature Cards Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full z-10">
        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm space-y-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">Canvas Gráfico 2D</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Multi-slides em formato quadrado, retrato ou stories. Sem licenças abusivas de SDKs proprietários.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm space-y-3 hover:border-purple-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">Copywriting & Ganchos</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            IA contextualizada gerando variações exclusivas para LinkedIn, X/Twitter, Instagram e Threads.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm space-y-3 hover:border-cyan-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-100">Filas & Segurança</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Agendamentos garantidos por BullMQ com retentativas exponenciais e tokens blindados com AES-256.
          </p>
        </div>
      </div>
    </main>
  );
}
