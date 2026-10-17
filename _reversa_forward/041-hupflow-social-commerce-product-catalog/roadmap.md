# Roadmap: 041-hupflow-social-commerce-product-catalog

1. **Fase 1 — Contratos & Schema Drizzle**:
   - Criar `hupflow/src/lib/commerce/types.ts` com contratos de item de catálogo social, métricas de atribuição (Receita, RPM Social, EPC, Conversão) e sumário.
   - Adicionar tabela `socialCommerceProducts` em `hupflow/src/lib/db/schema.ts`.
2. **Fase 2 — Motor de Atribuição Social Commerce & Copy Shoppable IA (TDD)**:
   - Criar `hupflow/src/lib/commerce/commerce.test.ts` com funções determinísticas (`evaluateSocialCommerceMetrics`, `generateShoppablePostCopy`, `summarizeSocialCommerceCatalog`) e 4 suítes de testes unitários.
3. **Fase 3 — Camada de Serviço Multi-Tenant**:
   - Criar `hupflow/src/lib/commerce/service.ts` com persistência Drizzle + fallback em memória pré-populado com 3 ofertas/produtos.
4. **Fase 4 — Rotas de API REST & RBAC**:
   - Criar `hupflow/src/app/api/commerce/route.ts` (`GET`, `POST`) e `hupflow/src/app/api/commerce/action/route.ts` (`POST`).
5. **Fase 5 — Componentes Visuais & Navegação**:
   - Criar `hupflow/src/components/commerce/SocialProductCard.tsx`, página `hupflow/src/app/(dashboard)/settings/commerce/page.tsx` e link na sidebar em `hupflow/src/app/(dashboard)/layout.tsx`.
6. **Fase 6 — Validação & SDD Sync**:
   - Rodar testes unitários (`npx tsx src/lib/commerce/commerce.test.ts`) e `npx tsc --noEmit`.
   - Atualizar artefatos Reversa e `_reversa_sdd/addenda/041-hupflow-social-commerce-product-catalog.md`.
