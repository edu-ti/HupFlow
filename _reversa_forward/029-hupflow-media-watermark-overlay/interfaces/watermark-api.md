# Especificação de Interface: API de Marca d'Água

> Identificador: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  

---

## 1. Endpoints de Marca d'Água

### `GET /api/watermark`
Retorna as preferências ativas de marca d'água do workspace ou defaults inteligentes integrados ao Brand Kit padrão.

- **Autenticação**: `requireOrgRole(req, 'viewer')`
- **Response (200 OK)**:
```json
{
  "settings": {
    "id": "wmk_1729123456_abc",
    "organizationId": "org_default",
    "watermarkType": "combined",
    "position": "bottom_right",
    "opacity": 85,
    "scalePercent": 15,
    "marginPx": 24,
    "customText": "@hupflow",
    "logoUrl": "https://pub-r2.hupflow.com/logos/brand-logo.png",
    "autoApply": false,
    "createdAt": "2026-10-16T20:00:00.000Z",
    "updatedAt": "2026-10-16T20:00:00.000Z"
  },
  "brandKitDefaults": {
    "handle": "@hupflow",
    "logoUrl": "https://pub-r2.hupflow.com/logos/brand-logo.png"
  }
}
```

---

### `POST /api/watermark`
Atualiza ou salva as configurações de marca d'água do workspace.

- **Autenticação**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "watermarkType": "combined",
  "position": "bottom_right",
  "opacity": 80,
  "scalePercent": 18,
  "marginPx": 32,
  "customText": "@empresa.oficial",
  "logoUrl": "https://pub-r2.hupflow.com/logos/selo.png",
  "autoApply": true
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "settings": { ... }
}
```
