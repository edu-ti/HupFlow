# Requirements: Fallback para Chave Própria (BYOK) no Carousel Generator

> Identificador: `002-byok-fallback`  
> Data: `2026-10-14`  
> Pasta da extração reversa: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

## 1. Resumo executivo

Esta feature implementa o fallback transparente para chave de API própria (Bring Your Own Key - BYOK) no Carousel Generator. Quando a cota pública de requisições por IP no Upstash Redis for excedida (ou a chave global do servidor estiver indisponível), o cliente automaticamente utiliza a chave privada OpenAI informada pelo usuário em `useKeysContext` via `generateCarouselSlides` local, permitindo que usuários continuem gerando carrosséis sem interrupções.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#1-visão-geral-da-arquitetura` | Carousel Generator utiliza LangChain com OpenAI (`gpt-4o-mini`) e Upstash Redis para rate limit. | 🟢 |
| `_reversa_sdd/addenda/001-rate-limit-feedback.md#impacto-por-artefato-da-extração` | Feature 001 estruturou `GenerateCarouselResult` com discriminadores `rate_limit` e `missing_key`. | 🟢 |
| `_reversa_sdd/code-analysis.md#21-módulo-carousel-generator` | Em `ai-input-form.tsx:56-59` e `ai-textarea-form.tsx:52-56`, havia o comentário legado: `// TODO: Restore local function for going over limit`. | 🟢 |
| `carousel-generator-main/src/components/api-keys-dialog.tsx` | Diálogo modal que permite ao usuário inserir e armazenar sua chave OpenAI no `KeysContext`. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Criador de Conteúdo Heavy-User | Gerar dezenas de carrosséis sem restrição de cota pública compartilhada. | Ao atingir o limite de 10 gerações a cada 15 minutos pelo IP público, se o usuário tiver configurado sua própria OpenAI API Key, a geração ocorre sem interrupção usando sua chave privada, com feedback de fallback. |

## 4. Regras de negócio novas ou alteradas

1. **RN-BYOK-01: Fallback Automático na Cota Excedida** 🟢
   - Origem no legado: `carousel-generator-main/src/components/ai-textarea-form.tsx:52`
   - Tipo: nova
   - Descrição: Caso a Server Action retorne `rate_limit` (ou `missing_key`) E o `apiKey` do `useKeysContext` esteja preenchido pelo usuário, o cliente dispara automaticamente a função `generateCarouselSlides(prompt, apiKey)`.

2. **RN-BYOK-02: Notificação Contextual de Uso da Chave Própria** 🟢
   - Origem no legado: `carousel-generator-main/src/components/ui/use-toast.ts`
   - Tipo: nova
   - Descrição: Quando a geração for realizada via fallback com chave privada, a interface notifica o usuário via Toast informativo indicando: "Carrossel gerado utilizando sua chave própria da OpenAI (BYOK)".

3. **RN-BYOK-03: Convite à Configuração de Chave Própria** 🟡
   - Origem no legado: `carousel-generator-main/src/components/api-keys-dialog.tsx`
   - Tipo: nova
   - Descrição: Se o limite de cota for atingido e o usuário NÃO tiver chave configurada, a mensagem de erro deve sugerir que o usuário adicione sua chave de API OpenAI no menu de configurações para continuar sem esperar o reset do rate limit.

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Acionamento condicional de `generateCarouselSlides` quando `rate_limit` e `apiKey` presente em `AIInputForm` | Must | Executar geração local client-side com `apiKey` do contexto | 🟢 |
| RF-02 | Acionamento condicional de `generateCarouselSlides` quando `rate_limit` e `apiKey` presente em `AITextAreaForm` | Must | Executar geração local client-side com `apiKey` do contexto | 🟢 |
| RF-03 | Toast explicativo de sucesso com indicação de BYOK | Should | Exibir toast com descrição informando o uso da chave pessoal | 🟢 |
| RF-04 | Orientação amigável para inserir chave em caso de rate limit sem chave cadastrada | Should | Mensagem de erro convida o usuário a clicar em Configurações de API | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Segurança | Chave do usuário nunca trafega para o servidor | O cliente LangChain executa diretamente no browser enviando a requisição para a OpenAI via HTTPS | 🟢 |
| Resiliência | Geração ininterrupta para criadores frequentes | Elimina bloqueios de produtividade de usuários pro | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Geração em fallback com chave própria quando limite é atingido
  Dado que o usuário configurou sua chave OpenAI no diálogo de API Keys
  E a cota pública de requisições por IP atingiu o limite (rate_limit)
  Quando o usuário submete um novo carrossel
  Então o sistema detecta o bloqueio público e executa a geração local via OpenAI com a chave privada
  E os slides são carregados no editor
  E um Toast informa "Novo carrossel gerado (chave própria utilizada)"

Cenário: Limite atingido sem chave própria configurada
  Dado que o usuário NÃO possui chave OpenAI salva
  E a cota pública de requisições por IP atingiu o limite
  Quando o usuário submete um novo carrossel
  Então a mensagem de rate limit informa os minutos restantes e sugere adicionar uma chave própria para continuar imediatamente
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Núcleo do fallback no formulário de prompt simples |
| RF-02 | Must | Núcleo do fallback no formulário de artigo longo |
| RF-03 | Should | Transparência de custo e quota para o usuário |
| RF-04 | Should | Descoberta da funcionalidade BYOK pelo usuário |

## 9. Esclarecimentos

> Modo autônomo ativado: dúvidas convertidas diretamente em premissas explícitas documentadas no roadmap e questions.md.

## 10. Lacunas

- 🟡 [DÚVIDA] A chave privada deve persistir no `localStorage` entre sessões?
  - *Premissa assumida*: Sim, o hook `use-keys.tsx` já implementa persistência via storage/contexto na aplicação legado.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-14 | Versão inicial gerada por `/reversa-requirements` no modo autônomo | reversa |
