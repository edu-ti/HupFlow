# Delta de Dados: Central de Notificações In-App

> Identificador: `026-hupflow-notification-center`  
> Data: `2026-10-16`  

---

## 1. Nova Tabela no Drizzle ORM (`notifications`)

```typescript
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(), // approval_requested | approval_reviewed | post_published | post_failed | quota_warning | member_joined | general
  title: text('title').notNull(),
  message: text('message').notNull(),
  linkUrl: text('link_url'),
  entityType: text('entity_type'), // post | member | billing | dlq
  entityId: text('entity_id'),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Índices de Alta Eficiência
- `idx_notifications_user_unread`: `(user_id, organization_id, is_read, created_at DESC)` para badge de contagem e feed de recentes.
