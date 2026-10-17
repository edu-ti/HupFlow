# Interfaces de API — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## 1. Endpoints de Afiliados (`/api/affiliates`)
- **`GET /api/affiliates`**:
  - Retorna a lista de parceiros afiliados da organização e o resumo do programa.
  - Query params: `?tier=gold&status=active`
  - Resposta: `{ success: true, partners: AffiliatePartner[], summary: AffiliateProgramSummary }`

- **`POST /api/affiliates`**:
  - Registra um novo afiliado ou parceiro estratégico.
  - Body: `{ name, email, referralCode?, tier?, payoutMethod?, payoutKey }`

- **`PATCH /api/affiliates`**:
  - Atualiza status, tier ou dados de pagamento.
  - Body: `{ id, tier?, status?, commissionPct?, payoutKey? }`

- **`DELETE /api/affiliates?id=:id`**:
  - Desativa ou remove o afiliado.

## 2. Endpoint de Solicitação e Pagamento de Saques (`/api/affiliates/payout`)
- **`POST /api/affiliates/payout`**:
  - Processa uma quitação total ou parcial de comissão para o afiliado.
  - Body: `{ partnerId, amountBrl, paymentReference }`
  - Resposta: `{ success: true, updatedPartner: AffiliatePartner, payoutId: string }`
