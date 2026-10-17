import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { webhooks, webhookDeliveries } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { dispatchSingleWebhook } from '@/lib/webhooks/dispatcher';
import { WebhookEventType } from '@/lib/webhooks/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { id, event = 'test.ping' } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do webhook é obrigatório' }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(webhooks)
      .where(and(eq(webhooks.id, id), eq(webhooks.organizationId, auth.organizationId)))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Webhook não encontrado' }, { status: 404 });
    }

    const wh = rows[0];

    // Payload de teste representativo
    const sampleData = {
      message: 'Este é um disparo de teste do HupFlow para verificação de webhook.',
      simulatedAt: new Date().toISOString(),
      triggeredBy: {
        userId: auth.user.id,
        orgId: auth.organizationId,
      },
      environment: process.env.NODE_ENV || 'development',
      samplePost: {
        id: 'post_sample_clean_room',
        content: 'Testando integração de publicação automática com n8n/Zapier via HupFlow!',
        channels: ['linkedin', 'instagram'],
      },
    };

    const result = await dispatchSingleWebhook(
      { id: wh.id, url: wh.url, secret: wh.secret },
      event as WebhookEventType,
      auth.organizationId,
      sampleData
    );

    // Registra a tentativa de teste na tabela de entregas
    await db.insert(webhookDeliveries).values({
      id: result.deliveryId,
      webhookId: wh.id,
      organizationId: auth.organizationId,
      event: event as WebhookEventType,
      statusCode: result.statusCode ?? null,
      responseTimeMs: result.responseTimeMs,
      payload: JSON.stringify(sampleData),
      errorMessage: result.error ?? null,
    });

    return NextResponse.json({
      success: result.success,
      statusCode: result.statusCode,
      responseTimeMs: result.responseTimeMs,
      deliveryId: result.deliveryId,
      error: result.error,
    });
  } catch (err: any) {
    console.error('[Webhooks Test API] Erro no teste de disparo:', err);
    return NextResponse.json({ error: err.message || 'Falha no teste de webhook' }, { status: 500 });
  }
}
