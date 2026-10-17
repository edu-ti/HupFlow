# Plano de Ação — Feature 048: Kill Switch de Segurança & Gestão de Crise

## Checklist de Tarefas Clean-Room

- [x] **T001**: Criar definições de tipos em `hupflow/src/lib/brandsafety/types.ts` (`BrandSafetyStatus`, `CrisisIncidentLog`, `BrandSafetyConfig`, `EvaluatePostSafetyResult`).
- [x] **T002**: Adicionar tabelas `brand_safety_settings` e `crisis_incident_logs` no schema Drizzle em `hupflow/src/lib/db/schema.ts`.
- [x] **T003**: Implementar funções puras de segurança e prevenção de disparo (`evaluatePostBrandSafety`, `reconcileFrozenPostsOnResume`, `summarizeBrandSafetyHealth`) com suíte de testes em `hupflow/src/lib/brandsafety/brandsafety.test.ts`.
- [x] **T004**: Criar camada de serviço em `hupflow/src/lib/brandsafety/service.ts` com fallback em memória pré-populado e operações atômicas de ativação/desativação.
- [x] **T005**: Desenvolver rotas de API `/api/brand-safety` e `/api/brand-safety/kill-switch` com validação de perfil `admin` e trava de confirmação textual.
- [x] **T006**: Criar componentes `CrisisStatusBanner.tsx` e `CrisisIncidentCard.tsx`.
- [x] **T007**: Criar página do dashboard `/settings/kill-switch` em `hupflow/src/app/(dashboard)/settings/kill-switch/page.tsx`.
- [x] **T008**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `ShieldAlert` com badge `SOS`).
- [x] **T009**: Validar suíte de testes unitários com `tsx` e compilação estática `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/048-hupflow-crisis-kill-switch-brand-safety.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
