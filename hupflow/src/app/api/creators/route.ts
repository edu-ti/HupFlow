import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  createCreatorPartnership,
  listCreatorPartnerships,
} from '@/lib/creators/service';
import { CreatorChannel } from '@/lib/creators/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const stageParam = searchParams.get('stage') || 'all';

    const data = await listCreatorPartnerships(auth.organizationId, stageParam);
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao listar parcerias de criadores.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    if (!body?.creatorName || !body?.handle) {
      return NextResponse.json(
        { error: 'Nome do criador e @handle são obrigatórios.' },
        { status: 400 }
      );
    }

    const creator = await createCreatorPartnership(auth.organizationId, {
      creatorName: String(body.creatorName),
      handle: String(body.handle),
      channel: (body.channel as CreatorChannel) || 'instagram',
      niche: body.niche ? String(body.niche) : 'SaaS & Produtividade',
      followersCount: Number(body.followersCount || 35000),
      agreedFeeBrl: Number(body.agreedFeeBrl || 2500),
      deliverablesTotal: Number(body.deliverablesTotal || 3),
      couponCode: body.couponCode ? String(body.couponCode) : undefined,
    });

    return NextResponse.json({ creator }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao cadastrar parceria de criador.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
