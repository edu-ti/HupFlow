# Requirements: Planos de Assinatura, Faturamento & Integração Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa o sistema de monetização, faturamento recorrente e gestão de assinaturas do HupFlow através da integração com o Stripe.
Ela estrutura os 3 planos comerciais do SaaS (Starter, Pro e Agency) com cotas bem definidas (contas conectadas, membros da organização, limites de postagens e espaço de armazenamento), disponibiliza a criação de sessões de Checkout, processamento seguro de webhooks para sincronização de ciclo de vida das assinaturas e Customer Portal para autogerenciamento de cartões e faturas. No frontend, entrega a página `/settings/billing` em Dark Mode e barras de consumo de limites da organização.

---

## 2. Contexto a partir do legado e specs SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/code-analysis.md` | "Faturamento (billing.controller.ts & stripe.controller.ts): Controla os planos Free, Pro e Enterprise, emitindo sessões de checkout e processando webhooks com verificação criptográfica." | 🟢 |
| `_reversa_sdd/erd-complete.md` | "Tabela Subscription com stripeSubscriptionId, status, tier e currentPeriodEnd." | 🟢 |
| `_reversa_sdd/c4-context.md` | "Sistema Externo: Gateway Stripe para processamento de pagamentos, assinaturas e webhooks." | 🟢 |
| `_reversa_sdd/permissions.md` | "Assinatura & Faturamento: Restrito exclusivamente a ADMIN e SUPERADMIN (Owner)." | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | "Monetização SaaS: Planos de assinatura com cobrança recorrente e gestão de capacidade por workspace." | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Eduardo (Owner da Agência)** | Fazer upgrade da organização do plano Starter para o Pro para adicionar mais clientes e redatores à equipe. | Acessa `/settings/billing`, analisa os limites do plano Pro (10 contas sociais, 5 membros), clica em "Fazer Upgrade", é redirecionado ao Stripe Checkout, conclui o pagamento e retorna ao dashboard com os novos limites liberados imediatamente. |
| **Financeiro / Admin** | Atualizar o cartão de crédito corporativo e baixar notas fiscais/invoices de faturamentos anteriores. | Clica em "Gerenciar Assinatura", acessa o Stripe Customer Portal seguro e atualiza a forma de pagamento sem precisar de suporte manual. |
| **Criador / Membro** | Visualizar a cota disponível de postagens e armazenamento da organização. | Acessa a tela de configurações em modo somente leitura para conferir o consumo do workspace. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Permissão Estrita de Faturamento):** Apenas usuários com papel `owner` ou `admin` na organização ativa podem iniciar sessões de checkout, trocar de plano ou acessar o Customer Portal do Stripe. Usuários com papel `member` ou `viewer` recebem HTTP 403 Forbidden para ações de mutação financeira. 🟢
2. **RN-02 (Cotas e Limites dos Planos):**
   - **Starter (R$ 49/mês):** Até 3 contas sociais, 1 membro, 30 posts agendados/mês, 5GB de mídia.
   - **Pro (R$ 149/mês):** Até 10 contas sociais, 5 membros, posts ilimitados, 25GB de mídia, copywriter IA e exportação em PDF vetorial.
   - **Agency (R$ 349/mês):** Contas sociais ilimitadas, 15 membros, posts ilimitados, 100GB de mídia, suporte prioritário. 🟢
3. **RN-03 (Sincronização Idempotente de Webhooks):** O processamento de eventos do Stripe (`customer.subscription.created`, `updated`, `deleted`, `invoice.payment_succeeded`) deve ser idempotente, atualizando a tabela `subscriptions` vinculada à organização correspondente via `stripeCustomerId` ou metadados de `organizationId`. 🟢
4. **RN-04 (Fallback Gracioso para Desenvolvimento Local):** Em ambiente de desenvolvimento local (`NODE_ENV === 'development'`) ou quando credenciais do Stripe não estiverem configuradas, o sistema deve operar com simulação segura (mock checkout / ativação instantânea em modo sandbox), permitindo testes de fluxo completos sem travar a aplicação. 🟢
5. **RN-05 (Isolamento Multi-Tenant em Faturamento):** Nenhuma organização pode acessar ou herdar faturas, assinaturas ou limites de outro workspace. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Modelo relacional `subscriptions` em `schema.ts`. | Must | Tabela Drizzle contendo `organizationId`, `stripeCustomerId`, `stripeSubscriptionId`, `plan`, `status`, `currentPeriodEnd` e timestamps. | 🟢 |
| **RF-02** | Módulo de definição de planos e validação de limites (`plans.ts`). | Must | Exporta especificações completas de planos, preços, limites e função de validação de cota `checkResourceQuota`. | 🟢 |
| **RF-03** | Rota de consulta de assinatura (`GET /api/billing/subscription`). | Must | Retorna plano atual, status, datas do período e uso atual de recursos vs limite contratado. | 🟢 |
| **RF-04** | Rota de criação de Checkout (`POST /api/billing/checkout`). | Must | Emite URL de sessão do Stripe Checkout para o plano solicitado ou ativação em modo sandbox. | 🟢 |
| **RF-05** | Rota de Customer Portal (`POST /api/billing/portal`). | Must | Emite URL para o portal de faturamento e faturas do Stripe. | 🟢 |
| **RF-06** | Webhook Handler (`POST /api/billing/webhook`). | Must | Recebe e processa eventos de ciclo de vida de assinatura e pagamento com validação de payload. | 🟢 |
| **RF-07** | Tela de Planos & Faturamento (`/settings/billing`). | Must | Interface em Dark Mode com status da assinatura, barras de consumo de limites e cards comparativos de planos com botão de checkout. | 🟢 |
| **RF-08** | Navegação no Dashboard (`layout.tsx`). | Must | Inclusão do link "Faturamento & Planos" na barra lateral. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Segurança** | Verificação criptográfica de webhooks e estrito bloqueio de BOLA em faturamento. | Padrões de assinatura HMAC do Stripe e RBAC rígido. | 🟢 |
| **Confiabilidade** | Tolerância a falhas com idempotência de atualização no Drizzle ORM. | `uniqueIndex` em `organizationId` e `stripeSubscriptionId`. | 🟢 |
| **Usabilidade** | Redirecionamento fluido com parâmetros `?success=true` e toasts comemorativos. | Design System Dark Premium do HupFlow. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Admin inicia contratação do Plano Pro
  Dado que o usuário "Eduardo" é Admin na organização
  Quando ele dispara POST /api/billing/checkout com plan "pro"
  Então o servidor retorna HTTP 200 com a URL de checkout
  E o redirecionamento leva à página segura de pagamento

Cenário: Membro comum tenta alterar plano
  Dado que o usuário "Beatriz" possui papel "member"
  Quando ela tenta disparar POST /api/billing/checkout
  Então o servidor rejeita a requisição com HTTP 403 Forbidden
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| **RF-01, RF-02, RF-03 (Modelo, Planos & API)** | Must | Infraestrutura básica de planos e limites. |
| **RF-04 & RF-06 (Checkout & Webhook)** | Must | Fluxo principal de monetização e ativação. |
| **RF-07 (Interface /settings/billing)** | Must | Tela para o gestor visualizar e contratar. |
| **RF-05 (Customer Portal)** | Should | Facilidade para auto-atendimento de cartões e faturas. |
| **RF-08 (Navegação)** | Must | Ponto de acesso direto no dashboard. |

---

## 9. Esclarecimentos

> Nenhuma dúvida pendente. Estrutura comercial e modelo de assinaturas alinhados ao SDD.

---

## 10. Lacunas

*(Nenhuma dúvida impeditiva registrada)*

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Versão inicial gerada por `/reversa-requirements` | reversa-requirements |
