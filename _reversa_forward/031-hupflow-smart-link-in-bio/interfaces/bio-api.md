# Interface de API: Smart Link-in-Bio

## 1. Endpoints do Dashboard (Autenticados via Workspace)

### `GET /api/bio`
Retorna a configuração completa de bio do workspace logado, incluindo links cadastrados e estatísticas agregadas.

**Resposta de Sucesso (200 OK):**
```json
{
  "profile": {
    "id": "bio_123",
    "workspace_id": "ws_123",
    "handle": "techbrand",
    "title": "Tech Brand Oficial",
    "bio": "Dicas diárias sobre tecnologia, IA e produtividade.",
    "avatar_url": "https://...",
    "theme": "midnight",
    "social_links": {
      "instagram": "techbrand",
      "linkedin": "tech-brand",
      "youtube": "techbrand"
    },
    "show_posts_showcase": true,
    "is_published": true,
    "total_views": 1540
  },
  "links": [
    {
      "id": "link_001",
      "title": "Comunidade VIP no Discord",
      "subtitle": "+10.000 desenvolvedores",
      "url": "https://discord.gg/...",
      "icon": "MessageSquare",
      "is_featured": true,
      "is_active": true,
      "sort_order": 0,
      "click_count": 420
    }
  ],
  "stats": {
    "totalViews": 1540,
    "totalClicks": 850,
    "ctr": 55.19
  }
}
```

### `POST /api/bio`
Atualiza os dados cadastrais do perfil e a lista de botões.

**Corpo da Requisição:**
```json
{
  "handle": "techbrand",
  "title": "Tech Brand Oficial",
  "bio": "Bio atualizada...",
  "theme": "sunset_gradient",
  "social_links": { "instagram": "techbrand" },
  "show_posts_showcase": true,
  "is_published": true,
  "links": [
    {
      "id": "link_001",
      "title": "Novo Curso Grátis",
      "url": "https://...",
      "is_featured": true,
      "is_active": true,
      "sort_order": 0
    }
  ]
}
```

---

## 2. Endpoints Públicos (Não Requerem Sessão)

### `GET /api/bio/public/[handle]`
Consulta o perfil público e links ativos para montagem da página.
Incrementa visualização de forma síncrona/assíncrona.

### `POST /api/bio/click`
Registra clique individual em um botão específico:
```json
{
  "linkId": "link_001",
  "profileId": "bio_123",
  "referrer": "https://instagram.com"
}
```
Retorna `{ "ok": true }`.
