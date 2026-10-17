# Delta de Dados — Feature 048: Kill Switch & Brand Safety

## Nova Tabela Drizzle: `crisis_incident_logs`
Registra o histórico de eventos de ativação e desativação do Kill Switch.

```ts
export const crisisIncidentLogs = pgTable('crisis_incident_logs', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  action: text('action').notNull(), // 'kill_switch_activated' | 'kill_switch_deactivated' | 'posts_frozen' | 'posts_resumed'
  scope: text('scope').default('global').notNull(), // 'global' | 'brand_specific' | 'channel_specific'
  targetBrandSlug: text('target_brand_slug'),
  targetChannel: text('target_channel'),
  reason: text('reason').notNull(),
  activatedByUserId: text('activated_by_user_id').notNull(),
  activatedByUserName: text('activated_by_user_name').notNull(),
  affectedPostsCount: integer('affected_posts_count').default(0).notNull(),
  details: jsonb('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## Nova Tabela Drizzle: `brand_safety_settings`
Configuração de estado por organização.

```ts
export const brandSafetySettings = pgTable('brand_safety_settings', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  isEmergencyPaused: boolean('is_emergency_paused').default(false).notNull(),
  pausedAt: timestamp('paused_at'),
  pausedByUserName: text('paused_by_user_name'),
  pauseReason: text('pause_reason'),
  autoResumeAt: timestamp('auto_resume_at'),
  allowedChannels: jsonb('allowed_channels').notNull(), // canais autorizados mesmo em crise (ex: comunicados oficiais)
  restrictedKeywords: jsonb('restricted_keywords').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
