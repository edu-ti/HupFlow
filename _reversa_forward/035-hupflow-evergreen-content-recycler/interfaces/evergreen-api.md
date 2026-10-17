# Interface de API: Evergreen Content Recycler & Smart Auto-Requeue

## 1. Endpoints do Dashboard (Autenticados via Workspace)

### `GET /api/evergreen`
Retorna a biblioteca de itens Evergreen do workspace e estatísticas agregadas (total de itens ativos, total de reciclagens executadas, score médio de perenidade e horas economizadas).

### `POST /api/evergreen`
Cria ou atualiza um item na biblioteca Evergreen, calculando automaticamente seu `evergreenScore`, `nextScheduledAt` e gerando as 3 variações de gancho/copy (`variations`).

**Corpo da Requisição:**
```json
{
  "title": "Guia Definitivo: Como Estruturar Carrosséis B2B no LinkedIn",
  "originalCaption": "1. Comece com uma promessa clara no slide 1. 2. Mantenha uma ideia central por card. 3. Feche com um CTA direto...",
  "category": "educational",
  "channels": ["linkedin", "instagram"],
  "mediaType": "carousel",
  "cooldownDays": 30,
  "maxRecycles": 12
}
```

### `DELETE /api/evergreen?id=evg_001`
Remove um item da biblioteca Evergreen.

### `POST /api/evergreen/recycle`
Executa um ciclo imediato de reciclagem (ou reenfileiramento inteligente) para um item, incrementando `recycleCount`, selecionando a próxima variação em round-robin e agendando a próxima janela (`nextScheduledAt = now + cooldownDays`).
