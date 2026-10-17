# Interfaces de API — Feature 049: Relatórios Executivos em PDF

## 1. `GET /api/reports`
- **Permissão**: `viewer+`
- **Parâmetros**: `?brandSlug=...&limit=...`
- **Retorno**: Lista de relatórios emitidos e configurações de agendamento ativas.

## 2. `POST /api/reports/generate`
- **Permissão**: `member+`
- **Corpo da Requisição**:
  ```json
  {
    "brandSlug": "hupflow-tech",
    "reportTitle": "Relatório Semanal de Performance — Semana 42",
    "daysRange": 7,
    "includeAiSummary": true
  }
  ```
- **Retorno**: Dados do relatório gerado com URL para download e dados de KPI.

## 3. `GET /api/reports/download?id=...`
- **Permissão**: `viewer+`
- **Retorno**: Arquivo PDF em streaming com cabeçalho `Content-Type: application/pdf` e `Content-Disposition: attachment; filename="relatorio-hupflow-....pdf"`.
