import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  createAbTestExperiment,
  listAbTestExperiments,
} from '@/lib/ab-testing/service';
import {
  AbHypothesisAngle,
  AbTargetMetric,
  AbTestChannel,
  AbTestType,
} from '@/lib/ab-testing/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status') || 'all';

    const data = await listAbTestExperiments(auth.organizationId, statusParam);
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Erro ao listar experimentos A/B.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    if (!body?.title || !body?.hookTextA) {
      return NextResponse.json(
        { error: 'Título do experimento e Gancho Controle (Variante A) são obrigatórios.' },
        { status: 400 }
      );
    }

    const experiment = await createAbTestExperiment(auth.organizationId, {
      title: String(body.title),
      channel: (body.channel as AbTestChannel) || 'instagram',
      testType: (body.testType as AbTestType) || 'hook_copy',
      hypothesisAngle:
        (body.hypothesisAngle as AbHypothesisAngle) || 'curiosity_gap',
      targetMetric: (body.targetMetric as AbTargetMetric) || 'engagement_rate',
      minSampleSize: Number(body.minSampleSize || 200),
      targetConfidencePct: Number(body.targetConfidencePct || 95),
      hookTextA: String(body.hookTextA),
      hookTextB: body.hookTextB ? String(body.hookTextB) : undefined,
    });

    return NextResponse.json({ experiment }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Erro ao criar experimento A/B.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
