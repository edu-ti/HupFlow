# Data Delta: Feature 022 - Fluxo Editorial de Aprovações

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Alterações na Tabela `posts`

Campos adicionados:
- `approval_status`: `TEXT NOT NULL DEFAULT 'approved'` (`'draft' | 'in_review' | 'approved' | 'rejected'`)
- `submitted_by_id`: `TEXT REFERENCES users(id) ON DELETE SET NULL`
- `approved_by_id`: `TEXT REFERENCES users(id) ON DELETE SET NULL`
- `rejection_reason`: `TEXT`
- `reviewed_at`: `TIMESTAMP`

Índice adicionado:
```sql
CREATE INDEX idx_posts_approval ON posts(organization_id, approval_status);
```

---

## 2. Nova Tabela `post_approval_history`

```sql
CREATE TABLE post_approval_history (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- submit | approve | reject | reset
  from_status TEXT NOT NULL,
  to_status TEXT NOT NULL,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  feedback TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_approval_history_post ON post_approval_history(post_id);
CREATE INDEX idx_post_approval_history_org ON post_approval_history(organization_id);
```
