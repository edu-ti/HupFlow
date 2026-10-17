# Roadmap: Feature 021 - Webhooks Corporativos & Integrações n8n

> Identificador: `021-hupflow-webhook-integrations-n8n`  
> Data: `2026-10-16`  
> Status: Concluído  

---

## Fases de Entrega

1. **Fase 1: Preparação & Tipagem**
   - Definir interfaces TypeScript estritas em `src/lib/webhooks/types.ts`.
   - Adicionar tabelas `webhooks` e `webhook_deliveries` em `src/lib/db/schema.ts`.

2. **Fase 2: Testes de Validação**
   - Criar bateria de testes unitários para geração e verificação de assinatura HMAC, validação de URLs e parsing de payloads em `src/lib/webhooks/webhooks.test.ts`.

3. **Fase 3: Núcleo do Motor de Webhooks**
   - Implementar `src/lib/webhooks/signer.ts` (geração de segredo, assinatura HMAC, verificação).
   - Implementar `src/lib/webhooks/dispatcher.ts` (despacho assíncrono com timeout e gravação de log).
   - Implementar rota REST `/api/webhooks/route.ts` (GET, POST, PUT, DELETE).
   - Implementar rota de teste `/api/webhooks/test/route.ts`.

4. **Fase 4: Interface & Navegação**
   - Criar painel visual `/settings/webhooks/page.tsx` com listagem de webhooks, modal de cadastro/edição, visualização de segredo e disparador de teste em tempo real.
   - Adicionar atalho "Webhooks & n8n" no menu lateral do dashboard em `src/app/(dashboard)/layout.tsx`.

5. **Fase 5: Polimento & Governança**
   - Execução da suíte completa de testes (`npx tsx src/lib/webhooks/webhooks.test.ts`).
   - Validação estática sem erros com `npx tsc --noEmit`.
   - Documentação de adendo em `_reversa_sdd/addenda/021-hupflow-webhook-integrations-n8n.md`, `legacy-impact.md` e `regression-watch.md`.
