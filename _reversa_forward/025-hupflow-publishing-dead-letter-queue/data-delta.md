# Delta de Dados: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador: `025-hupflow-publishing-dead-letter-queue`  
> Data: `2026-10-16`  

---

## 1. Nova Tabela no Drizzle ORM (`publishing_dlq`)

```typescript
export const publishingDlq = pgTable('publishing_dlq', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  postId: text('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  channelId: text('channel_id')
    .references(() => postChannels.id, { onDelete: 'cascade' })
    .notNull(),
  provider: text('provider').notNull(), // instagram | threads | linkedin | x
  accountName: text('account_name').notNull(),
  errorCategory: text('error_category').notNull(), // AUTH_EXPIRED | MEDIA_INVALID | RATE_LIMITED | CONTENT_REJECTED | NETWORK_TIMEOUT | UNKNOWN
  rawErrorMessage: text('raw_error_message').notNull(),
  recommendedAction: text('recommended_action').notNull(),
  retryCount: integer('retry_count').default(0).notNull(),
  lastRetryAt: timestamp('last_retry_at'),
  status: text('status').default('pending').notNull(), // pending | retrying | resolved | dismissed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Índices de Otimização
- `idx_dlq_org_status`: `(organization_id, status, created_at DESC)` para listagem e contadores da fila.
- `idx_dlq_post_channel`: `(post_id, channel_id)` para busca de incidente existente.
