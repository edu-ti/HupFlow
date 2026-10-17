import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { synthesizeRssPostContent } from '@/lib/rss/service';
import { db } from '@/lib/db';
import { rssFeedItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { itemId, network = 'linkedin', tone = 'educational' } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'ID do artigo não fornecido' },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(rssFeedItems)
      .where(
        and(
          eq(rssFeedItems.id, itemId),
          eq(rssFeedItems.organizationId, auth.organizationId)
        )
      )
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Artigo do feed não encontrado' },
        { status: 404 }
      );
    }

    const item = rows[0];
    const draft = synthesizeRssPostContent(
      {
        title: item.title,
        link: item.link,
        summary: item.summary,
      },
      network,
      tone
    );

    // Atualiza status do artigo para drafted
    await db
      .update(rssFeedItems)
      .set({ status: 'drafted' })
      .where(eq(rssFeedItems.id, item.id));

    return NextResponse.json({
      success: true,
      draft: {
        title: item.title,
        imageUrl: item.imageUrl,
        ...draft,
      },
    });
  } catch (err: any) {
    console.error('[RSS Draft API] Erro ao sintetizar rascunho:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao sintetizar artigo com IA' },
      { status: 500 }
    );
  }
}
