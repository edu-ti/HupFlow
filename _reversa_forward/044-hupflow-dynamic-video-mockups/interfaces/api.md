# Interfaces de API — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

## 1. Endpoints de Gerenciamento (`/api/mockups`)
- **`GET /api/mockups`**:
  - Retorna mockups salvos da organização com estatísticas.
  - Query params: `?deviceType=iphone_16_pro&limit=20`
  - Resposta: `{ success: true, mockups: DeviceMockupItem[], summary: MockupSummaryMetrics }`

- **`POST /api/mockups`**:
  - Salva um novo preset de mockup na galeria do workspace.
  - Body: `{ title, deviceType, orientation, finishColor, shadowStyle, mediaType, mediaUrl, backgroundColorHex, perspectiveTiltX, perspectiveTiltY, tags }`

- **`PATCH /api/mockups`**:
  - Atualiza configurações do mockup existente.
  - Body: `{ id, ...patch }`

- **`DELETE /api/mockups?id=:id`**:
  - Exclui o mockup do catálogo.

## 2. Endpoint de Renderização & Exportação Vetorial (`/api/mockups/export`)
- **`POST /api/mockups/export`**:
  - Gera a definição vetorial SVG completa do dispositivo com clip-path e imagem incorporada em base64/link direto.
  - Body: `{ deviceType, orientation, finishColor, mediaUrl, width, height }`
  - Resposta: `{ success: true, svgContent: string }`
