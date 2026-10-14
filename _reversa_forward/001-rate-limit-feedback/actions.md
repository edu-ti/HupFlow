# Actions: Gestão e Feedback Visual de Rate Limit no Carousel Generator

> Identificador: `001-rate-limit-feedback`  
> Data: `2026-10-14`  
> Roadmap: `_reversa_forward/001-rate-limit-feedback/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 5 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 3 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Definir as interfaces e o tipo união discriminada `GenerateCarouselResult` em `actions.tsx` | - | - | `carousel-generator-main/src/app/actions.tsx` | 🟢 | `[X]` |

## Fase 2, Testes

<!-- O projeto legado carousel-generator não possui suíte de testes unitários ativa configurada. Validação realizada via tipagem estática e inspeção de contrato. -->

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T002 | Refatorar `generateCarouselSlidesAction` para capturar `!rl.success`, `!process.env.OPENAI_API_KEY` e erros de geração retornando a união discriminada | T001 | - | `carousel-generator-main/src/app/actions.tsx` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Atualizar `AIInputForm` para inspecionar `GenerateCarouselResult`, tratando `rate_limit` com cálculo de tempo e Toast descritivo | T002 | `[//]` | `carousel-generator-main/src/components/ai-input-form.tsx` | 🟢 | `[X]` |
| T004 | Atualizar `AITextAreaForm` para inspecionar `GenerateCarouselResult`, tratando `rate_limit` com cálculo de tempo e Toast descritivo | T002 | `[//]` | `carousel-generator-main/src/components/ai-textarea-form.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Validar consistência de tipagem e integridade do contrato em todo o módulo `carousel-generator-main` | T003, T004 | - | `carousel-generator-main/src/app/actions.tsx` | 🟢 | `[X]` |

## Notas de execução
- Execução concluída com sucesso sob política de segurança `allowLegacyEdits: true` com escopo restrito a `carousel-generator-main/**`.
- Todas as ações executadas e validadas sintaticamente.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-to-do` no modo autônomo | reversa |
| 2026-10-14 | Conclusão das tarefas T001 a T005 em `/reversa-coding` | reversa |
