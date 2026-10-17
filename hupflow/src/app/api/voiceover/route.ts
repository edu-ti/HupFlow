import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listVoiceoverTracks,
  createVoiceoverTrack,
  updateVoiceoverTrack,
  deleteVoiceoverTrack,
  getVoiceoverStudioMetrics,
} from '@/lib/voiceover/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const url = new URL(req.url);
  const status = url.searchParams.get('status') || undefined;
  const language = url.searchParams.get('language') || undefined;
  const persona = url.searchParams.get('persona') || undefined;
  const search = url.searchParams.get('search') || undefined;
  const metricsOnly = url.searchParams.get('metrics') === 'true';

  if (metricsOnly) {
    const metrics = await getVoiceoverStudioMetrics(auth.organizationId);
    return NextResponse.json({ success: true, metrics });
  }

  const tracks = await listVoiceoverTracks(auth.organizationId, { status, language, persona, search });
  const metrics = await getVoiceoverStudioMetrics(auth.organizationId);

  return NextResponse.json({
    success: true,
    tracks,
    metrics,
  });
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json({ error: 'Título é obrigatório.' }, { status: 400 });
    }
    if (!body.scriptText || typeof body.scriptText !== 'string' || body.scriptText.trim().length === 0) {
      return NextResponse.json({ error: 'Texto do roteiro não pode ser vazio.' }, { status: 400 });
    }
    if (!body.voiceId || typeof body.voiceId !== 'string') {
      return NextResponse.json({ error: 'ID da voz é obrigatório.' }, { status: 400 });
    }

    const created = await createVoiceoverTrack(auth.organizationId, {
      title: body.title,
      scriptText: body.scriptText,
      voiceId: body.voiceId,
      language: body.language,
      persona: body.persona,
      speed: body.speed ? String(body.speed) : '1.0',
      pitch: body.pitch,
      tags: Array.isArray(body.tags) ? body.tags : undefined,
    });

    return NextResponse.json({
      success: true,
      track: created,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao processar criação de locução.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID da faixa é obrigatório.' }, { status: 400 });
    }

    const updated = await updateVoiceoverTrack(auth.organizationId, body.id, {
      title: body.title,
      scriptText: body.scriptText,
      voiceId: body.voiceId,
      persona: body.persona,
      speed: body.speed !== undefined ? String(body.speed) : undefined,
      pitch: body.pitch,
      status: body.status,
      tags: body.tags,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Faixa de áudio não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, track: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro ao atualizar locução.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID da faixa de áudio é obrigatório.' }, { status: 400 });
  }

  const deleted = await deleteVoiceoverTrack(auth.organizationId, id);
  if (!deleted) {
    return NextResponse.json({ error: 'Faixa não encontrada ou não pertence à organização.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
