# Roadmap: Gestão e Feedback Visual de Rate Limit no Carousel Generator

> Identificador: `001-rate-limit-feedback`  
> Data: `2026-10-14`  
> Requirements: `_reversa_forward/001-rate-limit-feedback/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

## 1. Resumo da abordagem

Esta evolução técnica aborda o ponto cego identificado em `carousel-generator-main/src/app/actions.tsx:16-19`, onde requisições barradas pelo `@upstash/ratelimit` retornavam silenciosamente `null`. A abordagem consiste em estabelecer uma união discriminada em TypeScript para o resultado de `generateCarouselSlidesAction`. O contrato retornará sucesso com a lista de slides ou falha tipada com código de motivo (`rate_limit`, `missing_key`, `error`), timestamp de liberação (`reset`) e mensagem legível. No cliente (`ai-input-form.tsx` e `ai-textarea-form.tsx`), o retorno é inspecionado para disparar toasts contextuais ricos (com contagem de tempo restante) e prevenir reenvios desnecessários.

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| Transparência de Erro ao Usuário | Elimina falhas silenciosas (`null`) em favor de mensagens explicativas claras e contextuais. | respeita |
| Preservação de Contratos | Mantém o tipo dos dados dos slides inalterado quando a operação é bem-sucedida. | respeita |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | Retornar União Discriminada (`GenerateCarouselResult`) na Server Action em vez de lançar exceção (`throw new Error`) | Next.js Server Actions serializam retornos com segurança para o cliente; lançar erro exigiria `try/catch` genérico que mascara códigos HTTP/Upstash | Retornar HTTP error response via route handler (desnecessário para Server Actions) | 🟢 |
| D-02 | Exibir Toast descritivo com contagem aproximada de minutos restantes via `date-fns` ou cálculo matemático nativo | Evita adicionar bibliotecas pesadas e informa o tempo exato para o reset da janela deslizante de 15 minutos do Upstash | Apenas exibir "Erro 429" sem prazo de retorno | 🟢 |
| D-03 | Atualizar simultaneamente os formulários `AIInputForm` e `AITextAreaForm` | Ambos os formulários compartilham o mesmo entry point de geração e sofriam do mesmo problema | Atualizar apenas um dos componentes | 🟢 |

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| Não acionar fallback automático para chave de API do usuário (BYOK) nesta sprint; manter foco no feedback | Seção 10 (Lacunas) | Usuários com chave própria no client continuarão barrados pelo rate limit do IP até feature futura |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `generateCarouselSlidesAction` | `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` (`carousel-generator-main/src/app/actions.tsx`) | contrato-alterado | Transforma retorno de `UnstyledDocument \| null` para `GenerateCarouselResult` tipado. |
| `AIInputForm` | `carousel-generator-main/src/components/ai-input-form.tsx` | regra-alterada | Trata `res.reason === "rate_limit"` exibindo toast específico de alerta com tempo restante. |
| `AITextAreaForm` | `carousel-generator-main/src/components/ai-textarea-form.tsx` | regra-alterada | Trata `res.reason === "rate_limit"` exibindo toast específico de alerta com tempo restante. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Não há alterações em modelos de banco de dados nem no Prisma schema. Toda a mudança opera em memória e na camada de transporte da Server Action.
- Detalhe completo em: `_reversa_forward/001-rate-limit-feedback/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| `generateCarouselSlidesAction` | Server Action (RPC) | `_reversa_forward/001-rate-limit-feedback/interfaces/server-action.md` |

## 8. Plano de migração

1. A mudança é puramente de código e tipagem TypeScript na aplicação `carousel-generator-main`.
2. Não exige migração de banco, scripts de dados ou variáveis de ambiente adicionais.

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Componente legado esperar array de slides direto | Médio | Baixa | Apenas dois componentes chamam a action (`AIInputForm` e `AITextAreaForm`), ambos são atualizados na mesma entrega. |
| Header `x-real-ip` ausente em ambiente local | Baixo | Média | O código já possui fallback: `headers().get("x-real-ip") ?? "local"`. |

## 10. Critério de pronto

- [ ] Todas as ações do `actions.md` marcadas `[X]`
- [ ] Tipo `GenerateCarouselResult` exportado e utilizado em `actions.tsx`
- [ ] Retorno com rate limit inspecionado e renderizado em `ai-input-form.tsx` e `ai-textarea-form.tsx`
- [ ] Adendo gerado em `_reversa_sdd/addenda/` sincronizando a especificação

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-plan` no modo autônomo | reversa |
