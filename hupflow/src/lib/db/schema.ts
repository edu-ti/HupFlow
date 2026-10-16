import { pgTable, text, timestamp, boolean, json, integer } from 'drizzle-orm/pg-core';

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
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull().default('member'), // owner | admin | member
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
