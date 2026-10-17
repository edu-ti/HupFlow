# Delta de Dados — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## Nova Tabela: `device_mockups`

```typescript
export const deviceMockups = pgTable('device_mockups', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  deviceType: text('device_type').default('iphone_16_pro').notNull(),
  orientation: text('orientation').default('portrait').notNull(),
  finishColor: text('finish_color').default('titanium_black').notNull(),
  shadowStyle: text('shadow_style').default('floating_3d').notNull(),
  mediaType: text('media_type').default('image').notNull(),
  mediaUrl: text('media_url').notNull(),
  backgroundColorHex: text('background_color_hex').default('#09090b').notNull(),
  perspectiveTiltX: integer('perspective_tilt_x').default(0).notNull(),
  perspectiveTiltY: integer('perspective_tilt_y').default(0).notNull(),
  tags: jsonb('tags').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
