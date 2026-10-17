# Onboarding: Testando Gestão de Membros & RBAC no HupFlow

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  

---

## 1. Pré-requisitos

1. Servidor de desenvolvimento rodando ou testes unitários locais.
2. Organização ativa selecionada no dashboard.

---

## 2. Passo a Passo para Teste Manual

### Cenário 1: Convidar um Novo Membro
1. Abra o navegador em `http://localhost:3000/settings/members`.
2. Observe a lista de membros atuais do workspace (o usuário logado aparece com badge `Owner` ou `Admin`).
3. Clique no botão **"Convidar Membro"**.
4. No modal, insira o e-mail: `criador@agencia.com`.
5. Selecione o papel: **Criador (Member)**.
6. Clique em **"Enviar Convite"**.
7. Verifique que o convite aparece imediatamente na tabela **"Convites Pendentes"**.
8. Clique no botão **"Copiar Link"** ao lado do convite.

### Cenário 2: Aceitar o Convite
1. Abra uma nova aba ou janela anônima e acesse a URL copiada (`/accept-invite?token=...`).
2. A tela exibe o nome da organização que fez o convite e o papel atribuído.
3. Clique em **"Aceitar e Entrar no Workspace"**.
4. O usuário é vinculado com sucesso à organização e redirecionado ao dashboard.

### Cenário 3: Alteração de Papel e Exclusão
1. De volta à tela `/settings/members`, altere o papel do novo membro de `Member` para `Viewer`.
2. Verifique o feedback instantâneo da atualização.
3. Clique no botão de remover membro e confirme no modal de confirmação.
4. O membro deixa de pertencer à organização.
