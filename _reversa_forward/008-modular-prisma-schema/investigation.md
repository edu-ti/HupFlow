# Investigation: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

---

## 1. Análise Estrutural do `schema.prisma` Atual

O arquivo `libraries/nestjs-libraries/src/database/prisma/schema.prisma` possui 1.841 linhas.
Identificamos 8 grandes agrupamentos temáticos nos 90 modelos e 11 enums:

1. **Configuração Base**:
   - `generator client` e `datasource db`.
   - Enums globais: `Period`, `State`, `OrderStatus`, `APPROVED_SUBMIT_FOR_ORDER`, `CreationMethod`, `ShortLinkPreference`, `AnnouncementColor`.

2. **Autenticação, Organizações e Usuários**:
   - Modelos: `Organization`, `User`, `UserOrganization`, `UsedCodes`, `OAuthApp`, `OAuthAuthorization`, `OAuthSelfHostedAuthorization`.
   - Enums: `Role`.

3. **Publicações e Conteúdo**:
   - Modelos: `Post`, `Tags`, `TagsPosts`, `Comments`, `Sets`, `Signatures`, `PopularPosts`, `AutoPost`, `Mentions`.

4. **Integrações, Canais e Webhooks**:
   - Modelos: `Integration`, `IntegrationsWebhooks`, `Webhooks`, `ThirdParty`, `Plugs`, `ExisingPlugData`, `GitHub`, `Trending`, `TrendingLog`, `ItemUser`, `Star`.
   - Enums: `Provider`.

5. **Assinaturas, Faturamento e Marketplace**:
   - Modelos: `Subscription`, `Credits`, `Customer`, `SocialMediaAgency`, `SocialMediaAgencyNiche`, `Orders`, `OrderItems`, `MessagesGroup`, `Messages`, `PayoutProblems`.
   - Enums: `SubscriptionTier`, `From`.

6. **Mídias e Clipping**:
   - Modelos: `Media`, `Clipping`, `ClippingClip`.

7. **Notificações, Anúncios e Erros do Sistema**:
   - Modelos: `Notifications`, `Announcement`, `Errors`.

8. **Mastra AI (Agentes, Memória, Workflows e MCP)**:
   - 46 modelos prefixados por `mastra_` (ex: `mastra_agents`, `mastra_threads`, `mastra_messages`, `mastra_workflow_definitions`, `mastra_mcp_servers`, `mastra_mcp_clients`, `mastra_skills`, etc.).

---

## 2. Decisão Arquitetural e Estratégia de Transição

- **Suporte Nativo ao Prisma 6**:
  O Prisma 6.5.0 introduziu `previewFeatures = ["prismaSchemaFolder"]`. Quando essa flag está no generator, o Prisma compila nativamente schemas espalhados em uma pasta de schemas.
- **Estratégia Híbrida Segura (Dual-Support)**:
  1. Criar o diretório `libraries/nestjs-libraries/src/database/prisma/schema/` contendo os arquivos particionados por domínio.
  2. Criar o script idempotente `bundle-schema.ts` executável via `pnpm run prisma-bundle` que gera o `schema.prisma` consolidado com cabeçalho explicativo e `previewFeatures = ["prismaSchemaFolder"]`.
  3. Desta forma, pipelines de build legadas, migrações antigas ou comandos diretos de geração continuam funcionando perfeitamente sem risco de quebra em qualquer ambiente.
