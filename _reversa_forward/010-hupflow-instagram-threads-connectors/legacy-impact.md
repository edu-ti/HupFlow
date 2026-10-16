# Legacy Impact: Conectores Oficiais da Meta (Instagram & Threads)

> Identificador: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/06-social-connectors.md`)  
> Nota: Feature greenfield, sem legado pré-existente. Âncora: prd.md + specs SDD.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/connectors/instagram.ts` | `sdd/06-social-connectors` | `componente-novo` | HIGH | Conector Graph API para Instagram com publicação em dois passos. |
| `hupflow/src/lib/connectors/threads.ts` | `sdd/06-social-connectors` | `componente-novo` | HIGH | Conector oficial Threads API da Meta. |
| `hupflow/src/lib/connectors/index.ts` | `sdd/06-social-connectors` | `contrato-alterado` | MEDIUM | Adição dos providers `instagram` e `threads` no registry central. |
| `hupflow/src/lib/connectors/meta.test.ts` | `sdd/06-social-connectors` | `componente-novo` | LOW | Testes unitários de automação e mock dos conectores Meta. |
| `hupflow/src/app/(dashboard)/accounts/page.tsx` | `sdd/06-social-connectors` | `componente-novo` | LOW | Interface visual de conexão OAuth e feedback em tempo real. |

---

## 2. Diff Conceitual por Componente

- **`sdd/06-social-connectors`**: Conectores oficiais para Instagram e Threads implementados, complementando os conectores de LinkedIn e X já existentes.

---

## 3. Preservadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*

---

## 4. Modificadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*
