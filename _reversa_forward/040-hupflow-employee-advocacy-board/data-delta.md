# Data Delta: 040-hupflow-employee-advocacy-board

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `advocacyCampaigns` (`advocacy_campaigns`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`adv_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `title` | `text` | `NOT NULL` | Título interno da campanha de amplificação |
| `department` | `text` | `NOT NULL, DEFAULT 'Produto & Engenharia'` | Departamento / Tema |
| `channel` | `text` | `NOT NULL, DEFAULT 'linkedin'` | Canal principal (`linkedin`, `instagram`, `x`) |
| `baseMessage` | `text` | `NOT NULL` | Mensagem-base aprovada pelo marketing |
| `targetUrl` | `text` | `NOT NULL` | URL com UTM da campanha |
| `pointsReward` | `integer` | `NOT NULL, DEFAULT 50` | Pontos concedidos por compartilhamento |
| `sharesCount` | `integer` | `NOT NULL, DEFAULT 0` | Total de compartilhamentos pela equipe |
| `avgReachPerShare` | `integer` | `NOT NULL, DEFAULT 1800` | Alcance orgânico médio por compartilhamento |
| `personaVariations` | `jsonb` | `NOT NULL, DEFAULT '[]'` | Variações em 1ª pessoa por persona |
| `isActive` | `boolean` | `NOT NULL, DEFAULT true` | Status da campanha no mural |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
