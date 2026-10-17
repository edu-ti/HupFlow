# Pontos de Vigilância de Regressão: Chaves de API Públicas

> Identificador da Feature: `023-hupflow-public-api-keys`  
> Data: `2026-10-16`  
> Suite de Testes: `hupflow/src/lib/api-keys/api-keys.test.ts`  

---

## 1. Novos Pontos de Vigilância (W038 - W040)

### [W038] Persistência Estrita e Unidirecional de Tokens
- **Risco**: Risco de gravação acidental do token em texto puro (`hup_live_...`) no banco ou em logs de debug.
- **Detecção**: Testes unitários validando que a coluna `keyHash` possui exatamente 64 caracteres hexadecimais e que o valor gravado não contém a substring `hup_live_`.
- **Mitigação**: O método `createApiKey` computa o hash antes do `insert` e armazena exclusivamente `keyHash` e `keyPrefix`.

### [W039] Validação Granular de Escopos e Prevenção de Elevação de Privilégios
- **Risco**: Uma chave com escopo restrito (ex: `posts:read`) conseguir executar operações de escrita (`posts:write`) ou gestão de webhooks (`webhooks:manage`).
- **Detecção**: Teste automatizado de asserção na função `hasScope` garantindo rejeição quando o escopo solicitado não está expressamente na lista de permissões da chave e o wildcard `*` não está ativo.
- **Mitigação**: Rotas protegidas devem sempre invocar `validateApiKeyRequest(req, requiredScope)`.

### [W040] Isolamento Multitenant na Revogação e Autenticação
- **Risco**: Chave de uma organização ser utilizada para consultar ou revogar dados de outro tenant.
- **Detecção**: Todas as queries de revogação no Drizzle incluem cláusula composta `and(eq(apiKeys.id, id), eq(apiKeys.organizationId, auth.organizationId))`.
- **Mitigação**: O resultado da validação retorna o `organizationId` vinculado à chave, que deve ser adotado como contexto mandatório do tenant na requisição.
