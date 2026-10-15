# Dúvidas e Premissas Assumidas: 002-byok-fallback

## 1. Dúvidas Convertidas em Premissas

### D01: Persistência e Segurança da Chave no Browser
- **Dúvida**: A chave informada pelo usuário deve ser persistida localmente no navegador?
- **Premissa Assumida**: O hook `use-keys.tsx` e o `KeysContext` da arquitetura legado já foram concebidos com armazenamento em `localStorage` ou estado de sessão. A chave nunca é enviada ao backend nas Server Actions, permanecendo restrita à invocação direta do SDK OpenAI no browser.
