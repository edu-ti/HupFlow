# Actions: 038-hupflow-social-listening-brand-mentions

- [x] **T001**: Criar contratos e tipos em `hupflow/src/lib/listening/types.ts`
- [x] **T002**: Adicionar tabela `socialListeningMentions` em `hupflow/src/lib/db/schema.ts`
- [x] **T003**: Implementar motor de sentimento, urgência de RP e Playbook IA + suíte TDD em `hupflow/src/lib/listening/listening.test.ts`
- [x] **T004**: Implementar serviço multi-tenant com fallback em memória em `hupflow/src/lib/listening/service.ts`
- [x] **T005**: Criar endpoints `GET`/`POST /api/listening` em `hupflow/src/app/api/listening/route.ts`
- [x] **T006**: Criar endpoint `POST /api/listening/action` em `hupflow/src/app/api/listening/action/route.ts`
- [x] **T007**: Criar componente `hupflow/src/components/listening/ListeningMentionCard.tsx`
- [x] **T008**: Criar página `hupflow/src/app/(dashboard)/settings/listening/page.tsx` e adicionar item de menu em `hupflow/src/app/(dashboard)/layout.tsx`
- [x] **T009**: Executar suíte de testes (`listening.test.ts`) e checagem de tipos (`tsc --noEmit`)
- [x] **T010**: Sincronizar documentação SDD (`addenda/038-hupflow-social-listening-brand-mentions.md`, `legacy-impact.md`, `regression-watch.md`, `SESSION_HANDOFF.md`)
