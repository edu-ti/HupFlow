export type CampaignMode = 'preview' | 'commit';

export interface CampaignRequest {
  mode: CampaignMode;
  theme: string;
  targetAudience?: string;
  postCount: number; // 2 a 12
  daysOfWeek: number[]; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  timeSlot: string; // "HH:mm" (ex: "10:00")
  startDate?: string; // ISO string inicial (default: hoje)
  channels: string[]; // IDs das socialAccounts selecionadas
  includeCarousels?: boolean;
}

export interface ScheduleSlot {
  date: Date;
  dayOfWeek: number;
  dayOfWeekName: string;
  timeFormatted: string;
}

export interface CampaignSlide {
  slideNumber: number;
  type: 'cover' | 'content' | 'quote' | 'statistic' | 'cta';
  headline: string;
  bodyText: string;
  highlightText?: string;
}

export interface GeneratedCampaignPost {
  index: number;
  scheduledAt: string;
  dayOfWeekName: string;
  angle: string;
  headline: string;
  content: string;
  hashtags: string[];
  isCarousel: boolean;
  slideCount?: number;
  slides?: CampaignSlide[];
  postId?: string | null;
}

export interface CampaignQuotaSummary {
  usedBefore: number;
  added: number;
  totalAfter: number;
  limit: number;
}

export interface CampaignResponse {
  success: boolean;
  mode: CampaignMode;
  campaignTheme: string;
  posts: GeneratedCampaignPost[];
  quota: CampaignQuotaSummary;
  error?: string;
}
