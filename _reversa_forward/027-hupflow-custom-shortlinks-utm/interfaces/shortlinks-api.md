# Interface REST: Encurtador de Links & UTMs

> Identificador: `027-hupflow-custom-shortlinks-utm`  
> Data: `2026-10-16`  

---

## 1. Endpoints

### `GET /api/shortlinks`
Lista os links encurtados da organização com métricas de cliques.
- **Autenticação**: Requer papel `viewer` ou superior (`requireOrgRole(req, 'viewer')`).
- **Resposta HTTP 200**:
```json
{
  "shortLinks": [
    {
      "id": "lnk_1729115000_abc123",
      "slug": "blackfriday",
      "shortUrl": "https://app.hupflow.com/l/blackfriday",
      "destinationUrl": "https://loja.com.br/promocao",
      "title": "Campanha Black Friday 2026",
      "utmCampaign": "blackfriday2026",
      "utmMedium": "social",
      "totalClicks": 342,
      "lastClickedAt": "2026-10-16T21:00:00.000Z",
      "createdAt": "2026-10-16T18:00:00.000Z"
    }
  ]
}
```

### `POST /api/shortlinks`
Cria um novo link encurtado com tags UTM opcionais e slug automático ou customizado.
- **Autenticação**: Requer papel `member` ou superior (`requireOrgRole(req, 'member')`).
- **Corpo da Requisição**:
```json
{
  "destinationUrl": "https://loja.com.br/promocao",
  "title": "Campanha Black Friday 2026",
  "customSlug": "blackfriday",
  "utmCampaign": "blackfriday2026",
  "utmMedium": "social",
  "utmContent": "carrossel_v1"
}
```

### `DELETE /api/shortlinks?id=lnk_123`
Exclui um link encurtado.

### `GET /l/[slug]` (Redirecionador Público)
- Endpoint público de baixa latência.
- Incrementa `totalClicks`, grava telemetria e responde com **HTTP 302** direcionando para a URL final enriquecida com UTMs.
