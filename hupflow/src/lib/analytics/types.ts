export type SocialProvider = 'instagram' | 'threads' | 'linkedin' | 'x';

export interface AnalyticsKPIs {
  totalImpressions: number;
  totalReach: number;
  totalEngagements: number;
  averageEngagementRate: number; // Ex: 4.85 (%)
  impressionsTrend: string; // Ex: "+14.2%"
  reachTrend: string; // Ex: "+8.9%"
  engagementsTrend: string; // Ex: "+19.4%"
  rateTrend: string; // Ex: "+0.8%"
}

export interface DailyMetricPoint {
  date: string; // YYYY-MM-DD
  impressions: number;
  reach: number;
  engagements: number;
}

export interface ChannelBreakdown {
  provider: SocialProvider;
  name: string;
  totalPosts: number;
  totalReach: number;
  totalEngagements: number;
  engagementRate: number;
  percentage: number;
}

export interface TopPostMetric {
  id: string;
  content: string;
  provider: SocialProvider;
  publishedAt: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
}

export interface AnalyticsResponse {
  period: '7d' | '30d' | '90d';
  provider: 'all' | SocialProvider;
  kpis: AnalyticsKPIs;
  dailySeries: DailyMetricPoint[];
  channelBreakdown: ChannelBreakdown[];
  topPosts: TopPostMetric[];
}
