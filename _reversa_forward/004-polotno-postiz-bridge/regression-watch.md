# Regression Watch: Ponte Polotno Studio (MCP) ➔ Postiz Web

> Feature: `004-polotno-postiz-bridge`  
> Data: `2026-10-14`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W008 | `polotno-studio-app-master/src/mcp-server/tools.ts` | A ferramenta `export_to_postiz` deve estar registrada no array `TOOLS` e suportar upload multipart | presença | Remoção da ferramenta `export_to_postiz` ou quebra na montagem do `FormData` |
| W009 | `polotno-studio-app-master/src/mcp-server/tools.ts` | O cabeçalho `auth: token` deve ser enviado em todas as chamadas HTTP para `/media/upload-simple` | presença | Omissão do cabeçalho `auth` na requisição fetch |

## 2. Observações

- A ferramenta depende do endpoint `/media/upload-simple` do Postiz Backend estar acessível.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
