import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  createAdvocacyCampaign,
  getAdvocacyBoardOverview,
} from '@/lib/advocacy/service';
import { AdvocacyChannel } from '@/lib/advocacy/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const channelParam = searchParams.get('channel') || 'all';

    const data = await getAdvocacyBoardOverview(
      auth.organizationId,
      channelParam
    );
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao carregar mural de Employee Advocacy.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    if (!body?.title || !body?.baseMessage || !body?.targetUrl) {
      return NextResponse.json(
        {
          error:
            'Título, mensagem-base e URL de destino da campanha são obrigatórios.',
        },
        { status: 400 }
      );
    }

    const campaign = await createAdvocacyCampaign(auth.organizationId, {
      title: String(body.title),
      department: body.department
        ? String(body.department)
        : 'Produto & Growth',
      channel: (body.channel as AdvocacyChannel) || 'linkedin',
      baseMessage: String(body.baseMessage),
      targetUrl: String(body.targetUrl),
      pointsReward: Number(body.pointsReward || 75),
      avgReachPerShare: Number(body.avgReachPerShare || 2000),
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao criar campanha de Employee Advocacy.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
