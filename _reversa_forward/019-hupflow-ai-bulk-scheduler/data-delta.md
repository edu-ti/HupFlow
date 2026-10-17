# Data Delta: Agendamento & Campanhas em Lote

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data: `2026-10-16`  

---

## 1. Mapeamento de Esquema

A persistência de campanhas em lote utiliza diretamente as tabelas pré-existentes em `hupflow/src/lib/db/schema.ts`:

- **`posts`**:
  - `id`: string (`post_bulk_...`).
  - `organizationId`: ID do workspace ativo.
  - `authorId`: ID do usuário solicitante.
  - `content`: Texto principal com hashtags.
  - `mediaIds`: IDs de mídias ou JSON de slides.
  - `status`: `'scheduled'`.
  - `scheduledAt`: Data e hora futura gerada pelo slot.

- **`post_channels`**:
  - Para cada conta social selecionada (LinkedIn, X, Instagram, Threads), uma linha é gerada associando `postId`, `socialAccountId`, `customContent` e `status: 'pending'`.

---

## 2. Migrações

- Nenhuma migração necessária no banco de dados. O modelo já suporta inserções em lote com integridade referencial em cascata.
