import { db } from '@/lib/db';
import { generatedClientReports, clientReportSchedules } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import {
  GeneratedClientReport,
  ClientReportSchedule,
  CreateReportInput,
  ReportsPortfolioSummary,
} from './types';
import {
  synthesizeClientMetrics,
  generateAiSummary,
  summarizeReportsPortfolio,
  buildExecutiveReportPdf,
} from './helpers';

// In-memory fallback
const memoryReportsStore = new Map<string, GeneratedClientReport[]>();
const memorySchedulesStore = new Map<string, ClientReportSchedule[]>();

function getOrgReports(organizationId: string): GeneratedClientReport[] {
  if (!memoryReportsStore.has(organizationId)) {
    const initialMetrics = synthesizeClientMetrics(7);
    const initialReports: GeneratedClientReport[] = [
      {
        id: 'report-sample-001',
        organizationId,
        brandSlug: 'hupflow-growth',
        reportTitle: 'Relatório Semanal de Social Media — Performance Q4',
        periodStart: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
        periodEnd: new Date().toISOString(),
        pdfUrl: '/api/reports/download?id=report-sample-001',
        fileSizeBytes: 11240,
        metricsSnapshot: initialMetrics,
        aiExecutiveSummary: generateAiSummary('HupFlow Growth', initialMetrics),
        status: 'ready',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'report-sample-002',
        organizationId,
        brandSlug: 'aurora-fashion',
        reportTitle: 'Relatório Executivo Mensal — Aurora Fashion',
        periodStart: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
        periodEnd: new Date().toISOString(),
        pdfUrl: '/api/reports/download?id=report-sample-002',
        fileSizeBytes: 12150,
        metricsSnapshot: {
          ...initialMetrics,
          totalImpressions: 489200,
          totalReach: 312000,
          averageEngagementRate: 5.6,
          newFollowers: 1850,
          topPostTitle: 'Nova Coleção Cápsula Outono/Inverno',
        },
        aiExecutiveSummary: 'A campanha cápsula gerou o maior índice de cliques por post do semestre, com 5.6% de engajamento.',
        status: 'ready',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];
    memoryReportsStore.set(organizationId, initialReports);
  }
  return memoryReportsStore.get(organizationId)!;
}

export async function listClientReports(
  organizationId: string,
  filter?: { brandSlug?: string }
): Promise<GeneratedClientReport[]> {
  try {
    if (db) {
      let query = db
        .select()
        .from(generatedClientReports)
        .where(eq(generatedClientReports.organizationId, organizationId))
        .orderBy(desc(generatedClientReports.createdAt));

      const rows = await query;
      if (rows && rows.length > 0) {
        let results = rows.map((r: any) => ({
          id: r.id,
          organizationId: r.organizationId,
          brandSlug: r.brandSlug,
          reportTitle: r.reportTitle,
          periodStart: r.periodStart instanceof Date ? r.periodStart.toISOString() : String(r.periodStart),
          periodEnd: r.periodEnd instanceof Date ? r.periodEnd.toISOString() : String(r.periodEnd),
          pdfUrl: r.pdfUrl,
          fileSizeBytes: Number(r.fileSizeBytes || 0),
          metricsSnapshot: typeof r.metricsSnapshot === 'string' ? JSON.parse(r.metricsSnapshot) : r.metricsSnapshot,
          aiExecutiveSummary: r.aiExecutiveSummary,
          status: r.status as 'ready' | 'generating' | 'failed',
          createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
        }));

        if (filter?.brandSlug) {
          results = results.filter(r => r.brandSlug === filter.brandSlug);
        }
        return results;
      }
    }
    const fallback = getOrgReports(organizationId);
    if (filter?.brandSlug) {
      return fallback.filter(r => r.brandSlug === filter.brandSlug);
    }
    return fallback;
  } catch {
    return getOrgReports(organizationId);
  }
}

export async function getClientReportById(
  organizationId: string,
  reportId: string
): Promise<GeneratedClientReport | null> {
  const all = await listClientReports(organizationId);
  return all.find(r => r.id === reportId) || null;
}

export async function generateClientReport(
  organizationId: string,
  input: CreateReportInput
): Promise<GeneratedClientReport> {
  const days = input.daysRange || 7;
  const metrics = synthesizeClientMetrics(days);
  const brandName = input.brandSlug.replace('-', ' ').toUpperCase();
  const summary = input.includeAiSummary !== false
    ? generateAiSummary(brandName, metrics)
    : 'Relatório gerado sem síntese de IA.';

  const now = new Date();
  const periodStart = new Date(now.getTime() - 3600000 * 24 * days);

  const reportId = `report-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Gerar o PDF na memória para computar o tamanho real
  const doc = buildExecutiveReportPdf({
    brandName,
    reportTitle: input.reportTitle.trim(),
    periodLabel: `${periodStart.toLocaleDateString('pt-BR')} a ${now.toLocaleDateString('pt-BR')}`,
    metrics,
    aiExecutiveSummary: summary,
  });
  const pdfBytes = doc.output('arraybuffer').byteLength;

  const newReport: GeneratedClientReport = {
    id: reportId,
    organizationId,
    brandSlug: input.brandSlug,
    reportTitle: input.reportTitle.trim(),
    periodStart: periodStart.toISOString(),
    periodEnd: now.toISOString(),
    pdfUrl: `/api/reports/download?id=${reportId}`,
    fileSizeBytes: pdfBytes,
    metricsSnapshot: metrics,
    aiExecutiveSummary: summary,
    status: 'ready',
    createdAt: now.toISOString(),
  };

  try {
    if (db) {
      await db.insert(generatedClientReports).values({
        id: newReport.id,
        organizationId: newReport.organizationId,
        brandSlug: newReport.brandSlug,
        reportTitle: newReport.reportTitle,
        periodStart,
        periodEnd: now,
        pdfUrl: newReport.pdfUrl,
        fileSizeBytes: newReport.fileSizeBytes,
        metricsSnapshot: JSON.stringify(newReport.metricsSnapshot),
        aiExecutiveSummary: newReport.aiExecutiveSummary,
        status: newReport.status,
        createdAt: now,
      });
    }
  } catch {
    // In-memory fallback
  }

  const store = getOrgReports(organizationId);
  store.unshift(newReport);

  return newReport;
}

export async function getReportsPortfolioMetrics(
  organizationId: string
): Promise<ReportsPortfolioSummary> {
  const reports = await listClientReports(organizationId);
  return summarizeReportsPortfolio(reports);
}
