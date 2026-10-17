# Interfaces de API — Feature 047: Estúdio de Narração e Text-to-Speech (TTS) com Vozes Neurais

## 1. Endpoints de Faixas de Narração (`/api/voiceover`)
- **`GET /api/voiceover`**:
  - Lista todas as faixas geradas pela organização com métricas de minutos totais de áudio.
  - Query params: `?language=pt-BR&persona=narrator_documentary`
  - Resposta: `{ success: true, tracks: VoiceoverTrackItem[], summary: VoiceoverStudioMetrics }`

- **`POST /api/voiceover`**:
  - Sintetiza e registra uma nova faixa de narração em áudio.
  - Body: `{ title, scriptText, voiceId, language, persona, speed, pitch, tags }`

- **`PATCH /api/voiceover`**:
  - Atualiza título ou tags da faixa de áudio.
  - Body: `{ id, title?, tags? }`

- **`DELETE /api/voiceover?id=:id`**:
  - Remove a faixa de áudio.

## 2. Endpoint de Catálogo de Vozes Neurais (`/api/voiceover/voices`)
- **`GET /api/voiceover/voices`**:
  - Retorna o catálogo de vozes disponíveis com amostras de áudio para preview.
  - Resposta: `{ success: true, voices: VoiceProfile[] }`
