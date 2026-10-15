# Legacy Impact: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

---

## 1. Arquivos Legados Modificados

| Arquivo | Natureza da Modificação | Justificativa |
|---|---|---|
| `postiz-app-main/package.json` | Adição do script `"prisma-bundle"` | Permitir regeneração e validação instantânea do schema consolidado |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema.prisma` | Inclusão de `previewFeatures = ["prismaSchemaFolder"]` e reorganização por seções de domínio | Habilitar recursos do Prisma 6 e documentar a origem dos sub-esquemas |

---

## 2. Novos Arquivos Criados

| Arquivo | Propósito |
|---|---|
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/01-base.prisma` | Configuração do client, datasource e enums globais |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/02-auth-users.prisma` | Modelos de Organização, Usuários, Convites e OAuth |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/03-posts-content.prisma` | Modelos de Publicações, Comentários, Tags, Sets e Signatures |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/04-integrations-channels.prisma` | Modelos de Canais Sociais, Webhooks, Plugs e GitHub |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/05-billing-marketplace.prisma` | Modelos de Assinaturas, Faturamento, Pedidos e Agências |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/06-media-clipping.prisma` | Modelos de Arquivos de Mídia, Clipping e Vídeos |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/07-notifications-system.prisma` | Modelos de Notificações, Anúncios e Erros |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/08-mastra-ai.prisma` | Modelos de Agentes Mastra, Threads, Traces, Workflows e MCP |
| `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/bundle-schema.ts` | Script de bundle, validação e integridade referencial |

---

## 3. Avaliação de Risco e Compatibilidade

- **Risco de Quebra no Banco de Dados**: Zero. O schema gerado mantém rigorosamente as 90 tabelas, índices e tipos idênticos ao banco de dados PostgreSQL existente.
- **Retrocompatibilidade de Comandos**: Total. Scripts como `pnpm run prisma-generate` e `pnpm run prisma-db-push` continuam funcionando sem necessidade de alteração de parâmetros em ambientes de CI/CD.
