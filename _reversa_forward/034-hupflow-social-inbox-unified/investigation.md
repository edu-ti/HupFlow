# Investigação Técnica: Unified Social Inbox & AI Smart Replies

## 1. Heurística Determinística de Intenção e Prioridade (`classifyInboxMessage`)
Para garantir latência zero na ingestão de comentários e independência de chamadas externas bloqueantes:
- **`lead_intent` (Prioridade `high`)**: Detecta termos comerciais de compra, preço, demonstração ou contratação (`preço`, `valor`, `plano`, `como contratar`, `agência`, `orçamento`, `demo`, `link`, `comprar`, `teste`).
- **`support` (Prioridade `high`, Sentimento `negative`)**: Detecta relatos de erro, dificuldade técnica ou reclamação (`erro`, `não funciona`, `falha`, `ajuda`, `bug`, `problema`, `travou`, `suporte`).
- **`question` (Prioridade `normal`)**: Detecta dúvidas técnicas ou editoriais (`como faço`, `qual`, `onde`, `funciona com`, `?`).
- **`spam` (Prioridade `low`)**: Detecta links suspeitos repetidos, promessas financeiras falsas ou bots (`ganhe dinheiro fácil`, `cripto grátis`, `clique aqui urgente`).
- **`praise` (Prioridade `normal`, Sentimento `positive`)**: Detecta elogios e engajamento positivo (`parabéns`, `incrível`, `excelente`, `muito bom`, `sensacional`, `top`, `amei`).

## 2. Geração Contextual de Respostas (`generateSmartReplies`)
Para cada intenção classificada, o motor sintetiza 3 sugestões imediatas nos tons:
- `consultative`: Ideal para converter leads (`lead_intent`) ou resolver dúvidas técnicas (`question` / `support`).
- `friendly`: Ideal para nutrir comunidade e agradecer elogios (`praise`).
- `direct`: Resposta curta e objetiva respeitando limites estritos (ex: X/Twitter 280 caracteres).
