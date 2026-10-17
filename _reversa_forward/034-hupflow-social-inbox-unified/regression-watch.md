# Regression Watch — Feature 034: Unified Social Inbox & AI Smart Replies

Pontos de vigilância de regressão para monitorar durante a evolução da triagem de mensagens e respostas rápidas no Social Inbox.

---

### W071: Estouro de Limite de Caracteres em Respostas para X / Twitter (280c)
- **Cenário de Risco**: Uma sugestão de resposta automática (`SmartReplySuggestion`) ultrapassar 280 caracteres quando a mensagem de origem veio do canal `x`, causando rejeição na API do X.
- **Mecanismo de Proteção**:
  - `generateSmartReplies` aplica clamping automático (`maxLen = 275`) sempre que `message.channel === 'x'`.
- **Verificação**:
  - Teste unitário explícito em `inbox.test.ts` valida que todas as sugestões geradas para `channel: 'x'` possuem `length <= 280`.

---

### W072: Poluição da Taxa de Resposta (Response Rate) por Mensagens de Spam
- **Cenário de Risco**: Comentários classificados como `spam` reduzirem artificialmente a métrica `responseRate` da equipe por não serem respondidos.
- **Mecanismo de Proteção**:
  - `calculateInboxStats` filtra todas as interações com `intent === 'spam'` antes de calcular o denominador do `responseRate`.
- **Verificação**:
  - Verificado na suíte `inbox.test.ts`.

---

### W073: Priorização de Reclamações e Suporte sobre Elogios
- **Cenário de Risco**: Uma mensagem contendo simultaneamente termos neutros e relato de falha técnica não receber prioridade `high`.
- **Mecanismo de Proteção**:
  - Em `classifyInboxMessage`, a regra de `support` (sentimento `negative`, prioridade `high`) é avaliada antes das regras de `praise` e `question`.
- **Verificação**:
  - Asserções diretas em `inbox.test.ts`.
