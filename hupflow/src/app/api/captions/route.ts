import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listCaptionProjects,
  upsertCaptionProject,
  deleteCaptionProject,
} from '@/lib/captions/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const data = await listCaptionProjects(auth.organizationId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Captions API] Erro ao listar projetos de legendas:', err);
    return NextResponse.json(
      { error: 'Falha ao carregar projetos de legendas' },
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

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'O título do projeto de legendas é obrigatório.' },
        { status: 400 }
      );
    }

    const project = await upsertCaptionProject(auth.organizationId, body);
    return NextResponse.json({ project });
  } catch (err: any) {
    console.error('[Captions API] Erro ao salvar projeto de legendas:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao salvar projeto de legendas' },
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
        { error: 'ID do projeto é obrigatório' },
        { status: 400 }
      );
    }

    await deleteCaptionProject(auth.organizationId, id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[Captions API] Erro ao remover projeto:', err);
    return NextResponse.json(
      { error: 'Falha ao remover projeto de legendas' },
      { status: 500 }
    );
  }
}
