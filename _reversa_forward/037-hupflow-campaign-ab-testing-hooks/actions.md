# Actions: 037-hupflow-campaign-ab-testing-hooks

- [x] **T001**: Criar contratos e tipos em `hupflow/src/lib/ab-testing/types.ts`
- [x] **T002**: Adicionar tabela `abTestExperiments` em `hupflow/src/lib/db/schema.ts`
- [x] **T003**: Implementar motor estatístico Z-Score, gerador de variante desafiante e suíte TDD em `hupflow/src/lib/ab-testing/ab-testing.test.ts`
- [x] **T004**: Implementar serviço multi-tenant com fallback em memória em `hupflow/src/lib/ab-testing/service.ts`
- [x] **T005**: Criar endpoints `GET`/`POST /api/ab-tests` em `hupflow/src/app/api/ab-tests/route.ts`
- [x] **T006**: Criar endpoint `POST /api/ab-tests/simulate` em `hupflow/src/app/api/ab-tests/simulate/route.ts`
- [x] **T007**: Criar componente `hupflow/src/components/ab-testing/AbExperimentCard.tsx`
- [x] **T008**: Criar página `hupflow/src/app/(dashboard)/settings/ab-testing/page.tsx` e adicionar item de menu em `hupflow/src/app/(dashboard)/layout.tsx`
- [x] **T009**: Executar suíte de testes (`ab-testing.test.ts`) e checagem de tipos (`tsc --noEmit`)
- [x] **T010**: Sincronizar documentação SDD (`addenda/037-hupflow-campaign-ab-testing-hooks.md`, `legacy-impact.md`, `regression-watch.md`, `SESSION_HANDOFF.md`)
