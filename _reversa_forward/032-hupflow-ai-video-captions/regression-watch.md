# Regression Watch — Feature 032: AI Video Captions & Animated Subtitles Studio

Pontos de vigilância de regressão para monitorar durante a evolução do motor de legendas sincronizadas e exportadores SRT/WebVTT.

---

### W065: Conformidade Estrita de Separadores de Milissegundos (SRT vs WebVTT)
- **Cenário de Risco**: Misturar ponto (`.`) no arquivo `.srt` ou vírgula (`,`) no arquivo `.vtt`, fazendo com que players rigorosos (LinkedIn Video, HTML5 `<track>`, Premiere) rejeitem o arquivo de legenda.
- **Mecanismo de Proteção**:
  - Funções dedicadas `formatTimestampSrt` (usa `,`) e `formatTimestampVtt` (usa `.` e exige cabeçalho `WEBVTT\n\n`).
- **Verificação**:
  - Asserções diretas em `src/lib/captions/captions.test.ts` validam a formatação exata e o cabeçalho de ambos os formatos.

---

### W066: Sobreposição Temporal ou Timestamps Negativos na Edição Manual
- **Cenário de Risco**: O usuário editar manualmente `startMs` ou `endMs` de um segmento na linha do tempo criando tempos negativos, `endMs <= startMs`, ou sobreposição com o bloco anterior.
- **Mecanismo de Proteção**:
  - A função `validateAndNormalizeCues` ordena os segmentos cronologicamente, aplica clamp em `0ms`, impõe duração mínima legível de `400ms` por bloco e avança o cursor temporal para impedir sobreposições.
- **Verificação**:
  - Teste unitário dedicado com cues invertidos e negativos em `captions.test.ts`.

---

### W067: Oclusão de Legendas pela Interface do Instagram Reels / TikTok (Safe Zones)
- **Cenário de Risco**: Legendas posicionadas muito próximas à borda inferior (abaixo de 20%) ficarem cobertas pelo nome do usuário, descrição do vídeo ou faixa de áudio nas redes sociais.
- **Mecanismo de Proteção**:
  - Âncora padrão `bottom_safe` posicionada a `22%` da base (`bottom-[22%]`) e overlay visual de **Safe Zones** no componente `VideoCaptionPreview.tsx`.
- **Verificação**:
  - Validação da classe de âncora `getSafeZoneAnchorClass('bottom_safe')` nos testes unitários e simulação visual no frame 9:16.
