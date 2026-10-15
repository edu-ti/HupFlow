# Regression Watch: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| W014 | `postiz-app-main/apps/backend/src/api/routes/copilot.controller.ts` | O endpoint `@Post('/copywriter')` deve permanecer ativo com validação de política AI e retorno de `{ caption, hooks, hashtags, platformTip }` | presença | Remoção do endpoint `/copywriter` ou quebra do contrato de resposta JSON estruturado |
| W015 | `postiz-app-main/apps/frontend/src/components/new-launch/editor.tsx` | A barra de ferramentas do editor deve exibir o botão `AI Copywriter` e invocar o `AiCopywriterModal` com as ações de substituição e anexo | presença | Omissão do botão de IA na toolbar ou falha na propagação do texto via `onChange` |

## 2. Observações

- O fallback do backend em caso de ausência de `OPENAI_API_KEY` deve manter sugestões de alta qualidade para todas as redes suportadas.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
