# Regression Watch: Feature 021 - Webhooks Corporativos & Integrações n8n

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data: `2026-10-16`  
> Status: Ativo  

---

## 1. Itens de Monitoramento

| ID | Área / Componente | Condição Crítica | Risco Mitigado |
|----|-------------------|------------------|----------------|
| **W032** | `src/lib/webhooks/signer.ts` | Validação timing-safe e tolerância de 300s no timestamp | Impedir ataques de temporização e replay attacks contra receptores de webhooks |
| **W033** | `src/lib/webhooks/dispatcher.ts` | Timeout de 5000ms com `AbortController` em requisições de saída | Evitar travamento do pool de conexões por endpoints lentos ou fora do ar |
| **W034** | `src/app/api/webhooks/route.ts` | Verificação estrita de RBAC `admin` para mutações e segredos | Impedir que membros comuns ou visualizadores tenham acesso aos segredos de webhook |

---

## 2. Estratégia de Verificação

1. **Testes Unitários**: Execução do script `src/lib/webhooks/webhooks.test.ts`.
2. **Checagem Estática**: Compilação TypeScript com `npx tsc --noEmit`.
3. **Verificação de Regressão Cruzada**: Garantir que as rotas de publicação e agendamento permaneçam 100% operacionais.
