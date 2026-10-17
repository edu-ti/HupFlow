# Data Delta: Conectores Sociais LinkedIn & X

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data: `2026-10-16`  

---

## 1. Mapeamento de Esquema

A tabela `social_accounts` (declarada em `hupflow/src/lib/db/schema.ts`) suporta nativamente a persistência dos conectores LinkedIn e X:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | `text` PK | Identificador único (`acc_...`). |
| `organization_id` | `text` FK | Associação estrita com o workspace ativo. |
| `provider` | `text` | `'linkedin'` ou `'x'`. |
| `provider_account_id` | `text` | URN do LinkedIn ou ID numérico do X. |
| `account_name` | `text` | Nome público ou `@handle`. |
| `account_avatar` | `text` | URL da foto de perfil. |
| `encrypted_access_token` | `text` | Chave de acesso cifrada com AES-256-GCM. |
| `encrypted_refresh_token` | `text` | Chave de renovação cifrada com AES-256-GCM. |
| `token_expires_at` | `timestamp` | Timestamp de expiração para renovação automática. |
| `created_at` | `timestamp` | Data de vinculação da conta. |

---

## 2. Migrações

- Zero migrações necessárias no Drizzle Kit. A tabela `social_accounts` já possui todas as colunas necessárias e integridade referencial com `organizations`.
