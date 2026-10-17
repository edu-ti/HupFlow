# Requisitos: Gestão de Chaves de API Públicas (Public API Keys & Developer Access)

> Identificador: `023-hupflow-public-api-keys`  
> Data de Início: `2026-10-16`  
> Cenário: `greenfield` (Evolução contínua do HupFlow Clean-Room)  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

Desenvolvedores, times técnicos e clientes corporativos do HupFlow necessitam integrar pipelines de CI/CD, scripts em Python/Node.js, ferramentas de linha de comando (CLI) e robôs de automação externa diretamente com o HupFlow sem depender de sessões interativas de navegador.
Esta feature implementa o subsistema de **Chaves de API Públicas (Developer API Keys)** com:
1. **Formato Seguro de Token**: Tokens gerados com formato canônico `hup_live_<prefix_6chars>_<secret_32bytes_hex>` (ex: `hup_live_ab12cd_4f8a...`).
2. **Armazenamento Hashed**: Apenas o hash SHA-256 do token (`key_hash`) e os primeiros 10 caracteres visíveis (`hup_live_ab12cd...`) são persistidos no banco de dados. O segredo completo nunca é armazenado em texto plano e é exibido ao usuário **apenas uma única vez** no momento da criação.
3. **Escopos Granulares (Least Privilege)**:
   - `posts:write`: Criar, agendar e editar publicações.
   - `posts:read`: Listar posts, fila e histórico.
   - `analytics:read`: Consultar métricas de engajamento e KPIs.
   - `media:upload`: Fazer upload de mídias para a biblioteca Cloudflare R2 / S3.
   - `webhooks:manage`: Criar e listar endpoints de webhooks.
4. **Autenticação de Requisições de API**:
   - Header HTTP padrão: `Authorization: Bearer hup_live_...` ou `X-API-Key: hup_live_...`.
   - Rastreamento de `last_used_at` em cada requisição autenticada com sucesso.
5. **Painel Visual para Desenvolvedores (`/settings/keys`)**:
   - Listagem das chaves ativas do workspace, escopos associados, data de criação e data do último uso.
   - Modal de criação com seleção granular de escopos e cópia segura.
   - Revogação imediata (deleção ou `is_active: false`) com confirmação.

---

## 2. Requisitos Funcionais (RF)

- **RF-001**: O sistema deve permitir que usuários administradores (`admin` ou `owner`) gerem novas chaves de API para sua organização (`organizationId`).
- **RF-002**: A chave gerada deve possuir o prefixo `hup_live_`, comprimento mínimo de 48 caracteres e entropia criptográfica via `node:crypto.randomBytes`.
- **RF-003**: O banco de dados deve armazenar apenas o hash SHA-256 da chave, além de seu nome, prefixo legível, escopos autorizados e data de expiração (opcional).
- **RF-004**: O helper `validateApiKeyRequest` deve extrair o token do cabeçalho `Authorization` ou `X-API-Key`, calcular seu hash SHA-256 e validar se a chave está ativa e pertence ao tenant requisitante.
- **RF-005**: As chaves revogadas devem ser imediatamente rejeitadas com HTTP 401 Unauthorized.
- **RF-006**: O endpoint REST `/api/api-keys` deve fornecer `GET`, `POST` e `DELETE`.
- **RF-007**: A tela `/settings/keys` deve fornecer experiência para desenvolvedores, incluindo exemplos prontos em cURL e TypeScript.
- **RF-008**: O menu de navegação do dashboard (`layout.tsx`) deve incluir o atalho "Chaves de API".

---

## 3. Requisitos Não-Funcionais & Clean-Room (RNF)

- **RNF-001 (Clean-Room)**: Implementação 100% nativa em Node.js / TypeScript utilizando `node:crypto` para geração e hashing SHA-256. Proibido o uso de pacotes externos pesados ou serviços fechados.
- **RNF-002 (Isolamento Multi-tenant)**: Uma chave de API só concede acesso aos recursos da organização que a emitiu.
- **RNF-003 (Conformidade TypeScript)**: Zero erros em `npx tsc --noEmit`.
- **RNF-004 (Garantia de Regressão)**: 100% de aprovação na suíte de testes unitários.
