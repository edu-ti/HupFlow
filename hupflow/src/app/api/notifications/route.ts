import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import {
  listUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/notifications/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

    const result = await listUserNotifications(
      auth.user.id,
      auth.organizationId,
      unreadOnly,
      limit
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[Notifications API] Erro ao listar notificações:', err);
    return NextResponse.json(
      { error: 'Falha ao buscar notificações' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      await markAllNotificationsAsRead(auth.user.id, auth.organizationId);
      return NextResponse.json({
        success: true,
        message: 'Todas as notificações foram marcadas como lidas.',
      });
    }

    if (notificationId) {
      await markNotificationAsRead(notificationId, auth.user.id, auth.organizationId);
      return NextResponse.json({
        success: true,
        notificationId,
        message: 'Notificação marcada como lida.',
      });
    }

    return NextResponse.json(
      { error: 'Informe notificationId ou markAllAsRead: true' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[Notifications API] Erro ao atualizar notificação:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao atualizar status de leitura' },
      { status: 500 }
    );
  }
}
