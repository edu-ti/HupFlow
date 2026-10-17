# Data Delta: AI Video Captions & Animated Subtitles Studio

## Tabelas Adicionadas

### 1. `video_caption_projects`
Armazena projetos de transcrição e legendas animadas para vídeos curtos por organização (`organization_id`).

```sql
CREATE TABLE IF NOT EXISTS video_caption_projects (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  language TEXT NOT NULL DEFAULT 'pt-BR',
  duration_ms INTEGER NOT NULL DEFAULT 15000,
  preset TEXT NOT NULL DEFAULT 'hormozi_bold',
  safe_zone_position TEXT NOT NULL DEFAULT 'bottom_safe',
  style_config JSONB, -- { fontSize, primaryColor, highlightColor, backgroundColor, uppercase, autoEmoji }
  cues JSONB NOT NULL DEFAULT '[]', -- Array de CaptionCue { id, index, startMs, endMs, text, highlightWord, emoji }
  raw_transcript TEXT,
  status TEXT NOT NULL DEFAULT 'ready', -- 'draft' | 'ready' | 'exported'
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```
