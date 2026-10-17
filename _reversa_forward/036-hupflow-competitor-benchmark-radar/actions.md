# Actions: 036-hupflow-competitor-benchmark-radar

- [x] **T001**: Criar contratos e tipos em `hupflow/src/lib/competitors/types.ts`
- [x] **T002**: Adicionar tabela `competitorProfiles` em `hupflow/src/lib/db/schema.ts`
- [x] **T003**: Implementar motor puro de Share of Voice, Threat Score e Content Gaps + suíte TDD em `hupflow/src/lib/competitors/competitors.test.ts`
- [x] **T004**: Implementar serviço multi-tenant com fallback em memória em `hupflow/src/lib/competitors/service.ts`
- [x] **T005**: Criar endpoints `GET`/`POST /api/competitors` em `hupflow/src/app/api/competitors/route.ts`
- [x] **T006**: Criar endpoint `POST /api/competitors/sync` em `hupflow/src/app/api/competitors/sync/route.ts`
- [x] **T007**: Criar componente `hupflow/src/components/competitors/CompetitorRadarCard.tsx`
- [x] **T008**: Criar página `hupflow/src/app/(dashboard)/settings/competitors/page.tsx` e adicionar item de menu em `hupflow/src/app/(dashboard)/layout.tsx`
- [x] **T009**: Executar suíte de testes (`competitors.test.ts`) e checagem de tipos (`tsc --noEmit`)
- [x] **T010**: Sincronizar documentação SDD (`addenda/036-hupflow-competitor-benchmark-radar.md`, `legacy-impact.md`, `regression-watch.md`, `SESSION_HANDOFF.md`)
