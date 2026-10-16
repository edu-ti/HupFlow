# Legacy Impact: Editor TipTap & Preview Realista Multicanal

> Identificador: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/04-composer-copywriter.md`)  
> Nota: Feature greenfield, sem legado pré-existente. Âncora: prd.md + specs SDD.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/composer/types.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Tipagem estrita de mídias anexadas e limites de caracteres por rede. |
| `hupflow/src/lib/composer/text-utils.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Funções puras de validação de limite e conversão de HTML para texto. |
| `hupflow/src/lib/composer/text-utils.test.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Testes unitários automatizados da lógica de caracteres. |
| `hupflow/src/components/composer/TipTapToolbar.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Barra de ferramentas com comandos de formatação e menu de emojis. |
| `hupflow/src/components/composer/PlatformPreview.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | HIGH | Mockups visuais fidedignos para LinkedIn, X, Instagram e Threads. |
| `hupflow/src/app/(dashboard)/composer/page.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Integração do editor com mídias anexadas e alternador de preview. |

---

## 2. Diff Conceitual por Componente

- **`sdd/04-composer-copywriter`**: Aprimorado o compositor com suporte visual completo a mockups de preview realistas de cada rede social e barra de ferramentas de edição rica.

---

## 3. Preservadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*

---

## 4. Modificadas

*(Feature greenfield, sem regras pré-existentes modificadas no legado)*
