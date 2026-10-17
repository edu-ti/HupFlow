# Requisitos: Conectores Oficiais LinkedIn Marketing API & X (Twitter) API v2

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data de início: `2026-10-16`  
> Cenário: `greenfield` (Clean-Room HupFlow, sem dependências AGPL)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/04-social-connectors.md`, `_reversa_sdd/postiz-backend-api/contracts.md`)  

---

## 1. Visão Geral e Propósito

Esta feature consolida a integração oficial com as duas maiores plataformas profissionais e de microblogging do ecossistema moderno: **LinkedIn** e **X (Twitter)**.
O HupFlow já conta com o Estúdio de Carrosséis 2D (Fabric.js + jsPDF) e gerador de PDFs nativos para carrosséis do LinkedIn.
Esta feature entrega a infraestrutura completa de:
1. **LinkedIn Marketing API (v2 / REST)**:
   - OAuth 2.0 Authorization Code Flow com escopos `openid`, `profile`, `email`, `w_member_social`.
   - Publicação de postagens em texto simples e links.
   - Publicação de imagens individuais (PNG/JPG).
   - **Upload & Publicação de Documentos PDF Nativos (LinkedIn Carrossel Document)**: registro do asset via `restli` API, upload do stream binário e anexação com título customizado, viabilizando a publicação direta do PDF gerado no estúdio.
2. **X / Twitter API v2**:
   - OAuth 2.0 Authorization Code Flow com **PKCE** (`code_verifier` e SHA-256 `code_challenge`).
   - Escopos: `tweet.read`, `tweet.write`, `users.read`, `offline.access`.
   - Publicação de posts simples e **Threads encadeadas** (`in_reply_to_tweet_id`).
   - Upload de mídias (Chunked Media Upload v1.1) associado ao tweet v2.
3. **Criptografia & Isolamento Multi-Tenant**:
   - Armazenamento em `social_accounts` com tokens criptografados em **AES-256-GCM**.
   - Verificação de cotas da organização em tempo real via `checkResourceQuota` (Feature 017).
   - Renovação automática e transparente de Refresh Tokens expirados.
4. **Clean-Room Compliance**:
   - Zero código derivado ou vinculado à licença AGPL v3 (Postiz blindado).
   - Comunicação REST nativa via `fetch` puro e Node `crypto`.

---

## 2. Requisitos Funcionais (RF)

- **RF-01 (LinkedIn Auth)**: Gerar URL de autorização OAuth 2.0 para LinkedIn com `state` anti-CSRF e trocar `code` por Access Token e Refresh Token.
- **RF-02 (LinkedIn Text & Image Publish)**: Publicar posts de texto e imagens na UGC Posts API do LinkedIn.
- **RF-03 (LinkedIn Native PDF Carousel)**: Suportar upload de documentos PDF (carrosséis) via LinkedIn Media API em 3 etapas (`initializeUpload`, PUT binário, `createPost` com categoria `DOCUMENT`), permitindo que arquivos gerados pelo Estúdio do HupFlow sejam publicados diretamente como carrosséis interativos no LinkedIn.
- **RF-04 (X/Twitter OAuth 2.0 PKCE)**: Implementar fluxo PKCE compatível com os requisitos rígidos da API v2 do X, gerando `code_verifier` e `code_challenge` criptográficos.
- **RF-05 (X/Twitter Threads)**: Suportar publicação encadeada de múltiplos tweets sequenciais (threads) respeitando o limite de 280 caracteres por nó.
- **RF-06 (Conexão & Cotas de Contas)**: Endpoint REST `/api/connectors/accounts` para listar, conectar e desconectar contas sociais da organização, validando o limite máximo de contas permitidas pelo plano contratado (`checkResourceQuota`).
- **RF-07 (Interface de Conexão)**: Página `/accounts` no dashboard conectada à API real, com botões de conexão OAuth, badges de status e botão de desconexão.

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF-01 (Segurança de Credenciais)**: Todo Access Token e Refresh Token deve ser armazenado na coluna `encryptedAccessToken` utilizando cifra `aes-256-gcm` com Initialization Vector (IV) e Authentication Tag únicos por registro.
- **RNF-02 (Resiliência & Offline Dev)**: Em ambiente de desenvolvimento ou testes quando `LINKEDIN_CLIENT_ID` ou `X_CLIENT_ID` não estiverem configurados, os conectores devem operar em modo sandbox simulado, retornando URNs/IDs mockados válidos para não bloquear a experiência do usuário.
- **RNF-03 (TypeScript Strict)**: Todas as chamadas, payloads, URNs e respostas de erro devem ser estritamente tipadas.

---

## 4. Regras de Negócio (RN)

- **RN-01**: Antes de salvar uma nova conta na tabela `social_accounts`, o sistema deve consultar a contagem atual de contas da organização e invocar `checkResourceQuota(plan, 'socialAccounts', currentUsage)`. Se exceder, retornar erro HTTP 403 Forbidden com motivo legível.
- **RN-02**: Posts publicados no X com mais de 280 caracteres devem ser automaticamente particionados em nós encadeados de thread, ou rejeitados antes do envio caso o modo thread esteja desativado.
- **RN-03**: No LinkedIn, a publicação de documentos PDF exige título legível (`title`) que será exibido no player de carrossel da plataforma.

---

## 5. Rastreabilidade com SDD & Legado

- **SDD**: `_reversa_sdd/sdd/04-social-connectors.md` (LinkedIn & Twitter Conformance).
- **Contratos**: `_reversa_sdd/postiz-backend-api/contracts.md#social-accounts`.
- **Governança**: `_reversa_sdd/addenda/017-hupflow-stripe-billing-subscriptions.md` (integração com cotas de plano).
