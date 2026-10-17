# Roadmap: Feed RSS Integrator & Publicação com IA

> Identificador: `030-hupflow-rss-auto-publishing`  
> Data: `2026-10-16`  

---

## Fases de Execução

### Fase 1: Preparação & Tipagem
- `T001`: Definir contratos TypeScript para feeds, itens, status e síntese em `hupflow/src/lib/rss/types.ts`.
- `T002`: Adicionar tabelas `rss_feeds` e `rss_feed_items` no schema do Drizzle ORM em `hupflow/src/lib/db/schema.ts`.

### Fase 2: Testes de Domínio (TDD)
- `T003`: Criar testes unitários para o parser XML RSS/Atom nativo, deduplicação por GUID e síntese de post em `hupflow/src/lib/rss/rss.test.ts`.

### Fase 3: Motor de Parser & Serviços
- `T004`: Implementar o parser nativo, fetcher de feeds e serviço de síntese em `hupflow/src/lib/rss/service.ts`.
- `T005`: Criar rotas REST `/api/rss/route.ts` e `/api/rss/sync/route.ts` com RBAC.

### Fase 4: Interface & Gerenciamento de Feeds
- `T006`: Criar modal de cadastro e teste de feed `AddFeedModal.tsx` em `hupflow/src/components/rss/AddFeedModal.tsx`.
- `T007`: Criar painel visual de gerenciamento de feeds e artigos detectados em `hupflow/src/app/(dashboard)/settings/rss/page.tsx`.
- `T008`: Adicionar atalho "Feeds RSS" no menu lateral do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.

### Fase 5: Validação, Regressão e Governança
- `T009`: Bateria de testes com `npx tsx`, verificação estática com `npx tsc --noEmit`, adendo SDD e relatórios de conformidade.
