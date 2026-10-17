# Watchpoints de Regressão — Feature 046: Conectores Oficiais & Agendador Nativo para TikTok & YouTube Shorts

## Pontos Críticos Monitorados

### `W096: Requisito de Duração Máxima de 60s no YouTube Shorts`
- **Contexto**: A API do YouTube classifica automaticamente vídeos como Shorts apenas se a duração for $\le 60$ segundos e a proporção for vertical.
- **Risco**: Se um vídeo com 65 segundos for enviado com hashtag `#Shorts`, o YouTube o publicará como vídeo regular de feed horizontal, quebrando a experiência de descoberta.
- **Mitigação**: O validador puro `validateVerticalMediaRequirements` rejeita preventivamente vídeos com mais de 60 segundos quando o canal `youtube_shorts` estiver selecionado.

### `W097: Obrigatoriedade de Declaração de Conteúdo Gerado por IA (AIGC Compliance)`
- **Contexto**: O TikTok exige que ferramentas de agendamento passem o parâmetro booleano de disclosure quando um conteúdo for sintetizado por modelos gerativos.
- **Risco**: Violação de diretrizes da comunidade do TikTok e suspensão de tokens de criadores.
- **Mitigação**: O payload oficial gerado por `formatTikTokPublishPayload` mapeia explicitamente `is_aigc: post.tiktokSettings.isAiGenerated` diretamente no `post_info`.
