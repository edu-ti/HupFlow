# Onboarding: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

---

## 1. Como trabalhar com o Schema Modular do Prisma

A partir desta atualização, os modelos de dados não precisam ser editados no arquivo monolítico gigante. Em vez disso:

1. **Localize o domínio desejado** na pasta:
   `libraries/nestjs-libraries/src/database/prisma/schema/`
   - Autenticação e Usuários: `02-auth-users.prisma`
   - Posts e Tags: `03-posts-content.prisma`
   - Canais Sociais e Webhooks: `04-integrations-channels.prisma`
   - Assinaturas e Créditos: `05-billing-marketplace.prisma`
   - Mídias: `06-media-clipping.prisma`
   - Notificações: `07-notifications-system.prisma`
   - Mastra AI: `08-mastra-ai.prisma`

2. **Faça as modificações no arquivo específico do domínio**.

3. **Reconstrua e valide o schema unificado**:
   ```bash
   pnpm run prisma-bundle
   ```

4. **Gere os tipos do Prisma Client normalmente**:
   ```bash
   pnpm run prisma-generate
   ```
