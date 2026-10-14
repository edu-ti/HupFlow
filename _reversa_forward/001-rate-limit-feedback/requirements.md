# Requirements: Gestão e Feedback Visual de Rate Limit no Carousel Generator

> Identificador: `001-rate-limit-feedback`  
> Data: `2026-10-14`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta feature resolve o débito técnico GAP-CRIT-02 no Carousel Generator, eliminando falhas silenciosas na geração de carrosséis por IA. A solução transforma o retorno binário nulo da Server Action em um contrato de resposta tipado, informando explicitamente ao usuário quando a cota de requisições por IP foi atingida, exibindo feedback visual amigável com tempo restante de desbloqueio e desabilitando temporariamente novas tentativas.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | Carousel Generator: Next.js 14, LangChain, OpenAI (`gpt-4o-mini`), Upstash Redis. | 🟢 |
| `_reversa_sdd/domain.md#13-domínio-carousel-generator` | Carousel: sequência de slides gerados via IA otimizados para redes sociais. | 🟢 |
| `_reversa_sdd/code-analysis.md#21-módulo-carousel-generator` | `generateCarouselSlidesAction` chama `messageRateLimit.limit(ip)`. Se `!rl.success`, há `// TODO: Handle returning errors` e retorna `null` silencioso, sem feedback na UI. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Criador de Conteúdo Social | Gerar múltiplos carrosséis para LinkedIn a partir de artigos e tópicos. | Ao atingir o limite de 10 gerações em 15 minutos, o usuário recebe um aviso claro com timer de espera em vez de uma mensagem genérica de erro ou travamento da tela. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01: Contrato de Resposta Tipado da Geração** 🟢
   - Origem no legado: `carousel-generator-main/src/app/actions.tsx:16-19`
   - Tipo: alterada
   - Descrição: A Server Action `generateCarouselSlidesAction` não deve retornar apenas `null` ou `slides`. Deve retornar um objeto discriminado contendo status (`success`, `rate_limited`, `missing_key`, `error`), payload de slides (quando sucesso) e metadados de rate limit (`remaining`, `reset`, `limit`).

2. **RN-02: Feedback Visual Específico e Amigável de Rate Limit** 🟢
   - Origem no legado: `carousel-generator-main/src/components/ai-input-form.tsx:60-70` e `ai-textarea-form.tsx:58-68`
   - Tipo: nova
   - Descrição: Quando a resposta indicar `rate_limited`, a interface deve exibir um toast com variante destrutiva/aviso explicando que o limite de requisições foi atingido e informar o tempo estimado para nova tentativa (ex.: "Tente novamente em X minutos").

3. **RN-03: Bloqueio Preventivo com Cooldown Visual** 🟡
   - Origem no legado: `carousel-generator-main/src/components/ai-input-form.tsx:94-102`
   - Tipo: nova
   - Descrição: Enquanto o período de bloqueio estiver ativo, o botão de submissão pode exibir estado de espera/cooldown ou alertar imediatamente antes de disparar nova requisição inútil.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Tipagem e retorno de status estruturado em `generateCarouselSlidesAction` | Must | Retornar `{ success: true, slides }` ou `{ success: false, reason: "rate_limit", reset: number, message: string }` | 🟢 |
| RF-02 | Tratamento do erro de rate limit em `AITextAreaForm` e `AIInputForm` | Must | Notificar o usuário via Toast com mensagem clara citando a cota atingida e o tempo de liberação | 🟢 |
| RF-03 | Cálculo do tempo restante em formato legível (minutos/segundos) | Should | Converter o timestamp `reset` retornado pelo Upstash em "X minutos e Y segundos" para exibição ao usuário | 🟢 |
| RF-04 | Tratamento de erro quando `OPENAI_API_KEY` não estiver configurada | Should | Retornar motivo discriminado `missing_key` e avisar na UI que a chave da OpenAI não está presente | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Overhead zero nas chamadas com rate limit | O Upstash Ratelimit já executa a verificação; a serialização de status adiciona menos de 1ms de latência | 🟢 |
| Usabilidade | Clareza no feedback | O usuário nunca deve ficar em dúvida se a IA falhou, se a internet caiu ou se foi cota de uso | 🟢 |
| Retrocompatibilidade | Não quebrar o consumo de slides existente | A atribuição de `slides` no formulário (`setValue("slides", ...)`) deve continuar idêntica | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Usuário atinge o limite de 10 requisições em 15 minutos
  Dado que o usuário já gerou 10 carrosséis na janela de 15 minutos
  Quando o usuário submete um novo prompt de artigo ou tema
  Então a Server Action retorna status rate_limit com timestamp de reset
  E a interface exibe um Toast com a mensagem "Limite de requisições atingido. Tente novamente em X minutos"
  E o estado do editor permanece consistente sem travamentos

Cenário: Geração dentro da cota normal
  Dado que o usuário possui requisições disponíveis na cota
  Quando o usuário submete um novo prompt válido
  Então a Server Action retorna status success com os slides gerados
  E a interface popula o carrossel no editor e exibe Toast de sucesso
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Pré-requisito indispensável para distinguir rate limit de outros erros de servidor |
| RF-02 | Must | Entrega o valor direto ao usuário final, eliminando a falha silenciosa |
| RF-03 | Should | Melhora substancialmente a experiência do usuário ao fornecer contagem clara |
| RF-04 | Should | Evita confusão no ambiente de desenvolvimento local quando não há chave configurada |

## 9. Esclarecimentos

> Modo autônomo ativado: dúvidas convertidas diretamente em premissas explícitas documentadas no roadmap e questions.md.

## 10. Lacunas

- 🟡 [DÚVIDA] Se o usuário configurar uma chave própria no `keys-context` (BYOK - Bring Your Own Key), o rate limit do servidor Upstash deve ser contornado e usar a chave dele diretamente?
  - *Premissa assumida*: Sim, no futuro; nesta iteração mantemos a infraestrutura de Server Action informando adequadamente o erro e preparando o gancho para fallback.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-requirements` no modo autônomo | reversa |
