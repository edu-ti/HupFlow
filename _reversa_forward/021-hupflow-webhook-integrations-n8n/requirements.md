# Requisitos: Webhooks Corporativos & Integrações n8n/Zapier (Webhook Integrations)

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data de Início: `2026-10-16`  
> Cenário: `greenfield` (Evolução contínua do HupFlow Clean-Room)  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

O HupFlow atende criadores, agências e times de marketing modernos que operam fluxos automatizados de trabalho no **n8n**, **Zapier**, **Make** e sistemas proprietários de CRM/BI.
Esta feature implementa o subsistema de **Webhooks Corporativos de Saída (Outbound Webhooks)** com:
1. **Assinatura Criptográfica HMAC-SHA256**: Cada webhook configurado recebe um segredo único (`whsec_...`). Cada disparo carrega o header `X-HupFlow-Signature: sha256=<hex_digest>` e `X-HupFlow-Timestamp: <unix_epoch>`, prevenindo ataques de replay e garantindo autenticidade ponta a ponta sem dependências externas.
2. **Catálogo Canônico de Eventos**:
   - `post.published`: Disparado com êxito na publicação em qualquer rede conectada (Instagram, Threads, LinkedIn, X).
   - `post.failed`: Disparado quando ocorre erro definitivo de publicação, contendo a causa e canal para alerta imediato.
   - `media.uploaded`: Notificação de nova mídia processada na biblioteca Cloudflare R2 / S3.
   - `campaign.completed`: Conclusão de agendamento em lote gerado pelo AI Bulk Scheduler.
3. **Mecanismo de Despacho & Retentativas**: Despacho HTTP POST com timeout seguro (5s) e registro de telemetria em `webhook_deliveries` (status code, tempo de resposta em ms, payload enviado e erro se houver).
4. **Interface Visual Administrativa**: Painel em `/settings/webhooks` com listagem de endpoints cadastrados, alternância de status ativo/inativo, teste de disparo (ping/dry-run) e histórico das últimas entregas.
5. **Navegação do Dashboard**: Adição de atalho em `layout.tsx` para fácil acesso por gestores da organização.

---

## 2. Requisitos Funcionais (RF)

- **RF-001**: O sistema deve permitir o cadastro de múltiplos URLs de webhook por organização (`organizationId`), definindo quais eventos cada endpoint deseja assinar (`events: string[]`).
- **RF-002**: Toda criação de webhook deve gerar um segredo criptográfico aleatório com prefixo `whsec_` (mínimo de 32 bytes hexadecimais via `crypto.randomBytes`).
- **RF-003**: O motor de envio deve calcular o HMAC-SHA256 sobre a concatenação `<timestamp>.<payload_json>` usando o segredo do webhook.
- **RF-004**: O payload do webhook deve ser padronizado e idempotente:
  ```json
  {
    "id": "evt_01J...",
    "event": "post.published",
    "createdAt": "2026-10-16T20:00:00.000Z",
    "organizationId": "org_...",
    "data": { ... }
  }
  ```
- **RF-005**: O sistema deve fornecer um endpoint REST `/api/webhooks` com suporte a `GET`, `POST`, `PUT`, `DELETE` e `/api/webhooks/test` para simulação de eventos em tempo real.
- **RF-006**: A tabela `webhook_deliveries` deve registrar o histórico das últimas tentativas de envio, permitindo auditoria visual no frontend.
- **RF-007**: A tela `/settings/webhooks` deve permitir criar, editar, testar (disparo de evento de teste) e visualizar os logs de entrega recentes com status badges coloridos.

---

## 3. Requisitos Não-Funcionais & Clean-Room (RNF)

- **RNF-001 (Clean-Room)**: Implementação 100% nativa em Node.js / TypeScript utilizando `node:crypto` e `fetch` nativo. Proibido o uso de pacotes externos pesados como `svix` ou clientes fechados.
- **RNF-002 (Isolamento Multi-tenant)**: Nenhuma organização pode listar, testar ou visualizar entregas de webhooks de outros tenants.
- **RNF-003 (Resiliência & Não-bloqueio)**: O envio de webhooks em produção deve ser assíncrono e não-bloqueante para a thread principal de publicação ou agendamento.
- **RNF-004 (Segurança de Segredos)**: O segredo `secret` só é exibido na íntegra no momento da criação ou regeneração, com opção de cópia segura.
- **RNF-005 (Conformidade TypeScript)**: Zero erros em `npx tsc --noEmit` e 100% de cobertura nos testes unitários.
