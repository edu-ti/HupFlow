# Interfaces de API — Feature 048: Kill Switch & Brand Safety

## 1. `GET /api/brand-safety`
- **Permissão**: `viewer+`
- **Retorno**: Estado atual de segurança da marca, configuração do kill switch e últimos 10 incidentes.
- **Exemplo de Resposta**:
  ```json
  {
    "success": true,
    "settings": {
      "isEmergencyPaused": true,
      "pausedAt": "2026-10-17T16:00:00Z",
      "pausedByUserName": "Eduardo (Admin)",
      "pauseReason": "Alerta de crise institucional no X",
      "affectedPostsCount": 14
    },
    "recentIncidents": [ ... ]
  }
  ```

## 2. `POST /api/brand-safety/kill-switch`
- **Permissão**: `admin+`
- **Ação**: Ativar imediatamente a pausa de emergência global ou por escopo.
- **Corpo da Requisição**:
  ```json
  {
    "action": "activate",
    "reason": "Recall de produto anunciado pela matriz",
    "scope": "global",
    "confirmationText": "CONFIRMAR PAUSA"
  }
  ```

## 3. `POST /api/brand-safety/resume`
- **Permissão**: `admin+`
- **Ação**: Descongelar a fila com estratégia de resolução de posts vencidos.
- **Corpo da Requisição**:
  ```json
  {
    "expiredPostStrategy": "hold_for_review", // ou "reschedule_next_available"
    "resumeReason": "Crise contornada e nota oficial divulgada"
  }
  ```
