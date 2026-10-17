# Roadmap de Implementação — Feature 049: Relatórios Executivos em PDF

- **Fase 1 (Tipagem & Engine Pura de PDF)**:
  - Definir tipos em `src/lib/reports/types.ts`.
  - Construir gerador vetorial de PDF com `jspdf` em `src/lib/reports/pdfEngine.ts`.
  - Escrever testes unitários em `src/lib/reports/reports.test.ts`.
- **Fase 2 (Schema Drizzle & Service)**:
  - Adicionar `clientReportSchedules` e `generatedClientReports` em `src/lib/db/schema.ts`.
  - Implementar camada de serviço multi-tenant em `src/lib/reports/service.ts`.
- **Fase 3 (Rotas de API com RBAC)**:
  - Criar `/api/reports`, `/api/reports/generate` e `/api/reports/download`.
- **Fase 4 (UI & Integração com Dashboard)**:
  - Criar componente `ClientReportCard.tsx`.
  - Construir página `/settings/reports`.
  - Adicionar link na barra lateral do layout do dashboard.
- **Fase 5 (Testes & Sincronização)**:
  - Validar com `tsx` e typecheck `tsc --noEmit`.
  - Registrar no SDD e atualizar `SESSION_HANDOFF.md`.
