# Data Delta: Feature 023 - Chaves de API Públicas

> Identificador: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Nova Tabela `api_keys`

```sql
CREATE TABLE api_keys (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- Ex: 'hup_live_ab12cd' para visualização no dashboard
  key_hash TEXT NOT NULL UNIQUE, -- SHA-256 da chave completa
  scopes TEXT NOT NULL, -- JSON array de escopos: ["posts:write", "analytics:read", ...]
  created_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_org ON api_keys(organization_id);
```
