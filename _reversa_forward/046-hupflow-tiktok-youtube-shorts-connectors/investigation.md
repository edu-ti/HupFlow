# Investigação — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## 1. Especificações Técnicas das APIs Oficiais
1. **TikTok Content Posting API (v2)**:
   - Endpoint: `POST https://open.tiktokapis.com/v2/post/publish/video/init/`
   - Requisição de upload em blocos (chunked upload) com `source_info` e `post_info`.
   - Exigência de campos de compliance: `privacy_level`, `disable_duet`, `disable_stitch`, `disable_comment`, `video_cover_timestamp_ms` e `brand_content_toggle`.
2. **YouTube Data API v3 (Shorts)**:
   - Endpoint: `POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status`
   - O YouTube classifica automaticamente qualquer vídeo com aspect ratio 9:16 ou 1:1 e duração $\le 60$ segundos como **YouTube Short**.
   - Boas práticas recomendam a tag ou hashtag `#Shorts` no título ou descrição.

## 2. Decisão de Design e Validador Pré-Upload
- Para evitar que o usuário tente agendar um vídeo que falhará silenciosamente na fila de publicação (`BullMQ`), criamos um validador puro de especificação de mídia (`validateVerticalMediaRequirements`) que avalia dimensões, duração e proporção antes do envio.
