# Investigação Técnica — Feature 050: Produção & Orquestração Docker

## 1. Estrutura do Next.js 15 Standalone
- O Next.js 15 permite a configuração `output: "standalone"` em `next.config.ts` (ou `next.config.mjs`), que copia automaticamente apenas os arquivos estritamente necessários para produção na pasta `.next/standalone`, reduzindo a imagem Docker de ~1.2 GB para menos de 180 MB.
- O Dockerfile multi-stage deve usar:
  1. `deps`: Instalação de dependências via `npm ci`.
  2. `builder`: Build estático com `npm run build`.
  3. `runner`: Imagem mínima `node:20-alpine` com usuário não-root `nodejs:nextjs` por motivos de segurança corporativa.

## 2. Docker Compose & Serviços Essenciais
- As portas mapeadas no `docker-compose.yml`:
  - `3000:3000` -> HupFlow Next.js App
  - `5432:5432` -> PostgreSQL 16
  - `6379:6379` -> Redis 7 Alpine
  - `9000:9000` (API) e `9001:9001` (Console) -> MinIO Local S3 / Cloudflare R2
- Healthchecks declarados com `pg_isready` e `redis-cli ping` garantem ordem determinística de inicialização com `depends_on: { condition: service_healthy }`.

## 3. Verificação de Saúde do Sistema (Healthcheck Engine)
- Módulo puro `evaluateSystemHealth` capaz de validar a integridade dos subsistemas essenciais sem derrubar a aplicação caso um serviço secundário esteja indisponível.
