import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createStripePortalSession } from '@/lib/billing/stripe';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    let customerId = 'cus_dev_sandbox';

    try {
      const subRows = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.organizationId, auth.organizationId))
        .limit(1);

      if (subRows[0]?.stripeCustomerId) {
        customerId = subRows[0].stripeCustomerId;
      }
    } catch {
      // Falha graciosa se banco offline
    }

    const portalResult = await createStripePortalSession({
      customerId,
      returnUrl: `${baseUrl}/settings/billing`,
    });

    return NextResponse.json({ url: portalResult.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao gerar sessão do Customer Portal' },
      { status: 500 }
    );
  }
}
