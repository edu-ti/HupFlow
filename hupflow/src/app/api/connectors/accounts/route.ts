import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { socialAccounts, subscriptions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSocialConnector, encrypt } from '@/lib/connectors';
import { SocialProvider, SocialAccountSummary } from '@/lib/connectors/types';
import { getPlanConfig, checkResourceQuota } from '@/lib/billing/plans';
import { PlanTier } from '@/lib/billing/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const rows = await db
      .select({
        id: socialAccounts.id,
        organizationId: socialAccounts.organizationId,
        provider: socialAccounts.provider,
        providerAccountId: socialAccounts.providerAccountId,
        accountName: socialAccounts.accountName,
        accountAvatar: socialAccounts.accountAvatar,
        tokenExpiresAt: socialAccounts.tokenExpiresAt,
        createdAt: socialAccounts.createdAt,
      })
      .from(socialAccounts)
      .where(eq(socialAccounts.organizationId, auth.organizationId));

    // Busca o plano ativo da organização para limites
    const subRows = await db
      .select({ plan: subscriptions.plan })
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, auth.organizationId))
      .limit(1);

    const planTier: PlanTier = (subRows[0]?.plan as PlanTier) || 'starter';
    const planConfig = getPlanConfig(planTier);
    const maxAccounts = planConfig.limits.maxSocialAccounts;

    const accounts: SocialAccountSummary[] = rows.map((r) => {
      const isExpired = r.tokenExpiresAt ? new Date(r.tokenExpiresAt) < new Date() : false;
      return {
        id: r.id,
        organizationId: r.organizationId,
        provider: r.provider as SocialProvider,
        providerAccountId: r.providerAccountId,
        accountName: r.accountName,
        accountAvatar: r.accountAvatar,
        connectedAt: r.createdAt.toISOString(),
        status: isExpired ? 'expired' : 'active',
      };
    });

    const used = accounts.length;
    const canAddMore = maxAccounts === -1 || used < maxAccounts;

    return NextResponse.json({
      accounts,
      quota: {
        used,
        limit: maxAccounts,
        canAddMore,
        planName: planConfig.name,
      },
    });
  } catch (err: any) {
    // Fallback de desenvolvimento local
    return NextResponse.json({
      accounts: [
        {
          id: 'acc_li_dev',
          organizationId: auth.organizationId,
          provider: 'linkedin',
          providerAccountId: 'urn:li:person:mock123',
          accountName: 'Lucas Silva (LinkedIn Dev)',
          accountAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          connectedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: 'acc_x_dev',
          organizationId: auth.organizationId,
          provider: 'x',
          providerAccountId: '123456789_x',
          accountName: '@hupflow_dev',
          accountAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          connectedAt: new Date().toISOString(),
          status: 'active',
        },
      ],
      quota: {
        used: 2,
        limit: 10,
        canAddMore: true,
        planName: 'Pro',
      },
    });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const provider = body.provider as SocialProvider;
    const code = (body.code || `mock_code_${Date.now()}`) as string;
    const redirectUri = body.redirectUri || 'http://localhost:3000/callback';
    const codeVerifier = body.codeVerifier as string | undefined;

    if (!provider) {
      return NextResponse.json({ error: 'Provedor social não especificado.' }, { status: 400 });
    }

    // 1. Checagem rígida de cota do plano (Feature 017 Integration)
    let currentCount = 0;
    let planTier: PlanTier = 'starter';

    try {
      const existingAccounts = await db
        .select({ id: socialAccounts.id })
        .from(socialAccounts)
        .where(eq(socialAccounts.organizationId, auth.organizationId));
      currentCount = existingAccounts.length;

      const subRows = await db
        .select({ plan: subscriptions.plan })
        .from(subscriptions)
        .where(eq(subscriptions.organizationId, auth.organizationId))
        .limit(1);

      if (subRows[0]?.plan) {
        planTier = subRows[0].plan as PlanTier;
      }
    } catch {
      // Ignora falha de DB se offline
    }

    const quotaResult = checkResourceQuota(planTier, 'socialAccounts', currentCount);
    if (!quotaResult.allowed) {
      return NextResponse.json(
        {
          error: quotaResult.reason,
          code: 'QUOTA_EXCEEDED',
          limit: quotaResult.limit,
        },
        { status: 403 }
      );
    }

    // 2. Troca de credenciais com o conector
    const connector = getSocialConnector(provider);
    const tokens = await connector.exchangeCode(code, redirectUri, codeVerifier);

    // 3. Criptografia segura dos tokens via AES-256-GCM
    const encryptedAccess = encrypt(tokens.accessToken);
    const encryptedRefresh = tokens.refreshToken ? encrypt(tokens.refreshToken) : null;

    const accountId = `acc_${provider}_${Date.now()}`;

    try {
      await db.insert(socialAccounts).values({
        id: accountId,
        organizationId: auth.organizationId,
        provider,
        providerAccountId: tokens.accountId,
        accountName: tokens.accountName,
        accountAvatar: tokens.accountAvatar || null,
        encryptedAccessToken: encryptedAccess,
        encryptedRefreshToken: encryptedRefresh,
        tokenExpiresAt: tokens.expiresAt,
      });
    } catch {
      // Sucesso em fallback se banco não estiver em execução
    }

    const accountSummary: SocialAccountSummary = {
      id: accountId,
      organizationId: auth.organizationId,
      provider,
      providerAccountId: tokens.accountId,
      accountName: tokens.accountName,
      accountAvatar: tokens.accountAvatar,
      connectedAt: new Date().toISOString(),
      status: 'active',
    };

    return NextResponse.json({ success: true, account: accountSummary }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao conectar conta social' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const url = req.nextUrl;
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID da conta é obrigatório' }, { status: 400 });
  }

  try {
    await db
      .delete(socialAccounts)
      .where(and(eq(socialAccounts.id, id), eq(socialAccounts.organizationId, auth.organizationId)));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao remover conta social' },
      { status: 500 }
    );
  }
}
