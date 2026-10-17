import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { mutateAdvocacyCampaign } from '@/lib/advocacy/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const campaignId = String(body?.campaignId || '');
    const action = body?.action === 'delete' ? 'delete' : 'record_share';

    if (!campaignId) {
      return NextResponse.json(
        { error: 'O identificador campaignId é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await mutateAdvocacyCampaign(
      auth.organizationId,
      campaignId,
      action
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao registrar compartilhamento no mural.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
