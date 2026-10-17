import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { listInboxMessages, ingestInboxMessage } from '@/lib/inbox/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const channel = searchParams.get('channel');
    const intent = searchParams.get('intent');

    const data = await listInboxMessages(auth.organizationId, {
      status,
      channel,
      intent,
    });
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[Inbox API] Erro ao listar mensagens:', err);
    return NextResponse.json(
      { error: 'Falha ao carregar o Social Inbox' },
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
    if (!body.authorName || !body.content) {
      return NextResponse.json(
        { error: 'Autor e conteúdo da interação são obrigatórios.' },
        { status: 400 }
      );
    }

    const message = await ingestInboxMessage(auth.organizationId, body);
    return NextResponse.json({ message });
  } catch (err: any) {
    console.error('[Inbox API] Erro ao ingerir mensagem:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao registrar interação social' },
      { status: 400 }
    );
  }
}
