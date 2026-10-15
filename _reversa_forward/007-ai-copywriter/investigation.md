# Investigation: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  

---

## 1. Arquitetura Atual

- **Frontend Postiz**:
  - Modal de publicação: `apps/frontend/src/components/new-launch/manage.modal.tsx` gerencia canais, datas, repetidores e renderiza `<EditorWrapper>`.
  - Editor de texto: `apps/frontend/src/components/new-launch/editor.tsx` utiliza TipTap (`useEditor`), zustand store (`useLaunchStore`) para sincronizar textos individuais (`setInternalValueText`) e globais (`setGlobalValueText`), além de imagens e mídias.
  - Copilot Integration: `manage.modal.tsx` contém `<CopilotPopup>` com instruções legadas para métodos inexistentes (`addPostContentFor`), enquanto `editor.tsx` expõe `useCopilotAction({ name: 'setPosts' })`.
  - Requisições autenticadas: O hook `useFetch()` de `@gitroom/helpers/utils/custom.fetch` lida com autenticação via cookie/JWT contra a API backend.

- **Backend Postiz**:
  - `apps/backend/src/api/routes/copilot.controller.ts`: Expõe rotas `@Controller('/copilot')`, incluindo `/chat`, `/agent` e `/credits`.
  - `libraries/nestjs-libraries/src/database/prisma/autopost/autopost.service.ts` e `libraries/nestjs-libraries/src/agent/agent.graph.service.ts`: Instanciam `ChatOpenAI` de `@langchain/openai` com modelo `gpt-4.1` e chave de ambiente `process.env.OPENAI_API_KEY`.
  - Autorização: `@CheckPolicies([AuthorizationActions.Create, Sections.AI])` garante controle de acesso por permissão e organização.

---

## 2. Decisões Técnicas

1. **Endpoint Dedicado no Backend**:
   - Adicionar `@Post('/copywriter')` no `CopilotController` com validação de payload via class-validator (`CopywriterDto`).
   - O endpoint aceita: `topic`, `content`, `platform`, `tone`, `mode`, `customInstruction`.
   - Gera resposta estruturada JSON com `{ caption, hooks, hashtags, platformTip }`.
   - Inclui mecanismo de fallback heurístico inteligente para evitar quebras se a API OpenAI estiver indisponível ou sem chave configurada no ambiente local.

2. **Componente de UI Dedicado**:
   - Criar `apps/frontend/src/components/new-launch/ai.copywriter.modal.tsx` como um modal limpo, acessível e responsivo, integrado ao tema do Postiz.
   - Conectar o botão `✨ AI Copywriter` no cabeçalho ou barra de ferramentas de cada post em `editor.tsx`.
   - Permitir substituição direta ou anexo no editor TipTap com chamada direta para as funções de store `setInternalValueText` / `setGlobalValueText`.

3. **Atualização do CopilotPopup**:
   - Ajustar o prompt em `manage.modal.tsx` para refletir `setPosts` e dar instruções claras de copywriting e assistência multicanal.
