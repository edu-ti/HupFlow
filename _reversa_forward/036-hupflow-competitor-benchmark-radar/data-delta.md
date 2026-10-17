# Data Delta: 036-hupflow-competitor-benchmark-radar

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `competitorProfiles` (`competitor_profiles`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`comp_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `name` | `text` | `NOT NULL` | Nome da marca ou criador concorrente |
| `handle` | `text` | `NOT NULL` | Handle social (ex: `@metricool_br`) |
| `channel` | `text` | `NOT NULL, DEFAULT 'instagram'` | Canal monitorado (`instagram`, `linkedin`, `tiktok`, `youtube`, `x`) |
| `niche` | `text` | `NOT NULL, DEFAULT 'SaaS & Marketing'` | Categoria/nicho competitivo |
| `followersCount` | `integer` | `NOT NULL, DEFAULT 10000` | Total de seguidores atuais |
| `engagementRatePct` | `integer` | `NOT NULL, DEFAULT 350` | Taxa de engajamento em pontos-base (ex: `420` = `4.20%`) ou float serializado |
| `postsPerWeek` | `integer` | `NOT NULL, DEFAULT 5` | Frequência média semanal de publicações |
| `growth30dPct` | `integer` | `NOT NULL, DEFAULT 500` | Crescimento de seguidores em 30d em pontos-base (ex: `680` = `6.80%`) |
| `topFormat` | `text` | `NOT NULL, DEFAULT 'carousel'` | Formato dominante (`carousel`, `reel_video`, `text_thread`, `single_image`) |
| `topTopics` | `jsonb` | `NOT NULL, DEFAULT '[]'` | Lista de tópicos de maior tração (`string[]`) |
| `threatScore` | `integer` | `NOT NULL, DEFAULT 65` | Score de pressão competitiva (`0-100`) |
| `lastSyncedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data da última coleta de snapshot |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
