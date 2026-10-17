# Legacy Impact: Biblioteca de Mídias & Upload Cloudflare R2 / S3

> Identificador: `013-hupflow-media-library-r2`  
> Data: `2026-10-16`  
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
| `hupflow/src/lib/storage/r2-client.ts` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Adaptador compatível com Cloudflare R2 / AWS S3 para geração de Presigned URLs e mock local. |
| `hupflow/src/app/api/media/presign/route.ts` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Rota de API para validação prévia de tipo/tamanho e emissão da Presigned PUT URL. |
| `hupflow/src/app/api/media/confirm/route.ts` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Rota de API para registrar os metadados da mídia confirmada na tabela `media`. |
| `hupflow/src/app/api/media/route.ts` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Rotas GET e DELETE para listagem e remoção de mídias da organização. |
| `hupflow/src/app/api/media/mock-upload/route.ts` | `sdd/04-composer-copywriter` | `componente-novo` | LOW | Rota de apoio local para simulação graciosa de uploads sem credenciais R2 externas. |
| `hupflow/src/components/media/MediaUploaderModal.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | MEDIUM | Modal interativo de upload com drag-and-drop e barra de progresso. |
| `hupflow/src/app/(dashboard)/media/page.tsx` | `sdd/04-composer-copywriter` | `componente-novo` | HIGH | Página principal da Biblioteca de Mídias com filtros, busca e galeria visual. |
| `hupflow/src/app/(dashboard)/layout.tsx` | `sdd/04-composer-copywriter` | `modificado` | LOW | Adição do link "Biblioteca de Mídias" na barra lateral de navegação. |

---

## 2. Diff Conceitual por Componente

- **`sdd/04-composer-copywriter`**: Fornecimento da infraestrutura de armazenamento e gerenciamento de arquivos de mídia (imagens, vídeos e PDFs) necessária para o enriquecimento de posts e carrosséis.
- **`sdd/02-canvas-studio`**: Destino para persistência e reutilização de peças gráficas e carrosséis em PDF exportados.

---

## 3. Preservadas

*(Feature greenfield, nenhum código legado modificado)*

---

## 4. Modificadas

- Barra de navegação principal (`layout.tsx`) ganha atalho para a nova rota `/media`.
