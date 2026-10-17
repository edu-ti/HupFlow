# Investigation: APIs Oficiais do LinkedIn e X/Twitter em Ambiente Clean-Room

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data: `2026-10-16`  

---

## 1. LinkedIn: Compartilhamento de Carrosséis Nativos (Documentos PDF)

O LinkedIn não possui um formato de "Carrossel de Imagens" direto na API para postagens orgânicas normais da mesma forma que o Instagram. O formato oficial que gera o carrossel paginado interativo na timeline do LinkedIn é o **Document Post (PDF)**.
1. O usuário cria os slides no Estúdio de Carrosséis do HupFlow.
2. O estúdio exporta o PDF vetorial multipágina via jsPDF.
3. Ao publicar no LinkedIn, o conector registra o documento na Media API com categoria `DOCUMENT`, faz upload do arquivo binário e cria a postagem via UGC API com `shareMediaCategory: 'DOCUMENT'`.
4. O resultado no feed é o carrossel de alta conversão oficial do LinkedIn.

---

## 2. X / Twitter API v2: PKCE & Threads

A API v2 do X exige:
- OAuth 2.0 com **PKCE** (RFC 7636) obrigatório para clientes confidenciais e públicos em endpoints de escrita (`/2/tweets`).
- `code_verifier`: string aleatória de 43 a 128 caracteres (Base64URL-safe).
- `code_challenge`: SHA-256 do `code_verifier` em Base64URL sem padding.
- Threads: Cada tweet subsequente deve especificar `reply.in_reply_to_tweet_id` apontando para o ID retornado pelo tweet anterior.

---

## 3. Conformidade Clean-Room

- Toda a lógica de requisição HTTP utiliza `fetch` nativo com `headers` e `body` puros.
- Criptografia simétrica com chave de 32 bytes gerenciada via variável de ambiente `ENCRYPTION_KEY` e algoritmo `aes-256-gcm`.
- Nenhuma dependência AGPL do Postiz é utilizada.
