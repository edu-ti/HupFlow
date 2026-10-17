import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { getClientReportById } from '@/lib/reports/service';
import { buildExecutiveReportPdf } from '@/lib/reports/helpers';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID do relatório é obrigatório.' }, { status: 400 });
  }

  const report = await getClientReportById(auth.organizationId, id);
  if (!report) {
    return NextResponse.json({ error: 'Relatório não encontrado.' }, { status: 404 });
  }

  // Gera o PDF sob demanda para streaming com cabeçalhos binários
  const brandName = report.brandSlug.replace('-', ' ').toUpperCase();
  const doc = buildExecutiveReportPdf({
    brandName,
    reportTitle: report.reportTitle,
    periodLabel: `${new Date(report.periodStart).toLocaleDateString('pt-BR')} a ${new Date(report.periodEnd).toLocaleDateString('pt-BR')}`,
    metrics: report.metricsSnapshot,
    aiExecutiveSummary: report.aiExecutiveSummary,
  });

  const arrayBuffer = doc.output('arraybuffer');
  const buffer = Buffer.from(arrayBuffer);

  const filename = `relatorio-${report.brandSlug}-${report.id.substring(0, 8)}.pdf`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    },
  });
}
