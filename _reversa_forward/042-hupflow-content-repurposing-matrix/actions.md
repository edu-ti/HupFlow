# Plano de Ação — Feature 042: Matriz de Reaproveitamento Multi-Formato IA (1 Conteúdo Longo -> Kit de 4 Formatos)

## Checklist de Implementação Clean-Room

- [x] **T001**: Criar modelo de tipos em `hupflow/src/lib/repurpose/types.ts` (`RepurposingSourceType`, `RepurposingTone`, `CarouselSlideItem`, `XThreadTweet`, `VerticalReelScript`, `ExecutiveNewsletter`, `ContentRepurposingKit`, `RepurposingSummaryMetrics`).
- [x] **T002**: Adicionar tabela `contentRepurposingKits` em `hupflow/src/lib/db/schema.ts` com Drizzle ORM e isolamento multi-tenant por `organizationId`.
- [x] **T003**: Implementar geradores determinísticos puros e suíte de testes unitários em `hupflow/src/lib/repurpose/repurpose.test.ts` (`decomposeLongFormContent`, `generateCarouselSlides`, `generateXThread`, `generateVerticalReelScript`, `generateExecutiveNewsletter`, `summarizeRepurposingPortfolio`).
- [x] **T004**: Criar camada de serviço multi-tenant em `hupflow/src/lib/repurpose/service.ts` com suporte a persistência Drizzle e fallback resiliente em memória `Map`.
- [x] **T005**: Implementar rotas de API REST em `hupflow/src/app/api/repurpose/route.ts` (GET, POST, PATCH, DELETE) com validação de RBAC (`requireOrgRole`).
- [x] **T006**: Criar endpoint de exportação unificada em `hupflow/src/app/api/repurpose/export/route.ts` (Markdown e JSON).
- [x] **T007**: Desenvolver componente de UI interativo com abas `RepurposingKitCard.tsx` em `hupflow/src/components/repurpose/RepurposingKitCard.tsx`.
- [x] **T008**: Construir página do painel `/settings/repurpose` em `hupflow/src/app/(dashboard)/settings/repurpose/page.tsx` com métricas consolidadas, modal de criação e gerador assistido.
- [x] **T009**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` com ícone `Layers` e badge `4x`.
- [x] **T010**: Executar bateria de testes com `tsx` e typecheck estático rigoroso `tsc --noEmit`, registrando sincronização no Reversa SDD e handoff.
