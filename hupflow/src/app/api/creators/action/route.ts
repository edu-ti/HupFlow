import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { mutateCreatorPartnership } from '@/lib/creators/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const creatorId = String(body?.creatorId || '');
    const action =
      body?.action === 'advance_stage'
        ? 'advance_stage'
        : body?.action === 'delete'
        ? 'delete'
        : 'log_deliverable';

    if (!creatorId) {
      return NextResponse.json(
        { error: 'O identificador creatorId é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await mutateCreatorPartnership(
      auth.organizationId,
      creatorId,
      action
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao atualizar parceria de criador.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
