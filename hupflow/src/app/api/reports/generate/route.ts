import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { generateClientReport } from '@/lib/reports/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    if (!body.brandSlug || typeof body.brandSlug !== 'string') {
      return NextResponse.json({ error: 'Identificador do cliente/marca é obrigatório.' }, { status: 400 });
    }
    if (!body.reportTitle || typeof body.reportTitle !== 'string') {
      return NextResponse.json({ error: 'Título do relatório é obrigatório.' }, { status: 400 });
    }

    const report = await generateClientReport(auth.organizationId, {
      brandSlug: body.brandSlug,
      reportTitle: body.reportTitle,
      daysRange: body.daysRange ? Number(body.daysRange) : 7,
      includeAiSummary: body.includeAiSummary !== false,
    });

    return NextResponse.json({
      success: true,
      report,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao gerar relatório em PDF.' }, { status: 500 });
  }
}
