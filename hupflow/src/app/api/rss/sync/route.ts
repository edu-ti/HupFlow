import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { syncRssFeed } from '@/lib/rss/service';
import { db } from '@/lib/db';
import { rssFeeds } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    let feedId: string | undefined;
    try {
      const body = await req.json();
      feedId = body.feedId;
    } catch {
      // Sem body, sincroniza todos os ativos
    }

    if (feedId) {
      const newItems = await syncRssFeed(auth.organizationId, feedId);
      return NextResponse.json({
        success: true,
        message: `Sincronização concluída. ${newItems} novos artigos importados.`,
        newItems,
      });
    }

    // Sincroniza todos os feeds ativos do workspace
    const feeds = await db
      .select()
      .from(rssFeeds)
      .where(eq(rssFeeds.organizationId, auth.organizationId));

    let totalNew = 0;
    for (const f of feeds) {
      try {
        const count = await syncRssFeed(auth.organizationId, f.id);
        totalNew += count;
      } catch (err) {
        console.warn(`[RssSync] Falha ao sincronizar feed ${f.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sincronização global concluída. ${totalNew} novos artigos importados de ${feeds.length} feeds.`,
      newItems: totalNew,
    });
  } catch (err: any) {
    console.error('[RSS Sync API] Erro na sincronização:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao sincronizar feeds' },
      { status: 500 }
    );
  }
}
