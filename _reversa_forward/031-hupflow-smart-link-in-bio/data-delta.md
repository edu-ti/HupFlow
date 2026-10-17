# Data Delta: Smart Link-in-Bio Multi-Link & Showcase

## Tabelas Adicionadas

### 1. `bio_profiles`
Configuração principal da página de bio do workspace.
```sql
CREATE TABLE IF NOT EXISTS bio_profiles (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  handle TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT NOT NULL DEFAULT 'midnight',
  custom_theme_config TEXT, -- JSON com cores personalizadas se aplicável
  social_links TEXT,        -- JSON com { instagram, linkedin, twitter, youtube, tiktok, whatsapp, github, website }
  show_posts_showcase INTEGER NOT NULL DEFAULT 1, -- 1 = exibe últimos carrosséis/posts
  is_published INTEGER NOT NULL DEFAULT 1,
  total_views INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

### 2. `bio_links`
Botões individuais que aparecem na lista da página.
```sql
CREATE TABLE IF NOT EXISTS bio_links (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES bio_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT NOT NULL,
  icon TEXT, -- nome do ícone Lucide ou emoji
  is_featured INTEGER NOT NULL DEFAULT 0, -- 1 = botão destacado com efeito pulse
  is_active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

### 3. `bio_clicks`
Logs para telemetria de cliques nos botões.
```sql
CREATE TABLE IF NOT EXISTS bio_clicks (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL REFERENCES bio_links(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES bio_profiles(id) ON DELETE CASCADE,
  clicked_at INTEGER NOT NULL DEFAULT (unixepoch()),
  referrer TEXT,
  user_agent TEXT
);
```
