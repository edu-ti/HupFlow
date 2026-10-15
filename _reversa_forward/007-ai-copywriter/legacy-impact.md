# Legacy Impact: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  

---

## 1. Arquivos Legados Modificados

| Arquivo | Natureza da Modificação | Justificativa |
|---|---|---|
| `postiz-app-main/apps/backend/src/api/routes/copilot.controller.ts` | Adição de importações (`Body`, `CopywriterDto`, `ChatOpenAI`) e rota `@Post('/copywriter')` | Fornecer endpoint autenticado de geração de legendas estruturadas com IA |
| `postiz-app-main/apps/frontend/src/components/new-launch/editor.tsx` | Adição de import do `AiCopywriterModal`, estado `copywriterOpen`, botão de disparo na toolbar e renderização do modal | Permitir acesso com 1 clique ao assistente de copywriting em qualquer post |
| `postiz-app-main/apps/frontend/src/components/new-launch/manage.modal.tsx` | Atualização das instruções e labels do `CopilotPopup` | Alinhar as capacidades do CopilotKit com a API atual de `setPosts` |

---

## 2. Novos Arquivos Criados

| Arquivo | Propósito |
|---|---|
| `postiz-app-main/libraries/nestjs-libraries/src/dtos/generator/copywriter.dto.ts` | Definição de tipos e validação class-validator para payloads de copywriting |
| `postiz-app-main/apps/frontend/src/components/new-launch/ai.copywriter.modal.tsx` | Componente de UI modal para geração de legendas, troca de ganchos e hashtags |

---

## 3. Avaliação de Risco e Compatibilidade

- **Risco de Quebra no Editor**: Baixo. A integração usa as funções existentes de atualização de texto (`props.onChange`) com marcação HTML compatível com TipTap (`<p>`, `<br/>`).
- **Resiliência de Backend**: Alta. O endpoint possui fallback heurístico rico caso a OpenAI não esteja configurada ou ocorra timeout, garantindo que o usuário nunca receba erro 500 sem conteúdo.
- **Isolamento de Segurança**: Garantido via `@CheckPolicies([AuthorizationActions.Create, Sections.AI])` e extração de organização pelo token de sessão.
