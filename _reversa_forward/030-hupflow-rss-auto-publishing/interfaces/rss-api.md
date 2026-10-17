# Especificação de Interface: API de Feeds RSS/Atom

> Identificador: `030-hupflow-rss-auto-publishing`  
> Data: `2026-10-16`  

---

## 1. Endpoints de Feeds RSS

### `GET /api/rss`
Lista feeds configurados e artigos importados recentemente.

- **Autenticação**: `requireOrgRole(req, 'viewer')`
- **Response (200 OK)**:
```json
{
  "feeds": [
    {
      "id": "rss_1729123456_abc",
      "name": "TechCrunch Principal",
      "url": "https://techcrunch.com/feed/",
      "status": "active",
      "autoPublish": false,
      "targetNetworks": ["linkedin", "x"],
      "lastFetchedAt": "2026-10-16T20:00:00.000Z",
      "itemCount": 15
    }
  ],
  "recentItems": [
    {
      "id": "rsi_1729123456_xyz",
      "feedId": "rss_1729123456_abc",
      "title": "Nova IA Generativa Revoluciona Automação SaaS",
      "link": "https://techcrunch.com/article-123",
      "summary": "Resumo do artigo...",
      "imageUrl": "https://techcrunch.com/img.jpg",
      "pubDate": "2026-10-16T19:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

---

### `POST /api/rss`
Cadastra e testa um novo feed RSS/Atom.

- **Autenticação**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "name": "Blog de Engenharia",
  "url": "https://blog.hupflow.com/rss.xml",
  "targetNetworks": ["linkedin", "x", "threads"],
  "autoPublish": false
}
```

---

### `POST /api/rss/sync`
Dispara a varredura manual de novos artigos nos feeds ativos.

- **Autenticação**: `requireOrgRole(req, 'member')`

---

### `POST /api/rss/draft`
Sintetiza um artigo do feed em post social com IA.

- **Autenticação**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "itemId": "rsi_1729123456_xyz",
  "network": "linkedin",
  "tone": "educational"
}
```
- **Response (200 OK)**:
```json
{
  "draft": {
    "content": "Texto formatado do post...",
    "hashtags": ["SaaS", "Tecnologia", "Inovacao"],
    "targetNetwork": "linkedin"
  }
}
```
