# Data Delta: 037-hupflow-campaign-ab-testing-hooks

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `abTestExperiments` (`ab_test_experiments`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`ab_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `title` | `text` | `NOT NULL` | Nome do experimento A/B |
| `channel` | `text` | `NOT NULL, DEFAULT 'instagram'` | Canal alvo (`instagram`, `linkedin`, `tiktok`, `x`) |
| `testType` | `text` | `NOT NULL, DEFAULT 'hook_copy'` | Tipo de elemento testado (`hook_copy`, `carousel_cover`, `cta_button`) |
| `hypothesisAngle` | `text` | `NOT NULL, DEFAULT 'curiosity_gap'` | Ângulo psicológico da desafiante |
| `targetMetric` | `text` | `NOT NULL, DEFAULT 'engagement_rate'` | Métrica primária (`engagement_rate`, `ctr_clicks`, `saves_rate`) |
| `minSampleSize` | `integer` | `NOT NULL, DEFAULT 200` | Amostra mínima de impressões por variante |
| `targetConfidencePct` | `integer` | `NOT NULL, DEFAULT 95` | Limiar de confiança estatística (`90`, `95`, `99`) |
| `variantA` | `jsonb` | `NOT NULL` | Dados e contadores da Variante A (Controle) |
| `variantB` | `jsonb` | `NOT NULL` | Dados e contadores da Variante B (Desafiante) |
| `status` | `text` | `NOT NULL, DEFAULT 'running'` | Status (`running`, `completed`, `paused`) |
| `winningVariantId` | `text` | `NULLABLE` | `'A'`, `'B'` ou `null` |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
