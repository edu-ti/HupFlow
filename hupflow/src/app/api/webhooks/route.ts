import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { webhooks, webhookDeliveries } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Webhook, WebhookEventType, CreateWebhookInput, UpdateWebhookInput } from '@/lib/webhooks/types';
import { generateWebhookSecret, isValidWebhookUrl } from '@/lib/webhooks/signer';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const rows = await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.organizationId, auth.organizationId))
      .orderBy(desc(webhooks.createdAt));

    // Busca as últimas 20 entregas de toda a organização para telemetria recente
    const recentDeliveries = await db
      .select()
      .from(webhookDeliveries)
      .where(eq(webhookDeliveries.organizationId, auth.organizationId))
      .orderBy(desc(webhookDeliveries.createdAt))
      .limit(20);

    const formattedWebhooks: Webhook[] = rows.map((r) => ({
      id: r.id,
      organizationId: r.organizationId,
      name: r.name,
      url: r.url,
      secret: r.secret,
      events: r.events as WebhookEventType[],
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      webhooks: formattedWebhooks,
      recentDeliveries: recentDeliveries.map((d) => ({
        id: d.id,
        webhookId: d.webhookId,
        event: d.event,
        statusCode: d.statusCode,
        responseTimeMs: d.responseTimeMs,
        errorMessage: d.errorMessage,
        createdAt: d.createdAt.toISOString(),
      })),
    });
  } catch (err: any) {
    console.error('[Webhooks API] Erro ao listar webhooks:', err);
    return NextResponse.json({ error: 'Falha ao buscar webhooks' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: CreateWebhookInput = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Nome do webhook é obrigatório' }, { status: 400 });
    }

    if (!body.url || !isValidWebhookUrl(body.url)) {
      return NextResponse.json(
        { error: 'URL do webhook inválida. Deve iniciar com http:// ou https://' },
        { status: 400 }
      );
    }

    if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        { error: 'Selecione ao menos um evento para subscrição' },
        { status: 400 }
      );
    }

    const newId = `wh_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const secret = generateWebhookSecret();
    const now = new Date();

    await db.insert(webhooks).values({
      id: newId,
      organizationId: auth.organizationId,
      name: body.name.trim(),
      url: body.url.trim(),
      secret,
      events: body.events,
      isActive: body.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });

    const createdWebhook: Webhook = {
      id: newId,
      organizationId: auth.organizationId,
      name: body.name.trim(),
      url: body.url.trim(),
      secret,
      events: body.events,
      isActive: body.isActive ?? true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    return NextResponse.json({ webhook: createdWebhook }, { status: 201 });
  } catch (err: any) {
    console.error('[Webhooks API] Erro ao criar webhook:', err);
    return NextResponse.json({ error: 'Falha ao criar webhook' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body: UpdateWebhookInput = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: 'ID do webhook é obrigatório' }, { status: 400 });
    }

    // Verifica existência e pertença ao workspace
    const existing = await db
      .select()
      .from(webhooks)
      .where(and(eq(webhooks.id, body.id), eq(webhooks.organizationId, auth.organizationId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Webhook não encontrado' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (body.name && body.name.trim()) updates.name = body.name.trim();
    if (body.url) {
      if (!isValidWebhookUrl(body.url)) {
        return NextResponse.json({ error: 'URL do webhook inválida' }, { status: 400 });
      }
      updates.url = body.url.trim();
    }
    if (body.events && Array.isArray(body.events) && body.events.length > 0) {
      updates.events = body.events;
    }
    if (typeof body.isActive === 'boolean') {
      updates.isActive = body.isActive;
    }
    if (body.regenerateSecret) {
      updates.secret = generateWebhookSecret();
    }

    await db
      .update(webhooks)
      .set(updates)
      .where(and(eq(webhooks.id, body.id), eq(webhooks.organizationId, auth.organizationId)));

    return NextResponse.json({ success: true, updatedFields: updates });
  } catch (err: any) {
    console.error('[Webhooks API] Erro ao atualizar webhook:', err);
    return NextResponse.json({ error: 'Falha ao atualizar webhook' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do webhook é obrigatório' }, { status: 400 });
    }

    const deleted = await db
      .delete(webhooks)
      .where(and(eq(webhooks.id, id), eq(webhooks.organizationId, auth.organizationId)));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Webhooks API] Erro ao excluir webhook:', err);
    return NextResponse.json({ error: 'Falha ao excluir webhook' }, { status: 500 });
  }
}
