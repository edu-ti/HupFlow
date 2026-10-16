'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Send,
  Share2,
  Calendar,
  Settings,
  Sparkles,
  Layers,
  ChevronDown,
  Plus,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard & Fila', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Estúdio de Carrosséis', href: '/studio', icon: Palette, badge: 'IA' },
  { name: 'Compositor de Posts', href: '/composer', icon: Send },
  { name: 'Contas Conectadas', href: '/accounts', icon: Share2 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#07090E] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0A0D14]/90 backdrop-blur-xl flex flex-col justify-between p-4 z-20">
        <div>
          {/* Logo & Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                HupFlow
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">v1</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Clean Social Studio</p>
            </div>
          </Link>

          {/* Org Selector / Workspace */}
          <div className="mb-6 px-1">
            <button
              id="btn-workspace-selector"
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-850 transition-all text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                  H
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-200 truncate">HupFlow Workspace</p>
                  <p className="text-[10px] text-slate-500 truncate">Plano Pro • Multi-tenant</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  id={`nav-link-${item.href.replace('/', '')}`}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/20">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom CTA / Status */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <Link
            id="btn-quick-create"
            href="/composer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Post ou Carrossel
          </Link>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-slate-400">BullMQ & Redis Ativos</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-[#0A0D14]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-300">
              {navigation.find((n) => n.href === pathname)?.name || 'HupFlow Studio'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-800 bg-slate-900/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>AES-256 Safe</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xs text-white">
              HF
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
