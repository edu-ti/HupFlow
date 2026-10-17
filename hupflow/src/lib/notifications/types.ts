export type NotificationType =
  | 'approval_requested'
  | 'approval_reviewed'
  | 'post_published'
  | 'post_failed'
  | 'quota_warning'
  | 'member_joined'
  | 'general';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface NotificationItem {
  id: string;
  organizationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface CreateNotificationInput {
  organizationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  entityType?: string;
  entityId?: string;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}
