export type CaptionPreset =
  | 'hormozi_bold'
  | 'karaoke_glow'
  | 'minimal_pill'
  | 'neon_cyber'
  | 'editorial_serif';

export type CaptionSafeZone = 'top_safe' | 'center' | 'bottom_safe';

export type CaptionLanguage = 'pt-BR' | 'en-US' | 'es-ES';

export type CaptionExportFormat = 'srt' | 'vtt';

export interface CaptionCue {
  id: string;
  index: number;
  startMs: number;
  endMs: number;
  text: string;
  highlightWord?: string | null;
  emoji?: string | null;
}

export interface CaptionStyleConfig {
  fontSizePx: number;
  primaryColor: string;
  highlightColor: string;
  backgroundColor: string;
  uppercase: boolean;
  autoEmoji: boolean;
  showShadow: boolean;
}

export interface VideoCaptionProject {
  id: string;
  organizationId: string;
  title: string;
  videoUrl?: string | null;
  language: CaptionLanguage;
  durationMs: number;
  preset: CaptionPreset;
  safeZonePosition: CaptionSafeZone;
  styleConfig: CaptionStyleConfig;
  cues: CaptionCue[];
  rawTranscript?: string | null;
  status: 'draft' | 'ready' | 'exported';
  createdAt: number;
  updatedAt: number;
}

export interface CaptionProjectStats {
  totalProjects: number;
  totalCues: number;
  totalDurationSec: number;
}

export interface SegmentTranscriptOptions {
  maxWordsPerCue?: number;
  totalDurationMs?: number;
  wordsPerMinute?: number;
  autoEmoji?: boolean;
}
