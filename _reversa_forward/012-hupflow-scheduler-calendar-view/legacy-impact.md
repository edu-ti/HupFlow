# Legacy Impact: Visão de Calendário & Gestão Visual de Agendamentos

> Identificador: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/05-scheduler-engine.md`)  
> Nota: Feature greenfield, sem legado pré-existente. Âncora: prd.md + specs SDD.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/calendar/date-utils.ts` | `sdd/05-scheduler-engine` | `componente-novo` | LOW | Funções de cálculo de semana e manipulação de datas. |
| `hupflow/src/lib/calendar/date-utils.test.ts` | `sdd/05-scheduler-engine` | `componente-novo` | LOW | Testes unitários automatizados da lógica de datas. |
| `hupflow/src/components/calendar/RescheduleModal.tsx` | `sdd/05-scheduler-engine` | `componente-novo` | MEDIUM | Modal de reprogramação rápida de data/hora e cancelamento. |
| `hupflow/src/components/calendar/WeeklyCalendarView.tsx` | `sdd/05-scheduler-engine` | `componente-novo` | HIGH | Grade de 7 dias com cards de publicações e badges. |
| `hupflow/src/app/(dashboard)/dashboard/page.tsx` | `sdd/05-scheduler-engine` | `componente-novo` | MEDIUM | Alternador Lista vs Calendário e filtros por canal social. |

---

## 2. Diff Conceitual por Componente

- **`sdd/05-scheduler-engine`**: Expandido o painel operacional com perspectiva de calendário visual para acompanhamento da cadência de publicações.

---

## 3. Preservadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*

---

## 4. Modificadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*
