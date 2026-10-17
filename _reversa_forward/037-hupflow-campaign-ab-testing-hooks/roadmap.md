# Roadmap: 037-hupflow-campaign-ab-testing-hooks

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/ab-testing/types.ts` com contratos de variante, estatísticas Z-Score, experimento A/B e sumário.
   - Adicionar tabela `abTestExperiments` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor Estatístico Z-Score & Gerador de Hipóteses (TDD)**:
   - Criar `hupflow/src/lib/ab-testing/ab-testing.test.ts` com funções puras (`normalCdfApprox`, `evaluateAbExperimentStatistics`, `generateChallengerHookVariant`, `simulateTrafficBatch`, `summarizeAbExperiments`) e 6 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/ab-testing/service.ts` com persistência Drizzle + fallback em memória pré-populado com 3 experimentos A/B realistas.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/ab-tests/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/ab-tests/simulate/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/ab-testing/AbExperimentCard.tsx`, página `hupflow/src/app/(dashboard)/settings/ab-testing/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/ab-testing/ab-testing.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/037-hupflow-campaign-ab-testing-hooks.md`.
