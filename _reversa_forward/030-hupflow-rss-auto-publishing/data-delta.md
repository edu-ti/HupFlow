# Delta de Dados: Feed RSS Integrator & Publicação com IA

> Identificador: `030-hupflow-rss-auto-publishing`  
> Data: `2026-10-16`  

---

## 1. Novas Tabelas no Schema do Drizzle (`rss_feeds` e `rss_feed_items`)

```typescript
export const rssFeeds = pgTable('rss_feeds', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'paused' | 'error'
  autoPublish: boolean('auto_publish').default(false).notNull(),
  targetNetworks: jsonb('target_networks').$type<string[]>().default(['linkedin', 'x']).notNull(),
  lastFetchedAt: timestamp('last_fetched_at'),
  lastError: text('last_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rssFeedItems = pgTable('rss_feed_items', {
  id: text('id').primaryKey(),
  feedId: text('feed_id')
    .references(() => rssFeeds.id, { onDelete: 'cascade' })
    .notNull(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  guid: text('guid').notNull(),
  title: text('title').notNull(),
  link: text('link').notNull(),
  summary: text('summary'),
  imageUrl: text('image_url'),
  pubDate: timestamp('pub_date'),
  status: text('status').default('pending').notNull(), // 'pending' | 'drafted' | 'published' | 'ignored'
  postId: text('post_id').references(() => posts.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## 2. Índices e Restrições
- Chaves primárias textuais com prefixos semânticos (`rss_...` e `rsi_...`).
- Integridade referencial com cascata em `rss_feeds` e `rss_feed_items`.
- Prevenção de duplicação por feed e GUID.
