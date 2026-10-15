# Roadmap: AI Copywriter & Sugestão de Legendas no Postiz

> Feature: `007-ai-copywriter`  
> Data: `2026-10-15`  

---

## Fases de Execução

### Fase 1: Backend - Endpoint e DTO de Copywriting
- [ ] Criar `CopywriterDto` com validação de payload em `libraries/nestjs-libraries/src/dtos/generator/copywriter.dto.ts`.
- [ ] Implementar `@Post('/copywriter')` no `CopilotController` (`apps/backend/src/api/routes/copilot.controller.ts`), com suporte a OpenAI e fallback heurístico rico por plataforma e tom.
- [ ] Exportar o DTO e registrar no módulo se necessário.

### Fase 2: Frontend - Componente de UI e Integração
- [ ] Criar componente `AiCopywriterModal` em `apps/frontend/src/components/new-launch/ai.copywriter.modal.tsx`.
- [ ] Integrar botão de acionamento `✨ AI Copywriter` em `apps/frontend/src/components/new-launch/editor.tsx` para cada post da thread.
- [ ] Atualizar instruções do `CopilotPopup` em `apps/frontend/src/components/new-launch/manage.modal.tsx`.

### Fase 3: Validação e Documentação
- [ ] Validar fluxo de ponta a ponta (requisição, geração, seleção de ganchos/hashtags, aplicação no editor).
- [ ] Atualizar `actions.md`, `progress.jsonl`, `legacy-impact.md`, `regression-watch.md` e gerar adendo SDD `007-ai-copywriter.md`.
