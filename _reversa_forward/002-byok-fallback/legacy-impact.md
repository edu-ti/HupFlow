# Impacto no Legado: Fallback para Chave Própria (BYOK) no Carousel Generator

> Feature: `002-byok-fallback`  
> Data de Execução: `2026-10-14`  
> Política de Edição Ativa: `allowLegacyEdits: true`  
> Escopo Liberado em `allowedPaths`: `["carousel-generator-main/**"]`  

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `carousel-generator-main/src/components/ai-input-form.tsx` | `carousel-generator` | `regra-nova` | LOW | Adiciona fallback para `generateCarouselSlides(..., apiKey)` quando rate limit atingido |
| `carousel-generator-main/src/components/ai-textarea-form.tsx` | `carousel-generator` | `regra-nova` | LOW | Adiciona fallback para `generateCarouselSlides(..., apiKey)` quando rate limit atingido |

## 2. Diff Conceitual por Componente

### Componente: `carousel-generator`
- **Antes**: O código continha comentários marcando `// TODO: Restore local function for going over limit`. Quando o usuário atingia o rate limit do servidor, a aplicação simplesmente exibia o aviso de bloqueio sem dar vazão aos usuários que possuíam chave OpenAI própria configurada no diálogo `ApiKeyForm`.
- **Depois**: Quando a Server Action retorna `rate_limit` ou `missing_key`, o componente cliente inspeciona o `apiKey` do `KeysContext`. Havendo chave própria, invoca a geração client-side diretamente via LangChain, informando ao usuário via Toast que sua chave pessoal foi utilizada. Se não houver chave, orienta o usuário a configurar sua chave para continuar sem limites.

## 3. Regras Preservadas

- **RN-01 (Isolamento Multi-tenant Postiz)**: Sem alterações.
- **RN-Carousel-01 (Rate Limit Server Action)**: O servidor continua limitando e protegendo a cota do Upstash Redis por IP para requisições anônimas.
- **Armazenamento de Chave**: O `ApiKeyForm` continua salvando localmente em `KeysContext` sem tráfego de credenciais sensíveis para os servidores do HupFlow.

## 4. Regras Modificadas

- **RN-Carousel-02 (Fallback BYOK para Geração de Slides)**:
  - Antes: Bloqueio estrito até expiração da janela de 15 minutos do Upstash.
  - Depois: Liberação imediata de geração client-side para usuários com chave OpenAI configurada.
