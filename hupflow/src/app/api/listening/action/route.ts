import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { mutateSocialListeningMention } from '@/lib/listening/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const mentionId = String(body?.mentionId || '');
    const action =
      body?.action === 'resolve'
        ? 'resolve'
        : body?.action === 'ignore'
        ? 'ignore'
        : body?.action === 'delete'
        ? 'delete'
        : 'engage';

    if (!mentionId) {
      return NextResponse.json(
        { error: 'O identificador mentionId é obrigatório.' },
        { status: 400 }
      );
    }

    const result = await mutateSocialListeningMention(
      auth.organizationId,
      mentionId,
      action
    );

    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao atualizar sinal de Social Listening.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
