# Regression Watch — Feature 030: RSS Auto-Publishing

Pontos de vigilância de regressão para monitorar durante a evolução contínua da ingestão e agendamento de posts baseados em feeds externos.

---

### W059: Resiliência contra Feeds Externos Offline, Timeouts e XML Malformado
- **Cenário de Risco**: Feeds RSS de servidores lentos, com certificados expirados, respostas 5xx ou XML quebrado gerarem travamento no loop de sincronização do workspace.
- **Mecanismo de Proteção**:
  - Timeout explícito de 10 segundos no `fetchRssFeed`.
  - Tratamento com contadores `error_count` e registro de `last_error` no feed.
  - O loop de polling isola cada feed em `try/catch`, impedindo que uma falha em um feed paralise a sincronização dos demais.
- **Verificação**:
  - Tentar sincronizar feed com URL inexistente ou XML corrompido: deve registrar erro sem quebrar a API ou a interface do usuário.

---

### W060: Idempotência e Deduplicação por GUID Composto
- **Cenário de Risco**: Ingestões periódicas reprocessarem os mesmos artigos várias vezes, gerando centenas de rascunhos duplicados e poluindo o banco.
- **Mecanismo de Proteção**:
  - Fallback determinístico de GUID caso a tag `<guid>` / `<id>` esteja ausente: usa o próprio link do artigo.
  - Verificação de unicidade no banco por par `(feed_id, guid)` antes da inserção.
- **Verificação**:
  - Sincronizar o mesmo feed duas vezes consecutivas: a segunda execução deve reportar 0 novos itens importados.

---

### W061: Limites de Caracteres na Síntese Multi-Rede (especialmente X/Twitter 280 chars)
- **Cenário de Risco**: Artigos longos sintetizados para o Twitter estourarem o limite de 280 caracteres, quebrando a publicação automática.
- **Mecanismo de Proteção**:
  - Função `synthesizeSocialDraft` possui corte proporcional rígido por plataforma:
    - Twitter/X: teto rígido de 250 caracteres de corpo + reserva de 30 caracteres para link e hashtags.
    - LinkedIn: gancho curto + bullets + link expandido.
    - Threads: pergunta provocativa + gancho + link.
- **Verificação**:
  - Teste unitário em `rss.test.ts` valida explicitamente que a variação para Twitter possui `<= 280` caracteres.
