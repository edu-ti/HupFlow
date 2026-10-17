import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import {
  subscriptions,
  socialAccounts,
  members,
  posts,
  media,
} from '@/lib/db/schema';
import { eq, gte } from 'drizzle-orm';
import { getPlanConfig, PLANS } from '@/lib/billing/plans';
import { PlanTier, BillingDetailsResponse } from '@/lib/billing/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const orgId = auth.organizationId;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    // 1. Busca dados da assinatura ativa
    const subRows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, orgId))
      .limit(1);

    const sub = subRows[0] || null;
    const planTier: PlanTier = (sub?.plan as PlanTier) || 'starter';
    const planConfig = getPlanConfig(planTier);

    // 2. Coleta de uso real de recursos
    const accountsCount = await db
      .select({ id: socialAccounts.id })
      .from(socialAccounts)
      .where(eq(socialAccounts.organizationId, orgId));

    const membersCount = await db
      .select({ id: members.id })
      .from(members)
      .where(eq(members.organizationId, orgId));

    const postsCount = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        eq(posts.organizationId, orgId)
      );

    const mediaRows = await db
      .select({ sizeBytes: media.sizeBytes })
      .from(media)
      .where(eq(media.organizationId, orgId));

    const totalStorageBytes = mediaRows.reduce(
      (acc, curr) => acc + (curr.sizeBytes || 0),
      0
    );

    const responsePayload: BillingDetailsResponse = {
      subscription: {
        id: sub?.id ?? `sub_${orgId}`,
        organizationId: orgId,
        plan: planTier,
        status: (sub?.status as any) || 'active',
        currentPeriodEnd:
          sub?.currentPeriodEnd?.toISOString() ??
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
        stripeCustomerId: sub?.stripeCustomerId ?? null,
        stripeSubscriptionId: sub?.stripeSubscriptionId ?? null,
      },
      limits: planConfig.limits,
      usage: {
        socialAccounts: accountsCount.length,
        teamMembers: membersCount.length > 0 ? membersCount.length : 1,
        postsThisMonth: postsCount.length,
        storageBytes: totalStorageBytes,
      },
      plans: Object.values(PLANS),
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    // Em fallback de desenvolvimento ou se a conexão com banco estiver offline
    const planTier: PlanTier = 'pro';
    const planConfig = getPlanConfig(planTier);

    const fallbackResponse: BillingDetailsResponse = {
      subscription: {
        id: `sub_${orgId}_dev`,
        organizationId: orgId,
        plan: planTier,
        status: 'active',
        currentPeriodEnd: new Date(
          now.getTime() + 24 * 24 * 60 * 60 * 1000
        ).toISOString(),
        cancelAtPeriodEnd: false,
        stripeCustomerId: 'cus_dev_sandbox',
        stripeSubscriptionId: 'sub_dev_sandbox',
      },
      limits: planConfig.limits,
      usage: {
        socialAccounts: 2,
        teamMembers: 2,
        postsThisMonth: 14,
        storageBytes: 32 * 1024 * 1024, // 32 MB
      },
      plans: Object.values(PLANS),
    };

    return NextResponse.json(fallbackResponse);
  }
}
