# Roadmap: 039-hupflow-influencer-creator-crm

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/creators/types.ts` com contratos de parceria de criador, métricas financeiras (CPE, CPM, EMV, ROI) e sumário de portfólio.
   - Adicionar tabela `influencerPartnerships` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor Financeiro de CPE, EMV, ROI & Briefing UGC IA (TDD)**:
   - Criar `hupflow/src/lib/creators/creators.test.ts` com funções determinísticas (`evaluateCreatorFinancialMetrics`, `generateCreatorUgcBriefing`, `summarizeCreatorPortfolio`) e 5 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/creators/service.ts` com persistência Drizzle + fallback em memória pré-populado com 3 criadores realistas.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/creators/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/creators/action/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/creators/CreatorPartnershipCard.tsx`, página `hupflow/src/app/(dashboard)/settings/creators/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/creators/creators.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/039-hupflow-influencer-creator-crm.md`.
