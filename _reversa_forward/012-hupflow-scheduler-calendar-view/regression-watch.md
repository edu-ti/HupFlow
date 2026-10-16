# Regression Watch: Visão de Calendário & Gestão Visual de Agendamentos

> Identificador: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W007 | `requirements.md#RF-01` | Grade semanal deve conter exatamente 7 dias com datas sequenciais | Presença | Quebra no array de dias retornado por `getDaysOfWeek` |
| W008 | `requirements.md#RN-04` | Reprogramação de horário deve atualizar `scheduled_at` no post | Presença | Falha na persistência da nova data/hora |

---

## 2. Observações

- **RF-01**: Grade semanal e navegação de semanas validada nos testes `date-utils.test.ts`.
- **RF-02**: Cards posicionados nos dias corretos com ícones das redes.
- **RF-03**: Modal `RescheduleModal` permite ajustar data/hora e cancelar publicação com confirmação.
- **RF-04**: Alternador de visualização Lista vs Calendário implementado.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
