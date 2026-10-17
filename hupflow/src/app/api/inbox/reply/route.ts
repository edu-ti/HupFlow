import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { replyOrUpdateInboxMessage } from '@/lib/inbox/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    if (!body.messageId || !body.action) {
      return NextResponse.json(
        { error: 'ID da mensagem e ação são obrigatórios.' },
        { status: 400 }
      );
    }

    if (body.action === 'reply' && (!body.replyText || !body.replyText.trim())) {
      return NextResponse.json(
        { error: 'O texto da resposta não pode estar vazio.' },
        { status: 400 }
      );
    }

    const updated = await replyOrUpdateInboxMessage(auth.organizationId, {
      messageId: body.messageId,
      action: body.action,
      replyText: body.replyText,
      repliedBy: body.repliedBy || 'Equipe HupFlow',
    });

    return NextResponse.json({ message: updated });
  } catch (err: any) {
    console.error('[Inbox Reply API] Erro ao processar resposta:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao responder interação' },
      { status: 400 }
    );
  }
}
