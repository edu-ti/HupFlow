# Contrato de Integração: Ingestão de Mídia no Postiz (`/media/upload-simple`)

> Feature: `005-carousel-postiz-bridge`  
> Contrato: HTTP REST Multipart Upload  
> Provedor: Postiz Backend (`postiz-backend-api`)  
> Consumidor: Carousel Generator (`uploadToPostizAction`)  

---

## 1. Visão Geral

Este contrato define a interface de upload direto de mídia utilizada para transferir carrosséis renderizados (PDF ou imagens) do Carousel Generator para a biblioteca da organização do usuário no Postiz.

---

## 2. Especificação do Endpoint

- **Método:** `POST`
- **Path:** `/media/upload-simple`
- **Content-Type:** `multipart/form-data`

### 2.1 Cabeçalhos (Headers)

| Cabeçalho | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `auth` | `string` | Sim | Token JWT de autenticação e sessão do Postiz |

### 2.2 Corpo da Requisição (FormData)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `file` | `File / Blob` | Conteúdo binário do documento PDF (`application/pdf`) ou imagem (`image/png`, `image/jpeg`) |

---

## 3. Respostas da API

### 3.1 Sucesso: HTTP 201 Created

```json
{
  "id": "cm7abcdef1234567890",
  "name": "hupflow-carousel.pdf",
  "path": "/uploads/org_123/hupflow-carousel.pdf",
  "mimeType": "application/pdf"
}
```

### 3.2 Erros Conhecidos

- **HTTP 401 Unauthorized**: Token de autenticação ausente ou malformado.
  ```json
  { "statusCode": 401, "message": "Unauthorized" }
  ```
- **HTTP 403 Forbidden**: Token expirado ou usuário sem permissão na organização.
  ```json
  { "statusCode": 403, "message": "Forbidden resource" }
  ```
- **HTTP 400 Bad Request**: Campo `file` ausente ou formato não suportado.
  ```json
  { "statusCode": 400, "message": "No file uploaded or invalid format" }
  ```

---

## 4. Resiliência e Timeouts

- **Timeout Recomendado:** 30 segundos (suficiente para geração e transferência de PDFs de até 20 páginas em conexões padrão).
- **Idempotência:** Como o endpoint gera um novo registro de `Media` a cada upload, o client não deve disparar submissões em duplicidade enquanto a primeira estiver em andamento (protegido por estado `isLoading` no botão da interface).
