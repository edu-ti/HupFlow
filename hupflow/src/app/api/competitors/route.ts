import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  createCompetitorProfile,
  getCompetitorRadarOverview,
} from '@/lib/competitors/service';
import {
  CompetitorChannel,
  CompetitorContentFormat,
} from '@/lib/competitors/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const channelParam = searchParams.get('channel') as CompetitorChannel | null;

    const overview = await getCompetitorRadarOverview(
      auth.organizationId,
      channelParam && channelParam !== ('all' as unknown as CompetitorChannel)
        ? channelParam
        : undefined
    );

    return NextResponse.json(overview);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao carregar radar competitivo.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    if (!body?.name || !body?.handle) {
      return NextResponse.json(
        { error: 'Nome e @handle do concorrente são obrigatórios.' },
        { status: 400 }
      );
    }

    const created = await createCompetitorProfile(auth.organizationId, {
      name: String(body.name),
      handle: String(body.handle),
      channel: (body.channel as CompetitorChannel) || 'instagram',
      niche: body.niche ? String(body.niche) : 'SaaS & Marketing Digital',
      followersCount: Number(body.followersCount || 15000),
      engagementRatePct: Number(body.engagementRatePct || 3.8),
      postsPerWeek: Number(body.postsPerWeek || 5),
      growth30dPct: Number(body.growth30dPct || 5.5),
      topFormat: (body.topFormat as CompetitorContentFormat) || 'carousel',
      topTopics: Array.isArray(body.topTopics)
        ? body.topTopics.map(String)
        : typeof body.topTopics === 'string'
        ? body.topTopics
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : ['Estratégia de Conteúdo', 'Funil Orgânico'],
    });

    return NextResponse.json({ competitor: created }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao adicionar concorrente.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
