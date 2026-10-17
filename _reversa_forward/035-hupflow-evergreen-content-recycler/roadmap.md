# Roadmap: Evergreen Content Recycler & Smart Auto-Requeue

> Identificador: `035-hupflow-evergreen-content-recycler`  
> Data: `2026-10-17`  

---

## Fases de Execução

### Fase 1: Fundação de Dados e Contratos
- Criar tipos em `hupflow/src/lib/evergreen/types.ts` (`EvergreenItem`, `EvergreenCategory`, `EvergreenVariation`, `EvergreenStats`).
- Adicionar a tabela `evergreen_items` em `hupflow/src/lib/db/schema.ts`.

### Fase 2: Motor de Pontuação Evergreen, Cooldown e Testes Unitários
- Criar `hupflow/src/lib/evergreen/evergreen.test.ts` implementando e validando:
  - `calculateEvergreenScore(caption, mediaType, historicalEngagement)`: pontuação 0-100 com penalidade para termos datados/efêmeros e bônus para listas/carrosséis.
  - `generateSpunVariations(title, originalCaption)`: geração determinística de 3 ângulos editoriais (`contrarian`, `checklist`, `story_hook`).
  - `isEligibleForRecycle(item, nowMs)` e `computeNextRecycleSlot(nowMs, cooldownDays)`.
  - `pickNextVariationForCycle(variations, recycleCount)`: seleção round-robin anti-repetição.

### Fase 3: Camada de Serviço e Rotas de API REST
- Implementar `hupflow/src/lib/evergreen/service.ts` com persistência Drizzle em `evergreen_items` e fallback resiliente em memória.
- Criar rotas REST:
  - `GET / POST / DELETE` em `hupflow/src/app/api/evergreen/route.ts`.
  - `POST` em `hupflow/src/app/api/evergreen/recycle/route.ts`.

### Fase 4: Componente `EvergreenVariationCard.tsx` e Painel `/settings/evergreen`
- Criar `hupflow/src/components/evergreen/EvergreenVariationCard.tsx` para inspecionar o score de perenidade, a próxima variação na fila round-robin e acionar a reciclagem em 1 clique.
- Criar `hupflow/src/app/(dashboard)/settings/evergreen/page.tsx` para gerenciar a biblioteca Evergreen, regras de cooldown e criar novos ativos perenes.

### Fase 5: Navegação, Testes e Sincronização SDD
- Adicionar atalho `'Reciclagem Evergreen'` com ícone `Repeat` em `hupflow/src/app/(dashboard)/layout.tsx`.
- Executar `npx tsx src/lib/evergreen/evergreen.test.ts` e `npx tsc --noEmit`.
- Gerar `legacy-impact.md`, `regression-watch.md`, adendo SDD 035 e atualizar `SESSION_HANDOFF.md`.
