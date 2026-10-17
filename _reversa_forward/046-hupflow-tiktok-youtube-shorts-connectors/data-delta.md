# Delta de Dados — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## Nova Tabela no Drizzle ORM

```typescript
export const verticalVideoPosts = pgTable('vertical_video_posts', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  caption: text('caption').notNull(),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  channels: jsonb('channels').notNull(), // ['tiktok', 'youtube_shorts']
  durationSeconds: integer('duration_seconds').notNull(),
  width: integer('width').default(1080).notNull(),
  height: integer('height').default(1920).notNull(),
  privacyLevel: text('privacy_level').default('public').notNull(),
  tiktokSettings: jsonb('tiktok_settings').notNull(), // { disableComments, disableDuet, disableStitch, isAiGenerated }
  youtubeSettings: jsonb('youtube_settings').notNull(), // { isMadeForKids, containsPaidPromotion }
  scheduledAt: timestamp('scheduled_at'),
  status: text('status').default('draft').notNull(), // draft, scheduled, publishing, published, failed
  externalPublishIds: jsonb('external_publish_ids'), // { tiktokPostId?, youtubeVideoId? }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```
