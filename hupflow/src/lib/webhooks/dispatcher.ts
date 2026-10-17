import { db } from '@/lib/db';
import { webhooks, webhookDeliveries } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  Webhook,
  WebhookEventType,
  WebhookPayload,
  DispatchResult,
} from './types';
import { signWebhookPayload } from './signer';

/**
 * Executa o despacho HTTP POST para um único endpoint de webhook com timeout de 5 segundos
 * e assinatura criptográfica HMAC-SHA256 nos cabeçalhos.
 */
export async function dispatchSingleWebhook(
  webhook: { id: string; url: string; secret: string },
  event: WebhookEventType,
  organizationId: string,
  data: Record<string, any>
): Promise<DispatchResult> {
  const deliveryId = `del_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const timestamp = Math.floor(Date.now() / 1000);

  const payload: WebhookPayload = {
    id: eventId,
    event,
    createdAt: new Date().toISOString(),
    organizationId,
    data,
  };

  const payloadString = JSON.stringify(payload);
  const signature = signWebhookPayload(webhook.secret, timestamp, payloadString);

  const startTime = Date.now();
  let statusCode: number | undefined;
  let success = false;
  let errorMsg: string | undefined;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HupFlow-Webhooks/1.0',
        'X-HupFlow-Signature': signature,
        'X-HupFlow-Timestamp': timestamp.toString(),
        'X-HupFlow-Event': event,
        'X-HupFlow-Delivery': deliveryId,
      },
      body: payloadString,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    statusCode = res.status;
    // Considera sucesso qualquer resposta 2xx
    success = res.status >= 200 && res.status < 300;
    if (!success) {
      errorMsg = `Endpoint retornou código HTTP ${res.status}`;
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      errorMsg = 'Timeout de conexão excedido (5000ms)';
    } else {
      errorMsg = err.message || 'Falha de conexão com o servidor de destino';
    }
  }

  const responseTimeMs = Date.now() - startTime;

  return {
    webhookId: webhook.id,
    url: webhook.url,
    statusCode,
    responseTimeMs,
    success,
    error: errorMsg,
    deliveryId,
  };
}

/**
 * Localiza todos os webhooks ativos da organização inscritos no evento e despacha
 * as requisições em paralelo, registrando o log na tabela `webhook_deliveries`.
 */
export async function dispatchWebhookEvent(
  organizationId: string,
  event: WebhookEventType,
  data: Record<string, any>
): Promise<DispatchResult[]> {
  try {
    const activeWebhooks = await db
      .select()
      .from(webhooks)
      .where(and(eq(webhooks.organizationId, organizationId), eq(webhooks.isActive, true)));

    // Filtra webhooks que assinam este evento específico
    const matchingWebhooks = activeWebhooks.filter((wh) => {
      const subscribedEvents = Array.isArray(wh.events) ? wh.events : [];
      return subscribedEvents.includes(event) || subscribedEvents.includes('*' as any);
    });

    if (matchingWebhooks.length === 0) {
      return [];
    }

    // Executa envios paralelos
    const results = await Promise.all(
      matchingWebhooks.map(async (wh) => {
        const result = await dispatchSingleWebhook(
          { id: wh.id, url: wh.url, secret: wh.secret },
          event,
          organizationId,
          data
        );

        // Registra histórico na tabela webhook_deliveries
        try {
          await db.insert(webhookDeliveries).values({
            id: result.deliveryId,
            webhookId: wh.id,
            organizationId,
            event,
            statusCode: result.statusCode ?? null,
            responseTimeMs: result.responseTimeMs,
            payload: JSON.stringify(data),
            errorMessage: result.error ?? null,
          });
        } catch (dbErr) {
          console.error('[Webhooks] Falha ao registrar log de entrega:', dbErr);
        }

        return result;
      })
    );

    return results;
  } catch (err) {
    console.error(`[Webhooks] Erro ao despachar evento "${event}":`, err);
    return [];
  }
}
