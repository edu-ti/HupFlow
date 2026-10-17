# API Interfaces: 041-hupflow-social-commerce-product-catalog

## 1. `GET /api/commerce`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `category` (opcional): `all` | `saas_plan` | `digital_course` | `physical_product` | `consulting_service`
- **Response `200 OK`**:
```json
{
  "products": [
    {
      "id": "prd_seed_agency",
      "organizationId": "org_default",
      "sku": "HUP-AGENCY-PRO",
      "name": "Plano HupFlow Agency White-Label (Anual)",
      "category": "saas_plan",
      "channel": "linkedin",
      "priceBrl": 997,
      "checkoutUrl": "https://hupflow.app/checkout/agency-pro",
      "taggedPostsCount": 8,
      "taggedImpressions": 64000,
      "productClicks": 1420,
      "ordersCount": 46,
      "metrics": {
        "totalRevenueBrl": 45862,
        "checkoutConversionPct": 3.24,
        "epcBrl": 32.3,
        "socialRpmBrl": 716.59,
        "velocityTier": "bestseller"
      },
      "shoppableCopy": "🔥 [Tag de Produto: Plano HupFlow Agency White-Label (Anual) — R$ 997] ..."
    }
  ],
  "summary": {
    "totalProducts": 3,
    "totalRevenueBrl": 84125,
    "totalOrders": 139,
    "avgCheckoutConversionPct": 3.51,
    "avgSocialRpmBrl": 532.4
  }
}
```

## 2. `POST /api/commerce`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "sku": "PACK-CARROSSEL-IA",
  "name": "Pack 50 Templates de Carrossel B2B + Prompts IA",
  "category": "digital_course",
  "channel": "instagram",
  "priceBrl": 197,
  "checkoutUrl": "https://hupflow.app/checkout/pack-carrossel"
}
```
- **Response `201 Created`**: Objeto `SocialCommerceProductItem` com métricas de atribuição e copy Shoppable gerada.

## 3. `POST /api/commerce/action`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "productId": "prd_seed_agency",
  "action": "simulate_order"
}
```
  - Suporta `action: "simulate_order"` (incrementa impressões, cliques na sacola e +3 pedidos pagos) ou `action: "delete"`.
