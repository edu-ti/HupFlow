export interface ReportMetricsSnapshot {
  totalImpressions: number;
  totalReach: number;
  totalEngagement: number;
  averageEngagementRate: number; // Porcentagem (ex: 4.8)
  newFollowers: number;
  postsPublishedCount: number;
  topPerformingChannel: string;
  topPostTitle: string;
  topPostEngagementRate: number;
}

export interface ClientReportSchedule {
  id: string;
  organizationId: string;
  brandSlug: string;
  title: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  sendDayOfWeek: number; // 1 = Segunda
  recipients: string[];
  includeAiSummary: boolean;
  status: 'active' | 'paused';
  lastGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedClientReport {
  id: string;
  organizationId: string;
  brandSlug: string;
  reportTitle: string;
  periodStart: string;
  periodEnd: string;
  pdfUrl: string;
  fileSizeBytes: number;
  metricsSnapshot: ReportMetricsSnapshot;
  aiExecutiveSummary: string;
  status: 'ready' | 'generating' | 'failed';
  createdAt: string;
}

export interface CreateReportInput {
  brandSlug: string;
  reportTitle: string;
  daysRange?: number; // Padrão: 7
  includeAiSummary?: boolean;
}

export interface ReportsPortfolioSummary {
  totalReportsGenerated: number;
  totalClientsCovered: number;
  estimatedHoursSaved: number;
  averageEngagementAcrossClients: number;
}
