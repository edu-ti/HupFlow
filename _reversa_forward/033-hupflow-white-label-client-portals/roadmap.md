# Roadmap: White-Label Client Portals & External Approvals

> Identificador: `033-hupflow-white-label-client-portals`  
> Data: `2026-10-17`  

---

## Fases de Execução

### Fase 1: Fundação de Dados e Contratos
- Criar tipos em `hupflow/src/lib/portals/types.ts` (`ClientPortal`, `PortalDeliverable`, `PortalDeliverableStatus`, `PortalStats`, `PortalReviewInput`, `PublicPortalView`).
- Adicionar a tabela `client_portals` em `hupflow/src/lib/db/schema.ts`.

### Fase 2: Motor de Tokens, Regras de Aprovação e Testes Unitários
- Criar `hupflow/src/lib/portals/portals.test.ts` implementando e validando:
  - `generatePortalToken()`: geração de token URL-safe com prefixo `ptl_`.
  - `isValidHexColor(hex)` e `validatePortalPin(pin)`.
  - `applyDeliverableReview(deliverables, reviewInput)`: transição de estado (`pending_review -> approved | changes_requested`), exigência de feedback textual quando `decision === 'changes_requested'` e carimbo de data/hora.
  - `calculatePortalMetrics(deliverables)`: contagem de pendentes, aprovados, ajustes solicitados e percentual de conclusão (`approvalRate`).

### Fase 3: Camada de Serviço e Rotas de API REST
- Implementar `hupflow/src/lib/portals/service.ts` com persistência Drizzle em `client_portals` e fallback resiliente em memória (com portal de demonstração populado).
- Criar rotas REST:
  - `GET / POST / DELETE` em `hupflow/src/app/api/portals/route.ts` (autenticadas via RBAC).
  - `GET` em `hupflow/src/app/api/portals/public/[token]/route.ts` (acesso público com suporte a PIN).
  - `POST` em `hupflow/src/app/api/portals/review/route.ts` (submissão pública de aprovação/ajuste pelo cliente).

### Fase 4: Simulador White-Label, Painel `/settings/portals` e Portal Público `/portal/[token]`
- Criar `hupflow/src/components/portals/ClientPortalPreview.tsx` para visualização interativa do portal White-Label dentro do dashboard.
- Criar `hupflow/src/app/(dashboard)/settings/portals/page.tsx` para gerenciar clientes, branding, PIN, entregas e copiar links mágicos.
- Criar a página pública externa `hupflow/src/app/portal/[token]/page.tsx` sem necessidade de login para o cliente aprovar ou pedir ajustes em 1 clique.

### Fase 5: Navegação, Testes e Sincronização SDD
- Adicionar atalho `'Portais de Clientes'` com ícone `ExternalLink` (ou `Building2`) em `hupflow/src/app/(dashboard)/layout.tsx`.
- Executar `npx tsx src/lib/portals/portals.test.ts` e `npx tsc --noEmit`.
- Gerar `legacy-impact.md`, `regression-watch.md`, adendo SDD 033 e atualizar `SESSION_HANDOFF.md`.
