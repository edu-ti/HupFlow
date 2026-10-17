# Delta de Dados — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

## Nova Tabela no Drizzle ORM

```typescript
export const voiceoverTracks = pgTable('voiceover_tracks', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  scriptText: text('script_text').notNull(),
  voiceId: text('voice_id').notNull(),
  voiceName: text('voice_name').notNull(),
  language: text('language').default('pt-BR').notNull(),
  persona: text('persona').default('narrator_documentary').notNull(),
  speed: text('speed').default('1.0').notNull(),
  pitch: text('pitch').default('balanced').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  wordCount: integer('word_count').notNull(),
  audioUrl: text('audio_url').notNull(),
  status: text('status').default('ready').notNull(),
  tags: jsonb('tags').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
