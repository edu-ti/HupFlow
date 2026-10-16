# Requirements: Visão de Calendário & Gestão Visual de Agendamentos

> Identificador: `012-hupflow-scheduler-calendar-view`  
> Data: `2026-10-15`  
> Pasta de especificações SDD: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa o componente de Calendário Visual de Agendamentos no Dashboard do HupFlow, permitindo que criadores e gestores de mídias visualizem a grade semanal e mensal de conteúdos programados. Ela exibe os posts distribuídos por blocos de horário, badges coloridos dos canais de publicação (LinkedIn, X, Instagram, Threads), status dos jobs na fila BullMQ (`scheduled`, `publishing`, `published`, `failed`), filtros por canal e modal de edição rápida para reprogramação de data/hora.

---

## 2. Contexto a partir do legado e especificações SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/sdd/05-scheduler-engine.md` | Máquina de estados do post e orquestração de delayed jobs no BullMQ. | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | Calendário editorial visual para acompanhamento da cadência de publicações. | 🟢 |
| `hupflow/src/lib/queue/scheduler-queue.ts` | Função `schedulePostJob` com suporte a cancelamento e atualização de delayed jobs. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Mariana (Social Media Manager)** | Enxergar a distribuição de conteúdo da semana para garantir que não haja dias sem publicação. | Acessa o Dashboard, seleciona "Visão Semanal", visualiza 5 posts programados de segunda a sexta e arrasta ou edita um post de quarta para quinta-feira. |
| **Lucas (Solopreneur)** | Ter clareza sobre o próximo post que será disparado sem precisar abrir menus complexos. | Bate o olho no card do dia de hoje e vê o badge verde "Agendado para hoje às 14:30 no LinkedIn e X". |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Grade de Dias da Semana):** A visão semanal deve exibir os 7 dias (Segunda a Domingo) com o dia atual destacado visualmente em azul/índigo. 🟢
2. **RN-02 (Cores de Status Padronizadas):**
   - `scheduled`: Roxo/Índigo com ícone de relógio.
   - `publishing`: Amarelo/Âmbar com animação de pulso.
   - `published`: Verde/Esmeralda com checkmark.
   - `failed`: Vermelho/Rosa com alerta e mensagem de erro ao passar o cursor. 🟢
3. **RN-03 (Filtro por Canal Social):** O usuário deve poder filtrar a visão do calendário por rede específica (ex: ver apenas posts de Instagram ou apenas posts de LinkedIn). 🟢
4. **RN-04 (Reprogramação de Horário):** Ao alterar a data/hora de um post agendado, o sistema deve recalcular o delay do job no BullMQ (`scheduledAt - now()`), mantendo a idempotência pelo `jobId`. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Visualizador de Calendário Semanal com navegação entre semanas (Semana Anterior / Próxima Semana / Hoje). | Must | Os dias e datas da semana selecionada são calculados dinamicamente com base na data local. | 🟢 |
| **RF-02** | Cards de postagem dentro dos dias da grade com horário, título/prévia e ícones das redes. | Must | Cada post aparece no bloco do dia correspondente com badges visuais. | 🟢 |
| **RF-03** | Modal de reprogramação de horário e cancelamento de post agendado. | Must | O usuário clica no post, altera a data/hora e confirma, atualizando a listagem e o job de fila. | 🟢 |
| **RF-04** | Alternador entre "Visão de Fila (Lista)" e "Visão de Calendário (Grade Semanal)". | Must | Um toggle no topo do painel permite alternar a perspectiva visual sem recarregar a página. | 🟢 |
| **RF-05** | Filtros rápidos por status (`Todos`, `Agendados`, `Publicados`) e por rede social. | Should | A grade oculta ou exibe os posts correspondentes ao filtro ativo instantaneamente. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Estética & Design** | Interface moderna com tema escuro, bordas suaves, efeitos de glow e contraste nítido. | Diretrizes de excelência visual ("WOW factor"). | 🟢 |
| **Desempenho** | Renderização da grade semanal e filtro instantâneo sem repaints desnecessários. | Performance client-side a 60fps. | 🟢 |
| **Responsividade** | Layout adaptável: em telas menores (mobile), a grade semanal se transforma em lista colapsável por dia. | Usabilidade contínua em qualquer dispositivo. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Visualização de posts programados na semana
  Dado que existem 3 posts agendados para a semana corrente
  Quando o usuário acessa o Dashboard no modo "Calendário"
  Então os posts são renderizados nos dias correspondentes (ex: Quarta e Sexta)
  E cada card exibe o horário, resumo do texto e ícones das redes selecionadas

Cenário: Reprogramação de horário de post agendado
  Dado que um post está agendado para Quarta-feira às 10:00
  Quando o usuário clica no post e altera a data para Quinta-feira às 15:30
  Então o card do post migra imediatamente para a coluna de Quinta-feira
  E o status permanece como 'scheduled' com o novo horário registrado

Cenário: Filtragem por rede social
  Dado que há posts agendados para LinkedIn, X e Instagram
  Quando o usuário clica no filtro "LinkedIn"
  Então a grade exibe apenas as publicações direcionadas ao LinkedIn
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| RF-01 (Grade Semanal com navegação de semanas) | **Must** | Estrutura central da visão de calendário. |
| RF-02 (Cards de postagem por dia e horário) | **Must** | Identificação clara dos disparos programados. |
| RF-03 (Modal de edição e reprogramação) | **Must** | Controle operacional sobre a fila. |
| RF-04 (Toggle Lista vs Calendário) | **Must** | Flexibilidade de uso para o criador de conteúdo. |
| RF-05 (Filtros por canal e status) | **Should** | Facilita a gestão de múltiplas campanhas. |

---

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

---

## 10. Lacunas

> Nenhuma lacuna crítica pendente. Fluxos de estados de post e fila documentados em `_reversa_sdd/sdd/05-scheduler-engine.md`.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-requirements` para a Feature 012 | reversa-requirements |
