import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listApiKeys,
  createApiKey,
  revokeApiKey,
} from '@/lib/api-keys/service';
import { CreateApiKeyInput } from '@/lib/api-keys/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const keys = await listApiKeys(auth.organizationId);
    return NextResponse.json({ apiKeys: keys });
  } catch (err: any) {
    console.error('[API Keys Route] Erro ao listar chaves:', err);
    return NextResponse.json({ error: 'Falha ao buscar chaves de API' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: CreateApiKeyInput = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: 'O nome identificador da chave de API é obrigatório' },
        { status: 400 }
      );
    }

    if (!body.scopes || !Array.isArray(body.scopes) || body.scopes.length === 0) {
      return NextResponse.json(
        { error: 'Selecione ao menos um escopo de permissão para a chave de API' },
        { status: 400 }
      );
    }

    const result = await createApiKey(
      auth.organizationId,
      {
        name: body.name.trim(),
        scopes: body.scopes,
        expiresInDays: body.expiresInDays,
      },
      auth.user.id
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error('[API Keys Route] Erro ao criar chave de API:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao gerar chave de API' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // Ignora erro de parsing caso não haja body
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: 'O identificador (id) da chave de API é obrigatório para revogação' },
        { status: 400 }
      );
    }

    await revokeApiKey(auth.organizationId, id);

    return NextResponse.json({ success: true, message: 'Chave de API revogada com sucesso' });
  } catch (err: any) {
    console.error('[API Keys Route] Erro ao revogar chave de API:', err);
    return NextResponse.json({ error: 'Falha ao revogar chave de API' }, { status: 500 });
  }
}
