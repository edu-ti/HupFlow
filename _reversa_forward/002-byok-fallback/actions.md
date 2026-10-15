# Actions: Fallback para Chave Própria (BYOK) no Carousel Generator

> Identificador: `002-byok-fallback`  
> Data: `2026-10-14`  
> Roadmap: `_reversa_forward/002-byok-fallback/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 3 |
| Paralelizáveis (`[//]`) | 2 |
| Maior cadeia de dependência | 2 |

## Fase 1, Preparação

<!-- A infraestrutura de KeysContext e generateCarouselSlides já existe no módulo legado. -->

## Fase 2, Testes

<!-- O projeto não possui suite de testes unitários ativa. Validação via tipagem e checagem de fluxo. -->

## Fase 3, Núcleo

<!-- Implementação direta nos consumidores de entrada. -->

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Implementar fallback BYOK e feedback contextual no formulário de input rápido | - | `[//]` | `carousel-generator-main/src/components/ai-input-form.tsx` | 🟢 | `[X]` |
| T002 | Implementar fallback BYOK e feedback contextual no formulário de artigo longo | - | `[//]` | `carousel-generator-main/src/components/ai-textarea-form.tsx` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T003 | Verificar tratamento de erros de autenticação OpenAI (401) e coerência das mensagens nos toasts | T001, T002 | - | `carousel-generator-main/src/components/ai-input-form.tsx` | 🟢 | `[X]` |

## Notas de execução
- Execução das tarefas T001, T002 e T003 finalizada com sucesso.
- Fallback automático para `generateCarouselSlides(promptText, apiKey)` com toast explicativo quando `apiKey` presente.
- Toast explicativo orientando configuração de chave quando `apiKey` ausente.

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-to-do` no modo autônomo | reversa |
| 2026-10-14 | Conclusão das tarefas T001 a T003 em `/reversa-coding` | reversa |
