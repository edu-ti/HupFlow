# Investigação Técnica: Feature 021 - Webhooks Corporativos & Integrações n8n

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## 1. Análise da Arquitetura Atual

1. **Persistência de Dados (Drizzle ORM & SQLite/Postgres)**:
   - Atualmente, as tabelas em `hupflow/src/lib/db/schema.ts` suportam organizações, membros, contas sociais, postagens, mídias, analytics, assinaturas e brand kits.
   - Precisamos adicionar:
     - Tabela `webhooks`: Armazena o endpoint URL, lista serializada de eventos subscritos, segredo HMAC (`secret`), status ativo/inativo e `organizationId`.
     - Tabela `webhook_deliveries`: Armazena o histórico recente de envios (ID do webhook, evento disparado, status HTTP, payload JSON enviado, mensagem de erro e tempo de resposta em milissegundos).

2. **Criptografia & Assinatura Digital**:
   - `node:crypto` já está presente e foi utilizado com sucesso na Feature 018 para criptografia AES-256-GCM.
   - O cálculo do HMAC é direto e performático:
     ```ts
     const hmac = crypto.createHmac('sha256', secret);
     const signature = hmac.update(`${timestamp}.${payloadString}`).digest('hex');
     ```
   - Isso segue exatamente o padrão ouro da indústria (utilizado por Stripe, GitHub e Slack), permitindo que nós do n8n (ex: Nó Webhook com Verificação HMAC) e Zapier validem a autenticidade com 1 clique.

3. **Pontos de Despacho (Trigger Points)**:
   - Criar uma função de conveniência `dispatchWebhookEvent(orgId: string, event: WebhookEventType, data: Record<string, any>)` em `src/lib/webhooks/dispatcher.ts`.
   - Essa função busca todos os webhooks ativos da organização que assinam aquele evento e dispara requisições HTTP POST em paralelo com `Promise.allSettled`, registrando o resultado em `webhook_deliveries`.
   - Sendo assíncrona, não impacta o tempo de resposta das rotas principais da API.

---

## 2. Decisões Arquiteturais Clean-Room

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Motor HMAC | `node:crypto` nativo | Zero dependências AGPL ou pacotes externos pesados; máxima performance. |
| Transporte HTTP | `fetch` nativo do Node.js 18+ com `AbortController` (timeout de 5s) | Previne conexões pendentes caso o servidor de destino demore para responder. |
| Log de Auditoria | Tabela `webhook_deliveries` limitada por data/quantidade | Permite depuração visual na tela de configurações pelo usuário. |
| Multi-tenant | Filtro estrito por `organizationId` em todas as operações | Isolamento total entre workspaces da plataforma. |
