import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listFeedsWithRecentItems,
  createRssFeed,
  deleteRssFeed,
} from '@/lib/rss/service';
import { CreateRssFeedInput } from '@/lib/rss/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const data = await listFeedsWithRecentItems(auth.organizationId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[RSS API] Erro ao listar feeds:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar feeds RSS' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: CreateRssFeedInput = await req.json();

    if (!body.url || !body.url.trim()) {
      return NextResponse.json(
        { error: 'A URL do feed RSS é obrigatória' },
        { status: 400 }
      );
    }

    const feed = await createRssFeed(auth.organizationId, {
      name: body.name || '',
      url: body.url.trim(),
      autoPublish: body.autoPublish ?? false,
      targetNetworks: body.targetNetworks || ['linkedin', 'x'],
    });

    return NextResponse.json({ success: true, feed }, { status: 201 });
  } catch (err: any) {
    console.error('[RSS API] Erro ao cadastrar feed:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao conectar e validar feed RSS' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // Sem body JSON
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID do feed não informado' },
        { status: 400 }
      );
    }

    await deleteRssFeed(auth.organizationId, id);

    return NextResponse.json({
      success: true,
      message: 'Feed RSS excluído com sucesso.',
    });
  } catch (err: any) {
    console.error('[RSS API] Erro ao excluir feed:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao excluir feed' },
      { status: 500 }
    );
  }
}
