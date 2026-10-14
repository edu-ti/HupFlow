# Impacto no Legado: Gestão e Feedback Visual de Rate Limit no Carousel Generator

> Feature: `001-rate-limit-feedback`  
> Data de Execução: `2026-10-14`  
> Política de Edição Ativa: `allowLegacyEdits: true`  
> Escopo Liberado em `allowedPaths`: `["carousel-generator-main/**"]`  

## 1. Arquivos Afetados

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `carousel-generator-main/src/app/actions.tsx` | `carousel-generator` (`_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura`) | `delta-de-contrato-externo` | MEDIUM | Adiciona tipo `GenerateCarouselResult` e retorna união discriminada em vez de `null` |
| `carousel-generator-main/src/components/ai-input-form.tsx` | `carousel-generator` | `regra-alterada` | LOW | Consome `GenerateCarouselResult` e exibe toasts ricos contextualizados para rate limit |
| `carousel-generator-main/src/components/ai-textarea-form.tsx` | `carousel-generator` | `regra-alterada` | LOW | Consome `GenerateCarouselResult` e exibe toasts ricos contextualizados para rate limit |

## 2. Diff Conceitual por Componente

### Componente: `carousel-generator`
- **Antes**: A função `generateCarouselSlidesAction` continha `// TODO: Handle returning errors` e retornava silenciosamente `null` quando o rate limit do Upstash era atingido ou quando a chave da OpenAI não estava definida. Nos componentes `ai-input-form.tsx` e `ai-textarea-form.tsx`, o cliente avaliava apenas `if (generatedSlides)` disparando um toast genérico de falha.
- **Depois**: A Server Action expõe uma união discriminada segura em TypeScript (`GenerateCarouselResult`), identificando os estados `success`, `rate_limit`, `missing_key` e `error`. O cliente calcula o tempo restante de bloqueio com base no timestamp Unix retornado pelo Upstash KV e exibe um toast destrutivo com mensagem precisa ao usuário.

## 3. Regras Preservadas

As seguintes regras de negócio 🟢 extraídas em `_reversa_sdd/domain.md` permanecem completamente intactas:
- **RN-01 (Isolamento Multi-tenant Postiz)**: Sem alteração, restrito ao subsistema Postiz backend.
- **RN-02 (Limites de Texto e Mídia por Rede Social)**: Sem alteração na camada de integração.
- **RN-03 (Renovação Autônoma de Credenciais OAuth)**: Sem alteração no orquestrador Temporal.
- **RN-04 (Idempotência de Publicação via Temporal)**: Sem alteração.
- **Geração de Slides**: Formato e schema `MultiSlideSchema` mantidos para todos os fluxos de sucesso.

## 4. Regras Modificadas

- **RN-Carousel-01 (Tratamento de Rate Limit no Carousel Generator)**:
  - Antes: Falha silenciosa com retorno `null` sem feedback específico.
  - Depois: Retorno estruturado `{ success: false, reason: "rate_limit", reset, remaining, message }` com feedback visual imediato contendo tempo estimado de reset.
