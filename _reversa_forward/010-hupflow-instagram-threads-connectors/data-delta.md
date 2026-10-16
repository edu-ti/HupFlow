# Data Delta: Conectores Oficiais da Meta

> Feature: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  

---

## 1. Resumo das Mudanças

Não há migrações no banco de dados. O schema Drizzle já prevê as tabelas necessárias:
- `social_accounts`: Armazena contas do tipo `provider: "instagram"` e `provider: "threads"`.
- `post_channels`: Registra status independente por canal (`pending`, `published`, `failed`), `external_post_id` e `external_url`.

## 2. Parâmetros de Configuração Adicionais (`.env`)

```env
# Conectores Meta (Instagram & Threads)
META_APP_ID=""
META_APP_SECRET=""
THREADS_APP_ID=""
THREADS_APP_SECRET=""
```
