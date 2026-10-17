import { pgTable, text, timestamp, boolean, json, jsonb, integer } from 'drizzle-orm/pg-core';

// ============================================================================
// 1. AUTENTICAÇÃO & MULTI-TENANCY (Better-Auth)
// ============================================================================

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  activeOrganizationId: text('active_organization_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull().default('member'), // owner | admin | member
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invitations = pgTable('invitations', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('member'),
  status: text('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 2. CONEXÕES SOCIAIS (Tokens Criptografados)
// ============================================================================

export const socialAccounts = pgTable('social_accounts', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').notNull(), // linkedin | x | instagram | facebook | threads
  providerAccountId: text('provider_account_id').notNull(),
  accountName: text('account_name').notNull(),
  accountAvatar: text('account_avatar'),
  encryptedAccessToken: text('encrypted_access_token').notNull(),
  encryptedRefreshToken: text('encrypted_refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 3. MÍDIAS & ARQUIVOS
// ============================================================================

export const media = pgTable('media', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  dimensions: json('dimensions').$type<{ width: number; height: number }>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 4. PUBLICAÇÕES & AGENDAMENTO
// ============================================================================

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
  content: text('content').notNull(),
  mediaIds: json('media_ids').$type<string[]>().default([]).notNull(),
  status: text('status').notNull().default('draft'), // draft | scheduled | publishing | published | failed
  approvalStatus: text('approval_status').default('approved').notNull(), // draft | in_review | approved | rejected
  submittedById: text('submitted_by_id').references(() => users.id, { onDelete: 'set null' }),
  approvedById: text('approved_by_id').references(() => users.id, { onDelete: 'set null' }),
  rejectionReason: text('rejection_reason'),
  reviewedAt: timestamp('reviewed_at'),
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postChannels = pgTable('post_channels', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  socialAccountId: text('social_account_id').references(() => socialAccounts.id, { onDelete: 'cascade' }).notNull(),
  customContent: text('custom_content'), // Sobrescrita de texto adaptada para esta rede
  status: text('status').notNull().default('pending'), // pending | published | failed
  externalPostId: text('external_post_id'),
  externalUrl: text('external_url'),
  errorMessage: text('error_message'),
});

export const postApprovalHistory = pgTable('post_approval_history', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  action: text('action').notNull(), // submit | approve | reject | reset
  fromStatus: text('from_status').notNull(),
  toStatus: text('to_status').notNull(),
  actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 5. ANALYTICS & MÉTRICAS DE ENGAJAMENTO
// ============================================================================

export const postAnalytics = pgTable('post_analytics', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  channelId: text('channel_id').references(() => postChannels.id, { onDelete: 'cascade' }).notNull(),
  provider: text('provider').notNull(), // instagram | threads | linkedin | x
  impressions: integer('impressions').default(0).notNull(),
  reach: integer('reach').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  shares: integer('shares').default(0).notNull(),
  clicks: integer('clicks').default(0).notNull(),
  engagementRate: integer('engagement_rate').default(0).notNull(), // base 10000 (ex: 350 = 3.5%)
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

// ============================================================================
// 6. FATURAMENTO & ASSINATURAS (Stripe)
// ============================================================================

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  plan: text('plan').notNull().default('starter'), // starter | pro | agency
  status: text('status').notNull().default('active'), // active | trialing | past_due | canceled
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 7. KITS DE MARCA & IDENTIDADE VISUAL
// ============================================================================

export const brandKits = pgTable('brand_kits', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  colors: json('colors').$type<{
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  }>().notNull(),
  typography: json('typography').$type<{
    fontFamilyHeading: string;
    fontFamilyBody: string;
  }>().notNull(),
  logoUrl: text('logo_url'),
  handle: text('handle'),
  website: text('website'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 9. WEBHOOKS CORPORATIVOS & INTEGRAÇÕES n8n / ZAPIER
// ============================================================================

export const webhooks = pgTable('webhooks', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  secret: text('secret').notNull(),
  events: json('events').$type<string[]>().notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: text('id').primaryKey(),
  webhookId: text('webhook_id')
    .references(() => webhooks.id, { onDelete: 'cascade' })
    .notNull(),
  organizationId: text('organization_id').notNull(),
  event: text('event').notNull(),
  statusCode: integer('status_code'),
  responseTimeMs: integer('response_time_ms'),
  payload: text('payload').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 10. CHAVES DE API PÚBLICAS (Developer API Keys)
// ============================================================================

export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  keyPrefix: text('key_prefix').notNull(),
  keyHash: text('key_hash').notNull().unique(),
  scopes: json('scopes').$type<string[]>().notNull(),
  createdById: text('created_by_id').references(() => users.id, { onDelete: 'set null' }),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 11. TRILHA DE AUDITORIA & ACTIVITY LOGS DO WORKSPACE
// ============================================================================

export const workspaceAuditLogs = pgTable('workspace_audit_logs', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  actorId: text('actor_id').references(() => users.id, { onDelete: 'set null' }),
  actorName: text('actor_name').notNull(),
  actorEmail: text('actor_email').notNull(),
  action: text('action').notNull(),
  category: text('category').notNull(), // security | content | team | connectors | integrations
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  details: json('details').$type<Record<string, any>>(),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 12. DEAD-LETTER QUEUE (DLQ) & REPROCESSAMENTO DE FALHAS
// ============================================================================

export const publishingDlq = pgTable('publishing_dlq', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  postId: text('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  channelId: text('channel_id')
    .references(() => postChannels.id, { onDelete: 'cascade' })
    .notNull(),
  provider: text('provider').notNull(), // instagram | threads | linkedin | x
  accountName: text('account_name').notNull(),
  errorCategory: text('error_category').notNull(), // AUTH_EXPIRED | MEDIA_INVALID | RATE_LIMITED | CONTENT_REJECTED | NETWORK_TIMEOUT | UNKNOWN
  rawErrorMessage: text('raw_error_message').notNull(),
  recommendedAction: text('recommended_action').notNull(),
  retryCount: integer('retry_count').default(0).notNull(),
  lastRetryAt: timestamp('last_retry_at'),
  status: text('status').default('pending').notNull(), // pending | retrying | resolved | dismissed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 13. CENTRAL DE NOTIFICAÇÕES IN-APP DO WORKSPACE
// ============================================================================

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(), // approval_requested | approval_reviewed | post_published | post_failed | quota_warning | member_joined | general
  title: text('title').notNull(),
  message: text('message').notNull(),
  linkUrl: text('link_url'),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============================================================================
// 14. ENCURTADOR DE LINKS & RASTREAMENTO UTM POR CANAL
// ============================================================================

export const shortLinks = pgTable('short_links', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  slug: text('slug').notNull().unique(),
  destinationUrl: text('destination_url').notNull(),
  title: text('title').notNull(),
  utmSource: text('utm_source'),
  utmMedium: text('utm_medium').default('social'),
  utmCampaign: text('utm_campaign'),
  utmContent: text('utm_content'),
  utmTerm: text('utm_term'),
  totalClicks: integer('total_clicks').default(0).notNull(),
  lastClickedAt: timestamp('last_clicked_at'),
  createdById: text('created_by_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const shortLinkClicks = pgTable('short_link_clicks', {
  id: text('id').primaryKey(),
  shortLinkId: text('short_link_id')
    .references(() => shortLinks.id, { onDelete: 'cascade' })
    .notNull(),
  organizationId: text('organization_id').notNull(),
  referer: text('referer'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  channelHint: text('channel_hint'),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
});

// ============================================================================
// 15. RECOMENDADOR DE HASHTAGS & COLEÇÕES SALVAS (HASHTAG SETS)
// ============================================================================

export const hashtagSets = pgTable('hashtag_sets', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  category: text('category').default('general').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 16. MARCA D'ÁGUA (WATERMARK OVERLAY) & SELOS CORPORATIVOS
// ============================================================================

export const watermarkSettings = pgTable('watermark_settings', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  watermarkType: text('watermark_type').default('combined').notNull(),
  position: text('position').default('bottom_right').notNull(),
  opacity: integer('opacity').default(85).notNull(),
  scalePercent: integer('scale_percent').default(15).notNull(),
  marginPx: integer('margin_px').default(24).notNull(),
  customText: text('custom_text'),
  logoUrl: text('logo_url'),
  autoApply: boolean('auto_apply').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// 17. INTEGRADOR DE FEEDS RSS/ATOM & AUTOMAÇÃO IA
// ============================================================================

export const rssFeeds = pgTable('rss_feeds', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  status: text('status').default('active').notNull(),
  autoPublish: boolean('auto_publish').default(false).notNull(),
  targetNetworks: jsonb('target_networks').$type<string[]>().default(['linkedin', 'x']).notNull(),
  lastFetchedAt: timestamp('last_fetched_at'),
  lastError: text('last_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rssFeedItems = pgTable('rss_feed_items', {
  id: text('id').primaryKey(),
  feedId: text('feed_id')
    .references(() => rssFeeds.id, { onDelete: 'cascade' })
    .notNull(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  guid: text('guid').notNull(),
  title: text('title').notNull(),
  link: text('link').notNull(),
  summary: text('summary'),
  imageUrl: text('image_url'),
  pubDate: timestamp('pub_date'),
  status: text('status').default('pending').notNull(),
  postId: text('post_id').references(() => posts.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bioProfiles = pgTable('bio_profiles', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  handle: text('handle').notNull().unique(),
  title: text('title').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  theme: text('theme').default('midnight').notNull(),
  customThemeConfig: jsonb('custom_theme_config'),
  socialLinks: jsonb('social_links').$type<Record<string, any>>().default({}).notNull(),
  showPostsShowcase: boolean('show_posts_showcase').default(true).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  totalViews: integer('total_views').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bioLinks = pgTable('bio_links', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .references(() => bioProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  url: text('url').notNull(),
  icon: text('icon'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  clickCount: integer('click_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bioClicks = pgTable('bio_clicks', {
  id: text('id').primaryKey(),
  linkId: text('link_id')
    .references(() => bioLinks.id, { onDelete: 'cascade' })
    .notNull(),
  profileId: text('profile_id')
    .references(() => bioProfiles.id, { onDelete: 'cascade' })
    .notNull(),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
});

export const videoCaptionProjects = pgTable('video_caption_projects', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  videoUrl: text('video_url'),
  language: text('language').default('pt-BR').notNull(),
  durationMs: integer('duration_ms').default(15000).notNull(),
  preset: text('preset').default('hormozi_bold').notNull(),
  safeZonePosition: text('safe_zone_position').default('bottom_safe').notNull(),
  styleConfig: jsonb('style_config'),
  cues: jsonb('cues').default([]).notNull(),
  rawTranscript: text('raw_transcript'),
  status: text('status').default('ready').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
