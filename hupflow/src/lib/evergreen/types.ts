export type EvergreenCategory =
  | 'educational'
  | 'case_study'
  | 'framework'
  | 'lead_magnet';

export type EvergreenAngle = 'contrarian' | 'checklist' | 'story_hook';

export interface EvergreenVariation {
  id: string;
  angle: EvergreenAngle;
  label: string;
  caption: string;
}

export interface EvergreenItem {
  id: string;
  organizationId: string;
  title: string;
  originalCaption: string;
  category: EvergreenCategory;
  channels: string[];
  mediaType: 'carousel' | 'single_image' | 'short_video';
  evergreenScore: number;
  cooldownDays: number;
  recycleCount: number;
  maxRecycles: number;
  variations: EvergreenVariation[];
  isActive: boolean;
  lastRecycledAt?: number | null;
  nextScheduledAt?: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface EvergreenStats {
  totalItems: number;
  activeItems: number;
  totalRecyclesExecuted: number;
  averageEvergreenScore: number;
  estimatedHoursSaved: number;
}
