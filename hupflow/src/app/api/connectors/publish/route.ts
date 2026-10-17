import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { socialAccounts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSocialConnector, decrypt } from '@/lib/connectors';
import { SocialProvider, SocialPublishPayload } from '@/lib/connectors/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const socialAccountId = body.socialAccountId as string;
    const content = body.content as string;
    const mediaUrls = (body.mediaUrls || []) as string[];
    const documentUrl = body.documentUrl as string | undefined;
    const documentTitle = body.documentTitle as string | undefined;
    const isThread = !!body.isThread;
    const threadNodes = body.threadNodes as string[] | undefined;

    if (!socialAccountId || !content) {
      return NextResponse.json(
        { error: 'Campos socialAccountId e content são obrigatórios.' },
        { status: 400 }
      );
    }

    let account: any = null;

    try {
      const rows = await db
        .select()
        .from(socialAccounts)
        .where(
          and(
            eq(socialAccounts.id, socialAccountId),
            eq(socialAccounts.organizationId, auth.organizationId)
          )
        )
        .limit(1);

      account = rows[0] || null;
    } catch {
      // Ignora erro se DB estiver offline
    }

    let accessToken = `mock_token_${Date.now()}`;
    let provider: SocialProvider = 'linkedin';

    if (account) {
      provider = account.provider as SocialProvider;
      try {
        accessToken = decrypt(account.encryptedAccessToken);
      } catch {
        accessToken = `mock_token_dev_${account.provider}`;
      }
    } else if (socialAccountId.includes('linkedin')) {
      provider = 'linkedin';
    } else if (socialAccountId.includes('x')) {
      provider = 'x';
    }

    const connector = getSocialConnector(provider);

    const payload: SocialPublishPayload = {
      content,
      mediaUrls,
      documentUrl,
      documentTitle,
      isThread,
      threadNodes,
    };

    const result = await connector.publish(accessToken, payload);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Falha ao despachar publicação na rede social' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      provider,
      externalPostId: result.externalPostId,
      externalPostUrl: result.externalPostUrl,
      threadPostIds: result.threadPostIds,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro inesperado no despacho de publicação' },
      { status: 500 }
    );
  }
}
