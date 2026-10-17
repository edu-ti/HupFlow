# Interfaces de UI — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## 1. Card de Publicação Vertical `VerticalVideoPostCard.tsx`
- Miniatura em proporção 9:16 com preview de vídeo e badges dos canais selecionados (TikTok / YouTube Shorts).
- Indicador de conformidade técnica: `✓ 1080x1920 Full HD`, `✓ 9:16`, `✓ Duração (00:45s)`.
- Status de publicação: `Agendado`, `Publicado`, `Processando`, `Falha`.
- Ações: Ver prévia no simulador, Publicar Imediatamente, Excluir.

## 2. Painel de Vídeos Verticais (`/settings/vertical`)
- Indicadores de saúde da esteira:
  - Total de Vídeos na Fila
  - Publicados no TikTok
  - Publicados no YouTube Shorts
  - Taxa Média de Conclusão / Retenção
- Modal de Composição 9:16:
  - Dropzone de vídeo com inspeção instantânea de aspect ratio e duração.
  - Alternador de canais (TikTok e/ou YouTube Shorts).
  - Título com sugestão automática de `#Shorts`.
  - Opções nativas do TikTok (Duet, Stitch, Marcação IA).
