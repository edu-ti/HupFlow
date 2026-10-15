# Requirements: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  
> Status: `Approved`  
> Origem: Ordem de evolução solicitada pelo usuário (Item 3: Mitigação de GAP-MOD-02)

---

## 1. Contexto e Problema de Negócio

No ecossistema Postiz / HupFlow, o banco de dados PostgreSQL é orquestrado via Prisma ORM através de um único arquivo monolítico:
`postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema.prisma` com **1.841 linhas**, contendo **90 modelos** e **11 enums**.

Este acoplamento monolítico apresenta os seguintes riscos e fricções:
1. **Conflitos Frequentes de Mesclagem**: Qualquer alteração em tabelas de autenticação, agentes de IA (Mastra), mídias ou assinaturas concorre no mesmo arquivo gigante.
2. **Violação de Contextos Delimitados (Bounded Contexts)**: Modelos de domínios completamente distintos (ex: `Orders` vs `mastra_traces` vs `Integration`) compartilham o mesmo espaço global de edição.
3. **Dificuldade de Leitura e Manutenção**: Desenvolvedores e agentes de IA gastam tokens e tempo excessivos inspecionando um arquivo de quase 60 KB.

---

## 2. Objetivos e Escopo

### 2.1 Objetivos Principais
- **Modularização por Domínio**: Decompor os 90 modelos e 11 enums em sub-esquemas modulares organizados por contexto de negócio dentro de `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/`:
  1. `01-base.prisma`: Datasource PostgreSQL, generator client com suporte a `prismaSchemaFolder` e enums globais.
  2. `02-auth-users.prisma`: Organização, usuários, autenticações OAuth e convites.
  3. `03-posts-content.prisma`: Postagens, agendamentos, tags, comentários e menções.
  4. `04-integrations-channels.prisma`: Conexões sociais, webhooks e provedores terceiros.
  5. `05-billing-marketplace.prisma`: Assinaturas, créditos, pedidos e marketplace de agências.
  6. `06-media-clipping.prisma`: Arquivos de mídia, vídeos, uploads e cortes automáticos.
  7. `07-notifications-system.prisma`: Notificações internas, anúncios e logs de erros.
  8. `08-mastra-ai.prisma`: Tabelas de agentes Mastra, threads, memória, traces, workflows e MCP.
- **Automação de Bundle & Validação**: Criar um script utilitário (`bundle-schema.ts`) que valida a consistência relacional e monta/sincroniza o `schema.prisma` unificado para garantir compatibilidade retroativa total com todos os comandos `pnpm run prisma-*` e ferramentas legadas.
- **Integração no package.json**: Adicionar scripts `pnpm run prisma-bundle` e suporte a geração modular.

---

## 3. Requisitos Funcionais (RF)

| ID | Descrição | Prioridade |
|---|---|---|
| **RF-001** | Criar diretório `schema/` dentro de `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/` com os sub-esquemas modulares divididos por domínio. | Alta |
| **RF-002** | Garantir que a união de todos os sub-esquemas contenha exatamente os 90 modelos e 11 enums sem perda de campos, chaves primárias, relacionamentos `@relation` ou índices `@@index`. | Alta |
| **RF-003** | Configurar o bloco `generator client` com `previewFeatures = ["prismaSchemaFolder"]` habilitando suporte nativo do Prisma 6 à pasta modular. | Alta |
| **RF-004** | Criar script de automação (`bundle-schema.ts`) que gera e valida o `schema.prisma` consolidado de forma idempotente. | Alta |
| **RF-005** | Adicionar atalho de script `"prisma-bundle"` no `package.json` para facilitar a sincronização contínua. | Média |

---

## 4. Requisitos Não Funcionais (RNF)

- **RNF-001 (Zero Downtime / Zero Regressão de Schema)**: Nenhuma migração ou alteração estrutural no banco de dados existente deve ser disparada; o schema gerado deve ser identicamente equivalente ao banco atual.
- **RNF-002 (Retrocompatibilidade)**: Scripts existentes (`prisma-generate`, `prisma-db-push`) devem continuar funcionando sem quebrar pipelines de CI/CD ou deploys locais.

---

## 5. Critérios de Aceite

1. Todos os 90 modelos e 11 enums estão distribuídos logicamente nos arquivos `.prisma` dentro de `schema/`.
2. O script `pnpm run prisma-bundle` executa sem erros e reconstrói o `schema.prisma` consolidado.
3. O comando de geração do Prisma (`pnpm run prisma-generate`) valida o schema sem advertências sintáticas.
