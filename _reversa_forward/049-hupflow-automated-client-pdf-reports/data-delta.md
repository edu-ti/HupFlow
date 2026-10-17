# Delta de Dados — Feature 049: Relatórios Executivos em PDF

## Nova Tabela Drizzle: `client_report_schedules`
Configurações de relatórios periódicos por cliente/marca.

```ts
export const clientReportSchedules = pgTable('client_report_schedules', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  brandSlug: text('brand_slug').default('default').notNull(),
  title: text('title').notNull(),
  frequency: text('frequency').default('weekly').notNull(), // 'weekly' | 'monthly' | 'biweekly'
  sendDayOfWeek: integer('send_day_of_week').default(1).notNull(), // 1 = Segunda-feira
  recipients: jsonb('recipients').notNull(), // Array de e-mails
  includeAiSummary: boolean('include_ai_summary').default(true).notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'paused'
  lastGeneratedAt: timestamp('last_generated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

## Nova Tabela Drizzle: `generated_client_reports`
Histórico de edições e arquivos PDF gerados.

```ts
export const generatedClientReports = pgTable('generated_client_reports', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  brandSlug: text('brand_slug').default('default').notNull(),
  reportTitle: text('report_title').notNull(),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  fileSizeBytes: integer('file_size_bytes').default(0).notNull(),
  metricsSnapshot: jsonb('metrics_snapshot').notNull(),
  aiExecutiveSummary: text('ai_executive_summary').notNull(),
  status: text('status').default('ready').notNull(), // 'ready' | 'generating' | 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```
