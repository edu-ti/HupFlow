# Legacy Impact: Feature 021 - Webhooks Corporativos & Integrações n8n

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Visão Geral das Alterações

A Feature 021 implementa o subsistema de **Webhooks Corporativos de Saída (Outbound Webhooks)** do HupFlow, permitindo integração direta e segura com plataformas de automação (n8n, Zapier, Make) e backends próprios de clientes corporativos. Todas as requisições enviadas contam com assinatura criptográfica HMAC-SHA256 e tolerância contra ataques de replay.

---

## 2. Arquivos Criados ou Modificados

| Arquivo | Natureza | Descrição do Impacto |
|---------|:--------:|----------------------|
| `hupflow/src/lib/webhooks/types.ts` | Novo | Definições TypeScript estritas de eventos, payloads, webhooks e histórico de entregas. |
| `hupflow/src/lib/webhooks/signer.ts` | Novo | Geração de segredos `whsec_...`, cálculo de HMAC-SHA256, verificação timing-safe e validação de URLs. |
| `hupflow/src/lib/webhooks/dispatcher.ts` | Novo | Despachante assíncrono com timeout de 5 segundos, concorrência controlada e registro de telemetria. |
| `hupflow/src/lib/webhooks/webhooks.test.ts` | Novo | Bateria unitária de testes cobrindo geração de secret, assinatura HMAC, anti-tampering e anti-replay. |
| `hupflow/src/lib/db/schema.ts` | Modificado | Adição das tabelas `webhooks` e `webhook_deliveries` com índices por organização e webhook. |
| `hupflow/src/app/api/webhooks/route.ts` | Novo | API RESTful (GET, POST, PUT, DELETE) com isolamento multi-tenant e RBAC `admin`. |
| `hupflow/src/app/api/webhooks/test/route.ts` | Novo | Endpoint para disparo simulado de eventos (dry-run/ping) em tempo real. |
| `hupflow/src/app/(dashboard)/settings/webhooks/page.tsx` | Novo | Painel de controle visual com listagem, modal de cadastro, revelador de segredo e tabela de telemetria. |
| `hupflow/src/app/(dashboard)/layout.tsx` | Modificado | Inclusão do atalho "Webhooks & n8n" no menu de navegação lateral. |

---

## 3. Compatibilidade Regressiva & Regras de Isolamento

1. **Despacho Não-Bloqueante**: O disparo de webhooks é desacoplado e não adiciona latência ao ciclo de publicação de posts ou upload de mídias.
2. **Isolamento Multi-tenant**: Toda consulta e manipulação de webhooks e histórico de entregas filtra obrigatoriamente por `organizationId`.
3. **Segurança Criptográfica**: Chaves e assinaturas utilizam primitivas nativas `node:crypto` com comparação em tempo constante (`timingSafeEqual`), eliminando vulnerabilidades de timing attack.
4. **Conformidade Clean-Room**: Zero bibliotecas proprietárias ou AGPL. Implementação 100% nativa.
