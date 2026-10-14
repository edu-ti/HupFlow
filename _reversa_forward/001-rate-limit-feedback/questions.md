# Dúvidas e Premissas Assumidas: 001-rate-limit-feedback

Este documento registra as dúvidas identificadas durante a definição de requisitos que foram convertidas automaticamente em premissas de implementação conforme o modo autônomo (`doubts: file`).

## 1. Dúvidas Convertidas em Premissas

### D01: Fallback para BYOK (Bring Your Own Key) em caso de Rate Limit
- **Dúvida**: Quando o rate limit do IP for atingido no Upstash KV, a aplicação deve tentar imediatamente usar a `apiKey` pessoal fornecida pelo usuário no `keys-context`?
- **Premissa Assumida**: Nesta primeira iteração da feature, o foco é o contrato explícito de erro e feedback visual transparente ao usuário. Caso o rate limit seja atingido, a interface notifica com precisão o tempo de espera. Em uma feature futura de evolução, o cliente poderá acionar o gerador local do `langchain.ts` com a chave privada se ela estiver preenchida.
- **Impacto no Código**: A Server Action retorna `{ success: false, reason: "rate_limit", reset: number, message: string }`, e a UI informa o usuário com clareza.
