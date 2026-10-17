# Pontos de Vigilância de Regressão: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador da Feature: `025-hupflow-publishing-dead-letter-queue`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/dlq/dlq.test.ts`  

---

## 1. Novos Pontos de Vigilância (W044 - W046)

### [W044] Prevenção de Publicação Duplicada em Canais Concluídos
- **Risco**: Ao reprocessar um post com múltiplos canais (ex: Instagram falhou, mas LinkedIn teve sucesso), o retry publicar o conteúdo novamente no LinkedIn, gerando postagem duplicada na rede social.
- **Detecção**: O método `retryDlqIncident` atua exclusivamente no `channelId` específico do incidente, resetando para `pending` apenas aquele registro em `post_channels`.
- **Mitigação**: O worker de publicação deve ignorar registros de `post_channels` cujo status já seja `published`.

### [W045] Bloqueio de Retry Cego para Credenciais Expiradas (AUTH_EXPIRED)
- **Risco**: O usuário tentar infinitos retries em um canal cujo token OAuth expirou, consumindo recursos e gerando poluição de logs.
- **Detecção**: O motor `diagnosePublishingError` marca `canRetry: false` para a categoria `AUTH_EXPIRED` e orienta explicitamente a reconexão na interface.
- **Mitigação**: A UI destaca a necessidade de reconectar a conta em vez de tentar um retry imediato ineficaz.

### [W046] Rastreabilidade de Tentativas e Isolamento de Tenant
- **Risco**: Incidentes de uma organização serem reprocessados ou descartados por membros de outro workspace.
- **Detecção**: Todas as mutações em `retryDlqIncident` e `dismissDlqIncident` filtram obrigatoriamente por `and(eq(publishingDlq.id, incidentId), eq(publishingDlq.organizationId, auth.organizationId))`.
- **Mitigação**: O contador `retryCount` é incrementado atomicamente a cada tentativa para auditoria de ciclo de vida.
