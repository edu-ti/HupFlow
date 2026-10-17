# Delta de Dados: Encurtador de Links & Rastreamento UTM por Canal

> Identificador: `027-hupflow-custom-shortlinks-utm`  
> Data: `2026-10-16`  

---

## 1. Novas Tabelas no Drizzle ORM

### Tabela `short_links`
```typescript
export const shortLinks = pgTable('short_links', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  slug: text('slug').notNull().unique(), // ex: s7f9k2 ou blackfriday
  destinationUrl: text('destination_url').notNull(),
  title: text('title').notNull(),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium').default('social'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  totalClicks: integer('total_clicks').default(0).notNull(),
  lastClickedAt: timestamp('last_clicked_at'),
  createdById: text('created_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Tabela `short_link_clicks`
```typescript
export const shortLinkClicks = pgTable('short_link_clicks', {
  id: text('id').primaryKey(),
  shortLinkId: text('short_link_id')
    .references(() => shortLinks.id, { onDelete: 'cascade' })
    .notNull(),
  organizationId: text('organization_id').notNull(),
  referer: text('referer'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  channelHint: text('channel_hint'), // instagram | threads | linkedin | x | direct
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
});
```

### Índices de Otimização
- `idx_shortlinks_slug`: `slug UNIQUE` para lookup em $O(1)$ na rota de redirecionamento.
- `idx_shortlinks_org`: `(organization_id, created_at DESC)` para listagem do painel.
