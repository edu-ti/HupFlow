# Dúvidas e Premissas Assumidas: 003-postiz-backend-tests

## 1. Dúvidas Convertidas em Premissas

### D01: Configuração do Test Runner (Jest vs Vitest)
- **Dúvida**: Qual test runner utilizar para a suíte do backend?
- **Premissa Assumida**: O `package.json` de `postiz-app-main` já define o comando `"test": "jest ..."` e `nx/jest` configurado em `jest.config.ts`. Portanto, a suíte de testes unitários é implementada como arquivos `.spec.ts` compatíveis com o Jest e `@nestjs/testing`.
