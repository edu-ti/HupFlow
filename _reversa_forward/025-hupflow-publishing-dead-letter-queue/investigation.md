# Investigação Técnica: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador: `025-hupflow-publishing-dead-letter-queue`  
> Data: `2026-10-16`  

---

## 1. Arquitetura Atual de Despacho e Pontos de Falha

1. **Estado Atual do Worker (`hupflow/src/lib/queue/worker.ts`)**:
   - O worker itera sobre `postChannels` vinculados ao post.
   - Quando um conector retorna `result.success === false` ou lança exceção, ele marca `postChannels.status = 'failed'` e grava `errorMessage`.
   - No final, se `hasFailures === true`, marca `posts.status = 'failed'`.
   - **Gap Identificado**: Não há agregação das falhas em uma fila de triagem com diagnóstico inteligente; o usuário precisa entrar manualmente no post para saber o motivo. Canais bem-sucedidos não devem ser reenviados num retry global para evitar duplicatas em redes sociais.

2. **Padrão Dead-Letter Queue (DLQ)**:
   - Uma tabela dedicada `publishing_dlq` isola incidentes de publicação sem poluir a tabela `posts`.
   - Permite retry seletivo apenas no canal que falhou.
   - Preserva o histórico de tentativas (`retryCount`), mensagem crua da API e diagnóstico amigável traduzido.

3. **Diagnóstico Heurístico de Mensagens de Erro**:
   - Meta Graph API: Erros comuns como `Error validating access token: Session has expired`, `Application request limit reached`, `The image ratio is not supported`.
   - LinkedIn API: `EXPIRED_ACCESS_TOKEN`, `Throttle limit for calls to this resource is reached`, `FileSizeTooLarge`.
   - X/Twitter API v2: `429 Too Many Requests`, `Duplicate content`, `User has been suspended`.
   - Um analisador puramente funcional mapeia esses padrões para enums canônicos e instruções diretas de ação.
