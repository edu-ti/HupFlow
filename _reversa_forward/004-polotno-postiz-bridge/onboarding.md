# Onboarding: Utilização da Ferramenta MCP `export_to_postiz`

> Feature: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  

## 1. Passo a Passo para Teste Manual

### Via Claude Desktop / Cursor / Agente MCP
1. Certifique-se de que o Polotno Studio está aberto com um design ativo.
2. Inicie o Postiz Backend (`pnpm dev` na porta 3000).
3. Obtenha um token de autenticação ativo do Postiz (via login web ou endpoint `/auth/login`).
4. Invoque a ferramenta MCP:
   ```json
   {
     "name": "export_to_postiz",
     "arguments": {
       "designId": "<ID_DO_DESIGN>",
       "format": "png",
       "token": "<SEU_TOKEN_POSTIZ>"
     }
   }
   ```
5. O Polotno renderizará o canvas, fará o upload para `POST http://localhost:3000/media/upload-simple` e retornará os metadados da mídia criada na sua organização.
6. Acesse a tela de Posts do Postiz Web (`http://localhost:4200` ou `3000/posts`) e verifique a nova imagem presente na biblioteca de mídia pronta para publicação.
