# Data Delta: 039-hupflow-influencer-creator-crm

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `influencerPartnerships` (`influencer_partnerships`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`crt_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `creatorName` | `text` | `NOT NULL` | Nome do influenciador ou criador UGC |
| `handle` | `text` | `NOT NULL` | `@handle` principal |
| `channel` | `text` | `NOT NULL, DEFAULT 'instagram'` | Canal (`instagram`, `tiktok`, `youtube`, `linkedin`) |
| `niche` | `text` | `NOT NULL, DEFAULT 'SaaS & Produtividade'` | Nicho de atuação |
| `followersCount` | `integer` | `NOT NULL, DEFAULT 25000` | Audiência total do criador |
| `stage` | `text` | `NOT NULL, DEFAULT 'contracted'` | Estágio CRM (`prospecting`, `negotiating`, `contracted`, `content_review`, `published`) |
| `agreedFeeBrl` | `integer` | `NOT NULL, DEFAULT 2500` | Cachê acordado em BRL |
| `deliverablesTotal` | `integer` | `NOT NULL, DEFAULT 3` | Total de peças/entregáveis contratados |
| `deliverablesCompleted` | `integer` | `NOT NULL, DEFAULT 1` | Entregáveis já publicados |
| `totalViews` | `integer` | `NOT NULL, DEFAULT 0` | Visualizações acumuladas na campanha |
| `totalEngagements` | `integer` | `NOT NULL, DEFAULT 0` | Curtidas + comentários + salvamentos + shares |
| `generatedRevenueBrl` | `integer` | `NOT NULL, DEFAULT 0` | Receita direta atribuída via cupom/UTM |
| `couponCode` | `text` | `NOT NULL` | Código de rastreio exclusivo (ex: `BIANCA20`) |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
