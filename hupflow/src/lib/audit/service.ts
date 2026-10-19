import { db } from '@/lib/db';
import { workspaceAuditLogs } from '@/lib/db/schema';
import { eq, and, desc, gte, like, or } from 'drizzle-orm';
import {
  AuditLogEntry,
  AuditCategory,
  CreateAuditLogInput,
  AuditLogFilter,
  AuditLogsResponse,
} from './types';
import { formatAuditAction, serializeAuditLogsToCsv } from './audit-utils';

export { formatAuditAction, serializeAuditLogsToCsv };

/**
 * Registra uma ação de auditoria de forma segura e não-bloqueante.
 */
export async function recordAuditLog(
  organizationId: string,
  actor: { id?: string | null; name: string; email: string },
  input: CreateAuditLogInput
): Promise<AuditLogEntry | null> {
  const id = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date();

  try {
    await db.insert(workspaceAuditLogs).values({
      id,
      organizationId,
      actorId: actor.id || null,
      actorName: actor.name.trim() || 'Usuário',
      actorEmail: actor.email.trim(),
      action: input.action,
      category: input.category,
      entityType: input.entityType,
      entityId: input.entityId || null,
      details: input.details || null,
      ipAddress: input.ipAddress || null,
      createdAt: now,
    });

    return {
      id,
      organizationId,
      actorId: actor.id || null,
      actorName: actor.name.trim() || 'Usuário',
      actorEmail: actor.email.trim(),
      action: input.action,
      category: input.category,
      entityType: input.entityType,
      entityId: input.entityId || null,
      details: input.details || null,
      ipAddress: input.ipAddress || null,
      createdAt: now.toISOString(),
    };
  } catch (err) {
    // Falha silenciosa para não travar a operação principal do usuário
    console.error('[AuditService] Erro ao gravar registro de auditoria:', err);
    return null;
  }
}

/**
 * Lista os logs de auditoria de uma organização com filtros avançados.
 */
export async function listAuditLogs(
  organizationId: string,
  filter?: AuditLogFilter
): Promise<AuditLogsResponse> {
  const limit = Math.min(filter?.limit || 50, 200);
  const offset = filter?.offset || 0;

  const conditions = [eq(workspaceAuditLogs.organizationId, organizationId)];

  if (filter?.category && filter.category !== 'all') {
    conditions.push(eq(workspaceAuditLogs.category, filter.category));
  }

  if (filter?.action && filter.action.trim()) {
    conditions.push(eq(workspaceAuditLogs.action, filter.action.trim()));
  }

  if (filter?.days && filter.days > 0) {
    const minDate = new Date(Date.now() - filter.days * 24 * 60 * 60 * 1000);
    conditions.push(gte(workspaceAuditLogs.createdAt, minDate));
  }

  const rows = await db
    .select()
    .from(workspaceAuditLogs)
    .where(and(...conditions))
    .orderBy(desc(workspaceAuditLogs.createdAt))
    .limit(limit + 1)
    .offset(offset);

  const hasMore = rows.length > limit;
  const slicedRows = hasMore ? rows.slice(0, limit) : rows;

  let filtered = slicedRows;
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.toLowerCase().trim();
    filtered = slicedRows.filter(
      (r) =>
        r.actorName.toLowerCase().includes(q) ||
        r.actorEmail.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.entityType.toLowerCase().includes(q)
    );
  }

  const formatted: AuditLogEntry[] = filtered.map((r) => ({
    id: r.id,
    organizationId: r.organizationId,
    actorId: r.actorId,
    actorName: r.actorName,
    actorEmail: r.actorEmail,
    action: r.action,
    category: r.category as AuditCategory,
    entityType: r.entityType,
    entityId: r.entityId,
    details: r.details,
    ipAddress: r.ipAddress,
    createdAt: r.createdAt.toISOString(),
  }));

  return {
    logs: formatted,
    total: formatted.length,
    hasMore,
  };
}
