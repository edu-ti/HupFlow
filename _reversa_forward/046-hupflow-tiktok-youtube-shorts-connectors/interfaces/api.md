# Interfaces de API — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## 1. Endpoints de Publicações Verticais (`/api/vertical`)
- **`GET /api/vertical`**:
  - Retorna publicações 9:16 da organização com filtros por status e canal.
  - Query params: `?channel=tiktok&status=scheduled`
  - Resposta: `{ success: true, posts: VerticalVideoPost[], summary: VerticalPublishSummary }`

- **`POST /api/vertical`**:
  - Cria e agenda um vídeo para TikTok e/ou YouTube Shorts após validação.
  - Body: `{ title, caption, videoUrl, thumbnailUrl?, channels, durationSeconds, width, height, privacyLevel, tiktokSettings?, youtubeSettings?, scheduledAt? }`

- **`PATCH /api/vertical`**:
  - Atualiza detalhes de agendamento ou status da publicação.
  - Body: `{ id, status?, scheduledAt?, caption? }`

- **`DELETE /api/vertical?id=:id`**:
  - Cancela o agendamento ou exclui a publicação.

## 2. Endpoint de Validação de Mídia (`/api/vertical/validate`)
- **`POST /api/vertical/validate`**:
  - Valida parâmetros técnicos do vídeo antes do envio aos servidores de publicação.
  - Body: `{ width, height, durationSeconds, channel }`
  - Resposta: `{ isValid: boolean, errors: string[], warnings: string[] }`
