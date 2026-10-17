# Análise de Impacto no Legado — Feature 033: White-Label Client Portals & External Approvals

## 1. Visão Geral das Alterações
A **Feature 033** introduz Portais White-Label de Aprovação Externa (`/portal/[token]`), permitindo que agências e equipes de social media compartilhem cronogramas de posts, carrosséis e Reels com clientes finais através de um link mágico (Capability Token `ptl_...` e proteção opcional por PIN numérico), sem obrigar o cliente a criar conta ou senha no sistema.

## 2. Componentes Criados & Alterados
- **Modelos e Schemas (`hupflow/src/lib/db/schema.ts`, `hupflow/src/lib/portals/types.ts`)**:
  - Tabela `client_portals` com isolamento multi-tenant por `organization_id` e restrição `unique()` em `token`.
- **Motor de Tokens & Revisão Externa (`hupflow/src/lib/portals/portals.test.ts`)**:
  - Gerador criptográfico Base62 `generatePortalToken`.
  - Validadores `isValidHexColor`, `normalizeBrandColor`, `isValidPortalPin` e `verifyPortalPinAccess`.
  - Máquina de estados `applyDeliverableReview` (`pending_review -> approved | changes_requested`) e calculador `calculatePortalMetrics`.
- **Camada de Serviço (`hupflow/src/lib/portals/service.ts`)**:
  - Persistência Drizzle ORM com fallback em memória.
- **Rotas de API REST (`/api/portals`, `/api/portals/public/[token]`, `/api/portals/review`)**:
  - Endpoints do dashboard protegidos por RBAC (`viewer` / `member`) e endpoints públicos protegidos por Capability Token + PIN.
- **Simulador, Dashboard e Portal Público (`ClientPortalPreview.tsx`, `/settings/portals/page.tsx`, `/portal/[token]/page.tsx`, `layout.tsx`)**:
  - Simulador White-Label interativo no painel da agência.
  - Página externa responsiva `/portal/[token]` para aprovação em 1 clique.
  - Atalho `'Portais de Clientes'` na barra lateral do dashboard.

## 3. Impacto no Sistema Legado
- **Isolamento de Dados**: Totalmente isolado por `organization_id`.
- **Compatibilidade Retroativa**: 100% preservada.
- **Zero AGPL**: Código 100% autoral em TypeScript, sem dependências restritivas.
