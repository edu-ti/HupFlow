# Roadmap — Feature 045: Portal de Afiliados & Parcerias com Comissionamento Recorrente

1. **Fase 1: Tipos & Schema** (T001, T002)
   - Criação dos modelos TypeScript em `hupflow/src/lib/affiliates/types.ts`.
   - Adição das tabelas `affiliatePartners` e `affiliateReferrals` no Drizzle ORM.

2. **Fase 2: Motor de Comissionamento e Testes Unitários** (T003)
   - Funções puras em `hupflow/src/lib/affiliates/affiliates.test.ts` para cálculo de comissões por plano, progressão de nível (Tier upgrade) e consolidação do programa de parceiros.
   - Teste unitário com `tsx`.

3. **Fase 3: Camada de Serviço e Rotas de API** (T004, T005)
   - Serviço multi-tenant com fallback em memória pré-populado.
   - Rotas de API `/api/affiliates` e `/api/affiliates/payout`.

4. **Fase 4: Componente de Parceiro e Painel no Dashboard** (T006, T007, T008)
   - Componente `AffiliatePartnerCard.tsx` com link de indicação, badge de nível e botão de saque.
   - Página `/settings/affiliates` com cards executivos de MRR e modal de cadastro.
   - Inclusão no menu lateral com ícone `Handshake` ou `Gift` e badge `MRR`.

5. **Fase 5: Verificação e Sincronização** (T009, T010)
   - Bateria de testes com `tsx` e verificação estática `tsc --noEmit`.
   - Adendo SDD e handoff.
