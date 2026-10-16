export type SocialNetwork = 'linkedin' | 'x' | 'instagram' | 'threads';

export interface AttachedMedia {
  id: string;
  url: string;
  type: 'image' | 'pdf' | 'carousel';
  fileName: string;
  previewUrl?: string;
  slideCount?: number;
}

export interface NetworkConfig {
  id: SocialNetwork;
  name: string;
  charLimit: number;
  color: string;
  badgeBg: string;
}

export const NETWORK_CONFIGS: Record<SocialNetwork, NetworkConfig> = {
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    charLimit: 3000,
    color: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    charLimit: 280,
    color: 'from-slate-700 to-slate-900',
    badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    charLimit: 2200,
    color: 'from-pink-600 to-purple-600',
    badgeBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  },
  threads: {
    id: 'threads',
    name: 'Threads',
    charLimit: 500,
    color: 'from-zinc-700 to-zinc-900',
    badgeBg: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
  },
};
