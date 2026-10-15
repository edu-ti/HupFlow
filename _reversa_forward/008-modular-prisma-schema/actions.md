# Actions: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

---

## Lista de Ações

- [X] **T001**: Criar diretório `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/` e sub-esquemas modulares organizados por contexto de domínio (`01-base.prisma`, `02-auth-users.prisma`, `03-posts-content.prisma`, `04-integrations-channels.prisma`, `05-billing-marketplace.prisma`, `06-media-clipping.prisma`, `07-notifications-system.prisma`, `08-mastra-ai.prisma`).
- [X] **T002**: Implementar script `bundle-schema.ts` em `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/` para validação e compilação automatizada dos sub-esquemas em `schema.prisma`.
- [X] **T003**: Adicionar atalho `"prisma-bundle"` no `package.json` raiz do monorepo Postiz e atualizar `schema.prisma` com `previewFeatures = ["prismaSchemaFolder"]`.
- [X] **T004**: Executar bundle e validar que o schema resultante contém exatamente os 90 modelos e 11 enums sem qualquer regressão.
- [X] **T005**: Criar artefatos de encerramento (`progress.jsonl`, `legacy-impact.md`, `regression-watch.md` com IDs W016 e W017) e o adendo SDD `_reversa_sdd/addenda/008-modular-prisma-schema.md`.
