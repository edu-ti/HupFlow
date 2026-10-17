# Delta de Dados: Recomendador de Hashtags & Coleções Salvas

> Identificador: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  

---

## 1. Nova Tabela no Schema do Drizzle (`hashtag_sets`)

```typescript
export const hashtagSets = pgTable('hashtag_sets', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  category: text('category').default('general').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## 2. Índices e Restrições
- Primary Key: `id` (formato `hts_[timestamp]_[hex]`)
- Foreign Key: `organization_id` referenciando `organizations.id` com `onDelete: 'cascade'`.
- Sem quebras de entidades existentes.
