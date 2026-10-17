# Plano de Ação — Feature 050: Preparação para Produção, Docker Compose & Checklist Final

## Checklist de Tarefas Clean-Room

- [ ] **T001**: Criar arquivos de containerização `hupflow/Dockerfile`, `hupflow/docker-compose.yml`, `hupflow/.dockerignore` e `hupflow/.env.example`.
- [ ] **T002**: Definir modelos de dados de diagnóstico e checklist em `hupflow/src/lib/system/types.ts`.
- [ ] **T003**: Implementar funções puras de healthcheck e métricas de sistema com testes unitários em `hupflow/src/lib/system/system.test.ts`.
- [ ] **T004**: Criar camada de serviço de diagnóstico em `hupflow/src/lib/system/service.ts`.
- [ ] **T005**: Desenvolver rotas de API `/api/health` (pública) e `/api/system/status` (admin).
- [ ] **T006**: Construir componente `SystemHealthCard.tsx` com medidores visuais de latência e status dos containers.
- [ ] **T007**: Criar página do dashboard `/settings/system-health` em `hupflow/src/app/(dashboard)/settings/system-health/page.tsx` com radar de prontidão e checklist das 50 features.
- [ ] **T008**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `Server` com badge `50/50`).
- [ ] **T009**: Validar compilação geral com `tsc --noEmit` e rodar testes unitários com `tsx`.
- [ ] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/050-hupflow-production-readiness-docker.md`), atualizar `.reversa/state.json`, `active-requirements.json` e celebrar a conclusão do marco de 50 Features no `SESSION_HANDOFF.md`.
