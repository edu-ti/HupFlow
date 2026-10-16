# Data Delta: Biblioteca de Mídias & Upload R2 / S3

> Feature: `013-hupflow-media-library-r2`  
> Data: `2026-10-15`  

---

## 1. Resumo das Mudanças de Dados

A infraestrutura consome e popula diretamente a tabela `media` existente em `hupflow/src/lib/db/schema.ts`, sem necessidade de migrations estruturais no banco:

```typescript
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
```

## 2. Tipagem de Domínio para Storage e Uploads

```typescript
export type MediaType = 'image' | 'video' | 'pdf' | 'other';

export interface PresignedUploadRequest {
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface MediaAssetItem {
  id: string;
  organizationId: string;
  filename: string;
  url: string;
  mimeType: string;
  mediaType: MediaType;
  sizeBytes: number;
  dimensions?: { width: number; height: number };
  createdAt: string;
}
```
