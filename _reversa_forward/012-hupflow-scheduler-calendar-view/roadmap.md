# Roadmap: Visão de Calendário & Gestão Visual de Agendamentos

> Identificador: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  
> Requirements: `_reversa_forward/012-hupflow-scheduler-calendar-view/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica constrói um componente de calendário semanal desacoplado e de alta performance (`WeeklyCalendarView`) integrado ao Dashboard do HupFlow.
O componente calcula dinamicamente os 7 dias da semana com base na data de referência (Segunda a Domingo), mapeia os posts agendados e publicados em seus respectivos dias pelo timestamp `scheduledAt`, renderiza cards informativos com badges das redes conectadas (LinkedIn, X, Instagram, Threads), status de fila com código de cores e provê um modal de reprogramação rápida (`RescheduleModal`) que permite alterar data e hora de disparo com recálculo instantâneo na fila do BullMQ ou cancelar uma publicação com segurança.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL** | Desenvolvido com componentes React puros e Tailwind CSS, sem bibliotecas externas pesadas ou proprietárias. | Respeita 🟢 |
| **Experiência WOW Factor** | Interface escura, cards com bordas suaves, efeitos de hover, tags nítidas e navegação intuitiva de datas. | Respeita 🟢 |
| **Idempotência no BullMQ** | Atualização de horário preserva o `jobId = post_<id>`, cancelando o atraso antigo e definindo o novo delay. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Calendário nativo em React sem FullCalendar | FullCalendar possui pacote pesado (>300KB) e licenças comerciais para recursos avançados. O componente nativo do HupFlow é leve (<10KB) e 100% sob medida. | FullCalendar / React-Big-Calendar. | 🟢 |
| **D-02** | Alternador de perspectiva Lista ➔ Calendário | Permite ao usuário escolher entre a visualização clássica de tabela operacional e a visão cronológica em grade de dias. | Forçar apenas um formato. | 🟢 |
| **D-03** | Modal de reprogramação in-place | Evita redirecionar o usuário para o compositor inteiro apenas para ajustar o horário de publicação. | Abrir formulário completo de edição. | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| Usuários planejam conteúdos prioritariamente na escala semanal | RF-01 / RF-02 | Baixo; visão semanal oferece o melhor equilíbrio entre legibilidade de texto e densidade de informação. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `WeeklyCalendarView` | `_reversa_sdd/sdd/05-scheduler-engine.md` | Componente Novo | Grade semanal dos 7 dias com cards de postagem. |
| `RescheduleModal` | `_reversa_sdd/sdd/05-scheduler-engine.md` | Componente Novo | Modal de ajuste rápido de horário e data. |
| `DashboardPage` | `_reversa_sdd/prd.md` | Componente Alterado | Incorporação do alternador Lista vs Calendário e filtros por canal. |

---

## 6. Delta no modelo de dados

Nenhuma mudança estrutural no schema PostgreSQL. A atualização de data/hora atualiza a coluna `scheduled_at` na tabela `posts`.
Detalhe completo em: `_reversa_forward/012-hupflow-scheduler-calendar-view/data-delta.md`.

---

## 7. Delta de contratos externos

Nenhum contrato externo alterado.

---

## 8. Plano de migração

Não aplicável (feature greenfield nova no HupFlow).

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Diferenças de fuso horário local vs UTC | Médio | Baixo | Uso de objetos `Date` nativos com conversão explícita para fuso local do navegador do usuário. |

---

## 10. Critério de pronto

- [ ] Grade semanal com navegação anterior, próxima e hoje.
- [ ] Cards de posts distribuídos corretamente nos dias correspondentes.
- [ ] Badges visuais de status (`scheduled`, `published`, `failed`) e ícones das redes.
- [ ] Modal de reprogramação permitindo trocar data/hora e salvar.
- [ ] Alternador entre visão de Lista e visão de Calendário.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
