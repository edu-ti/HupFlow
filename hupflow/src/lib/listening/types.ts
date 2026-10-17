export type ListeningChannel = 'x' | 'linkedin' | 'instagram' | 'reddit' | 'youtube';

export type ListeningCategory =
  | 'brand_mention'
  | 'competitor_complaint'
  | 'industry_trend'
  | 'crisis_risk';

export type ListeningSentiment = 'positive' | 'neutral' | 'negative';

export type CrisisRiskLevel = 'normal' | 'watch' | 'elevated' | 'critical_crisis';

export type ListeningMentionStatus = 'open' | 'engaged' | 'resolved' | 'ignored';

export interface StrategicResponsePlaybook {
  strategyLabel: string;
  recommendedAction: string;
  suggestedPublicReply: string;
}

export interface ListeningMentionItem {
  id: string;
  organizationId: string;
  keywordMatched: string;
  channel: ListeningChannel;
  category: ListeningCategory;
  authorName: string;
  authorHandle: string;
  authorFollowers: number;
  content: string;
  sentiment: ListeningSentiment;
  sentimentScore: number;
  velocityPerHour: number;
  urgencyScore: number;
  crisisLevel: CrisisRiskLevel;
  status: ListeningMentionStatus;
  playbook: StrategicResponsePlaybook;
  detectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandHealthRadarSummary {
  totalMentions: number;
  netSentimentScore: number;
  criticalCrisisCount: number;
  competitorLeadOpportunities: number;
  crisisAlertActive: boolean;
  topTrendingKeyword: string;
}

export interface CreateListeningMentionInput {
  keywordMatched: string;
  channel: ListeningChannel;
  category?: ListeningCategory;
  authorName: string;
  authorHandle: string;
  authorFollowers: number;
  velocityPerHour: number;
  content: string;
}
