# Pontos de Vigilância de Regressão: Central de Notificações In-App

> Identificador da Feature: `026-hupflow-notification-center`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/notifications/notifications.test.ts`  

---

## 1. Novos Pontos de Vigilância (W047 - W049)

### [W047] Isolamento Composto de Usuário e Workspace
- **Risco**: Notificações de um usuário em um workspace vazarem quando ele alternar para outra organização.
- **Detecção**: Todas as queries de listagem e mutação de leitura em `service.ts` exigem a cláusula composta `and(eq(notifications.userId, userId), eq(notifications.organizationId, organizationId))`.
- **Mitigação**: O `organizationId` é resolvido de forma estrita no servidor via `AuthContext`.

### [W048] Não-bloqueio em Despachos de Notificação
- **Risco**: Uma falha temporária ao registrar uma notificação travar a ação do usuário (ex: impedir a submissão de um post para aprovação ou o envio de um convite).
- **Detecção**: O método `createNotification` implementa bloco `try/catch` interno resiliente, retornando `null` em caso de erro no banco sem lançar exceção não capturada.
- **Mitigação**: O despachante de notificações é tratado como efeito colateral seguro.

### [W049] Atomicidade de Leitura e Prevenção de Contagens Negativas
- **Risco**: Marcações concorrentes de leitura gerarem contadores de não lidas negativos no cliente ou no banco.
- **Detecção**: O cálculo do contador utiliza agregação explícita via `count(*)` com `isRead = false`, e o cliente utiliza `Math.max(0, prev - 1)`.
- **Mitigação**: Operações de marcação atualizam `isRead = true` e `readAt = new Date()` sem decrementos numéricos cegos.
