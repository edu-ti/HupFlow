# Data Delta: Dashboard de Analytics & Métricas Sociais

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/erd-complete.md` + `hupflow/src/lib/db/schema.ts`  

---

## 1. Nova Tabela no Drizzle ORM (`post_analytics`)

```typescript
export const postAnalytics = pgTable('post_analytics', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  channelId: text('channel_id').references(() => postChannels.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').notNull(), // instagram | threads | linkedin | x
  impressions: integer('impressions').default(0).notNull(),
  reach: integer('reach').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  shares: integer('shares').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  engagementRate: integer('engagement_rate').default(0).notNull(), // base 10000 (ex: 380 = 3.80%)
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});
```

---

## 2. Relações e Integridade

- `organizationId` -> `organizations.id` com `onDelete: 'cascade'` para isolamento multi-tenant automático.
- `postId` -> `posts.id` com `onDelete: 'cascade'` garantindo limpeza ao remover post.
- `channelId` -> `postChannels.id` com `onDelete: 'cascade'` vinculando ao canal específico.

---

## 3. Tipagens em `hupflow/src/lib/analytics/types.ts`

- `AnalyticsKPIs`: `totalImpressions`, `totalReach`, `totalEngagements`, `averageEngagementRate`.
- `DailyMetricPoint`: `date` (YYYY-MM-DD), `impressions`, `reach`, `engagements`.
- `ChannelBreakdown`: `provider`, `name`, `totalPosts`, `totalReach`, `engagementRate`, `color`.
- `TopPostMetric`: `id`, `content`, `provider`, `publishedAt`, `impressions`, `reach`, `likes`, `comments`, `shares`, `engagementRate`.
