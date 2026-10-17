export type WebhookEventType =
  | 'post.published'
  | 'post.failed'
  | 'media.uploaded'
  | 'campaign.completed'
  | 'test.ping';

export const SUPPORTED_WEBHOOK_EVENTS: { event: WebhookEventType; label: string; description: string }[] = [
  {
    event: 'post.published',
    label: 'Publicação Concluída',
    description: 'Disparado quando um post ou carrossel é publicado com sucesso em qualquer rede social.',
  },
  {
    event: 'post.failed',
    label: 'Falha na Publicação',
    description: 'Disparado quando uma tentativa de publicação falha após esgotamento de retentativas.',
  },
  {
    event: 'media.uploaded',
    label: 'Mídia Enviada',
    description: 'Disparado quando um arquivo de imagem, vídeo ou PDF é enviado para a biblioteca de mídias.',
  },
  {
    event: 'campaign.completed',
    label: 'Campanha IA Concluída',
    description: 'Disparado quando um lote de posts gerado pelo AI Bulk Scheduler é agendado.',
  },
];

export interface Webhook {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  organizationId: string;
  event: WebhookEventType;
  statusCode?: number | null;
  responseTimeMs?: number | null;
  payload: string;
  errorMessage?: string | null;
  createdAt: string;
}

export interface WebhookPayload<T = Record<string, any>> {
  id: string;
  event: WebhookEventType;
  createdAt: string;
  organizationId: string;
  data: T;
}

export interface CreateWebhookInput {
  name: string;
  url: string;
  events: WebhookEventType[];
  isActive?: boolean;
}

export interface UpdateWebhookInput {
  id: string;
  name?: string;
  url?: string;
  events?: WebhookEventType[];
  isActive?: boolean;
  regenerateSecret?: boolean;
}

export interface DispatchResult {
  webhookId: string;
  url: string;
  statusCode?: number;
  responseTimeMs: number;
  success: boolean;
  error?: string;
  deliveryId: string;
}
