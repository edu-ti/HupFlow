# Delta de Dados — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## Nova Tabela: `agency_brand_profiles`

```typescript
export const agencyBrandProfiles = pgTable('agency_brand_profiles', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  brandName: text('brand_name').notNull(),
  slug: text('slug').notNull(),
  niche: text('niche').default('Geral').notNull(),
  colorHex: text('color_hex').default('#6366f1').notNull(),
  tier: text('tier').default('standard').notNull(),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  connectedChannelsCount: integer('connected_channels_count').default(2).notNull(),
  scheduledPostsCount: integer('scheduled_posts_count').default(5).notNull(),
  monthlyPostQuota: integer('monthly_post_quota').default(60).notNull(),
  status: text('status').default('active').notNull(),
  tags: jsonb('tags').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
