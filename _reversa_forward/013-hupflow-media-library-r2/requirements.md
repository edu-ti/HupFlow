# Requirements: Biblioteca de Mídias & Upload Cloudflare R2 / S3

> Identificador: `013-hupflow-media-library-r2`  
> Data: `2026-10-15`  
> Pasta de especificações SDD: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature implementa o motor de armazenamento de mídias e asset manager multi-tenant do HupFlow. Ela fornece upload seguro e de alta performance de imagens, vídeos e documentos PDF diretamente para buckets compatíveis com S3 (especificamente Cloudflare R2 e AWS S3) via URLs pré-assinadas (`Presigned PUT URLs`). O sistema inclui validação rígida de tipos MIME permitidos, limites de peso de arquivos (até 25MB para imagens e PDFs, até 100MB para vídeos), isolamento por organização (`organizations/<orgId>/...`), persistência dos metadados na tabela `media` do Drizzle ORM e uma interface visual de galeria com dropzone de upload, busca, filtros por tipo e inserção rápida no Compositor e no Estúdio.

---

## 2. Contexto a partir das especificações SDD e PRD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/prd.md#escopo-mvp` | "Upload seguro de imagens e vídeos para bucket Cloudflare R2 / S3-compatible com URLs assinadas." | 🟢 |
| `_reversa_sdd/prd.md#rnf-004` | "Custo de Operação Enxuto: uploads diretos evitam estresse de banda e timeout em funções serverless do Next.js." | 🟢 |
| `hupflow/src/lib/db/schema.ts` | Tabela `media` com campos `id`, `organizationId`, `filename`, `url`, `mimeType`, `sizeBytes`, `dimensions`. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Carlos (Designer / Criador)** | Fazer upload das artes dos carrosséis em alta definição (PNG/PDF) para anexar em posts sem perder qualidade. | Acessa a Biblioteca de Mídias ou clica em "Anexar Mídia" no Compositor, arrasta 5 imagens de uma vez e vê a barra de progresso em tempo real. |
| **Mariana (Social Media Manager)** | Reutilizar logotipos, fotos corporativas e vinhetas de vídeo recorrentes em múltiplos agendamentos. | Navega na galeria de mídias, filtra por "Imagens", seleciona o logotipo da empresa e anexa instantaneamente ao rascunho do post. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Upload Direto via Presigned URL):** Para evitar que arquivos pesados trafeguem pelos servidores do Next.js causando estouro de memória ou timeouts, o cliente solicita uma URL pré-assinada (`PUT`) com validade de 15 minutos e envia o binário diretamente ao bucket Cloudflare R2 / S3. 🟢
2. **RN-02 (Isolamento Rígido por Tenant):** As chaves de objeto no bucket devem sempre seguir o padrão estruturado: `orgs/{organizationId}/{ano}/{mes}/{uuid}_{sanitizedFilename}`. Nenhuma organização pode acessar ou sobrescrever arquivos de outra. 🟢
3. **RN-03 (Validação Estrita de MIME Type e Tamanho):**
   - **Imagens Permitidas:** `image/png`, `image/jpeg`, `image/webp`, `image/gif` (Máximo: 25 MB).
   - **Documentos Permitidos:** `application/pdf` (Máximo: 25 MB, usado para carrosséis LinkedIn).
   - **Vídeos Permitidos:** `video/mp4`, `video/quicktime` (Máximo: 100 MB).
   - Qualquer outro formato deve ser rejeitado antes da emissão da URL pré-assinada. 🟢
4. **RN-04 (Sanitização de Nome de Arquivo):** Nomes de arquivo contendo caracteres especiais, acentos ou tentativas de path traversal (`../`) devem ser sanitizados para caracteres alfanuméricos seguros e hifens. 🟢
5. **RN-05 (CDN Pública e URLs Amigáveis):** A URL salva no banco e retornada para as redes sociais deve utilizar o domínio público configurado do Cloudflare R2 / CDN (ex: `https://cdn.hupflow.com/...`), sem expor credenciais de acesso ao bucket. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Utilitário e validador de mídias (`validateMediaFile`, `sanitizeFileName`, `getMediaTypeFromMime`). | Must | Funções puras que validam tamanho, extensão e sanitizam nomes contra directory traversal. | 🟢 |
| **RF-02** | Gerador de Presigned URLs para S3/R2 (`createPresignedUploadUrl`). | Must | Gera URL segura com expiração de 15 minutos e cabeçalhos de Content-Type assinados. | 🟢 |
| **RF-03** | Rota de API (`POST /api/media/presign` e `POST /api/media/confirm`). | Must | Emite a presigned URL após validar a sessão e persiste o registro na tabela `media` pós-upload. | 🟢 |
| **RF-04** | Painel visual da Biblioteca de Mídias (`/media` no Dashboard). | Must | Grade de cards com preview visual das fotos/vídeos/PDFs, tamanho formatado, data de envio e botão de exclusão. | 🟢 |
| **RF-05** | Componente de Dropzone & Upload Progress (`MediaUploaderModal`). | Must | Suporte a drag-and-drop, indicador de progresso percentual e confirmação de sucesso com feedback visual. | 🟢 |
| **RF-06** | Filtros por tipo de mídia (`Todos`, `Imagens`, `Vídeos`, `PDFs`) e busca por nome. | Should | Filtragem instantânea na interface sem reload. | 🟢 |

---

## 6. Requisitos Não Funcionais

- **RNF-01 (Performance de Upload):** Upload direto via HTTP PUT sem consumo de memória no processo Node.js / Serverless.
- **RNF-02 (Segurança de Credenciais):** Credenciais de bucket (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) restritas ao ambiente de backend seguro.
- **RNF-03 (Resiliência):** Se o bucket não estiver configurado localmente (desenvolvimento offline), o sistema deve dispor de um modo mock/local fallback gracioso para não quebrar testes.
