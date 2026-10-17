import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getContentRepurposingKits,
  createContentRepurposingKit,
  getRepurposingSummaryMetrics,
  updateRepurposingKitStatus,
  deleteContentRepurposingKit,
} from '@/lib/repurpose/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const [kits, metrics] = await Promise.all([
      getContentRepurposingKits(auth.organizationId),
      getRepurposingSummaryMetrics(auth.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      kits,
      metrics,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao buscar matriz de reaproveitamento' },
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
    const { title, rawText, sourceType, sourceUrl, tone, tags } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Título do conteúdo é obrigatório.' },
        { status: 400 }
      );
    }

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 30) {
      return NextResponse.json(
        { error: 'Texto base é obrigatório e deve ter no mínimo 30 caracteres.' },
        { status: 400 }
      );
    }

    const kit = await createContentRepurposingKit(auth.organizationId, {
      title,
      rawText,
      sourceType: sourceType || 'youtube_transcript',
      sourceUrl,
      tone: tone || 'authoritative',
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({
      success: true,
      kit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao gerar kit de reaproveitamento' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Parâmetros "id" e "status" são obrigatórios.' },
        { status: 400 }
      );
    }

    const updated = await updateRepurposingKitStatus(auth.organizationId, id, status);
    if (!updated) {
      return NextResponse.json(
        { error: 'Kit de reaproveitamento não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      kit: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao atualizar kit' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Parâmetro "id" é obrigatório.' },
        { status: 400 }
      );
    }

    await deleteContentRepurposingKit(auth.organizationId, id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao excluir kit' },
      { status: 500 }
    );
  }
}
