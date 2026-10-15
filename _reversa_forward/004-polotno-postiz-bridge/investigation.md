# Investigação Técnica: Integração Polotno MCP ➔ Postiz Media Upload

> Feature: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  

## 1. Como o Polotno Renderiza e Exporta

No Polotno Studio (`src/mcp-server/tools.ts:325`):
```ts
const { value } = await exec(id, { type: 'export', format, pageId, pixelRatio })
const { pages, suggestedName } = value as {
  pages: { pageId?: string; dataUrl: string }[]
  suggestedName: string
}
```
Cada página vem como `dataUrl` no formato:
`data:image/png;base64,iVBORw0KGgo...`

Para converter esse `dataUrl` em um `Blob` no Node.js / Electron sem salvar em disco:
```ts
const base64Data = page.dataUrl.split(',')[1];
const buffer = Buffer.from(base64Data, 'base64');
const blob = new Blob([buffer], { type: format === 'pdf' ? 'application/pdf' : `image/${format}` });
```

## 2. Como o Postiz Recebe o Upload

O Postiz Backend (`src/api/routes/media.controller.ts:130`):
- Rota: `POST /media/upload-simple`
- Cabeçalhos: `auth: <token>` (ou Cookie `auth=<token>`)
- Corpo: `multipart/form-data` com campo `file`
- Retorno:
```json
{
  "id": "cm...uuid",
  "name": "filename.png",
  "path": "/uploads/filename.png",
  "organizationId": "org-id"
}
```

## 3. Implementação da Ferramenta `export_to_postiz`

```ts
{
  name: 'export_to_postiz',
  description: 'Export design pages from Polotno Studio and upload directly to Postiz media library for social media scheduling.',
  schema: {
    designId,
    format: z.enum(['png', 'jpeg', 'pdf']).default('png'),
    token: z.string().describe('Postiz auth token (JWT)'),
    apiUrl: z.string().optional().describe('Postiz backend URL (default: http://localhost:3000)'),
    pageId: z.string().optional(),
    fileName: z.string().optional()
  },
  handler: async ({ designId: id, format = 'png', token, apiUrl, pageId, fileName }: any) => { ... }
}
```
