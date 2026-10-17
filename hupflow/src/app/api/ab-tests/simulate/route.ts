import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { mutateAbTestExperiment } from '@/lib/ab-testing/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const experimentId = String(body?.experimentId || '');
    const action =
      body?.action === 'declare_winner'
        ? 'declare_winner'
        : body?.action === 'delete'
        ? 'delete'
        : 'simulate_traffic';

    if (!experimentId) {
      return NextResponse.json(
        { error: 'O identificador experimentId é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await mutateAbTestExperiment(
      auth.organizationId,
      experimentId,
      action
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao atualizar experimento A/B.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
