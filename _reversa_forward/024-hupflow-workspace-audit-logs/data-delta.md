# Delta de Dados: Trilha de Auditoria do Workspace

> Identificador: `024-hupflow-workspace-audit-logs`  
> Data: `2026-10-16`  

---

## 1. Nova Tabela no Drizzle ORM (`workspace_audit_logs`)

```typescript
export const workspaceAuditLogs = pgTable('workspace_audit_logs', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
  actorName: text('actor_name').notNull(),
  actorEmail: text('actor_email').notNull(),
  action: text('action').notNull(), // ex: post.published, api_key.created
  category: text('category').notNull(), // security | content | team | connectors | integrations
  entityType: text('entity_type').notNull(), // post | channel | member | api_key | webhook
  entityId: text('entity_id'),
  details: json('details').$type<Record<string, any>>(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Índices de Alta Eficiência
- `idx_audit_org_created`: `(organization_id, created_at DESC)` para queries paginadas da linha do tempo.
- `idx_audit_org_category`: `(organization_id, category, created_at DESC)` para filtros rápidos por área.
