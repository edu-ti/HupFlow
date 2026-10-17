export type CreatorChannel = 'instagram' | 'tiktok' | 'youtube' | 'linkedin';

export type CreatorPipelineStage =
  | 'prospecting'
  | 'negotiating'
  | 'contracted'
  | 'content_review'
  | 'published';

export type CreatorPerformanceTier =
  | 'elite_roi'
  | 'profitable'
  | 'break_even'
  | 'underperforming';

export interface CreatorFinancialMetrics {
  cpeBrl: number;
  cpmBrl: number;
  emvBrl: number;
  roiPct: number;
  performanceTier: CreatorPerformanceTier;
}

export interface CreatorPartnershipItem {
  id: string;
  organizationId: string;
  creatorName: string;
  handle: string;
  channel: CreatorChannel;
  niche: string;
  followersCount: number;
  stage: CreatorPipelineStage;
  agreedFeeBrl: number;
  deliverablesTotal: number;
  deliverablesCompleted: number;
  totalViews: number;
  totalEngagements: number;
  generatedRevenueBrl: number;
  couponCode: string;
  metrics: CreatorFinancialMetrics;
  ugcBriefing: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorPortfolioSummary {
  totalCreators: number;
  totalInvestedBrl: number;
  totalValueGeneratedBrl: number;
  portfolioRoiPct: number;
  avgCpeBrl: number;
  deliverablesProgressPct: number;
}

export interface CreateCreatorPartnershipInput {
  creatorName: string;
  handle: string;
  channel: CreatorChannel;
  niche?: string;
  followersCount: number;
  agreedFeeBrl: number;
  deliverablesTotal: number;
  couponCode?: string;
}
