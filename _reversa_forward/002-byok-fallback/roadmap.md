# Roadmap: Fallback para Chave Própria (BYOK) no Carousel Generator

> Identificador: `002-byok-fallback`  
> Data: `2026-10-14`  
> Requirements: `_reversa_forward/002-byok-fallback/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

Esta evolução implementa o fallback transparente para BYOK (Bring Your Own Key) no frontend do Carousel Generator. Ao submeter um formulário em `AIInputForm` ou `AITextAreaForm`, o cliente tenta primeiro a Server Action gratuita `generateCarouselSlidesAction`. Se o retorno indicar `rate_limit` (ou `missing_key`) E o usuário possuir uma chave privada configurada em `useKeysContext().apiKey`, o componente aciona diretamente `generateCarouselSlides(prompt, apiKey)`. Caso a chave não esteja configurada, a mensagem de rate limit convida o usuário a cadastrá-la no diálogo de configurações (`ApiKeyForm`), viabilizando geração contínua.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Continuidade do Fluxo de Criação | Permite que criadores frequentes nunca fiquem travados na esteira de produção. | respeita |
| Privacidade e Isolamento de Chaves | Chaves pessoais fornecidas pelo usuário rodam no browser e nunca são salvas ou enviadas ao servidor. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Acionar `generateCarouselSlides` localmente via LangChain no browser quando `apiKey` estiver disponível | A biblioteca `langchain` e a função `generateCarouselSlides` já existem no bundle cliente e foram preparadas pelo autor original (`// TODO: Restore local function`) | Enviar a chave do usuário para o servidor processar via Server Action (risco de segurança) | 🟢 |
| D-02 | Exibir Toast diferenciado quando a geração for realizada via BYOK | O usuário deve ter plena ciência de que sua cota privada da OpenAI está sendo consumida | Geração silenciosa sem avisar a origem da chamada | 🟢 |
| D-03 | Reutilizar a função auxiliar de formatação de tempo de reset já introduzida na feature 001 | Mantém a consistência visual quando o usuário não tiver chave configurada | Redesenhar modais | 🟢 |

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O bundle cliente suporta execução de `generateCarouselSlides` via LangChain no browser sem polyfills adicionais | Código existente e import já presente em `ai-input-form.tsx:19` | Falha de runtime se o bundler Next.js 14 bloquear módulos node no client |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `AIInputForm` | `carousel-generator-main/src/components/ai-input-form.tsx` | regra-alterada | Implementa fallback para `generateCarouselSlides(..., apiKey)` em caso de `rate_limit` |
| `AITextAreaForm` | `carousel-generator-main/src/components/ai-textarea-form.tsx` | regra-alterada | Implementa fallback para `generateCarouselSlides(..., apiKey)` em caso de `rate_limit` |

## 6. Delta no modelo de dados

- Resumo das mudanças: Nenhuma alteração em tabelas de banco nem no Prisma Schema. O armazenamento da chave permanece no `localStorage`/estado React do cliente.
- Detalhe completo em: `_reversa_forward/002-byok-fallback/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `byok-client-fallback` | Chamada Direta Client-side | `_reversa_forward/002-byok-fallback/interfaces/byok-client.md` |

## 8. Plano de migração

Não há migração de banco de dados nem quebra de retrocompatibilidade.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Chave privada do usuário ser inválida na OpenAI | Médio | Média | Envolver a chamada de fallback em `try/catch` tratando erro de autenticação 401 da OpenAI com toast explicativo |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Fallback operacional em `AIInputForm` quando `rate_limit` + `apiKey` presente
- [ ] Fallback operacional em `AITextAreaForm` quando `rate_limit` + `apiKey` presente
- [ ] Toast com feedback claro de uso de chave própria ou convite para adicionar chave
- [ ] Adendo gerado em `_reversa_sdd/addenda/002-byok-fallback.md`

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-plan` no modo autônomo | reversa |
