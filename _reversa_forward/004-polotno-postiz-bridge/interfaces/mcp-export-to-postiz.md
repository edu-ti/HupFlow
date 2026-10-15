# Contrato de Interface: Ferramenta MCP `export_to_postiz`

> Feature: `004-polotno-postiz-bridge`  
> Localização: `polotno-studio-app-master/src/mcp-server/tools.ts`  

## 1. Schema da Ferramenta

```ts
{
  name: 'export_to_postiz',
  description: 'Export design from Polotno Studio and upload directly to Postiz media library for social media scheduling.',
  schema: {
    designId: z.string().describe('The design id'),
    format: z.enum(['png', 'jpeg', 'pdf']).optional().default('png'),
    token: z.string().describe('Postiz auth JWT token'),
    apiUrl: z.string().optional().describe('Postiz backend URL (default: http://localhost:3000)'),
    pageId: z.string().optional().describe('Export one page instead of all'),
    fileName: z.string().optional().describe('Custom file name')
  }
}
```

## 2. Contrato de Resposta (JSON)

```json
{
  "success": true,
  "uploaded": [
    {
      "pageIndex": 0,
      "media": {
        "id": "cm7...",
        "name": "design-name.png",
        "path": "https://storage.../design-name.png"
      }
    }
  ],
  "total": 1
}
```

## 3. Respostas de Erro

| Código HTTP Postiz | Motivo | Retorno do MCP |
|--------------------|--------|----------------|
| 401 / 403 | Token inválido ou ausente | `Error: Postiz authentication failed (403). Check your auth token.` |
| 500 | Falha interna no upload do Postiz | `Error: Postiz upload failed (500): <mensagem>` |
| ECONNREFUSED | Backend Postiz offline | `Error: Unable to connect to Postiz at <apiUrl>. Is the server running?` |
