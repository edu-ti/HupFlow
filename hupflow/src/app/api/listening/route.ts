import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  createSocialListeningMention,
  listSocialListeningMentions,
} from '@/lib/listening/service';
import {
  ListeningCategory,
  ListeningChannel,
} from '@/lib/listening/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category') || 'all';

    const data = await listSocialListeningMentions(
      auth.organizationId,
      categoryParam
    );
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao carregar sinais de Social Listening.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();

    if (!body?.keywordMatched || !body?.content || !body?.authorHandle) {
      return NextResponse.json(
        {
          error:
            'Palavra-chave, @handle do autor e conteúdo da menção são obrigatórios.',
        },
        { status: 400 }
      );
    }

    const mention = await createSocialListeningMention(auth.organizationId, {
      keywordMatched: String(body.keywordMatched),
      channel: (body.channel as ListeningChannel) || 'x',
      category: body.category
        ? (body.category as ListeningCategory)
        : undefined,
      authorName: String(body.authorName || body.authorHandle),
      authorHandle: String(body.authorHandle),
      authorFollowers: Number(body.authorFollowers || 5000),
      velocityPerHour: Number(body.velocityPerHour || 25),
      content: String(body.content),
    });

    return NextResponse.json({ mention }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : 'Erro ao registrar sinal de Social Listening.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
