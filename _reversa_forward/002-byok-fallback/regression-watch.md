# Regression Watch: Fallback para Chave Própria (BYOK) no Carousel Generator

> Feature: `002-byok-fallback`  
> Data: `2026-10-14`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W004 | `carousel-generator-main/src/components/ai-input-form.tsx` | O formulário deve disparar `generateCarouselSlides(promptText, apiKey)` quando `result.reason === "rate_limit"` e `apiKey` presente | presença | Remoção do bloco `if ((result.reason === "rate_limit" ...)` ou ignorar `apiKey` |
| W005 | `carousel-generator-main/src/components/ai-textarea-form.tsx` | O formulário de artigo deve disparar `generateCarouselSlides(promptText, apiKey)` quando `result.reason === "rate_limit"` e `apiKey` presente | presença | Remoção do bloco `if ((result.reason === "rate_limit" ...)` ou ignorar `apiKey` |

## 2. Observações

- Nenhuma chave de API privada deve ser enviada via RPC para o backend; a execução é garantidamente client-side.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
