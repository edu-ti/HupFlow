# Análise de Impacto no Legado — Feature 035: Evergreen Content Recycler & Smart Auto-Requeue

## 1. Visão Geral das Alterações
A **Feature 035** introduz o Motor de Reciclagem Evergreen & Republicação Inteligente (`/settings/evergreen`), permitindo que marcas e agências pontuem conteúdos perenes (`calculateEvergreenScore`), gerem 3 ângulos editoriais alternativos em round-robin (`generateSpunVariations`) e reenfileirem posts automaticamente respeitando janelas de descanso (`cooldownDays`).

## 2. Componentes Criados & Alterados
- **Modelos e Schemas (`hupflow/src/lib/db/schema.ts`, `hupflow/src/lib/evergreen/types.ts`)**:
  - Tabela `evergreen_items` com isolamento multi-tenant por `organization_id`.
- **Motor de Perenidade & Cooldown (`hupflow/src/lib/evergreen/evergreen.test.ts`)**:
  - Algoritmo heurístico `calculateEvergreenScore` (0-100) com detecção de termos datados/efêmeros.
  - Gerador de variações `generateSpunVariations` e seletor round-robin `pickNextVariationForCycle`.
  - Guardião anti-saturação `isEligibleForRecycle` e calculador `computeNextRecycleSlot`.
- **Camada de Serviço (`hupflow/src/lib/evergreen/service.ts`)**:
  - Persistência Drizzle ORM com fallback em memória.
- **Rotas de API REST (`/api/evergreen`, `/api/evergreen/recycle`)**:
  - Endpoints protegidos por RBAC (`viewer` para leitura, `member` para cadastro, exclusão e disparo de reciclagem).
- **Componentes & Interface (`EvergreenVariationCard.tsx`, `/settings/evergreen/page.tsx`, `layout.tsx`)**:
  - Card interativo com inspeção das 3 variações round-robin, status de Cooldown e botão de reciclagem.
  - Atalho `'Reciclagem Evergreen'` na barra lateral do dashboard.

## 3. Impacto no Sistema Legado
- **Isolamento de Dados**: Totalmente isolado por `organization_id`.
- **Compatibilidade Retroativa**: 100% preservada.
- **Zero AGPL**: Código 100% autoral em TypeScript, sem dependências restritivas.
