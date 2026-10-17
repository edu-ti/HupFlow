# Data Delta: 038-hupflow-social-listening-brand-mentions

## Nova Tabela Drizzle ORM (`hupflow/src/lib/db/schema.ts`)

### `socialListeningMentions` (`social_listening_mentions`)
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `text` | `PRIMARY KEY` | Identificador único (`lst_<uuid>`) |
| `organizationId` | `text` | `NOT NULL, FK -> organizations.id ON DELETE CASCADE` | Isolamento multi-tenant |
| `keywordMatched` | `text` | `NOT NULL` | Palavra-chave ou termo capturado |
| `channel` | `text` | `NOT NULL, DEFAULT 'x'` | Plataforma de origem (`x`, `linkedin`, `instagram`, `reddit`, `youtube`) |
| `category` | `text` | `NOT NULL, DEFAULT 'brand_mention'` | Categoria (`brand_mention`, `competitor_complaint`, `industry_trend`, `crisis_risk`) |
| `authorName` | `text` | `NOT NULL` | Nome do autor da publicação externa |
| `authorHandle` | `text` | `NOT NULL` | Handle do autor |
| `authorFollowers` | `integer` | `NOT NULL, DEFAULT 1500` | Seguidores do autor |
| `content` | `text` | `NOT NULL` | Conteúdo textual capturado |
| `sentiment` | `text` | `NOT NULL, DEFAULT 'neutral'` | Sentimento (`positive`, `neutral`, `negative`) |
| `sentimentScore` | `integer` | `NOT NULL, DEFAULT 0` | Score de sentimento (`-100` a `+100`) |
| `velocityPerHour` | `integer` | `NOT NULL, DEFAULT 10` | Interações por hora na publicação |
| `urgencyScore` | `integer` | `NOT NULL, DEFAULT 35` | Score de urgência/RP (`0-100`) |
| `crisisLevel` | `text` | `NOT NULL, DEFAULT 'normal'` | Nível de risco (`normal`, `watch`, `elevated`, `critical_crisis`) |
| `status` | `text` | `NOT NULL, DEFAULT 'open'` | Status (`open`, `engaged`, `resolved`, `ignored`) |
| `detectedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data/hora de detecção |
| `createdAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de criação |
| `updatedAt` | `timestamp` | `DEFAULT NOW(), NOT NULL` | Data de atualização |
