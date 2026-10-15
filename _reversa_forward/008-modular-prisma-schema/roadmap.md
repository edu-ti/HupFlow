# Roadmap: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

---

## Fases de Execução

### Fase 1: Análise e Decomposição dos Modelos
- [ ] Particionar os 90 modelos e 11 enums de `schema.prisma` em 8 arquivos temáticos dentro de `libraries/nestjs-libraries/src/database/prisma/schema/`.
- [ ] Habilitar `previewFeatures = ["prismaSchemaFolder"]` no bloco `generator client` de `01-base.prisma`.

### Fase 2: Automação de Bundle e Validação
- [ ] Criar script `bundle-schema.ts` para mesclar ordenadamente os sub-esquemas e gerar `schema.prisma` consolidado com integridade referencial.
- [ ] Adicionar script `"prisma-bundle"` no `package.json` raiz.

### Fase 3: Validação de Equivalência e Documentação
- [ ] Executar o script de bundle e verificar se todos os 90 modelos e 11 enums estão presentes.
- [ ] Atualizar `actions.md`, `progress.jsonl`, `legacy-impact.md`, `regression-watch.md` (W016, W017) e `_reversa_sdd/addenda/008-modular-prisma-schema.md`.
