# Data Delta: Evergreen Content Recycler & Smart Auto-Requeue

## Tabelas Adicionadas

### 1. `evergreen_items`
Armazena as publicações e carrosséis perenes configurados para reciclagem automática por organização (`organization_id`).

```sql
CREATE TABLE IF NOT EXISTS evergreen_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_caption TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'educational', -- 'educational' | 'case_study' | 'framework' | 'lead_magnet'
  channels JSONB NOT NULL DEFAULT '["linkedin","instagram"]',
  media_type TEXT NOT NULL DEFAULT 'carousel',
  evergreen_score INTEGER NOT NULL DEFAULT 85,
  cooldown_days INTEGER NOT NULL DEFAULT 30,
  recycle_count INTEGER NOT NULL DEFAULT 0,
  max_recycles INTEGER NOT NULL DEFAULT 12,
  variations JSONB NOT NULL DEFAULT '[]', -- Array de EvergreenVariation
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_recycled_at TIMESTAMP,
  next_scheduled_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
