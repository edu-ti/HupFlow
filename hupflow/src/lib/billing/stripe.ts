import crypto from 'crypto';
import { PlanTier } from './types';
import { PLANS } from './plans';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Cria sessão de Checkout no Stripe via REST API nativa (sem dependências externas pesadas).
 * Em ambiente dev sem chave configurada, retorna URL de retorno simulada.
 */
export async function createStripeCheckoutSession(params: {
  organizationId: string;
  customerEmail: string;
  plan: PlanTier;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string; isSandbox: boolean; sessionId?: string }> {
  if (!STRIPE_SECRET_KEY) {
    return {
      url: `${params.successUrl}?sandbox=true&plan=${params.plan}`,
      isSandbox: true,
      sessionId: `cs_dev_sandbox_${Date.now()}`,
    };
  }

  const planConfig = PLANS[params.plan];
  const unitAmountInCents = planConfig.priceMonthly * 100;

  const body = new URLSearchParams();
  body.append('mode', 'subscription');
  body.append('client_reference_id', params.organizationId);
  body.append('customer_email', params.customerEmail);
  body.append('success_url', params.successUrl);
  body.append('cancel_url', params.cancelUrl);
  body.append('metadata[organizationId]', params.organizationId);
  body.append('metadata[plan]', params.plan);

  body.append('line_items[0][price_data][currency]', 'brl');
  body.append('line_items[0][price_data][product_data][name]', `HupFlow Plano ${planConfig.name}`);
  body.append('line_items[0][price_data][product_data][description]', planConfig.tagline);
  body.append('line_items[0][price_data][unit_amount]', unitAmountInCents.toString());
  body.append('line_items[0][price_data][recurring][interval]', 'month');
  body.append('line_items[0][quantity]', '1');

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao criar Checkout Session no Stripe (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    url: data.url,
    isSandbox: false,
    sessionId: data.id,
  };
}

/**
 * Cria sessão do Customer Portal do Stripe para gerenciamento de cobranças.
 */
export async function createStripePortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string; isSandbox: boolean }> {
  if (!STRIPE_SECRET_KEY || params.customerId.startsWith('cus_dev_')) {
    return {
      url: `${params.returnUrl}?portal=sandbox`,
      isSandbox: true,
    };
  }

  const body = new URLSearchParams();
  body.append('customer', params.customerId);
  body.append('return_url', params.returnUrl);

  const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ao criar Portal Session no Stripe (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return {
    url: data.url,
    isSandbox: false,
  };
}

/**
 * Validação de integridade de assinatura do Webhook Stripe (HMAC-SHA256).
 */
export function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string = STRIPE_WEBHOOK_SECRET || ''
): boolean {
  if (!secret) {
    // Sem chave secreta configurada em dev, permite bypass seguro para testes locais
    return true;
  }
  if (!signatureHeader) {
    return false;
  }

  try {
    const parts = signatureHeader.split(',').reduce((acc, part) => {
      const [key, val] = part.split('=');
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {} as Record<string, string>);

    const timestamp = parts['t'];
    const expectedSignature = parts['v1'];

    if (!timestamp || !expectedSignature) return false;

    const signedPayload = `${timestamp}.${rawBody}`;
    const hmac = crypto.createHmac('sha256', secret);
    const calculatedSignature = hmac.update(signedPayload).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}
