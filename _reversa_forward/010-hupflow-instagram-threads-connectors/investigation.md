# Investigação Técnica: Meta Graph API & Threads API

> Feature: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  

---

## 1. Fluxo de Publicação do Instagram Graph API

A API do Instagram requer uma abordagem em duas etapas:
1. **Container de Mídia (`POST /{ig-user-id}/media`)**:
   - Para imagem única: `image_url={url}&caption={legenda}`
   - Para carrossel: Criação de múltiplos containers individuais de mídia com `is_carousel_item=true`, seguidos de um container pai com `media_type=CAROUSEL` contendo a lista de `children`.
2. **Publicação (`POST /{ig-user-id}/media_publish`)**:
   - `creation_id={container_id}`. Retorna o ID da publicação no feed.

## 2. Fluxo da Threads API

A Threads API foi lançada em 2024 e espelha a arquitetura de containers da Meta:
1. **Container de Post (`POST /v1.0/{threads-user-id}/threads`)**:
   - `media_type=TEXT` e `text={conteúdo}` (máximo de 500 caracteres).
2. **Publicação (`POST /v1.0/{threads-user-id}/threads_publish`)**:
   - `creation_id={threads_container_id}`. Retorna o ID do post no Threads.

## 3. Estratégia de Mocking para Ambiente Local

Para permitir que desenvolvedores rodem e testem o HupFlow localmente sem depender de criar Apps no Facebook Developers nem aprovar permissões empresariais de imediato, implementamos um mock simulado de alta precisão que gera IDs representativos (`ig_post_mock_123` e `th_post_mock_123`), simulando a latência de rede e a resposta de sucesso oficial da Meta.
