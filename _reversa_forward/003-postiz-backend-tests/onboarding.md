# Onboarding: Execução da Suíte de Testes no Postiz Backend

> Feature: `003-postiz-backend-tests`  
> Data: `2026-10-14`  

## 1. Como Executar os Testes

No diretório `postiz-app-main`:

```bash
# Executar a suíte de testes do AuthMiddleware
pnpm test apps/backend/src/services/auth/auth.middleware.spec.ts
```

Ou no diretório `postiz-app-main/apps/backend`:
```bash
npx jest src/services/auth/auth.middleware.spec.ts
```

## 2. Cenários Validados

1. **Rejeição sem auth header/cookie**: Deve falhar com 403.
2. **Rejeição com JWT inválido**: Deve falhar com 403.
3. **Rejeição para usuário não ativado (`activated: false`)**: Deve falhar com 403.
4. **Rejeição para usuário sem organizações ativas**: Deve falhar com 403.
5. **Sucesso no isolamento normal de tenant**: `req.org` recebe a organização primária do usuário.
6. **Seleção de tenant via `showorg`**: `req.org` recebe a organização solicitada se o usuário for membro.
7. **Proteção contra tentativa de usurpação de tenant**: `showorg` de tenant alheio é ignorado.
8. **Impersonação de SuperAdmin**: SuperAdmin ganha contexto de usuário e organização impersonados.
