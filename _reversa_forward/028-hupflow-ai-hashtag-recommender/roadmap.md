# Roadmap: Recomendador Inteligente de Hashtags & Coleções Salvas por IA

> Identificador: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  

---

## Fases de Execução

### Fase 1: Preparação & Tipagem
- `T001`: Definir contratos TypeScript em `hupflow/src/lib/hashtags/types.ts`.
- `T002`: Adicionar tabela `hashtag_sets` no schema do Drizzle ORM em `hupflow/src/lib/db/schema.ts`.

### Fase 2: Testes de Domínio (TDD)
- `T003`: Criar testes unitários para o motor de recomendação, categorização por tier e higienização em `hupflow/src/lib/hashtags/hashtags.test.ts`.

### Fase 3: Motor de IA & Serviços
- `T004`: Implementar o motor de IA e fallbacks resilientes em `hupflow/src/lib/hashtags/service.ts`.
- `T005`: Criar rotas RESTful em `hupflow/src/app/api/ai/hashtags/route.ts` e `hupflow/src/app/api/hashtags/sets/route.ts`.

### Fase 4: Interface & Integração com o Compositor
- `T006`: Criar modal integrado de recomendação de hashtags no Compositor em `hupflow/src/components/composer/HashtagRecommenderModal.tsx`.
- `T007`: Integrar o botão e injeção de hashtags em 1 clique em `hupflow/src/app/(dashboard)/composer/page.tsx`.
- `T008`: Criar painel visual de gerenciamento de coleções salvas em `hupflow/src/app/(dashboard)/settings/hashtags/page.tsx` e atalho no menu em `hupflow/src/app/(dashboard)/layout.tsx`.

### Fase 5: Validação, Regressão e Governança
- `T009`: Bateria de testes com `npx tsx`, verificação estática com `npx tsc --noEmit`, adendo SDD e relatórios de conformidade.
