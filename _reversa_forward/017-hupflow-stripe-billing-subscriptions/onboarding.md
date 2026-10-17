# Onboarding: Testando Planos & Faturamento no HupFlow

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  

---

## 1. Pré-requisitos

1. Usuário logado com papel `owner` ou `admin` na organização ativa.
2. Servidor de desenvolvimento rodando localmente.

---

## 2. Passo a Passo para Teste Manual

### Cenário 1: Visualização do Plano Atual e Cotas
1. No menu lateral do dashboard, clique no item **"Planos & Faturamento"** (rota `/settings/billing`).
2. Observe o card superior com o plano atual (ex: **Starter** ou **Pro**), status **Ativo** e data da próxima renovação.
3. Observe as 3 barras de capacidade:
   - **Contas Conectadas** (ex: 1 de 3 utilizadas).
   - **Membros da Equipe** (ex: 1 de 1 utilizado).
   - **Armazenamento de Mídia** (ex: 24.5 MB de 5 GB).

### Cenário 2: Fazer Upgrade de Plano
1. Na grade comparativa inferior, localize o card do **Plano Pro (R$ 149/mês)** ou **Plano Agency (R$ 349/mês)**.
2. Clique no botão **"Fazer Upgrade"**.
3. Em ambiente com chaves Stripe configuradas, você será redirecionado para o Stripe Checkout seguro.
4. Em modo de desenvolvimento/sandbox, o sistema simula o upgrade instantaneamente com feedback toast de sucesso.
5. Os novos limites (ex: 10 contas sociais, 5 membros) são refletidos imediatamente no dashboard.

### Cenário 3: Portal do Cliente Stripe
1. Clique no botão **"Gerenciar no Stripe"**.
2. O sistema emite a sessão segura do Stripe Customer Portal para gerenciamento de cartão e faturas fiscais.
