# Actions: Recomendador de Hashtags com IA & Coleções Salvas

> Identificador: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/028-hupflow-ai-hashtag-recommender/roadmap.md`  

---

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 9 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Definir contratos TypeScript para hashtags, tiers, guidance e sets em types.ts | - | `[//]` | `hupflow/src/lib/hashtags/types.ts` | 🟢 | `[x]` |
| T002 | Adicionar tabela hashtag_sets no schema.ts do Drizzle ORM | T001 | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[x]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para motor de recomendação, sanitização de tags e tiers | T001 | - | `hupflow/src/lib/hashtags/hashtags.test.ts` | 🟢 | `[x]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar motor de recomendação IA e gerenciamento de coleções em service.ts | T001, T002 | - | `hupflow/src/lib/hashtags/service.ts` | 🟢 | `[x]` |
| T005 | Criar rotas REST /api/ai/hashtags e /api/hashtags/sets | T001, T004 | - | `hupflow/src/app/api/ai/hashtags/route.ts` & `hupflow/src/app/api/hashtags/sets/route.ts` | 🟢 | `[x]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Criar componente HashtagRecommenderModal.tsx para o Compositor | T001, T005 | `[//]` | `hupflow/src/components/composer/HashtagRecommenderModal.tsx` | 🟢 | `[x]` |
| T007 | Integrar o modal e injeção em 1 clique na tela do Compositor /composer | T006 | - | `hupflow/src/app/(dashboard)/composer/page.tsx` | 🟢 | `[x]` |
| T008 | Criar tela /settings/hashtags para gestão de coleções e adicionar ao menu lateral | T005 | - | `hupflow/src/app/(dashboard)/settings/hashtags/page.tsx` & `layout.tsx` | 🟢 | `[x]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Bateria de testes com tsx, validação estática tsc --noEmit e governança SDD | T003, T005, T007, T008 | - | `hupflow/` | 🟢 | `[x]` |

---

## Notas de execução

- **T001**: Contratos TypeScript definidos com `HashtagTier`, `SocialNetwork`, `HashtagRecommendation`, `NetworkGuidance`, `HashtagSet`.
- **T002**: Tabela `hashtag_sets` no Drizzle ORM com isolamento multi-tenant por `organization_id`.
- **T003**: Bateria de testes unitários validando sanitização PascalCase, diretrizes algorítmicas, categorização de tiers e motor semântico offline (100% aprovados).
- **T004**: Motor de IA híbrido com Vercel AI SDK e fallback semântico heurístico de 8 nichos de mercado.
- **T005**: Rotas RESTful `/api/ai/hashtags` e `/api/hashtags/sets` protegidas por RBAC.
- **T006**: Modal `HashtagRecommenderModal.tsx` com navegação por abas (IA e Coleções Salvas) e prevenção visual de saturação de tags.
- **T007**: Integrado ao Compositor `/composer` com injeção em 1 clique preservando quebras de linha e sincronização do rascunho.
- **T008**: Painel `/settings/hashtags` para criação e listagem de coleções salvas com chips visuais e link no menu lateral (`layout.tsx`).
- **T009**: Compilação TypeScript com `tsc --noEmit` resultando em zero erros; adendo SDD e relatórios de impacto e regressão concluídos.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
| 2026-10-16 | Conclusão e entrega de todas as 9 ações (T001-T009) | reversa-coding |
