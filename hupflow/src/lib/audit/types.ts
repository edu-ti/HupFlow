export type AuditCategory =
  | 'security'
  | 'content'
  | 'team'
  | 'connectors'
  | 'integrations';

export const AUDIT_CATEGORIES: { id: AuditCategory; label: string; description: string }[] = [
  {
    id: 'security',
    label: 'Segurança & Chaves',
    description: 'Logins, sessões, criação e revogação de chaves de API públicas.',
  },
  {
    id: 'content',
    label: 'Conteúdo & Posts',
    description: 'Criação, edição, exclusão, submissões editoriais, aprovações e despachos.',
  },
  {
    id: 'team',
    label: 'Equipe & Membros',
    description: 'Convites enviados, remoções e alterações de níveis hierárquicos RBAC.',
  },
  {
    id: 'connectors',
    label: 'Canais Sociais',
    description: 'Conexão e desconexão de contas do Instagram, Threads, LinkedIn e X.',
  },
  {
    id: 'integrations',
    label: 'Webhooks & Automação',
    description: 'Configuração, atualização e remoção de endpoints de integração n8n/Zapier.',
  },
];

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  actorId?: string | null;
  actorName: string;
  actorEmail: string;
  action: string;
  category: AuditCategory;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface CreateAuditLogInput {
  action: string;
  category: AuditCategory;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
}

export interface AuditLogFilter {
  category?: AuditCategory | 'all';
  action?: string;
  search?: string;
  days?: number;
  limit?: number;
  offset?: number;
}

export interface AuditLogsResponse {
  logs: AuditLogEntry[];
  total: number;
  hasMore: boolean;
}
