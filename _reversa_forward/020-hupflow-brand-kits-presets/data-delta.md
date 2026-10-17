# Data Delta: Tabela brand_kits

> Identificador: `020-hupflow-brand-kits-presets`  
> Data: `2026-10-16`  

---

## 1. Mapeamento de Esquema

Adição da tabela `brand_kits` ao esquema do Drizzle ORM (`hupflow/src/lib/db/schema.ts`):

```typescript
export const brandKits = pgTable('brand_kits', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  colors: json('colors').$type<{
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  }>().notNull(),
  typography: json('typography').$type<{
    fontFamilyHeading: string;
    fontFamilyBody: string;
  }>().notNull(),
  logoUrl: text('logo_url'),
  handle: text('handle'), // ex: "@hupflow"
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 2. Integridade & Índices

- Foreign Key para `organizations.id` com `onDelete: 'cascade'`.
- Chave Primária `id: text('id')`.
