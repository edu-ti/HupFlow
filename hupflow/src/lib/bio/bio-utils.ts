import { BioLink, BioThemePreset } from './types';

// Funções utilitárias puras de link-in-bio (seguras para Client Components e Webpack)
export function sanitizeHandle(raw: string): string {
  const sanitized = raw
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized.slice(0, 40);
}

export function isValidHandle(handle: string): boolean {
  if (!handle || handle.length < 3 || handle.length > 40) return false;
  return /^[a-z0-9][a-z0-9_-]*[a-z0-9]$/.test(handle);
}

export function calculateBioCtr(totalViews: number, totalClicks: number): number {
  if (totalViews <= 0) return 0;
  const ctr = (totalClicks / totalViews) * 100;
  return Number(ctr.toFixed(2));
}

export function sortBioLinks(links: BioLink[]): BioLink[] {
  return [...links].sort((a, b) => {
    // Links em destaque primeiro se desejado, ou por sortOrder estrito
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.title.localeCompare(b.title);
  });
}

export function getThemeConfig(theme: BioThemePreset) {
  switch (theme) {
    case 'minimal_light':
      return {
        bg: 'bg-zinc-50 text-zinc-900',
        card: 'bg-white text-zinc-900 border-zinc-200 shadow-sm hover:border-zinc-300',
        accent: 'text-zinc-900',
        badge: 'bg-zinc-100 text-zinc-800',
      };
    case 'sunset_gradient':
      return {
        bg: 'bg-gradient-to-br from-amber-500 via-rose-600 to-purple-800 text-white',
        card: 'bg-white/15 backdrop-blur-md text-white border-white/20 shadow-lg hover:bg-white/25',
        accent: 'text-amber-200',
        badge: 'bg-white/20 text-white',
      };
    case 'ocean_breeze':
      return {
        bg: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900 text-white',
        card: 'bg-white/15 backdrop-blur-md text-white border-white/20 shadow-lg hover:bg-white/25',
        accent: 'text-cyan-200',
        badge: 'bg-white/20 text-white',
      };
    case 'emerald_luxe':
      return {
        bg: 'bg-gradient-to-b from-emerald-950 via-zinc-950 to-black text-emerald-50',
        card: 'bg-emerald-900/40 text-emerald-100 border-emerald-700/50 shadow-md hover:bg-emerald-800/50',
        accent: 'text-emerald-400',
        badge: 'bg-emerald-800/60 text-emerald-200',
      };
    case 'midnight':
    default:
      return {
        bg: 'bg-zinc-950 text-zinc-100',
        card: 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-md hover:border-zinc-700',
        accent: 'text-violet-400',
        badge: 'bg-violet-950/80 text-violet-300 border-violet-800/50',
      };
  }
}
