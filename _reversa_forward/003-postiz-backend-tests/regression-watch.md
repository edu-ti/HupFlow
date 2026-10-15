# Regression Watch: Suíte Inicial de Testes Unitários no Postiz Backend

> Feature: `003-postiz-backend-tests`  
> Data: `2026-10-14`  

## 1. Itens em Vigilância de Regressão

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W006 | `postiz-app-main/apps/backend/src/services/auth/auth.middleware.spec.ts` | O arquivo de teste do AuthMiddleware deve permanecer no repositório e passar com 100% de sucesso | presença | Exclusão do arquivo ou quebra na asserção de 403 para requisição sem auth |
| W007 | `postiz-app-main/libraries/nestjs-libraries/src/user/org.from.request.spec.ts` | O teste unitário do decorator deve extrair request.org fielmente do contexto | presença | Exclusão do teste ou alteração do contrato do decorator |

## 2. Observações

- A suíte de testes não introduz dependências de banco de dados real em tempo de execução de testes unitários.

## 3. Histórico de re-extrações

*(Vazio. Será preenchido nas próximas execuções de `/reversa` sobre o repositório)*

## 4. Arquivadas

*(Nenhum item arquivado)*
