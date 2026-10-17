# Plano de Ação — Feature 049: Relatórios Executivos Automáticos em PDF para Clientes

## Checklist de Tarefas Clean-Room

- [x] **T001**: Definir modelos em `hupflow/src/lib/reports/types.ts` (`ClientReportSchedule`, `GeneratedClientReport`, `ReportMetricsSnapshot`, `CreateReportInput`).
- [x] **T002**: Adicionar tabelas `client_report_schedules` e `generated_client_reports` no schema Drizzle em `hupflow/src/lib/db/schema.ts`.
- [x] **T003**: Construir gerador vetorial de PDF nativo com `jspdf` e formatadores de KPIs com testes unitários em `hupflow/src/lib/reports/reports.test.ts`.
- [x] **T004**: Criar camada de serviço multi-tenant em `hupflow/src/lib/reports/service.ts` com fallback em memória pré-populado.
- [x] **T005**: Desenvolver rotas de API `/api/reports`, `/api/reports/generate` e `/api/reports/download` com controle RBAC.
- [x] **T006**: Construir componente `ClientReportCard.tsx` com botões de download e preview de métricas.
- [x] **T007**: Criar página do dashboard `/settings/reports` em `hupflow/src/app/(dashboard)/settings/reports/page.tsx`.
- [x] **T008**: Adicionar link na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `FileText` com badge `PDF`).
- [x] **T009**: Executar suíte de testes unitários com `tsx` e compilação estática `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/049-hupflow-automated-client-pdf-reports.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
