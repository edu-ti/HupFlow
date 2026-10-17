# Roadmap: Planos de Assinatura, Faturamento & Integração Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  
> Requirements: `_reversa_forward/017-hupflow-stripe-billing-subscriptions/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica implementa a infraestrutura completa de monetização e assinaturas recorrentes com Stripe, dividida em 4 pilares:
1. **Modelo de Dados Relacional (`subscriptions`):** Mapeamento em `schema.ts` da assinatura ativa da organização, vinculada a `stripeCustomerId` e `stripeSubscriptionId`, guardando datas de vigência e status.
2. **Módulo de Planos e Cotas (`hupflow/src/lib/billing/plans.ts`):** Definição matemática e conceitual dos planos `starter`, `pro` e `agency`, com limites de contas, membros, posts mensais e armazenamento, além da função de verificação `checkResourceQuota`.
3. **Rotas de API REST:**
   - `/api/billing/subscription`: `GET` para consulta do plano ativo e percentual de uso de recursos.
   - `/api/billing/checkout`: `POST` para emissão de sessão do Stripe Checkout com suporte a sandbox dev.
   - `/api/billing/portal`: `POST` para emissão de sessão do Stripe Customer Portal.
   - `/api/billing/webhook`: `POST` para recepção e sincronização assíncrona de eventos de fatura e assinatura.
4. **Interface de Usuário (`/settings/billing`):**
   - Resumo da assinatura com badge de status, preço e data da próxima renovação.
   - Painel de Consumo de Capacidade (barras de progresso percentual de contas sociais, membros da equipe e gigabytes de mídia).
   - Grade Comparativa de Planos com lista de benefícios, badge "Mais Popular" no Pro e botão de contratação/upgrade.
   - Link de navegação adicionado na barra lateral do dashboard.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL / Clean-Room** | Integração direta com a API REST oficial do Stripe e Drizzle ORM, sem código legado ou licenças virais. | Respeita 🟢 |
| **Isolamento Multi-Tenant Estrito** | Cada assinatura é estritamente vinculada a uma única `organizationId` com chave única no banco. | Respeita 🟢 |
| **Resiliência e Idempotência** | Webhooks com idempotência garantida por `stripeSubscriptionId` e transações Drizzle. | Respeita 🟢 |
| **Design Visual Premium** | Cards com bordas destacadas, gradientes de destaque e estados claros de plano atual vs upgrade. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Stripe Checkout hospedado em vez de Elements customizados na página | Elimina completamente o escopo PCI-DSS do frontend do HupFlow e reduz complexidade de suporte a múltiplos métodos de pagamento (Pix, Cartão, Boleto). | Construir formulário de cartão embedded (maior carga de conformidade e manutenção). | 🟢 |
| **D-02** | Tabela `subscriptions` 1-para-1 com `organizations` | Cada workspace possui exatamente uma assinatura ativa, simplificando consultas de permissão e limites em todo o sistema. | Tabela de histórico de faturas separada (o Customer Portal do Stripe já provê isso nativamente). | 🟢 |
| **D-03** | Modo Sandbox / Mock Gracioso quando sem chave de produção do Stripe | Permite testes locais automatizados e navegação completa na interface sem exigir chave secreta `sk_live_...` configurada. | Bloquear chamadas com erro de configuração de chave (quebraria deploys locais e testes). | 🟢 |
| **D-04** | Helper `checkResourceQuota` reutilizável em outros módulos | Permite que rotas como `/api/media/presign` ou `/api/org/invitations` façam verificações de limite de cota antes de permitir novos recursos. | Regras duplicadas espalhadas em cada rota. | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O plano padrão atribuído na criação da organização é o `starter` | `requirements.md#RN-02` | Baixo; premissa canônica em SaaS freemium/starter. |
| O Stripe Customer Portal é usado para cancelamento e download de faturas | `requirements.md#RF-05` | Baixo; prática padrão da indústria. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `subscriptions` | `_reversa_sdd/erd-complete.md` | Componente Novo | Tabela Drizzle para armazenamento do estado de assinaturas. |
| `plans.ts` | `_reversa_sdd/code-analysis.md` | Componente Novo | Especificação de planos, preços, limites e validação de cotas. |
| `plans.test.ts` | `_reversa_sdd/code-analysis.md` | Componente Novo | Testes unitários para regras de limites e cotas. |
| `/api/billing/subscription/route.ts` | `_reversa_sdd/c4-containers.md` | Componente Novo | Rota GET para consulta de plano e consumo atual. |
| `/api/billing/checkout/route.ts` | `_reversa_sdd/c4-containers.md` | Componente Novo | Rota POST para emissão de sessão de checkout. |
| `/api/billing/portal/route.ts` | `_reversa_sdd/c4-containers.md` | Componente Novo | Rota POST para acesso ao Stripe Customer Portal. |
| `/api/billing/webhook/route.ts` | `_reversa_sdd/c4-context.md` | Componente Novo | Handler de eventos assíncronos do Stripe. |
| `/settings/billing/page.tsx` | `_reversa_sdd/prd.md` | Componente Novo | Interface completa de gerenciamento de planos e faturamento. |
| `layout.tsx` | `_reversa_sdd/prd.md` | Modificado | Adição do link "Planos & Faturamento" na barra lateral. |

---

## 6. Delta no modelo de dados

Adição da tabela `subscriptions` em `schema.ts`. Detalhe completo em `data-delta.md`.

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| API de Faturamento e Assinaturas | HTTP REST | `_reversa_forward/017-hupflow-stripe-billing-subscriptions/interfaces/billing-api.md` |

---

## 8. Plano de migração / rollout

1. Criar a tabela `subscriptions` no schema.
2. Ao consultar qualquer organização sem registro de assinatura, inicializar automaticamente com o plano `starter` ativo.

---

## 9. Riscos e contingências

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Webhook perdido ou fora de ordem | Médio | Baixa | O endpoint `/api/billing/subscription` faz checagem de reconciliação sob demanda. |
| Tentativa de downgrade com recursos excedentes | Médio | Média | O sistema exibe aviso amigável indicando que recursos existentes serão mantidos mas novos bloqueados até regularização. |

---

## 10. Critério de pronto

- [ ] Tabela `subscriptions` criada e tipada no schema Drizzle.
- [ ] Funções de cálculo de cota e planos testadas via `plans.test.ts` com 100% de sucesso.
- [ ] Endpoints de consulta, checkout e portal operacionais e protegidos por RBAC.
- [ ] Tela `/settings/billing` funcional com consumo de limites e cards comparativos.
- [ ] Link "Planos & Faturamento" adicionado na barra lateral de navegação.
- [ ] Checagem estática `tsc --noEmit` finalizada com 0 erros.
