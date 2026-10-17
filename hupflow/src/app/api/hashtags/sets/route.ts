import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listHashtagSets,
  createHashtagSet,
  deleteHashtagSet,
  incrementSetUsage,
} from '@/lib/hashtags/service';
import { CreateHashtagSetInput } from '@/lib/hashtags/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const sets = await listHashtagSets(auth.organizationId);
    return NextResponse.json({ sets });
  } catch (err: any) {
    console.error('[Hashtag Sets API] Erro ao listar coleções:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar coleções de hashtags' },
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

    // Se a requisição for para incrementar contagem de uso ao injetar em post
    if (body.action === 'increment_usage' && body.setId) {
      await incrementSetUsage(auth.organizationId, body.setId);
      return NextResponse.json({ success: true });
    }

    const input: CreateHashtagSetInput = {
      name: body.name,
      category: body.category,
      tags: body.tags,
    };

    const newSet = await createHashtagSet(auth.organizationId, input);
    return NextResponse.json(newSet, { status: 201 });
  } catch (err: any) {
    console.error('[Hashtag Sets API] Erro ao criar coleção:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao salvar coleção de hashtags' },
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
        { error: 'ID da coleção de hashtags não informado' },
        { status: 400 }
      );
    }

    await deleteHashtagSet(auth.organizationId, id);

    return NextResponse.json({
      success: true,
      message: 'Coleção de hashtags removida com sucesso.',
    });
  } catch (err: any) {
    console.error('[Hashtag Sets API] Erro ao excluir coleção:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao excluir coleção' },
      { status: 500 }
    );
  }
}
