import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscriptions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyStripeSignature } from '@/lib/billing/stripe';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    const isValid = verifyStripeSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Assinatura inválida do Webhook Stripe' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orgId =
          session.client_reference_id || session.metadata?.organizationId;
        const plan = session.metadata?.plan || 'pro';
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (orgId) {
          const now = new Date();
          const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

          const existing = await db
            .select()
            .from(subscriptions)
            .where(eq(subscriptions.organizationId, orgId))
            .limit(1);

          if (existing.length > 0) {
            await db
              .update(subscriptions)
              .set({
                plan,
                status: 'active',
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                currentPeriodStart: now,
                currentPeriodEnd: nextMonth,
                updatedAt: now,
              })
              .where(eq(subscriptions.organizationId, orgId));
          } else {
            await db.insert(subscriptions).values({
              id: `sub_${Date.now()}`,
              organizationId: orgId,
              plan,
              status: 'active',
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              currentPeriodStart: now,
              currentPeriodEnd: nextMonth,
              cancelAtPeriodEnd: false,
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const subId = sub.id as string;
        const status = sub.status as string;
        const currentPeriodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000)
          : null;
        const cancelAtPeriodEnd = !!sub.cancel_at_period_end;

        await db
          .update(subscriptions)
          .set({
            status,
            currentPeriodEnd,
            cancelAtPeriodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subId));
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const subId = sub.id as string;

        await db
          .update(subscriptions)
          .set({
            plan: 'starter',
            status: 'canceled',
            cancelAtPeriodEnd: true,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subId));
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subId = invoice.subscription as string;
        if (subId) {
          await db
            .update(subscriptions)
            .set({
              status: 'active',
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subId = invoice.subscription as string;
        if (subId) {
          await db
            .update(subscriptions)
            .set({
              status: 'past_due',
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }
        break;
      }

      default:
        // Outros eventos recebidos são confirmados sem ação
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}
