# Impacto no Legado: Ponte Polotno Studio (MCP) ➔ Postiz Web

> Feature: `004-polotno-postiz-bridge`  
> Data de Execução: `2026-10-14`  
> Política de Edição Ativa: `allowLegacyEdits: true`  
> Escopo Liberado em `allowedPaths`: `["carousel-generator-main/**", "postiz-app-main/**", "polotno-studio-app-master/**"]`  

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `polotno-studio-app-master/src/mcp-server/tools.ts` | `polotno-mcp-server` | `delta-de-contrato-externo` | MEDIUM | Adiciona ferramenta `export_to_postiz` e aliases `postiz`/`publish` |

## 2. Diff Conceitual por Componente

### Componente: `polotno-mcp-server`
- **Antes**: O servidor MCP permitia renderizar páginas em base64 (`render_page`) ou salvar em arquivos no disco local (`export_design`). Não havia nenhuma capacidade de enviar criativos diretamente para a nuvem ou para a plataforma de postagens Postiz.
- **Depois**: O servidor passa a expor `export_to_postiz`, permitindo que agentes de IA e clientes HTTP exportem um design no Polotno e o transmitam diretamente em memória para a biblioteca de mídia do Postiz (`POST /media/upload-simple`) com validação multi-tenant.

## 3. Regras Preservadas

- **Isolamento de Contratos**: Todas as ferramentas pré-existentes (`list_designs`, `create_design`, `render_page`, `export_design`, `lint_design`) permanecem com assinaturas e comportamentos idênticos.
- **Segurança Multi-tenant**: A transmissão exige o token `auth` do Postiz, respeitando a integridade das organizações no backend.

## 4. Regras Modificadas

Nenhuma regra existente foi alterada. Foi introduzida a nova regra de interoperabilidade:
- **RN-BRIDGE-01**: Exportação e Upload Direto MCP para o Postiz.
