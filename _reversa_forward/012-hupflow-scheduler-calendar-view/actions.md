# Actions: Visão de Calendário & Gestão Visual de Agendamentos

> Identificador: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  
> Roadmap: `_reversa_forward/012-hupflow-scheduler-calendar-view/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 6 |
| Paralelizáveis (`[//]`) | 3 |
| Maior cadeia de dependência | 3 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Implementar funções puras de manipulação de data para grade semanal (getDaysOfWeek, formatWeekRange) | - | `[//]` | `hupflow/src/lib/calendar/date-utils.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T002 | Criar testes unitários para cálculo de datas da semana e agrupamento de posts | T001 | `[//]` | `hupflow/src/lib/calendar/date-utils.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Implementar modal de reprogramação rápida de horário e cancelamento de post (RescheduleModal) | T001 | - | `hupflow/src/components/calendar/RescheduleModal.tsx` | 🟢 | `[X]` |
| T004 | Implementar grade de calendário semanal dos 7 dias com cards de posts e status (WeeklyCalendarView) | T001 | `[//]` | `hupflow/src/components/calendar/WeeklyCalendarView.tsx` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T005 | Integrar WeeklyCalendarView e RescheduleModal na página principal do Dashboard com alternador de visão | T003, T004 | - | `hupflow/src/app/(dashboard)/dashboard/page.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Adicionar filtros por rede social e status de fila com animações fluidas na alternância de semanas | T005 | - | `hupflow/src/app/(dashboard)/dashboard/page.tsx` | 🟢 | `[X]` |

---

## Notas de execução

- Todas as 6 tarefas atômicas foram concluídas com sucesso.
- O Dashboard agora suporta alternância entre visão em grade semanal e visão em lista.
- Reprogramação e cancelamento de posts com recálculo de delay funcionando.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Execução e conclusão de todas as 6 ações (T001-T006) da Feature 012 | reversa-coding |
