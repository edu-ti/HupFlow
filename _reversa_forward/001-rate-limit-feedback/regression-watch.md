# Regression Watch: Gestão e Feedback Visual de Rate Limit no Carousel Generator

> Feature: `001-rate-limit-feedback`  
> Data: `2026-10-14`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W001 | `carousel-generator-main/src/app/actions.tsx` | A Server Action deve retornar objeto discriminado `GenerateCarouselResult` e nunca retornar `null` silencioso em caso de erro | presença | `return null;` reintroduzido na Server Action ou tipagem relaxada para `any` |
| W002 | `carousel-generator-main/src/components/ai-input-form.tsx` | O formulário deve tratar `result.reason === "rate_limit"` informando tempo restante ao usuário | presença | Toast genérico sem tempo de reset ou falta de tratamento para o status de erro |
| W003 | `carousel-generator-main/src/components/ai-textarea-form.tsx` | O formulário de artigo deve tratar `result.reason === "rate_limit"` informando tempo restante ao usuário | presença | Toast genérico sem tempo de reset ou falta de tratamento para o status de erro |

## 2. Observações

- As alterações foram feitas em TypeScript estrito, garantindo compatibilidade entre os dois formulários e a Server Action.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
