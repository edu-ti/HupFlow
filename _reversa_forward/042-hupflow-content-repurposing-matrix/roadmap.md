# Roadmap: 042-hupflow-content-repurposing-matrix

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/repurpose/types.ts` com contratos de kit de reaproveitamento, slides de carrossel, thread de tweets, roteiro vertical e sumário.
   - Adicionar tabela `contentRepurposingKits` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor de Decomposição Atômica & Geradores Multi-Formato IA (TDD)**:
   - Criar `hupflow/src/lib/repurpose/repurpose.test.ts` com funções determinísticas (`decomposeLongFormContent`, `generateCarouselSlidesFromLongForm`, `generateXThreadFromLongForm`, `generateVerticalVideoScriptFromLongForm`, `generateExecutiveNewsletterSnippet`, `summarizeRepurposingPortfolio`) e 6 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/repurpose/service.ts` com persistência Drizzle + fallback em memória pré-populado com 2 kits completos.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/repurpose/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/repurpose/export/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/repurpose/RepurposingKitCard.tsx`, página `hupflow/src/app/(dashboard)/settings/repurpose/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/repurpose/repurpose.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/042-hupflow-content-repurposing-matrix.md`.
