# Roadmap: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador: `025-hupflow-publishing-dead-letter-queue`  
> Data de Criação: `2026-10-16`  
> Status: `plan`  

---

## 1. Visão Geral das Fases

```
Fase 1 (Preparação) ➔ Fase 2 (Testes) ➔ Fase 3 (Núcleo) ➔ Fase 4 (Interface & Retry) ➔ Fase 5 (Validação & Governança)
```

---

## 2. Detalhamento por Fase

### Fase 1: Preparação & Tipagem
- **T001**: Definir interfaces TypeScript para `DlqIncident`, `DlqErrorCategory`, `DlqStatus`, `DlqDiagnosisResult` e `DlqCounts` em `hupflow/src/lib/dlq/types.ts`.
- **T002**: Adicionar tabela `publishing_dlq` no Drizzle ORM em `hupflow/src/lib/db/schema.ts` com índices e FKs para posts e postChannels.

### Fase 2: Testes
- **T003**: Criar testes unitários em `hupflow/src/lib/dlq/dlq.test.ts` cobrindo o motor de diagnóstico com mensagens reais de erro de Meta, LinkedIn e X, além de verificação de limites de retry.

### Fase 3: Núcleo de Serviço & Rota REST
- **T004**: Implementar serviço em `hupflow/src/lib/dlq/service.ts`:
  - `diagnosePublishingError`: Heurística de diagnóstico e ação recomendada.
  - `recordDlqIncident`: Inserção/atualização de incidente na falha.
  - `listDlqIncidents`: Consulta com status e contadores agregados.
  - `retryDlqIncident`: Validação de estado e reenfileiramento atômico sem republicar canais já concluídos.
  - `dismissDlqIncident`: Arquivamento de incidente.
- **T005**: Criar rotas REST:
  - `GET /api/posts/dlq` (listagem e contadores).
  - `POST /api/posts/dlq/retry` (retry com suporte a edição de conteúdo).
  - `POST /api/posts/dlq/dismiss` (descarte do incidente).

### Fase 4: Interface & Experiência
- **T006**: Criar tela da Central de Falhas em `hupflow/src/app/(dashboard)/queue/failures/page.tsx` com tabs de status (`Pendentes`, `Resolvidos`, `Descartados`), badges de severidade, botão de retry em 1 clique e modal de edição rápida de conteúdo.
- **T007**: Integrar atalho "Falhas & DLQ" no menu lateral do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.

### Fase 5: Polimento & Governança
- **T008**: Bateria de testes unitários com `tsx` e compilação estática `tsc --noEmit` com zero erros.
- **T009**: Geração do adendo formal `_reversa_sdd/addenda/025-hupflow-publishing-dead-letter-queue.md`, relatórios de impacto e sincronização no Reversa.
