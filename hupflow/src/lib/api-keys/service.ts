import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  ApiKey,
  ApiKeyScope,
  CreateApiKeyInput,
  CreatedApiKeyResponse,
  ValidateApiKeyResult,
} from './types';

/**
 * Gera um token público no formato canônico:
 * hup_live_<prefix_6chars>_<secret_48chars>
 * Ex: hup_live_4f8a9e_e98213bc5471a2d48c9034ff12a78104e12c4b89
 */
export function generateApiKeyToken(): { token: string; keyPrefix: string } {
  const prefixPart = crypto.randomBytes(3).toString('hex'); // 6 chars
  const secretPart = crypto.randomBytes(24).toString('hex'); // 48 chars
  const token = `hup_live_${prefixPart}_${secretPart}`;
  const keyPrefix = `hup_live_${prefixPart}_${secretPart.substring(0, 4)}...`;

  return { token, keyPrefix };
}

/**
 * Calcula o hash SHA-256 de um token bruto para armazenamento seguro no banco.
 * O segredo em texto puro nunca é persistido.
 */
export function hashApiKey(token: string): string {
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Verifica se um conjunto de escopos concedidos atende ao escopo requerido.
 * O escopo universal '*' concede acesso a qualquer operação.
 */
export function hasScope(
  grantedScopes: (ApiKeyScope | string)[],
  requiredScope: ApiKeyScope
): boolean {
  if (grantedScopes.includes('*')) {
    return true;
  }
  return grantedScopes.includes(requiredScope);
}

/**
 * Extrai o token de API a partir dos cabeçalhos HTTP.
 * Aceita tanto 'Authorization: Bearer <token>' quanto 'X-API-Key: <token>'.
 */
export function extractApiKeyFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>
): string | null {
  let authHeader: string | undefined;
  let customHeader: string | undefined;

  if (headers instanceof Headers) {
    authHeader = headers.get('authorization') || undefined;
    customHeader = headers.get('x-api-key') || undefined;
  } else {
    const rawAuth = headers['authorization'] || headers['Authorization'];
    authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
    const rawCustom = headers['x-api-key'] || headers['X-API-Key'] || headers['x-api-token'];
    customHeader = Array.isArray(rawCustom) ? rawCustom[0] : rawCustom;
  }

  if (customHeader && customHeader.trim().startsWith('hup_live_')) {
    return customHeader.trim();
  }

  if (authHeader) {
    const parts = authHeader.trim().split(/\s+/);
    if (parts.length === 2 && /^bearer$/i.test(parts[0]) && parts[1].startsWith('hup_live_')) {
      return parts[1];
    }
    if (parts.length === 1 && parts[0].startsWith('hup_live_')) {
      return parts[0];
    }
  }

  return null;
}

/**
 * Cria e persiste uma nova chave de API pública.
 * Retorna o objeto da chave e o token em texto puro (exibido apenas uma vez).
 */
export async function createApiKey(
  organizationId: string,
  input: CreateApiKeyInput,
  createdById?: string
): Promise<CreatedApiKeyResponse> {
  if (!input.name || input.name.trim().length === 0) {
    throw new Error('O nome identificador da chave de API é obrigatório.');
  }

  if (!input.scopes || input.scopes.length === 0) {
    throw new Error('Pelo menos um escopo de permissão deve ser atribuído à chave.');
  }

  const { token, keyPrefix } = generateApiKeyToken();
  const keyHash = hashApiKey(token);
  const now = new Date();
  const id = `apk_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  let expiresAt: Date | null = null;
  if (input.expiresInDays && input.expiresInDays > 0) {
    expiresAt = new Date(now.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000);
  }

  await db.insert(apiKeys).values({
    id,
    organizationId,
    name: input.name.trim(),
    keyPrefix,
    keyHash,
    scopes: input.scopes,
    createdById: createdById || null,
    expiresAt,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  const createdKey: ApiKey = {
    id,
    organizationId,
    name: input.name.trim(),
    keyPrefix,
    scopes: input.scopes,
    createdById: createdById || null,
    lastUsedAt: null,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  return {
    apiKey: createdKey,
    token,
  };
}

/**
 * Lista todas as chaves de API ativas de uma organização.
 */
export async function listApiKeys(organizationId: string): Promise<ApiKey[]> {
  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.organizationId, organizationId), eq(apiKeys.isActive, true)))
    .orderBy(apiKeys.createdAt);

  return rows.map((row) => ({
    id: row.id,
    organizationId: row.organizationId,
    name: row.name,
    keyPrefix: row.keyPrefix,
    scopes: row.scopes as ApiKeyScope[],
    createdById: row.createdById,
    lastUsedAt: row.lastUsedAt ? row.lastUsedAt.toISOString() : null,
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

/**
 * Revoga uma chave de API (soft-delete seguro marcando isActive = false).
 */
export async function revokeApiKey(
  organizationId: string,
  keyId: string
): Promise<boolean> {
  const result = await db
    .update(apiKeys)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(and(eq(apiKeys.id, keyId), eq(apiKeys.organizationId, organizationId)));

  return true;
}

/**
 * Valida um token bruto contra a base de dados em O(1) pelo hash SHA-256.
 */
export async function validateApiKeyToken(
  rawToken: string,
  requiredScope?: ApiKeyScope
): Promise<ValidateApiKeyResult> {
  if (!rawToken || !rawToken.startsWith('hup_live_')) {
    return { valid: false, error: 'Formato de chave de API inválido (esperado prefixo hup_live_).' };
  }

  const keyHash = hashApiKey(rawToken);

  const rows = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.isActive, true)))
    .limit(1);

  if (rows.length === 0) {
    return { valid: false, error: 'Chave de API não encontrada ou revogada.' };
  }

  const key = rows[0];

  // Verifica expiração
  if (key.expiresAt && new Date(key.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: 'Chave de API expirada.' };
  }

  const grantedScopes = (key.scopes || []) as ApiKeyScope[];

  // Verifica escopo requerido se especificado
  if (requiredScope && !hasScope(grantedScopes, requiredScope)) {
    return {
      valid: false,
      error: `Permissão insuficiente: a chave não possui o escopo "${requiredScope}".`,
      organizationId: key.organizationId,
      keyId: key.id,
      scopes: grantedScopes,
    };
  }

  // Atualiza lastUsedAt assincronamente sem travar requisição
  try {
    await db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, key.id));
  } catch (err) {
    console.error('[ApiKeys] Erro ao atualizar timestamp lastUsedAt:', err);
  }

  return {
    valid: true,
    organizationId: key.organizationId,
    keyId: key.id,
    scopes: grantedScopes,
  };
}

/**
 * Valida uma requisição HTTP entrante, extraindo a chave dos cabeçalhos e checando escopo.
 */
export async function validateApiKeyRequest(
  req: Request,
  requiredScope?: ApiKeyScope
): Promise<ValidateApiKeyResult> {
  const token = extractApiKeyFromHeaders(req.headers);
  if (!token) {
    return {
      valid: false,
      error: 'Cabeçalho de autenticação ausente ou inválido. Forneça Authorization: Bearer <key> ou X-API-Key: <key>.',
    };
  }

  return validateApiKeyToken(token, requiredScope);
}
