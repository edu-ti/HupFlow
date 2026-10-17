export type InboxChannel = 'linkedin' | 'instagram' | 'x' | 'threads';

export type InboxInteractionType = 'comment' | 'mention' | 'dm';

export type InboxIntent =
  | 'lead_intent'
  | 'support'
  | 'praise'
  | 'question'
  | 'spam';

export type InboxSentiment = 'positive' | 'neutral' | 'negative';

export type InboxPriority = 'high' | 'normal' | 'low';

export type InboxStatus = 'unread' | 'replied' | 'archived';

export interface SocialInboxMessage {
  id: string;
  organizationId: string;
  channel: InboxChannel;
  interactionType: InboxInteractionType;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string | null;
  postTitle?: string | null;
  content: string;
  intent: InboxIntent;
  sentiment: InboxSentiment;
  priority: InboxPriority;
  status: InboxStatus;
  replyText?: string | null;
  repliedBy?: string | null;
  repliedAt?: number | null;
  receivedAt: number;
  createdAt: number;
}

export interface SmartReplySuggestion {
  id: string;
  tone: 'consultative' | 'friendly' | 'direct';
  label: string;
  text: string;
}

export interface SavedReplyMacro {
  id: string;
  title: string;
  template: string;
}

export interface InboxStats {
  totalMessages: number;
  unreadCount: number;
  leadIntentCount: number;
  repliedCount: number;
  responseRate: number;
}
