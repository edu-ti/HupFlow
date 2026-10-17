export type CompetitorChannel = 'instagram' | 'linkedin' | 'tiktok' | 'youtube' | 'x';

export type CompetitorContentFormat = 'carousel' | 'reel_video' | 'text_thread' | 'single_image';

export type CompetitiveThreatLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface CompetitorProfile {
  id: string;
  organizationId: string;
  name: string;
  handle: string;
  channel: CompetitorChannel;
  niche: string;
  followersCount: number;
  engagementRatePct: number;
  postsPerWeek: number;
  growth30dPct: number;
  topFormat: CompetitorContentFormat;
  topTopics: string[];
  threatScore: number;
  threatLevel: CompetitiveThreatLevel;
  weeklyEngagedReach: number;
  shareOfVoicePct: number;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceBenchmarkBaseline {
  name: string;
  handle: string;
  followersCount: number;
  engagementRatePct: number;
  postsPerWeek: number;
  growth30dPct: number;
  coveredTopics: string[];
  weeklyEngagedReach: number;
  shareOfVoicePct: number;
}

export interface NicheBenchmarkComparison {
  nicheAvgEngagementPct: number;
  nicheAvgPostsPerWeek: number;
  nicheAvgGrowth30dPct: number;
  engagementDeltaPct: number;
  cadenceDeltaPosts: number;
  growthDeltaPct: number;
  brandShareOfVoicePct: number;
  winningFormatInNiche: CompetitorContentFormat;
}

export interface ContentGapOpportunity {
  id: string;
  topic: string;
  competitorSource: string;
  recommendedFormat: CompetitorContentFormat;
  opportunityScore: number;
  suggestedHook: string;
  rationale: string;
}

export interface CreateCompetitorInput {
  name: string;
  handle: string;
  channel: CompetitorChannel;
  niche?: string;
  followersCount: number;
  engagementRatePct: number;
  postsPerWeek: number;
  growth30dPct: number;
  topFormat?: CompetitorContentFormat;
  topTopics?: string[];
}

export interface CompetitorRadarOverview {
  workspaceBaseline: WorkspaceBenchmarkBaseline;
  competitors: CompetitorProfile[];
  comparison: NicheBenchmarkComparison;
  contentGaps: ContentGapOpportunity[];
}
