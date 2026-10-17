# Interface de API: AI Video Captions & Animated Subtitles Studio

## 1. Endpoints do Dashboard (Autenticados via Workspace)

### `GET /api/captions`
Lista todos os projetos de legendas da organização ativa e estatísticas agregadas (total de projetos, tempo total legendado, total de segmentos).

**Resposta de Sucesso (200 OK):**
```json
{
  "projects": [
    {
      "id": "cap_001",
      "organizationId": "org_123",
      "title": "Reels: 3 Segredos de Produtividade com IA",
      "language": "pt-BR",
      "durationMs": 12000,
      "preset": "hormozi_bold",
      "safeZonePosition": "bottom_safe",
      "cues": [
        {
          "id": "cue_1",
          "index": 1,
          "startMs": 0,
          "endMs": 2400,
          "text": "Mais de 80% dos vídeos",
          "highlightWord": "80%",
          "emoji": "🔥"
        }
      ]
    }
  ],
  "stats": {
    "totalProjects": 2,
    "totalCues": 12,
    "totalDurationSec": 27
  }
}
```

### `POST /api/captions`
Cria, atualiza ou gera automaticamente um projeto de legendas (a partir de um `rawTranscript` com segmentação IA ou lista direta de `cues`).

**Corpo da Requisição:**
```json
{
  "id": "cap_001",
  "title": "Reels: Como escalar conteúdo em 2026",
  "language": "pt-BR",
  "durationMs": 15000,
  "preset": "hormozi_bold",
  "safeZonePosition": "bottom_safe",
  "rawTranscript": "Quer triplicar seu alcance no Instagram e LinkedIn? O segredo está na retenção dos primeiros 3 segundos...",
  "autoGenerateFromTranscript": true,
  "maxWordsPerCue": 4
}
```

### `DELETE /api/captions?id=cap_001`
Remove um projeto de legendas do workspace.

---

## 2. Endpoint de Exportação Universal (`SRT` e `VTT`)

### `POST /api/captions/export`
Converte um projeto ou lista de `cues` para o formato `.srt` (SubRip) ou `.vtt` (WebVTT).

**Corpo da Requisição:**
```json
{
  "format": "srt",
  "cues": [
    {
      "id": "cue_1",
      "index": 1,
      "startMs": 0,
      "endMs": 2500,
      "text": "Bem-vindo ao HupFlow Studio"
    }
  ]
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "format": "srt",
  "filename": "legendas-hupflow.srt",
  "mimeType": "application/x-subrip",
  "content": "1\n00:00:00,000 --> 00:00:02,500\nBem-vindo ao HupFlow Studio\n"
}
```
