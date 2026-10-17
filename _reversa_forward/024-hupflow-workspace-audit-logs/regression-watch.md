# Pontos de Vigilância de Regressão: Trilha de Auditoria do Workspace

> Identificador da Feature: `024-hupflow-workspace-audit-logs`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/audit/audit.test.ts`  

---

## 1. Novos Pontos de Vigilância (W041 - W043)

### [W041] Gravação Não-Bloqueante e Isolamento de Falhas
- **Risco**: Erro de conexão ou timeout na tabela `workspace_audit_logs` travar ou reverter a transação de negócio principal do usuário (ex: cancelamento de publicação ou rejeição de convite).
- **Detecção**: O serviço `recordAuditLog` implementa tratamento de erro seguro com `try/catch` interno, retornando `null` e logando aviso sem propagar exceção que quebre a API chamadora.
- **Mitigação**: Chamadores de negócio devem tratar a gravação de auditoria como efeito colateral seguro.

### [W042] Sanitização e Escape Rigoroso na Exportação CSV (RFC 4180)
- **Risco**: Injeção de fórmulas CSV (CSV Injection / Formula Injection) ou corrupção de layout em campos contendo vírgulas, quebras de linha e aspas.
- **Detecção**: Testes automatizados em `audit.test.ts` validando que todos os campos são serializados com aspas duplas envolventes e que aspas internas são duplicadas (`""`).
- **Mitigação**: Uso exclusivo da função pura `serializeAuditLogsToCsv` para qualquer exportação tabular.

### [W043] Isolamento Multitenant na Consulta de Auditoria
- **Risco**: Vazamento de eventos de auditoria, IPs e dados de usuários de uma organização para administradores de outro tenant.
- **Detecção**: Todas as consultas no método `listAuditLogs` filtram obrigatoriamente por `eq(workspaceAuditLogs.organizationId, organizationId)`.
- **Mitigação**: O endpoint `/api/audit-logs` extrai `organizationId` exclusivamente do `AuthContext` validado pelo servidor, ignorando quaisquer IDs informados via query parameter ou payload.
