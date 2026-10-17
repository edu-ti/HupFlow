import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PlanTier } from '@/lib/billing/types';
import { PLANS } from '@/lib/billing/plans';
import { createStripeCheckoutSession } from '@/lib/billing/stripe';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const plan = body.plan as PlanTier;

    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: 'Plano inválido especificado. Escolha starter, pro ou agency.' },
        { status: 400 }
      );
    }

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const sessionResult = await createStripeCheckoutSession({
      organizationId: auth.organizationId,
      customerEmail: auth.user.email,
      plan,
      successUrl: `${baseUrl}/settings/billing?checkout=success`,
      cancelUrl: `${baseUrl}/settings/billing?checkout=cancelled`,
    });

    // Se estiver em modo sandbox/desenvolvimento, já atualiza o registro no banco para testes imediatos
    if (sessionResult.isSandbox) {
      try {
        const existing = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.organizationId, auth.organizationId))
          .limit(1);

        const now = new Date();
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (existing.length > 0) {
          await db
            .update(subscriptions)
            .set({
              plan,
              status: 'active',
              currentPeriodStart: now,
              currentPeriodEnd: nextMonth,
              updatedAt: now,
            })
            .where(eq(subscriptions.organizationId, auth.organizationId));
        } else {
          await db.insert(subscriptions).values({
            id: `sub_${Date.now()}`,
            organizationId: auth.organizationId,
            plan,
            status: 'active',
            stripeCustomerId: 'cus_dev_sandbox',
            stripeSubscriptionId: `sub_sim_${Date.now()}`,
            currentPeriodStart: now,
            currentPeriodEnd: nextMonth,
            cancelAtPeriodEnd: false,
          });
        }
      } catch (dbErr) {
        // Silencioso em fallback dev sem banco rodando
      }
    }

    return NextResponse.json({ url: sessionResult.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao processar sessão de checkout' },
      { status: 500 }
    );
  }
}
