# Delta no Modelo de Dados: Editor Polotno Canvas no Postiz Web

> Feature: `006-polotno-web-canvas`  
> Data: `2026-10-15`  

## 1. Esquema de Banco de Dados (Prisma ORM)

Esta feature **não altera** o banco de dados do sistema legado nem cria novas tabelas ou migrações. O salvamento dos designs exportados pelo canvas reutiliza integralmente a tabela `Media`:

```prisma
model Media {
  id             String       @id @default(cuid())
  name           String
  path           String
  mimeType       String
  size           Int
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}
```

## 2. Delta de Assinatura de Componentes React

### `Polonto` (`components/launches/polonto.tsx`)

```diff
 const Polonto: FC<{
   setMedia: (params: { id: string; path: string }[]) => void;
+  initialMedia?: { id: string; path: string };
   type?: 'image' | 'video';
   closeModal: () => void;
   width?: number;
   height?: number;
 }>
```

### `MediaComponent` (`components/media/media.component.tsx`)

```diff
- const designMedia = useCallback(() => {
+ const designMedia = useCallback((initialMedia?: { id: string; path: string }, replaceIndex?: number) => {
```
