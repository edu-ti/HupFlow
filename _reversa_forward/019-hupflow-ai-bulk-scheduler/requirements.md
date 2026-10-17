# Requisitos: Agendamento & Campanhas em Lote com IA (AI Bulk Scheduler)

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data de início: `2026-10-16`  
> Cenário: `greenfield` (Clean-Room HupFlow)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/05-scheduler-engine.md`, `_reversa_sdd/sdd/03-ai-orchestration.md`)  

---

## 1. Visão Geral e Propósito

Esta feature entrega o subsistema de **Campanhas e Agendamento em Lote com IA (AI Bulk Scheduler)** do HupFlow.
Em vez de redigir e agendar publicações uma a uma, criadores e agências podem definir um tema central ou objetivo de campanha (ex: "Mês da Arquitetura Limpa e SaaS B2B"), escolher a cadência semanal (ex: terças e quintas às 10:00) e o volume desejado (ex: 8 postagens no mês).
O motor de IA:
1. Calcula automaticamente o cronograma de datas futuras no calendário semanal.
2. Gera ângulos editoriais complementares (Problema/Dor, Passo a Passo, Mito vs Verdade, Estudo de Caso, Checklist e CTA).
3. Cria o conteúdo completo, hashtags, formato (Carrossel PDF ou Post Simples) e vincula aos canais selecionados.
4. Valida a cota mensal do plano contratado (`checkResourceQuota(plan, 'postsThisMonth', totalPosts)`).
5. Permite aprovação em lote ou edição individual antes de persistir na fila do agendador (`posts` e `post_channels`).

---

## 2. Requisitos Funcionais (RF)

- **RF-01 (Cálculo do Cronograma Temporal)**: Função pura `calculateScheduleSlots(startDate, daysOfWeek, timeSlots, count)` para distribuir datas futuras sequenciais a partir do dia e horários configurados.
- **RF-02 (Gerador de Ângulos Editoriais)**: Gerador com IA que recebe um tema e produz `count` conceitos distintos de publicação para evitar repetição ou canibalização de conteúdo.
- **RF-03 (Geração de Carrosséis e Copywriting em Lote)**: Para cada item da campanha, gerar título magnético, texto de copy formatado para LinkedIn/Instagram/X e estrutura de slides para carrossel.
- **RF-04 (Validação Rígida de Cotas)**: Antes de processar a criação em lote, validar se a soma de posts agendados no mês corrente não ultrapassará `maxPostsPerMonth` do plano ativo do workspace.
- **RF-05 (Endpoint REST /api/ai/bulk-campaign)**:
  - `POST`: recebe os parâmetros da campanha, gera o preview em lote e permite simulação prévia ou criação direta no banco.
- **RF-06 (Interface Visual "Campanha com IA")**: Modal ou painel integrado no Dashboard/Composer para configuração rápida, visualização dos slots gerados em timeline e botão de agendamento em 1 clique ("Agendar Campanha Inteira").

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF-01 (Resiliência & Dev Fallback)**: Em ausência de `OPENAI_API_KEY`, o gerador deve operar com fallback determinístico rico em dados simulados de marketing para permitir testes locais e navegação fluida.
- **RNF-02 (Atomicidade de Persistência)**: Ao aprovar a campanha, todos os posts devem ser inseridos em lote com integridade referencial vinculados aos canais sociais da organização.
- **RNF-03 (Conformidade Clean-Room)**: Implementação 100% proprietária em TypeScript estrito, sem bibliotecas AGPL.

---

## 4. Regras de Negócio (RN)

- **RN-01**: Apenas usuários com papel `member`, `admin` ou `owner` podem agendar campanhas em lote.
- **RN-02**: Nenhuma data de agendamento pode ser gerada no passado (`scheduledAt >= now`).
- **RN-03**: Se o volume de posts solicitado exceder o saldo restante da cota do plano, a API deve rejeitar a criação com código HTTP 403 e indicar o saldo disponível.

---

## 5. Rastreabilidade com SDD & Legado

- **SDD**: `_reversa_sdd/sdd/05-scheduler-engine.md` (Agendador & Distribuição Temporal).
- **SDD**: `_reversa_sdd/sdd/03-ai-orchestration.md` (Orquestração de Prompts e Schemas Zod).
- **Governança**: `_reversa_sdd/addenda/017-hupflow-stripe-billing-subscriptions.md` (`checkResourceQuota`).
