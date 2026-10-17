import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listEvergreenItems,
  upsertEvergreenItem,
  deleteEvergreenItem,
} from '@/lib/evergreen/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const data = await listEvergreenItems(auth.organizationId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Evergreen API] Erro ao listar itens:', err);
    return NextResponse.json(
      { error: 'Falha ao carregar biblioteca Evergreen' },
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
    if (!body.title || !body.originalCaption) {
      return NextResponse.json(
        { error: 'Título e legenda original são obrigatórios.' },
        { status: 400 }
      );
    }

    const item = await upsertEvergreenItem(auth.organizationId, body);
    return NextResponse.json({ item });
  } catch (err: any) {
    console.error('[Evergreen API] Erro ao salvar item:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao salvar item Evergreen' },
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
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'ID do item é obrigatório' },
        { status: 400 }
      );
    }

    await deleteEvergreenItem(auth.organizationId, id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[Evergreen API] Erro ao remover item:', err);
    return NextResponse.json(
      { error: 'Falha ao remover item Evergreen' },
      { status: 500 }
    );
  }
}
