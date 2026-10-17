# Requisitos da Feature: Dead-Letter Queue & Reprocessamento de Falhas

> Identificador: `025-hupflow-publishing-dead-letter-queue`  
> Data de Criação: `2026-10-16`  
> Autor: Equipe Reversa Forward  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

Em plataformas SaaS de automação de redes sociais, falhas transitórias e de autorização são comuns (expiração de tokens OAuth das APIs do Instagram/LinkedIn, rate limits do X/Twitter, aspectos incompatíveis de mídia ou instabilidades temporárias de rede). 

A **Dead-Letter Queue (DLQ) & Central de Reprocessamento de Falhas** do HupFlow transforma postagens falhas em incidentes controlados, oferecendo:
1. **Zero Perda de Conteúdo**: Postagens que falham não são descartadas; são retidas na DLQ com preservação integral de mídias, textos e histórico.
2. **Diagnóstico Automático Inteligente**: Análise do erro retornado pela rede social com classificação em categorias canônicas (`AUTH_EXPIRED`, `MEDIA_INVALID`, `RATE_LIMITED`, `CONTENT_REJECTED`, `NETWORK_TIMEOUT`).
3. **Resolução Recomendada em Linguagem Clara**: Orientações práticas para o usuário (ex: "Reconecte a conta do Instagram", "Ajuste o formato do arquivo para MP4 ou JPEG").
4. **Retry Atômico em 1 Clique**: Reenfileiramento seletivo apenas dos canais que falharam, sem republicar canais que já foram entregues com sucesso (prevenindo postagens duplicadas).
5. **Edição Corretiva Inline**: Permite ajustar o texto ou trocar a conta conectada antes de tentar publicar novamente.

---

## 2. Casos de Uso

### UC-01: Catalogação Automática de Falha na DLQ
- Quando o worker de publicação detecta uma falha em um canal ou no post, ele registra ou atualiza o incidente na tabela `publishing_dlq`.
- Atributos gravados: `id`, `organizationId`, `postId`, `channelId`, `provider`, `accountName`, `errorCategory`, `rawErrorMessage`, `recommendedAction`, `retryCount`, `status` (`pending`, `retrying`, `resolved`, `dismissed`), `createdAt`, `updatedAt`.

### UC-02: Categorização & Diagnóstico Inteligente de Erros
- Motor puro `diagnosePublishingError(errorMessage, provider)` analisa strings e códigos de erro de Meta, LinkedIn e X:
  - Token expirado / invalid session ➔ `AUTH_EXPIRED`
  - Unsupported media / aspect ratio out of bounds ➔ `MEDIA_INVALID`
  - 429 / Too many requests / rate limit ➔ `RATE_LIMITED`
  - Character limit exceeded / restricted keywords ➔ `CONTENT_REJECTED`
  - Timeout / 502 / 503 / 504 ➔ `NETWORK_TIMEOUT`

### UC-03: Visualização & Filtros na Central de Falhas
- Painel visual em `/queue/failures/page.tsx` com tabs:
  - `Pendentes` (exige atenção)
  - `Resolvidos` (sucesso após retry)
  - `Descartados` (ignorados pelo usuário)
- Contador dinâmico de falhas pendentes visível na navegação.

### UC-04: Retry Seletivo & Prevenção de Duplicatas
- Botão "Tentar Novamente":
  - Verifica se o post já não está em `publishing`.
  - Reenfileira exclusivamente os canais pendentes/falhos vinculados.
  - Incrementa `retryCount` e atualiza status para `retrying`.

### UC-05: Descarte / Arquivamento
- Opção de marcar um incidente como `dismissed` caso o post não seja mais necessário ou a campanha tenha expirado.

---

## 3. Critérios de Aceite (DoD)

1. [x] Zero dependências proprietárias ou licenças AGPL.
2. [x] Tabela `publishing_dlq` no schema Drizzle ORM com chaves estrangeiras e índices.
3. [x] Diagnóstico determinístico testado com suíte de erros reais de Instagram, LinkedIn e X.
4. [x] Rota REST `/api/posts/dlq` com endpoints de listagem, contadores, retry e descarte.
5. [x] Interface moderna em `/queue/failures/page.tsx` com diagnóstico visual, ação em 1 clique e modal de edição corretiva.
6. [x] Item "Falhas & DLQ" integrado à navegação lateral.
7. [x] Testes unitários com `tsx` e compilação `tsc --noEmit` com zero erros.
8. [x] Adendo SDD 025 registrado em `_reversa_sdd/addenda/025-hupflow-publishing-dead-letter-queue.md`.
