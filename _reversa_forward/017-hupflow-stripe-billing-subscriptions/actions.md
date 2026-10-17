# Actions: Planos de Assinatura, Faturamento & Integração Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  
> Roadmap: `_reversa_forward/017-hupflow-stripe-billing-subscriptions/roadmap.md`  

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
| T001 | Definir tipagens TypeScript para assinaturas, planos e limites em types.ts | - | `[//]` | `hupflow/src/lib/billing/types.ts` | 🟢 | `[X]` |
| T002 | Adicionar tabela subscriptions com integridade referencial em schema.ts | - | `[//]` | `hupflow/src/lib/db/schema.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para cálculo de cotas, validação de limites e planos | T001 | `[//]` | `hupflow/src/lib/billing/plans.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar definições de planos e função de validação de cota checkResourceQuota | T001 | - | `hupflow/src/lib/billing/plans.ts` | 🟢 | `[X]` |
| T005 | Implementar rota GET /api/billing/subscription com consolidação de consumo | T001, T002, T004 | - | `hupflow/src/app/api/billing/subscription/route.ts` | 🟢 | `[X]` |
| T006 | Implementar endpoints /api/billing/checkout, /api/billing/portal e /api/billing/webhook | T002, T004 | `[//]` | `hupflow/src/app/api/billing/checkout/route.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T007 | Criar tela /settings/billing com barras de cota, status do plano e cards de upgrade | T005, T006 | - | `hupflow/src/app/(dashboard)/settings/billing/page.tsx` | 🟢 | `[X]` |
| T008 | Adicionar atalho "Planos & Faturamento" na barra lateral de navegação em layout.tsx | T007 | - | `hupflow/src/app/(dashboard)/layout.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T009 | Executar suíte completa de testes com tsx e validação estática tsc --noEmit na base inteira | T003, T005, T006, T007, T008 | - | `hupflow/` | 🟢 | `[X]` |

---

## Notas de execução

*(Será preenchido durante a execução pelo `/reversa-coding`)*

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Criação das 9 ações atômicas (T001-T009) | reversa-to-do |
