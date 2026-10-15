# Impacto no Legado: Ponte Carousel Generator ➔ Postiz Web

> Feature: `005-carousel-postiz-bridge`  
> Data de Execução: `2026-10-15`  
> Política de Edição Ativa: `allowLegacyEdits: true`  
> Escopo Liberado em `allowedPaths`: `["carousel-generator-main/**", "postiz-app-main/**", "polotno-studio-app-master/**"]`  

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `carousel-generator-main/src/app/actions.tsx` | `carousel-generator` | `regra-nova` | MEDIUM | Adiciona a Server Action `uploadToPostizAction` para ingestão multipart segura |
| `carousel-generator-main/src/lib/hooks/use-component-printer.tsx` | `carousel-generator` | `regra-alterada` | LOW | Exporta funções utilitárias de renderização (`canvasToPdf`, `preparePrintClone`) |
| `carousel-generator-main/src/components/postiz-export-dialog.tsx` | `carousel-generator` | `componente-novo` | LOW | Diálogo modal de exportação com seletor de formato e feedback |
| `carousel-generator-main/src/components/editor-menubar.tsx` | `carousel-generator` | `regra-alterada` | LOW | Ponto de entrada visual sob o menu File e atalho na barra superior |

## 2. Diff Conceitual por Componente

### Componente: `carousel-generator`
- **Antes**: O gerador de carrosséis permitia apenas download local em PDF ou cópia de texto. O usuário precisava salvar o arquivo em disco e, manualmente, abrir o Postiz, logar, fazer upload e criar a publicação.
- **Depois**: O Carousel Generator ganha uma ponte de interoperabilidade direta com o Postiz. O usuário clica em "Enviar para o Postiz", seleciona o formato (PDF para LinkedIn ou PNG para Instagram/X) e os slides são convertidos e despachados em memória via Server Action diretamente para o endpoint `/media/upload-simple`, exibindo link imediato para iniciar o agendamento no Postiz Web.

## 3. Regras Preservadas

- **Rate Limiting e Geração via LLM (`RN-05`, `RN-06`)**: O fluxo de geração de carrosséis via LangChain e Upstash Redis permanece 100% inalterado.
- **Isolamento Multi-tenant (`RN-01`)**: As requisições continuam exigindo o token `auth` do Postiz, vinculando o criativo à organização ativa correta.

## 4. Regras Modificadas

Nenhuma regra existente de domínio foi quebrada ou removida. Foram introduzidas:
- **RN-CAROUSEL-01**: Exportação e Envio Flexível ao Postiz (PDF e PNG).
- **RN-CAROUSEL-04**: Proxy de Upload via Server Action para bypass de CORS.
