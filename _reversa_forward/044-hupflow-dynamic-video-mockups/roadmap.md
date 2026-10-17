# Roadmap — Feature 044: Gerador de Mockups Dinâmicos de Vídeo & Dispositivos

1. **Fase 1: Tipos & Schema** (T001, T002)
   - Criação dos modelos TypeScript em `hupflow/src/lib/mockups/types.ts`.
   - Adição da tabela `device_mockups` no Drizzle ORM.

2. **Fase 2: Motor de Geometria Vetorial e Testes Unitários** (T003)
   - Funções puras em `hupflow/src/lib/mockups/mockups.test.ts` para cálculo de viewports, aspect ratios, geração de SVG frames e resumo de mockups.
   - Teste unitário determinístico com `tsx`.

3. **Fase 3: Camada de Serviço e Rotas de API** (T004, T005)
   - Serviço multi-tenant com fallback em memória pré-populado.
   - Rotas de API `/api/mockups` e `/api/mockups/export`.

4. **Fase 4: Componente de Mockup e Tela no Dashboard** (T006, T007, T008)
   - Componente `DeviceMockupPreview.tsx` com moldura SVG, reflexos e Dynamic Island.
   - Página `/settings/mockups` com estúdio interativo e galeria de presets.
   - Link de navegação no menu lateral com ícone `Smartphone` ou `MonitorSmartphone` e badge `3D`.

5. **Fase 5: Verificação e Sincronização** (T009, T010)
   - Testes com `tsx` e verificação estática `tsc --noEmit`.
   - Adendo SDD e handoff.
