export type ApiKeyScope =
  | 'posts:write'
  | 'posts:read'
  | 'analytics:read'
  | 'media:upload'
  | 'webhooks:manage'
  | '*';

export const AVAILABLE_SCOPES: { scope: ApiKeyScope; label: string; description: string }[] = [
  {
    scope: 'posts:write',
    label: 'Criar & Agendar Posts',
    description: 'Permite criar, atualizar e agendar publicações e carrosséis em qualquer rede conectada.',
  },
  {
    scope: 'posts:read',
    label: 'Ler Publicações & Fila',
    description: 'Permite consultar o calendário editorial, status de fila e postagens passadas.',
  },
  {
    scope: 'analytics:read',
    label: 'Consultar Métricas & Analytics',
    description: 'Acesso a métricas agregadas de engajamento, impressões e taxas de conversão.',
  },
  {
    scope: 'media:upload',
    label: 'Upload de Mídias',
    description: 'Permite enviar imagens, vídeos e arquivos PDF para a biblioteca de assets da organização.',
  },
  {
    scope: 'webhooks:manage',
    label: 'Gerenciar Webhooks',
    description: 'Permite cadastrar, testar e configurar endpoints de webhook externos.',
  },
];

export interface ApiKey {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string;
  scopes: ApiKeyScope[];
  createdById?: string | null;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApiKeyInput {
  name: string;
  scopes: ApiKeyScope[];
  expiresInDays?: number; // Opcional: ex: 30, 90, 365 ou null (sem expiração)
}

export interface CreatedApiKeyResponse {
  apiKey: ApiKey;
  token: string; // Exibido apenas no momento da criação
}

export interface ValidateApiKeyResult {
  valid: boolean;
  error?: string;
  organizationId?: string;
  keyId?: string;
  scopes?: ApiKeyScope[];
}
