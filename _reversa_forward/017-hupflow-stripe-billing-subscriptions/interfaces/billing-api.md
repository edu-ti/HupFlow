# Interface: API REST de Faturamento & Assinaturas Stripe

> Identificador: `017-hupflow-stripe-billing-subscriptions`  
> Protocolo: HTTP REST / JSON  
> Base Path: `/api/billing`  

---

## 1. Consultar Assinatura & Cotas

### Requisição
- **Método / Rota:** `GET /api/billing/subscription`
- **Autenticação:** Requer sessão ativa (`requireOrgRole(req, 'viewer')`).

### Resposta de Sucesso (200 OK)
```json
{
  "subscription": {
    "plan": "pro",
    "status": "active",
    "priceMonthly": 149,
    "currency": "BRL",
    "currentPeriodEnd": "2026-11-16T16:00:00.000Z",
    "cancelAtPeriodEnd": false
  },
  "limits": {
    "maxSocialAccounts": 10,
    "maxTeamMembers": 5,
    "maxPostsPerMonth": -1,
    "maxStorageBytes": 26843545600,
    "hasAiCopywriter": true,
    "hasVectorPdfExport": true
  },
  "usage": {
    "socialAccounts": 2,
    "teamMembers": 2,
    "postsThisMonth": 14,
    "storageBytes": 32500000
  }
}
```

---

## 2. Criar Sessão de Checkout

### Requisição
- **Método / Rota:** `POST /api/billing/checkout`
- **Autenticação:** Requer papel `admin` ou `owner` (`requireOrgRole(req, 'admin')`).
- **Payload:**
```json
{
  "plan": "pro" // starter | pro | agency
}
```

### Resposta de Sucesso (200 OK)
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 3. Acessar Customer Portal

### Requisição
- **Método / Rota:** `POST /api/billing/portal`
- **Autenticação:** Requer papel `admin` ou `owner`.

### Resposta de Sucesso (200 OK)
```json
{
  "url": "https://billing.stripe.com/p/session/test_..."
}
```

---

## 4. Webhook do Stripe

### Requisição
- **Método / Rota:** `POST /api/billing/webhook`
- **Headers:** `stripe-signature: t=...,v1=...`
- **Eventos Processados:**
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
