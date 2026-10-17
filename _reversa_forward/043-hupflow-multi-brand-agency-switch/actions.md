# Plano de Ação — Feature 043: Seletor Rápido & Workspace Switcher de Agência Multi-Marca

## Checklist de Tarefas Clean-Room

- [x] **T001**: Definir modelos e interfaces de dados em `hupflow/src/lib/agency/types.ts` (`AgencyBrandProfile`, `AgencyPortfolioSummary`, `CreateAgencyBrandInput`, `BrandTier`, `BrandStatus`).
- [x] **T002**: Adicionar tabela `agency_brand_profiles` em `hupflow/src/lib/db/schema.ts` com Drizzle ORM.
- [x] **T003**: Implementar funções puras de busca difusa (`filterAgencyBrands`), ranqueamento com favoritos e consolidação de carteira (`calculateAgencyPortfolioSummary`) com suíte de testes unitários em `hupflow/src/lib/agency/agency.test.ts`.
- [x] **T004**: Criar camada de serviço em `hupflow/src/lib/agency/service.ts` com suporte Drizzle e fallback em memória pré-populado com marcas de demonstração.
- [x] **T005**: Implementar endpoints `/api/agency/brands` (GET, POST, PATCH, DELETE) e `/api/agency/switch` (POST) com validação de RBAC (`requireOrgRole`).
- [x] **T006**: Construir componente modal estilo Command Palette `hupflow/src/components/agency/AgencyBrandSwitcherModal.tsx` com listener global de atalho `Cmd/Ctrl + K`, busca e navegação por teclado.
- [x] **T007**: Criar página do dashboard `/settings/brands` em `hupflow/src/app/(dashboard)/settings/brands/page.tsx` para gestão centralizada de clientes da agência.
- [x] **T008**: Integrar atalho no menu lateral de navegação em `hupflow/src/app/(dashboard)/layout.tsx` (ícone `Building2` e badge `Agency`).
- [x] **T009**: Executar bateria de testes com `tsx` e typecheck rigoroso com `tsc --noEmit`.
- [x] **T010**: Registrar sincronização no SDD (`_reversa_sdd/addenda/043-hupflow-multi-brand-agency-switch.md`), atualizar `.reversa/state.json`, `active-requirements.json` e `SESSION_HANDOFF.md`.
