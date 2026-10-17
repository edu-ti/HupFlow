# Data Delta: Unified Social Inbox & AI Smart Replies

## Tabelas Adicionadas

### 1. `social_inbox_messages`
Armazena comentários, menções e mensagens diretas unificadas por organização (`organization_id`).

```sql
CREATE TABLE IF NOT EXISTS social_inbox_messages (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- 'linkedin' | 'instagram' | 'x' | 'threads'
  interaction_type TEXT NOT NULL DEFAULT 'comment', -- 'comment' | 'mention' | 'dm'
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT,
  post_title TEXT,
  content TEXT NOT NULL,
  intent TEXT NOT NULL DEFAULT 'question', -- 'lead_intent' | 'support' | 'praise' | 'question' | 'spam'
  sentiment TEXT NOT NULL DEFAULT 'neutral', -- 'positive' | 'neutral' | 'negative'
  priority TEXT NOT NULL DEFAULT 'normal', -- 'high' | 'normal' | 'low'
  status TEXT NOT NULL DEFAULT 'unread', -- 'unread' | 'replied' | 'archived'
  reply_text TEXT,
  replied_by TEXT,
  replied_at TIMESTAMP,
  received_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
