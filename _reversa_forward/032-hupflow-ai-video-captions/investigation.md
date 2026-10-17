# Investigação Técnica: AI Video Captions & Animated Subtitles Studio

## 1. Padrões de Exportação de Legendas (SRT vs WebVTT)
- **SubRip (`.srt`)**:
  - Blocos numerados a partir de `1`.
  - Separador de milissegundos é **vírgula** (`,`): `00:00:01,250 --> 00:00:03,800`.
  - Aceito nativamente por LinkedIn Video, YouTube, Instagram, Facebook e editores desktop (Premiere, DaVinci, CapCut).
- **WebVTT (`.vtt`)**:
  - Deve iniciar obrigatoriamente com a assinatura `WEBVTT\n\n`.
  - Separador de milissegundos é **ponto** (`.`): `00:00:01.250 --> 00:00:03.800`.
  - Padrão W3C HTML5 para `<track kind="captions">` em players web modernos.

## 2. Segmentação Dinâmica para Retenção em Vídeos Curtos (Reels/TikTok/Shorts)
- Diferente de legendas de filmes tradicionais (que exibem frases longas de 12 a 16 palavras), vídeos curtos de alta retenção utilizam **micro-segmentos (chunking)** de 3 a 5 palavras por vez (aprox. 1.2s a 2.5s por bloco).
- Nosso motor `segmentTranscriptToCues` divide o texto respeitando pontuação e limite de palavras (`maxWordsPerCue`), calcula a duração proporcional ao número de caracteres/palavras ajustado à duração total do vídeo (ou ritmo padrão de 150 palavras por minuto), e detecta automaticamente a palavra de maior relevância (substantivos/verbos longos ou números) para aplicar o highlight visual (`highlightWord`) e sugerir um emoji semântico quando o modo dinâmico estiver ativo.

## 3. Proteção de Safe Zones em Vídeos Verticais 9:16
- No Instagram Reels, TikTok e YouTube Shorts:
  - Os **20% inferiores** são ocupados pela descrição do post, faixa de áudio e barra de progresso.
  - A **lateral direita inferior** é ocupada pelos botões de Like, Comentário, Compartilhar e Avatar.
  - Os **12% superiores** possuem cabeçalho da rede social.
- Portanto, o posicionamento vertical (`safeZonePosition`) oferece 3 âncoras seguras:
  - `bottom_safe`: 22% acima da borda inferior (acima da legenda da rede social).
  - `center`: Centralizado verticalmente (50%), ideal para cortes de podcast e estilo Hormozi.
  - `top_safe`: 16% abaixo do topo, ideal quando há demonstração de produto no centro/base do vídeo.
