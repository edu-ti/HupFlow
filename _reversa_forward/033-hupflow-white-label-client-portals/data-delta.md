# Data Delta: White-Label Client Portals & External Approvals

## Tabelas Adicionadas

### 1. `client_portals`
Armazena os portais white-label de aprovação externa por organização (`organization_id`).

```sql
CREATE TABLE IF NOT EXISTS client_portals (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  brand_color TEXT NOT NULL DEFAULT '#6366F1',
  logo_url TEXT,
  welcome_message TEXT,
  access_pin TEXT,
  hide_hupflow_branding BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  deliverables JSONB NOT NULL DEFAULT '[]', -- Array de PortalDeliverable
  total_views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
