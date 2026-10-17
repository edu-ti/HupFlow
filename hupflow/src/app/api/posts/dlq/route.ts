import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listDlqIncidents,
  retryDlqIncident,
  dismissDlqIncident,
} from '@/lib/dlq/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const result = await listDlqIncidents(auth.organizationId, status);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[DLQ API] Erro ao listar incidentes:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar incidentes da Dead-Letter Queue' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { action, incidentId, updatedContent } = body;

    if (!incidentId) {
      return NextResponse.json(
        { error: 'O identificador do incidente (incidentId) é obrigatório.' },
        { status: 400 }
      );
    }

    if (action === 'retry') {
      const result = await retryDlqIncident(incidentId, auth.organizationId, updatedContent);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        incidentId,
        status: result.status,
        message: 'Incidente reenfileirado para reprocessamento com sucesso.',
      });
    }

    if (action === 'dismiss') {
      await dismissDlqIncident(incidentId, auth.organizationId);
      return NextResponse.json({
        success: true,
        incidentId,
        status: 'dismissed',
        message: 'Incidente arquivado/descartado com sucesso.',
      });
    }

    return NextResponse.json(
      { error: 'Ação inválida. Utilize "retry" ou "dismiss".' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[DLQ API] Erro ao executar ação no incidente:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao processar incidente na DLQ' },
      { status: 500 }
    );
  }
}
