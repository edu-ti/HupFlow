# Data Delta: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

---

## 1. Alterações Estruturais

- **Estrutura de Tabelas no Banco**:
  - **Zero alterações nas tabelas existentes do banco PostgreSQL**.
  - Todos os nomes de tabela, colunas, tipos, chaves estrangeiras, valores default e índices permanecem 100% idênticos.

- **Organização de Arquivos**:
  - Novo diretório: `libraries/nestjs-libraries/src/database/prisma/schema/`
    - `01-base.prisma`
    - `02-auth-users.prisma`
    - `03-posts-content.prisma`
    - `04-integrations-channels.prisma`
    - `05-billing-marketplace.prisma`
    - `06-media-clipping.prisma`
    - `07-notifications-system.prisma`
    - `08-mastra-ai.prisma`
  - Arquivo consolidado: `libraries/nestjs-libraries/src/database/prisma/schema.prisma` (gerado/sincronizado a partir dos sub-esquemas).

---

## 2. Contratos e Scripts

- Adição do comando `"prisma-bundle"` no `package.json` raiz:
  ```json
  "prisma-bundle": "ts-node ./libraries/nestjs-libraries/src/database/prisma/bundle-schema.ts"
  ```
