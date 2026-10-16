# Legacy Impact: Estúdio de Carrosséis 2D & Exportação PDF Multi-Páginas

> Identificador: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/02-canvas-studio.md` e `03-carousel-engine.md`)  
> Nota: Feature greenfield, sem legado pré-existente. Âncora: prd.md + specs SDD.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/canvas/types.ts` | `sdd/02-canvas-studio` | `componente-novo` | LOW | Tipos de exportação de mídia e proporções de carrossel. |
| `hupflow/src/lib/canvas/canvas-utils.ts` | `sdd/02-canvas-studio` | `componente-novo` | LOW | Funções puras de cálculo de dimensão e wrap de texto. |
| `hupflow/src/lib/canvas/canvas-utils.test.ts` | `sdd/02-canvas-studio` | `componente-novo` | LOW | Testes unitários automatizados da lógica de proporção. |
| `hupflow/src/lib/canvas/canvas-renderer.ts` | `sdd/02-canvas-studio` | `componente-novo` | MEDIUM | Renderizador gráfico 2D em buffer de alta resolução. |
| `hupflow/src/lib/canvas/pdf-exporter.ts` | `sdd/02-canvas-studio` | `componente-novo` | HIGH | Compilador de PDFs multi-páginas para LinkedIn. |
| `hupflow/src/app/(dashboard)/studio/page.tsx` | `sdd/02-canvas-studio` | `componente-novo` | MEDIUM | Interface interativa do estúdio com botões e atalhos. |

---

## 2. Diff Conceitual por Componente

- **`sdd/02-canvas-studio`**: Adicionado o subsistema de compilação gráfica vetorial e exportação de PDF multi-páginas e PNG individual.
- **`sdd/03-carousel-engine`**: Integrado o gerador de IA com os slides ativos e os novos controles de manipulação na prancheta.

---

## 3. Preservadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*

---

## 4. Modificadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*
