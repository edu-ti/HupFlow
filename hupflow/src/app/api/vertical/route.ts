import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  getVerticalPosts,
  createVerticalPost,
  updateVerticalPost,
  deleteVerticalPost,
  getVerticalPublishSummaryMetrics,
} from '@/lib/vertical/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const channel = (searchParams.get('channel') as any) || undefined;
    const status = searchParams.get('status') || undefined;

    const [posts, summary] = await Promise.all([
      getVerticalPosts(auth.organizationId, { channel, status }),
      getVerticalPublishSummaryMetrics(auth.organizationId),
    ]);

    return NextResponse.json({
      success: true,
      posts,
      summary,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao buscar vídeos verticais' },
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
    const {
      title,
      caption,
      videoUrl,
      thumbnailUrl,
      channels,
      durationSeconds,
      width,
      height,
      privacyLevel,
      tiktokSettings,
      youtubeSettings,
      scheduledAt,
    } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Título do vídeo é obrigatório.' },
        { status: 400 }
      );
    }

    if (!videoUrl || typeof videoUrl !== 'string' || videoUrl.trim().length === 0) {
      return NextResponse.json(
        { error: 'URL do vídeo é obrigatória.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json(
        { error: 'Selecione pelo menos um canal (TikTok ou YouTube Shorts).' },
        { status: 400 }
      );
    }

    const created = await createVerticalPost(auth.organizationId, {
      title,
      caption: caption || '',
      videoUrl,
      thumbnailUrl,
      channels,
      durationSeconds: Number(durationSeconds) || 30,
      width: Number(width) || 1080,
      height: Number(height) || 1920,
      privacyLevel: privacyLevel || 'public',
      tiktokSettings,
      youtubeSettings,
      scheduledAt,
    });

    return NextResponse.json({
      success: true,
      post: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao agendar vídeo vertical' },
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
    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do vídeo é obrigatório.' },
        { status: 400 }
      );
    }

    const updated = await updateVerticalPost(auth.organizationId, id, patch);
    if (!updated) {
      return NextResponse.json(
        { error: 'Vídeo vertical não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao atualizar vídeo vertical' },
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

    await deleteVerticalPost(auth.organizationId, id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao excluir vídeo vertical' },
      { status: 500 }
    );
  }
}
