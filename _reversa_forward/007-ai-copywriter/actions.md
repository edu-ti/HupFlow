# Actions: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  

---

## Lista de Ações

- [X] **T001**: Criar `CopywriterDto` em `postiz-app-main/libraries/nestjs-libraries/src/dtos/generator/copywriter.dto.ts` com validação de campos (`topic`, `content`, `platform`, `tone`, `mode`, `customInstruction`).
- [X] **T002**: Implementar o endpoint `@Post('/copywriter')` em `postiz-app-main/apps/backend/src/api/routes/copilot.controller.ts` com suporte à chamada OpenAI `ChatOpenAI` e gerador de templates heurísticos enriquecidos como fallback seguro.
- [X] **T003**: Criar o componente de interface `AiCopywriterModal` em `postiz-app-main/apps/frontend/src/components/new-launch/ai.copywriter.modal.tsx` com seleção de tom, plataforma, geração de ganchos clicáveis, nuvem de hashtags e botões de substituição/anexo.
- [X] **T004**: Integrar o botão `✨ AI Copywriter` no editor de posts em `postiz-app-main/apps/frontend/src/components/new-launch/editor.tsx` e acionar o modal passando o estado do post ativo.
- [X] **T005**: Atualizar as instruções do `CopilotPopup` em `postiz-app-main/apps/frontend/src/components/new-launch/manage.modal.tsx` para sincronizar com as capacidades atuais do editor.
- [X] **T006**: Criar artefatos de encerramento (`progress.jsonl`, `legacy-impact.md`, `regression-watch.md` com IDs W014 e W015) e o adendo SDD `_reversa_sdd/addenda/007-ai-copywriter.md`.
