# Roadmap: Gestão de Kits de Marca & Presets Visuais (Brand Kits & Presets)

> Identificador: `020-hupflow-brand-kits-presets`  
> Data: `2026-10-16`  
> Requisitos: `_reversa_forward/020-hupflow-brand-kits-presets/requirements.md`  

---

## Fases de Execução

### Fase 1, Preparação
- [ ] Definir interfaces TypeScript em `src/lib/brand/types.ts` (`BrandKit`, `BrandColors`, `BrandTypography`, `BrandKitPreset`).
- [ ] Adicionar tabela `brand_kits` em `src/lib/db/schema.ts` com integridade referencial.
- [ ] Definir presets corporativos de fábrica em `src/lib/brand/presets.ts`.

### Fase 2, Testes (TDD)
- [ ] Criar testes unitários em `src/lib/brand/brand-kits.test.ts`:
  - Validação rigorosa de formatos hexadecimais de cores.
  - Conversão de `BrandColors` para `ColorPalette` do Canvas 2D.
  - Comportamento de alternância de kit padrão (`isDefault`).
  - Carregamento de presets canônicos.

### Fase 3, Núcleo da API
- [ ] Implementar helpers de consulta e mutação em `src/lib/brand/service.ts`.
- [ ] Implementar endpoints REST `/api/brand-kits` (GET, POST, PUT, DELETE) com isolamento multi-tenant e RBAC.

### Fase 4, Integração Frontend
- [ ] Integrar seletor de Kits de Marca na barra lateral do Estúdio de Carrosséis (`src/app/(dashboard)/studio/page.tsx`).
- [ ] Criar tela de gestão de identidades visuais em `src/app/(dashboard)/settings/brand/page.tsx`.
- [ ] Adicionar atalho "Kit de Marca" na barra lateral de navegação ou configurações.

### Fase 5, Polimento & Governança
- [ ] Executar suíte completa de testes com `tsx`.
- [ ] Executar validação estática `tsc --noEmit` em toda a base.
- [ ] Gerar `legacy-impact.md`, `regression-watch.md` e adendo em `_reversa_sdd/addenda/020-hupflow-brand-kits-presets.md`.
- [ ] Sincronizar `.reversa/active-requirements.json`, `state.json` e `SESSION_HANDOFF.md`.
