# Roadmap: 036-hupflow-competitor-benchmark-radar

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/competitors/types.ts` com contratos de perfil concorrente, baseline do workspace, Share of Voice, comparativo de nicho e Content Gaps.
   - Adicionar tabela `competitorProfiles` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor Puro de Benchmarking & Content Gaps (TDD)**:
   - Criar `hupflow/src/lib/competitors/competitors.test.ts` com funções determinísticas (`calculateWeeklyEngagedReach`, `calculateCompetitiveThreatScore`, `calculateShareOfVoiceDistribution`, `compareAgainstWorkspaceBaseline`, `detectContentGaps`) e 6 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/competitors/service.ts` com persistência Drizzle + fallback em memória pré-populado com 3 concorrentes realistas e linha de base da organização.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/competitors/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/competitors/sync/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/competitors/CompetitorRadarCard.tsx`, página `hupflow/src/app/(dashboard)/settings/competitors/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/competitors/competitors.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/036-hupflow-competitor-benchmark-radar.md`.
