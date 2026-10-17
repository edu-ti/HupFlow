# Especificação de Interface: Presigned Upload API (R2 / S3)

> Feature: `013-hupflow-media-library-r2`  
> Contrato: HTTP REST (Next.js Route Handlers)  
> Data: `2026-10-16`  
> Protocolo: HTTPS / REST JSON  

---

## 1. Visão Geral

Este contrato define a comunicação entre o cliente web (navegador) e o backend do HupFlow para emissão segura de URLs pré-assinadas (`Presigned PUT URLs`) e posterior confirmação e persistência do registro do asset na tabela `media`.

---

## 2. Endpoints

### 2.1 Solicitar URL Pré-Assinada
- **Método / Rota:** `POST /api/media/presign`
- **Autenticação:** Sessão Better-Auth ativa (requer `organizationId`).
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "filename": "carrossel_capa.png",
  "mimeType": "image/png",
  "sizeBytes": 2048500
}
```

#### Validações Estritas
1. `mimeType` deve estar na whitelist permitida:
   - Imagens: `image/png`, `image/jpeg`, `image/webp`, `image/gif` (Máximo: 25 MB / 26.214.400 bytes).
   - Documentos: `application/pdf` (Máximo: 25 MB / 26.214.400 bytes).
   - Vídeos: `video/mp4`, `video/quicktime` (Máximo: 100 MB / 104.857.600 bytes).
2. Se `sizeBytes` ultrapassar o limite da categoria ou for <= 0, retorna status HTTP `400`.
3. `filename` é sanitizado removendo caracteres de path traversal (`..`, `/`, `\`) e caracteres especiais.

#### Response Body (200 OK)
```json
{
  "uploadUrl": "https://<account-id>.r2.cloudflarestorage.com/hupflow-media/orgs/<orgId>/2026/10/<uuid>_carrossel_capa.png?X-Amz-Algorithm=...",
  "fileKey": "orgs/<orgId>/2026/10/<uuid>_carrossel_capa.png",
  "publicUrl": "https://cdn.hupflow.com/orgs/<orgId>/2026/10/<uuid>_carrossel_capa.png",
  "expiresInSeconds": 900
}
```

#### Respostas de Erro
- `400 Bad Request`: `{ "error": "Tipo MIME não suportado ou arquivo excede o limite permitido (25MB)." }`
- `401 Unauthorized`: `{ "error": "Sessão inválida ou organização não identificada." }`
- `500 Internal Server Error`: `{ "error": "Falha ao gerar credencial pré-assinada no storage." }`

---

### 2.2 Upload Direto para o Bucket (Cliente ➔ Storage)
- **Método / Rota:** `PUT <uploadUrl>`
- **Headers:**
  - `Content-Type: <mimeType>` (deve ser idêntico ao informado na emissão da URL pré-assinada).
- **Body:** Binário do arquivo (Blob / ArrayBuffer).
- **Timeout:** 15 minutos (900s).

---

### 2.3 Confirmar e Registrar Asset
- **Método / Rota:** `POST /api/media/confirm`
- **Autenticação:** Sessão Better-Auth ativa.
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "fileKey": "orgs/<orgId>/2026/10/<uuid>_carrossel_capa.png",
  "filename": "carrossel_capa.png",
  "mimeType": "image/png",
  "sizeBytes": 2048500,
  "publicUrl": "https://cdn.hupflow.com/orgs/<orgId>/2026/10/<uuid>_carrossel_capa.png",
  "dimensions": {
    "width": 1080,
    "height": 1350
  }
}
```

#### Response Body (201 Created)
```json
{
  "success": true,
  "media": {
    "id": "med_123abc456",
    "organizationId": "org_default_123",
    "filename": "carrossel_capa.png",
    "url": "https://cdn.hupflow.com/orgs/<orgId>/2026/10/<uuid>_carrossel_capa.png",
    "mimeType": "image/png",
    "mediaType": "image",
    "sizeBytes": 2048500,
    "dimensions": { "width": 1080, "height": 1350 },
    "createdAt": "2026-10-16T08:00:00.000Z"
  }
}
```

---

## 3. Modo Mock / Desenvolvimento Local

Quando as variáveis de ambiente `R2_ACCESS_KEY_ID` e `R2_SECRET_ACCESS_KEY` não estiverem presentes (desenvolvimento offline), o serviço opera no modo simulação elegante:
- `uploadUrl` retorna um endpoint local ou aceita confirmação imediata.
- Garante que testes unitários e execuções em máquinas sem internet consigam operar o dashboard e galeria de mídia sem falhas de conexão.
