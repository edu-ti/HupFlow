import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  NotificationItem,
  NotificationType,
  NotificationSeverity,
  CreateNotificationInput,
  NotificationListResponse,
} from './types';

import { getNotificationSeverity } from './notifications-utils';
export { getNotificationSeverity };

/**
 * Cria e persiste uma notificação de forma não-bloqueante.
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<NotificationItem | null> {
  const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date();

  try {
    await db.insert(notifications).values({
      id,
      organizationId: input.organizationId,
      userId: input.userId,
      type: input.type,
      title: input.title.trim(),
      message: input.message.trim(),
      linkUrl: input.linkUrl || null,
      entityType: input.entityType || null,
      entityId: input.entityId || null,
      isRead: false,
      readAt: null,
      createdAt: now,
    });

    return {
      id,
      organizationId: input.organizationId,
      userId: input.userId,
      type: input.type,
      title: input.title.trim(),
      message: input.message.trim(),
      linkUrl: input.linkUrl || null,
      entityType: input.entityType || null,
      entityId: input.entityId || null,
      isRead: false,
      readAt: null,
      createdAt: now.toISOString(),
    };
  } catch (err) {
    // Falha silenciosa para não travar fluxos operacionais
    console.error('[NotificationService] Erro ao gravar notificação:', err);
    return null;
  }
}

/**
 * Lista as notificações recentes do usuário e calcula o total de não lidas.
 */
export async function listUserNotifications(
  userId: string,
  organizationId: string,
  unreadOnly: boolean = false,
  limit: number = 20
): Promise<NotificationListResponse> {
  const conditions = [
    eq(notifications.userId, userId),
    eq(notifications.organizationId, organizationId),
  ];

  if (unreadOnly) {
    conditions.push(eq(notifications.isRead, false));
  }

  // 1. Busca as notificações
  const rows = await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(Math.min(limit, 100));

  // 2. Calcula total de não lidas
  const unreadRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.organizationId, organizationId),
        eq(notifications.isRead, false)
      )
    );

  const unreadCount = Number(unreadRows[0]?.count || 0);

  const formatted: NotificationItem[] = rows.map((r) => ({
    id: r.id,
    organizationId: r.organizationId,
    userId: r.userId,
    type: r.type as NotificationType,
    title: r.title,
    message: r.message,
    linkUrl: r.linkUrl,
    entityType: r.entityType,
    entityId: r.entityId,
    isRead: r.isRead,
    readAt: r.readAt ? r.readAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
  }));

  return {
    notifications: formatted,
    unreadCount,
  };
}

/**
 * Marca uma notificação individual como lida.
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string,
  organizationId: string
): Promise<boolean> {
  await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: new Date(),
    })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
        eq(notifications.organizationId, organizationId)
      )
    );

  return true;
}

/**
 * Marca todas as notificações do usuário no workspace como lidas.
 */
export async function markAllNotificationsAsRead(
  userId: string,
  organizationId: string
): Promise<number> {
  const now = new Date();
  await db
    .update(notifications)
    .set({
      isRead: true,
      readAt: now,
    })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.organizationId, organizationId),
        eq(notifications.isRead, false)
      )
    );

  return 1;
}
