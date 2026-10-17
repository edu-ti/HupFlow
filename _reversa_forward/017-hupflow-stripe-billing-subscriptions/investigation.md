# Investigation: Integração Stripe, Webhooks e Gestão de Limites em SaaS B2B

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  

---

## 1. Contexto e Benchmarking

SaaS de produtividade e mídia social operam predominantemente com cobrança recorrente mensal ou anual vinculada a cotas físicas de consumo:
1. **Número de Contas Conectadas:** Limite rígido por rede para mitigar abusos de API e custos de infraestrutura de webhook.
2. **Membros da Equipe:** Modelo de assentos para incentivar planos de maior ticket médio (Agency).
3. **Volume de Armazenamento:** Custo direto de storage em nuvem (Cloudflare R2 / AWS S3).
4. **Volume de Postagens:** Fila de agendamento e chamadas aos conectores oficiais da Meta / LinkedIn.

---

## 2. Comparativo de Integração Stripe

### Abordagem A: Stripe Elements no Próprio App
- **Descrição:** Formulário de cartão inserido via `@stripe/react-stripe-js` na página do HupFlow.
- **Desvantagens:** Requer lidar com tokens efêmeros, verificação 3D Secure manual, conformidade SAQ-A-EP e suporte manual a métodos locais (ex: Pix).

### Abordagem B: Stripe Checkout + Customer Portal (Abordagem Escolhida)
- **Descrição:** Redirecionamento para a página oficial e otimizada de Checkout da Stripe, com retorno seguro via `success_url` e `cancel_url`.
- **Vantagens:** 
  - Conformidade PCI-DSS SAQ-A simples (zero dados de cartão trafegam nos servidores do HupFlow).
  - Suporte automático a Pix, Google Pay, Apple Pay e Cartão de Crédito sem esforço de código.
  - Customer Portal oficial pronto para atualização de cartões e download de recibos.
- **Decisão:** **Aprovada.**

---

## 3. Estratégia de Webhooks e Modo de Desenvolvimento

- Em produção, o webhook valida a assinatura HMAC com `stripe.webhooks.constructEvent(payload, signature, secret)`.
- Em ambiente de desenvolvimento local ou quando as variáveis `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` não estiverem presentes:
  - O endpoint de checkout ativa diretamente o plano solicitado via simulação segura (modo sandbox dev), permitindo testar a interface e a alteração de cotas instantaneamente.

---

## 4. Referências

- Stripe API Reference - Subscriptions & Checkout Sessions
- Stripe Customer Portal Integration Guide
- Postiz Legacy Controller: `_reversa_sdd/code-analysis.md#faturamento`
