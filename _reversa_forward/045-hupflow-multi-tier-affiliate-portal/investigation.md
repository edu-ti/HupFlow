# Investigação — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## 1. Arquitetura Atual de Assinaturas e Atribuição
- O HupFlow implementa faturamento com Stripe e planos Starter (R$ 97), Pro (R$ 297) e Agency (R$ 797) em `hupflow/src/lib/billing/`.
- No modelo de afiliados SaaS moderno, a comissão não é uma recompensa única (one-time bounty), mas sim uma participação recorrente na mensalidade do cliente (`revenue share`) durante o primeiro ano ou por tempo indeterminado enquanto o cliente estiver ativo.

## 2. Decisão de Design e Estrutura Financeira
- **Tabela `affiliate_partners`**:
  - `referralCode`: Código alfanumérico único para URL de indicação.
  - `tier`: `bronze` (20%), `silver` (25%), `gold` (30%), `diamond` (40%).
  - `commissionPct`: Percentual efetivo aplicado.
  - `totalReferredCustomers`: Contagem de clientes convertidos.
  - `activeCustomersCount`: Clientes pagantes atualmente ativos.
  - `totalEarningsBrl`: Valor total de comissões acumuladas na história.
  - `availableBalanceBrl`: Saldo disponível para resgate.
  - `payoutMethod`: Dados bancários / Chave Pix para liquidação.
- **Tabela `affiliate_referrals`**:
  - Registro de cada evento de assinatura associado ao afiliado, registrando valor do plano, comissão calculada e status.
