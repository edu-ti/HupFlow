# Data Delta: 042-hupflow-content-repurposing-matrix

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `contentRepurposingKits` (`content_repurposing_kits`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`rep_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `title` | `text` | `NOT NULL` | Título da campanha de conteúdo |
| `sourceType` | `text` | `NOT NULL, DEFAULT 'article'` | Tipo da fonte (`article`, `transcript`, `newsletter_draft`, `notes`) |
| `rawSourceText` | `text` | `NOT NULL` | Conteúdo bruto de entrada |
| `tone` | `text` | `NOT NULL, DEFAULT 'educational'` | Tom de voz (`educational`, `contrarian`, `storytelling`, `executive`) |
| `carouselSlides` | `jsonb` | `NOT NULL, DEFAULT '[]'` | 7 slides de carrossel estruturados |
| `xThread` | `jsonb` | `NOT NULL, DEFAULT '[]'` | 5 tweets encadeados $\le$ 280 chars |
| `reelScript` | `jsonb` | `NOT NULL, DEFAULT '{}'` | Roteiro 9:16 em 4 blocos de tempo |
| `newsletterSnippet` | `text` | `NOT NULL` | Texto da pílula executiva para newsletter |
| `estimatedPiecesCount` | `integer` | `NOT NULL, DEFAULT 4` | Total de formatos gerados no kit |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
