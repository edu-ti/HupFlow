# Roadmap: Aplicação de Marca d'Água (Watermark Overlay) & Selos Corporativos

> Identificador: `029-hupflow-media-watermark-overlay`  
> Data: `2026-10-16`  

---

## Fases de Execução

### Fase 1: Preparação & Tipagem
- `T001`: Definir contratos TypeScript para posições, tipos, estilos e configurações em `hupflow/src/lib/watermark/types.ts`.
- `T002`: Adicionar tabela `watermark_settings` no schema do Drizzle ORM em `hupflow/src/lib/db/schema.ts`.

### Fase 2: Testes de Domínio (TDD)
- `T003`: Criar testes unitários para cálculo geométrico de posições, margens de segurança e limites de escala em `hupflow/src/lib/watermark/watermark.test.ts`.

### Fase 3: Motor Geométrico & Serviços
- `T004`: Implementar o motor de cálculo de coordenadas e serviço de persistência com fallback ao Brand Kit em `hupflow/src/lib/watermark/service.ts`.
- `T005`: Criar rota REST `/api/watermark/route.ts` (GET, POST) com RBAC.

### Fase 4: Interface & Pré-Visualização Dinâmica
- `T006`: Criar componente de preview em tempo real `WatermarkPreviewCard.tsx` em `hupflow/src/components/watermark/WatermarkPreviewCard.tsx`.
- `T007`: Criar painel visual de gerenciamento de marca d'água em `hupflow/src/app/(dashboard)/settings/watermark/page.tsx`.
- `T008`: Adicionar atalho "Marca d'Água" no menu lateral do dashboard em `hupflow/src/app/(dashboard)/layout.tsx`.

### Fase 5: Validação, Regressão e Governança
- `T009`: Bateria de testes com `npx tsx`, verificação estática com `npx tsc --noEmit`, adendo SDD e relatórios de conformidade.
