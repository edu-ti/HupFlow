# Legacy Impact: Agendamento & Campanhas em Lote com IA (AI Bulk Scheduler)

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data: `2026-10-16`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/05-scheduler-engine.md`, `_reversa_sdd/sdd/03-ai-orchestration.md`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/bulk-scheduler/types.ts` | `sdd/05-scheduler-engine` | `componente-novo` | LOW | Interfaces e tipos de campanhas em lote, slots e respostas. |
| `hupflow/src/lib/bulk-scheduler/slots.ts` | `sdd/05-scheduler-engine` | `componente-novo` | MEDIUM | Motor matemático de projeção de slots futuros por dias da semana e horários. |
| `hupflow/src/lib/bulk-scheduler/bulk-scheduler.test.ts` | `sdd/05-scheduler-engine` | `componente-novo` | LOW | Testes unitários para slots temporais e integração com cotas de planos. |
| `hupflow/src/lib/bulk-scheduler/generator.ts` | `sdd/03-ai-orchestration` | `componente-novo` | HIGH | Orquestrador de IA gerando ângulos editoriais sem repetição de conteúdo. |
| `hupflow/src/app/api/ai/bulk-campaign/route.ts` | `sdd/05-scheduler-engine` | `componente-novo` | HIGH | Endpoint REST POST suportando preview e commit de campanhas com validação de cota. |
| `hupflow/src/components/campaign/BulkCampaignModal.tsx` | `sdd/05-scheduler-engine` | `componente-novo` | HIGH | Modal interativo de configuração, preview de timeline e agendamento em lote. |
| `hupflow/src/app/(dashboard)/dashboard/page.tsx` | `sdd/05-scheduler-engine` | `modificado` | LOW | Inclusão do botão de ação "Campanha com IA" no topo do Dashboard. |

---

## 2. Diff Conceitual por Componente

- **`sdd/05-scheduler-engine`**:
  - Capacidade de agendamento em lote (campanhas completas) ativada.
  - Projeção de slots temporais estritamente cronológica, sem gerar postagens no passado.
  - Integração nativa com o motor de cotas da Feature 017 (`checkResourceQuota`).

---

## 3. Preservadas

*(Feature greenfield em clean-room, nenhum código legado modificado)*

---

## 4. Modificadas

- Dashboard atualizado com botão de acionamento do modal de campanhas em lote.
