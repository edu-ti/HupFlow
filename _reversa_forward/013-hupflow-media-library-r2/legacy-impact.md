# Legacy Impact: Biblioteca de Mídias & Upload Cloudflare R2 / S3

> Identificador: `013-hupflow-media-library-r2`  
> Data: `2026-10-15`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/04-composer-copywriter.md`, `hupflow/src/lib/db/schema.ts`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/storage/types.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Definições de tipos TypeScript para uploads, assets de mídia e filtros. |
| `hupflow/src/lib/storage/validation.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Validações puras de MIME types, extensões seguras e limites de tamanho. |
| `hupflow/src/lib/storage/validation.test.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Suíte de testes unitários automatizados para garantia de segurança e sanitização. |
| `hupflow/src/lib/storage/r2-client.ts` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Adaptador compatível com Cloudflare R2 / AWS S3 para geração de Presigned URLs. |
| `hupflow/src/app/api/media/presign/route.ts` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Rota de API protegida que valida a intenção de upload e emite a URL pré-assinada. |
| `hupflow/src/components/media/MediaUploaderModal.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Modal interativo de upload com drag-and-drop e barra de progresso. |
| `hupflow/src/app/(dashboard)/media/page.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | HIGH | Página principal da Biblioteca de Mídias com filtros, busca e galeria visual. |
| `hupflow/src/app/(dashboard)/layout.tsx` | `sdd/04-composer-copywriter` | `modificado` | LOW | Adição do link "Biblioteca de Mídias" na barra lateral de navegação. |

---

## 2. Diff Conceitual por Componente

- **`sdd/04-composer-copywriter`**: Fornecimento da infraestrutura de armazenamento e gerenciamento de arquivos de mídia (imagens, vídeos e PDFs) necessária para o enriquecimento de posts e carrosséis.

---

## 3. Preservadas

*(Feature greenfield, nenhum código legado modificado)*

---

## 4. Modificadas

- Barra de navegação principal (`layout.tsx`) ganha atalho para a nova rota `/media`.
