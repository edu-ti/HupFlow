# Delta no Modelo de Dados: Ponte Carousel Generator ➔ Postiz Web

> Feature: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  

## 1. Esquema de Banco de Dados (Prisma ORM)

Esta feature **não altera** o banco de dados do sistema legado nem cria novas tabelas ou migrações. O envio de carrosséis reutiliza integralmente o modelo existente de `Media` do PostgreSQL gerenciado pelo Postiz:

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

## 2. Estrutura de Estado Local (LocalStorage)

No aplicativo cliente do Carousel Generator, as preferências de conexão com o Postiz são persistidas no navegador:

| Chave | Tipo | Descrição | Valor padrão |
|-------|------|-----------|--------------|
| `hupflow_postiz_api_url` | `string` | URL base do backend da API do Postiz | `http://localhost:3000` |
| `hupflow_postiz_web_url` | `string` | URL base do frontend web do Postiz | `http://localhost:4200` |
| `hupflow_postiz_token` | `string` | Token de autenticação JWT da sessão | `""` (vazio até preenchimento) |

## 3. Estrutura de Transferência (Payload e Resposta)

### Payload enviado pela Server Action (`multipart/form-data`)
- `file`: Arquivo binário (`carousel.pdf` ou `slide-N.png`) com `Content-Type: application/pdf` ou `image/png`.

### Resposta de Sucesso do Backend (`application/json`)
```json
{
  "id": "cm7a1b2c3d4e5f",
  "name": "meu-carrossel.pdf",
  "path": "/uploads/meu-carrossel.pdf",
  "mimeType": "application/pdf"
}
```
