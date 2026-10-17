# Roadmap: Agendamento & Campanhas em Lote com IA (AI Bulk Scheduler)

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data: `2026-10-16`  
> Requisitos: `_reversa_forward/019-hupflow-ai-bulk-scheduler/requirements.md`  

---

## Fases de Execução

### Fase 1, Preparação
- [ ] Definir interfaces TypeScript em `src/lib/bulk-scheduler/types.ts` (`CampaignRequest`, `CampaignSlot`, `GeneratedCampaignPost`, `CampaignResponse`).
- [ ] Implementar motor matemático de distribuição temporal em `src/lib/bulk-scheduler/slots.ts` (`calculateScheduleSlots`).

### Fase 2, Testes (TDD)
- [ ] Criar testes unitários em `src/lib/bulk-scheduler/bulk-scheduler.test.ts`:
  - Distribuição correta de dias da semana (ex: terças e quintas).
  - Horários configurados sem gerar datas no passado.
  - Geração de slots sequenciais de acordo com o total solicitado.
  - Validação de cotas contra `checkResourceQuota`.

### Fase 3, Núcleo do Gerador & API
- [ ] Implementar gerador de campanha com IA em `src/lib/bulk-scheduler/generator.ts` com fallback determinístico.
- [ ] Implementar endpoint REST `POST /api/ai/bulk-campaign` em `src/app/api/ai/bulk-campaign/route.ts` suportando `mode: "preview"` e `mode: "commit"`.

### Fase 4, Integração Frontend
- [ ] Criar componente `BulkCampaignModal.tsx` em `src/components/campaign/BulkCampaignModal.tsx` com formulário de objetivo, seletor de dias, horários e canais.
- [ ] Integrar botão "Criar Campanha com IA" no topo do Dashboard (`/dashboard`) abrindo o modal e atualizando o calendário semanal após aprovação.

### Fase 5, Polimento & Governança
- [ ] Executar suíte completa de testes com `tsx`.
- [ ] Executar validação estática `tsc --noEmit` em todo o workspace.
- [ ] Gerar `legacy-impact.md`, `regression-watch.md` e adendo em `_reversa_sdd/addenda/019-hupflow-ai-bulk-scheduler.md`.
- [ ] Sincronizar `.reversa/active-requirements.json`, `state.json` e `SESSION_HANDOFF.md`.
