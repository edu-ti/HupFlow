# Plano de Ação — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

## Checklist de Tarefas Clean-Room

- [x] **T001**: Definir modelos de dados em `hupflow/src/lib/affiliates/types.ts` (`AffiliateTier`, `AffiliatePartner`, `AffiliateReferralEvent`, `AffiliateProgramSummary`, `CreateAffiliatePartnerInput`).
- [x] **T002**: Adicionar tabelas `affiliatePartners` e `affiliateReferrals` no schema Drizzle em `hupflow/src/lib/db/schema.ts`.
- [x] **T003**: Implementar motor de cálculo de comissões, regras de promoção de Tier e consolidação do programa com testes unitários em `hupflow/src/lib/affiliates/affiliates.test.ts`.
- [x] **T004**: Criar camada de serviço multi-tenant em `hupflow/src/lib/affiliates/service.ts` com suporte Drizzle e fallback em memória pré-populado com parceiros de demonstração.
- [x] **T005**: Desenvolver rotas de API `/api/affiliates` (GET, POST, PATCH, DELETE) e `/api/affiliates/payout` com validação de RBAC (`requireOrgRole`).
- [x] **T006**: Construir componente interativo `hupflow/src/components/affiliates/AffiliatePartnerCard.tsx` com link de cópia rápida, badge de nível, métricas de MRR e liquidação de saque.
- [x] **T007**: Criar página do dashboard `/settings/affiliates` em `hupflow/src/app/(dashboard)/settings/affiliates/page.tsx` com KPIs financeiros e modal de novo parceiro.
- [x] **T008**: Integrar link de navegação na barra lateral em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `Handshake` com badge `MRR`).
- [x] **T009**: Executar bateria de testes com `tsx` e typecheck estático rigoroso `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/045-hupflow-multi-tier-affiliate-portal.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
