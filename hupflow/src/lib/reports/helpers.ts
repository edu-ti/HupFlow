import { ReportMetricsSnapshot, GeneratedClientReport, ReportsPortfolioSummary } from './types';
import { buildExecutiveReportPdf, GeneratePdfOptions } from './pdfEngine';

export { buildExecutiveReportPdf };
export type { GeneratePdfOptions };

export function synthesizeClientMetrics(daysRange: number = 7): ReportMetricsSnapshot {
  return {
    totalImpressions: 142850,
    totalReach: 98400,
    totalEngagement: 6890,
    averageEngagementRate: 4.82,
    newFollowers: 420,
    postsPublishedCount: Math.max(3, Math.round(daysRange * 1.8)),
    topPerformingChannel: 'Instagram Reels & Carrossel LinkedIn',
    topPostTitle: '3 Segredos para Escalar Agências em 2026',
    topPostEngagementRate: 7.4,
  };
}

export function generateAiSummary(brandName: string, metrics: ReportMetricsSnapshot): string {
  return `No período avaliado, a marca ${brandName} apresentou crescimento expressivo de ${metrics.averageEngagementRate}% na taxa média de engajamento, totalizando mais de ${metrics.totalImpressions.toLocaleString('pt-BR')} impressões. O destaque absoluto foi o conteúdo "${metrics.topPostTitle}" veiculado no ${metrics.topPerformingChannel}, superando a média do setor em 54%.`;
}

export function summarizeReportsPortfolio(reports: GeneratedClientReport[]): ReportsPortfolioSummary {
  const total = reports.length;
  const uniqueBrands = new Set(reports.map(r => r.brandSlug)).size;
  const avgEngagement = total > 0
    ? Math.round((reports.reduce((acc, r) => acc + (r.metricsSnapshot?.averageEngagementRate || 0), 0) / total) * 10) / 10
    : 0;

  return {
    totalReportsGenerated: total,
    totalClientsCovered: uniqueBrands,
    estimatedHoursSaved: total * 4,
    averageEngagementAcrossClients: avgEngagement,
  };
}
