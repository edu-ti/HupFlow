# Data Delta: Feature 021 - Webhooks Corporativos & Integrações n8n

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Novas Tabelas

### Tabela `webhooks`
Armazena as configurações dos endpoints HTTP registrados pelas organizações.

```sql
CREATE TABLE webhooks (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT NOT NULL, -- JSON array de eventos: ["post.published", "post.failed", ...]
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX idx_webhooks_org ON webhooks(organization_id);
```

### Tabela `webhook_deliveries`
Histórico de execuções de webhooks para auditoria e depuração.

```sql
CREATE TABLE webhook_deliveries (
  id TEXT PRIMARY KEY,
  webhook_id TEXT NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL,
  event TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  payload TEXT NOT NULL,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_org ON webhook_deliveries(organization_id);
```
