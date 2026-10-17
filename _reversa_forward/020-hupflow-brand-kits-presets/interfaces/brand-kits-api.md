# Interface: API REST de Kits de Marca (Brand Kits & Presets)

> Identificador: `020-hupflow-brand-kits-presets`  
> Base Path: `/api/brand-kits`  

---

## 1. Listar Kits de Marca
- **Método / Rota:** `GET /api/brand-kits`
- **Autenticação:** Requer papel `viewer` no workspace (`requireOrgRole(req, 'viewer')`).
- **Resposta (200 OK):**
```json
{
  "brandKits": [
    {
      "id": "bkit_1",
      "name": "Identidade HupFlow",
      "isDefault": true,
      "colors": {
        "primary": "#6366F1",
        "secondary": "#A855F7",
        "accent": "#06B6D4",
        "background": "#0B0F17",
        "text": "#F8FAFC"
      },
      "typography": {
        "fontFamilyHeading": "Inter",
        "fontFamilyBody": "Inter"
      },
      "handle": "@hupflow",
      "website": "https://hupflow.com",
      "logoUrl": null,
      "createdAt": "2026-10-16T12:00:00.000Z"
    }
  ],
  "presets": [
    {
      "id": "preset_modern_dark",
      "name": "Modern Dark",
      "colors": { ... }
    }
  ]
}
```

---

## 2. Criar Kit de Marca
- **Método / Rota:** `POST /api/brand-kits`
- **Autenticação:** Requer papel `member`, `admin` ou `owner`.
- **Payload:**
```json
{
  "name": "Marca Secundária",
  "isDefault": false,
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#1D4ED8",
    "accent": "#F59E0B",
    "background": "#FFFFFF",
    "text": "#0F172A"
  },
  "typography": {
    "fontFamilyHeading": "Plus Jakarta Sans",
    "fontFamilyBody": "Inter"
  },
  "handle": "@marcasecundaria",
  "website": "https://marca.com",
  "logoUrl": null
}
```
- **Resposta (201 Created):** Objeto do kit criado.

---

## 3. Atualizar Kit de Marca
- **Método / Rota:** `PUT /api/brand-kits`
- **Autenticação:** Requer papel `member`, `admin` ou `owner`.
- **Payload:** `{ id, ...camposAtualizados }`
- **Resposta (200 OK):** Objeto atualizado.

---

## 4. Remover Kit de Marca
- **Método / Rota:** `DELETE /api/brand-kits?id=bkit_1`
- **Autenticação:** Requer papel `admin` ou `owner`.
- **Resposta (200 OK):** `{ "success": true }`
