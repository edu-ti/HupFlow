# Investigação Técnica: Ponte Carousel Generator ➔ Postiz Web

> Feature: `005-carousel-postiz-bridge`  
> Data: `2026-10-15`  
> Status: Concluída  

## 1. Como o Carousel Generator Renderiza Slides

No Carousel Generator (`carousel-generator-main/src/lib/hooks/use-component-printer.tsx`):
- O componente de slides é renderizado no DOM dentro do editor (`slides-editor.tsx`).
- A biblioteca `html-to-image` converte os nós HTML dos slides em instâncias de `HTMLCanvasElement` via `toCanvas(node, options)`.
- A função `canvasToPdf(canvas, opt)` converte o canvas em páginas PDF utilizando a biblioteca `jspdf`.
- Para obter os bytes do PDF em memória no cliente:
  ```ts
  const pdf = new jsPDF(opt.jsPDF);
  // ... desenha páginas ...
  const pdfBlob = pdf.output("blob");
  ```
- Para imagens PNG individuais:
  ```ts
  const dataUrl = canvas.toDataURL("image/png");
  const blob = await (await fetch(dataUrl)).blob();
  ```

## 2. Como o Postiz Ingesta Arquivos de Mídia

No Postiz Backend (`postiz-app-main/apps/backend/src/api/routes/media.controller.ts:130-150`):
- **Rota:** `POST /media/upload-simple`
- **Autenticação:** Header `auth: <jwt-token>` ou Cookie de sessão.
- **Formato:** `multipart/form-data` contendo o campo de arquivo `file`.
- **Validação de Organização:** O middleware `AuthMiddleware` extrai o usuário e sua organização ativa associada (`orgId`).
- **Persistência:** O arquivo é persistido via `StorageService` (em disco local ou S3/R2 dependendo de `STORAGE_PROVIDER`) e um registro correspondente é inserido na tabela `Media` do PostgreSQL.
- **Resposta Sucesso (HTTP 201):**
  ```json
  {
    "id": "cm7...",
    "name": "carousel-document.pdf",
    "path": "/uploads/carousel-document.pdf",
    "mimeType": "application/pdf"
  }
  ```

## 3. Arquitetura de Proxy via Server Action (Next.js)

Se a requisição de upload fosse disparada diretamente do navegador do Carousel Generator (`http://localhost:3001`) para o Postiz Backend (`http://localhost:3000`), ocorreria bloqueio por **CORS (Cross-Origin Resource Sharing)** caso os headers de origem cruzada não estivessem explicitamente liberados para a porta secundária.

Ao adotar uma **Server Action** (`uploadToPostizAction`):
1. O cliente monta o `FormData` em memória com o `file`, `token` e `apiUrl`.
2. A Server Action é executada no backend Node.js do Next.js.
3. O Node.js dispara um `fetch` nativo multipart direto para o Postiz Backend.
4. Como é uma comunicação de servidor para servidor, o CORS do navegador não se aplica.
5. O resultado é devolvido tipado para o componente cliente:
   ```ts
   export type UploadToPostizResult =
     | { success: true; media: { id: string; name: string; path: string }; postizWebUrl: string }
     | { success: false; reason: "auth_error" | "network_error" | "upload_error"; message: string };
   ```

## 4. Persistência de Credenciais no Cliente

Para manter a experiência fluida sem expor tokens no servidor do Carousel Generator:
- Chaves armazenadas em `localStorage`:
  - `hupflow_postiz_api_url` (padrão: `http://localhost:3000`)
  - `hupflow_postiz_web_url` (padrão: `http://localhost:4200`)
  - `hupflow_postiz_token` (token JWT do Postiz)
- O diálogo modal carrega esses valores na abertura e permite salvar novas credenciais com 1 clique.
