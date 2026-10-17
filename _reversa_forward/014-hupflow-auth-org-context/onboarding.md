# Guia de Onboarding & Verificação Manual: Autenticação & Contexto de Organização

> Feature: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  

---

## 1. Objetivo do Teste

Validar o fluxo completo de autenticação e proteção de rotas no HupFlow:
1. Visualizar as telas de Login (`/login`) e Cadastro (`/register`).
2. Testar o seletor de Workspace ativo no dashboard.
3. Verificar a blindagem de rotas: uploads e deleções usam exclusivamente o `organizationId` da sessão.

---

## 2. Passo a Passo

1. **Acessar as Telas de Autenticação:**
   - Navegue até `http://localhost:3000/login`.
   - Observe o layout premium em Dark Mode com campos de e-mail e senha, botão de entrar e link para cadastro.
   - Navegue até `http://localhost:3000/register` e observe o formulário de criação de conta com nome, e-mail, senha e nome do workspace inicial.

2. **Verificar Seletor de Workspace no Dashboard:**
   - No dashboard (`http://localhost:3000/dashboard`), observe o botão do Workspace no topo da barra lateral.
   - Clique nele para abrir o dropdown de workspaces.
   - Veja o workspace ativo destacado com checkmark e a opção de criar/alternar organizações.

3. **Verificar Blindagem da API de Mídias:**
   - Dispare uma requisição de upload através do modal na Biblioteca de Mídias (`/media`).
   - Verifique que a chave gerada e gravada no banco adota estritamente o `organizationId` resolvido pelo `getAuthContext`, e não qualquer parâmetro injetado no body.
