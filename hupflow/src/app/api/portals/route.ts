import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listClientPortals,
  upsertClientPortal,
  deleteClientPortal,
} from '@/lib/portals/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const data = await listClientPortals(auth.organizationId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Portals API] Erro ao listar portais:', err);
    return NextResponse.json(
      { error: 'Falha ao carregar portais de clientes' },
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

    if (!body.clientName || !body.projectTitle) {
      return NextResponse.json(
        { error: 'Nome do cliente e título do projeto são obrigatórios.' },
        { status: 400 }
      );
    }

    const portal = await upsertClientPortal(auth.organizationId, body);
    return NextResponse.json({ portal });
  } catch (err: any) {
    console.error('[Portals API] Erro ao salvar portal:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao salvar portal do cliente' },
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
        { error: 'ID do portal é obrigatório' },
        { status: 400 }
      );
    }

    await deleteClientPortal(auth.organizationId, id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[Portals API] Erro ao remover portal:', err);
    return NextResponse.json(
      { error: 'Falha ao remover portal' },
      { status: 500 }
    );
  }
}
