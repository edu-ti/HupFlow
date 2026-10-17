# Roadmap: Biblioteca de Mídias & Upload Cloudflare R2 / S3

> Identificador: `013-hupflow-media-library-r2`  
> Data: `2026-10-16`  
> Requirements: `_reversa_forward/013-hupflow-media-library-r2/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

Esta feature implementa o motor de gerenciamento e armazenamento de mídias do HupFlow.
Para eliminar gargalos de banda e timeouts comuns em servidores Node.js/Serverless, adota-se a arquitetura de **Presigned PUT URLs**: o cliente solicita ao backend uma URL temporária pré-assinada (com validade de 15 minutos e Content-Type fixado) e envia o binário diretamente ao bucket Cloudflare R2 / AWS S3.
A solução conta com:
- Validação estrita de tipos MIME e limites de tamanho (25MB para imagens e PDFs, 100MB para vídeos).
- Sanitização de nomes de arquivos para evitar directory traversal.
- Isolamento multi-tenant rígido por organização (`orgs/{organizationId}/...`).
- Persistência e consulta dos metadados na tabela `media` do Drizzle ORM.
- Galeria visual em `/media` no Dashboard com filtros por tipo, busca em tempo real, dropzone com drag-and-drop, barra de progresso e atalho de inserção.
- Modo mock/fallback para desenvolvimento local offline sem dependência de credenciais R2 ativas.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL / Licenças Permissivas** | Toda a integração utiliza `@aws-sdk/client-s3` (Apache-2.0) e utilitários nativos em TypeScript/React sem bibliotecas copyleft ou SDKs proprietários fechados. | Respeita 🟢 |
| **Isolamento Multi-Tenant Estrito** | Todo upload e consulta é filtrado obrigatoriamente por `organizationId`, tanto na chave do storage quanto no banco. | Respeita 🟢 |
| **Alta Performance e Custo Zero de Tráfego** | Uploads diretos para Cloudflare R2 sem taxa de tráfego de saída (zero egress fees) e sem tráfego de binários pelo servidor Next.js. | Respeita 🟢 |
| **Design Visual Premium (Dark Mode)** | Galeria interativa com cards nítidos, previews rápidos de imagens, vídeos e PDFs, dropzone intuitivo e feedback de progresso. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Presigned PUT URLs em vez de upload via multipart proxy | Elimina limites de 4.5MB da Vercel/Serverless e economiza 100% da memória e banda do servidor na transmissão de vídeos e PDFs. | Rota proxy `POST /api/upload` no Next.js. | 🟢 |
| **D-02** | Cloudflare R2 como storage primário (S3-compatible) | Compatibilidade total com a API S3 e ausência de cobrança de taxa de egress (transferência de saída de dados). | AWS S3 padrão (alto custo de egress) ou Supabase Storage. | 🟢 |
| **D-03** | Validação antecipada de MIME Type e tamanho no cliente e backend | Impede que o cliente gere URLs pré-assinadas para arquivos executáveis ou payloads excessivos antes mesmo de iniciar o envio. | Validar apenas pós-upload via webhook. | 🟢 |
| **D-04** | Modo Fallback Offline/Mock | Permite desenvolvimento local, execução de testes unitários e visualização da galeria sem exigir credenciais reais do R2. | Exigir chaves R2 válidas para rodar qualquer parte do app. | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| Mídias são vinculadas ao workspace da organização e compartilhadas entre membros da equipe | RF-03 / RN-02 | Baixo; modelo SaaS corporativo padrão do HupFlow. |
| Domínio público ou CDN (ex: `R2_PUBLIC_URL`) distribui as URLs públicas para renderização e redes sociais | RN-05 | Baixo; R2 oferece URLs públicas com 1 clique ou domínio customizado sem custo adicional. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `storage/types.ts` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Tipos TypeScript para assets, presigned URLs e requisições de upload. |
| `storage/validation.ts` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Funções puras de validação de MIME, extensões, sanitização e formatação de tamanho. |
| `storage/r2-client.ts` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Gerador de Presigned URLs compatível com S3 e modo mock seguro para dev local. |
| `api/media/presign/route.ts` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Rota de API protegida que valida e gera a URL pré-assinada. |
| `api/media/confirm/route.ts` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Rota de confirmação que persiste a mídia no banco de dados. |
| `MediaUploaderModal` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Modal com dropzone drag-and-drop e barra de progresso de upload. |
| `MediaLibraryPage` (`/media`) | `_reversa_sdd/prd.md` | Componente Novo | Painel de visualização da galeria com cards, filtros por categoria e busca. |
| `DashboardLayout` | `hupflow/src/app/(dashboard)/layout.tsx` | Modificado | Inclusão do link "Biblioteca de Mídias" na navegação da sidebar. |

---

## 6. Delta no modelo de dados

A feature utiliza a tabela `media` já definida em `hupflow/src/lib/db/schema.ts`, sem requerer novas colunas nem migrations no banco de dados.
- Tabela: `media`
- Campos consumidos: `id`, `organizationId`, `filename`, `url`, `mimeType`, `sizeBytes`, `dimensions`, `createdAt`.
- Detalhe completo em: `_reversa_forward/013-hupflow-media-library-r2/data-delta.md`.

---

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Presigned Upload & Confirm API | HTTP REST | `_reversa_forward/013-hupflow-media-library-r2/interfaces/presigned-upload-api.md` |

---

## 8. Plano de migração

Não aplicável (feature greenfield nova no HupFlow). A tabela `media` já existe no schema PostgreSQL do Drizzle.

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Bloqueio de CORS ao fazer upload direto do navegador para o Cloudflare R2 | Alto | Médio | Documentar e configurar as regras de CORS permitidas (`AllowedOrigins`, `AllowedMethods: [PUT]`, `AllowedHeaders: [*]`) no bucket R2. |
| Tentativa de upload de arquivos executáveis com extensão forçada | Alto | Baixo | Validação dupla: checagem estrita da extensão e do header `Content-Type` assinado na URL pré-assinada. |
| Ausência de credenciais R2 durante desenvolvimento local | Médio | Médio | Implementação de fallback local mock transparente que simula o upload com URLs seguras. |

---

## 10. Critério de pronto

- [ ] Utilitário de validação com testes unitários cobrindo tipos permitidos, rejeições de tamanho e sanitização de nome.
- [ ] Adaptador S3/R2 para geração de URLs pré-assinadas com expiração de 15 minutos e suporte a fallback offline.
- [ ] Rotas de API `/api/media/presign` e `/api/media/confirm` operacionais e seguras.
- [ ] Modal de upload com dropzone, validação em tempo real e barra de progresso percentual.
- [ ] Página `/media` com galeria visual, cards informativos, filtros (Todos, Imagens, Vídeos, PDFs) e busca.
- [ ] Link "Biblioteca de Mídias" adicionado na barra lateral do Dashboard.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-16 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
