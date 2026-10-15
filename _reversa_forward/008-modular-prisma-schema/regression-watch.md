# Regression Watch: Modularização do schema.prisma Monolítico (GAP-MOD-02)

> Feature: `008-modular-prisma-schema`  
> Data: `2026-10-15`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|---|---|---|---|---|
| W016 | `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema/` | Os 8 arquivos de sub-esquemas modulares devem ser mantidos e refletir as alterações de novos modelos por domínio | presença | Remoção do diretório `schema/` ou edição exclusiva no arquivo consolidado sem sincronização |
| W017 | `postiz-app-main/libraries/nestjs-libraries/src/database/prisma/schema.prisma` | A contagem consolidada deve preservar todos os 90 modelos e 11 enums com a flag `previewFeatures = ["prismaSchemaFolder"]` ativa | presença | Divergência entre os arquivos de domínio e o schema unificado |

## 2. Observações

- A execução de `pnpm run prisma-bundle` é recomendada antes de qualquer `prisma-generate` ou `prisma-db-push`.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
