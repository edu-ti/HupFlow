# Roadmap: 040-hupflow-employee-advocacy-board

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/advocacy/types.ts` com contratos de campanha de Employee Advocacy, variações de persona, métricas de economia de Ads, Leaderboard e sumário.
   - Adicionar tabela `advocacyCampaigns` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor de Personas 1ª Pessoa, Ad Spend Saved & Gamificação (TDD)**:
   - Criar `hupflow/src/lib/advocacy/advocacy.test.ts` com funções determinísticas (`generateAdvocacyPersonaVariations`, `calculateAdvocacyImpactMetrics`, `assignAmbassadorBadge`, `summarizeAdvocacyProgram`) e 5 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/advocacy/service.ts` com persistência Drizzle + fallback em memória pré-populado com 3 campanhas e 4 embaixadores no Leaderboard.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/advocacy/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/advocacy/share/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/advocacy/AdvocacyCampaignCard.tsx`, página `hupflow/src/app/(dashboard)/settings/advocacy/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/advocacy/advocacy.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/040-hupflow-employee-advocacy-board.md`.
