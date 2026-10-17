# Delta de Dados: Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  

---

## 1. Nova Tabela no Schema do Drizzle (`watermark_settings`)

```typescript
export const watermarkSettings = pgTable('watermark_settings', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  watermarkType: text('watermark_type').default('combined').notNull(), // 'logo' | 'text' | 'combined'
  position: text('position').default('bottom_right').notNull(), // 'bottom_right' | 'bottom_left' | 'top_right' | 'top_left' | 'center'
  opacity: integer('opacity').default(85).notNull(), // 10 a 100
  scalePercent: integer('scale_percent').default(15).notNull(), // 5 a 35%
  marginPx: integer('margin_px').default(24).notNull(), // espaçamento em pixels
  customText: text('custom_text'), // handle (@suaempresa)
  logoUrl: text('logo_url'), // URL do logotipo PNG/SVG
  autoApply: boolean('auto_apply').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## 2. Índices e Restrições
- Primary Key: `id` (formato `wmk_[timestamp]_[hex]`)
- Unique Constraint: `organization_id` (cada workspace possui exatamente um registro de configuração de watermark)
- Foreign Key: `organization_id` com exclusão em cascata.
