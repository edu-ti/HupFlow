# Regression Watch: Planos de Assinatura, Faturamento & Integração Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/01-auth-multitenancy.md`)  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W020 | `requirements.md#RN-01` | Operações de mutação de faturamento (checkout e portal) devem exigir papel mínimo `admin` | Presença | Endpoints `/api/billing/checkout` ou `/api/billing/portal` sem `requireOrgRole(req, 'admin')` |
| W021 | `requirements.md#RN-02` | Webhooks do Stripe devem validar a assinatura HMAC-SHA256 (`stripe-signature`) em produção | Comportamento | Processamento de eventos de webhook sem validação criptográfica do cabeçalho `stripe-signature` |
| W022 | `requirements.md#RN-03` | O validador de cotas `checkResourceQuota` deve retornar `allowed: false` quando o consumo atingir o limite estipulado no plano | Comportamento | Operação de conexão de rede ou convite de membro permitida acima do teto contratado do plano |

---

## 2. Observações

- **RF-01**: Tabela `subscriptions` integrada ao Drizzle ORM com índice único por organização.
- **RF-02**: Mapeamento dos 3 planos (Starter, Pro, Agency) em BRL com cotas físicas de uso.
- **RF-03**: Cliente Stripe nativo via REST API (sem dependências externas pesadas no bundle).
- **RF-04**: Modo sandbox dev transparente para desenvolvimento local sem necessidade de credenciais de produção.
- **RF-05**: Interface visual rica em `/settings/billing` com barras de progresso de consumo e cards de checkout.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
