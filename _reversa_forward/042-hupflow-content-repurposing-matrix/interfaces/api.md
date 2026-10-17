# API Interfaces: 042-hupflow-content-repurposing-matrix

## 1. `GET /api/repurpose`
- **RBAC**: `requireOrgRole(req, 'viewer')`
- **Query Params**:
  - `tone` (opcional): `all` | `educational` | `contrarian` | `storytelling` | `executive`
- **Response `200 OK`**:
```json
{
  "kits": [
    {
      "id": "rep_seed_1",
      "organizationId": "org_default",
      "title": "Guia de Arquitetura Clean-Room & Escalabilidade",
      "sourceType": "article",
      "tone": "educational",
      "carouselSlides": [
        { "slideNumber": 1, "title": "Capa: O Fim do Código Espaguete", "body": "Como estruturar um SaaS..." }
      ],
      "xThread": [
        "1/5 A maioria dos SaaS quebra quando atinge 10k usuários..."
      ],
      "reelScript": {
        "hook3s": "Você comete esse erro de arquitetura?",
        "bodyText": "Mostre o diagrama na tela...",
        "ctaFinal": "Comente 'CLEAN' para receber o diagrama completo."
      },
      "newsletterSnippet": "Nesta edição: por que Clean-Room é o padrão definitivo...",
      "estimatedPiecesCount": 4
    }
  ],
  "summary": {
    "totalKits": 2,
    "totalPiecesGenerated": 8,
    "avgSlidesPerCarousel": 7,
    "avgTweetsPerThread": 5
  }
}
```

## 2. `POST /api/repurpose`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "title": "Por que agências perdem 40% do tempo em aprovação",
  "sourceType": "article",
  "tone": "executive",
  "rawSourceText": "Quando analisamos o dia a dia de 120 agências digitais, notamos que o maior gargalo..."
}
```
- **Response `201 Created`**: Objeto `ContentRepurposingKit` completo com os 4 formatos gerados.

## 3. `POST /api/repurpose/export`
- **RBAC**: `requireOrgRole(req, 'member')`
- **Request Body**:
```json
{
  "kitId": "rep_seed_1",
  "format": "carousel" | "x_thread" | "reel_script" | "newsletter"
}
```
  - Cria rascunho de postagem ou exporta conteúdo com status `200 OK`.
