import { NotificationType, NotificationSeverity } from './types';

/**
 * Mapeia o tipo de notificação para sua severidade semântica (cores e ícones).
 * Seguro para Client Components e Webpack.
 */
export function getNotificationSeverity(type: NotificationType): NotificationSeverity {
  switch (type) {
    case 'post_failed':
      return 'error';
    case 'post_published':
      return 'success';
    case 'approval_requested':
    case 'quota_warning':
      return 'warning';
    case 'approval_reviewed':
    case 'member_joined':
    case 'general':
    default:
      return 'info';
  }
}
