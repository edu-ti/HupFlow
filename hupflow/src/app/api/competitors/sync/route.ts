import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { syncOrDeleteCompetitor } from '@/lib/competitors/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    const competitorId = String(body?.competitorId || '');
    const action = body?.action === 'delete' ? 'delete' : 'sync';

    if (!competitorId) {
      return NextResponse.json(
        { error: 'O identificador competitorId é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await syncOrDeleteCompetitor(
      auth.organizationId,
      competitorId,
      action
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Erro ao sincronizar ou remover concorrente.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
