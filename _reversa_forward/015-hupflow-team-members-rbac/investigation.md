# Investigation: Padrões de RBAC, Gestão de Membros e Convites em SaaS Multi-Tenant

> Identificador: `015-hupflow-team-members-rbac`  
> Data: `2026-10-16`  

---

## 1. Contexto e Motivação

Plataformas SaaS de marketing e mídia social (como Buffer, Hootsuite e Postiz) operam com times multidisciplinares: agências, redatores freelancers e clientes corporativos.
Para que a colaboração seja segura e eficiente, o HupFlow precisa de um modelo de RBAC (Role-Based Access Control) que:
1. Garanta isolamento absoluto entre organizações.
2. Evite que criadores de conteúdo ou clientes acessem faturamento ou configurem conexões sensíveis de redes sociais.
3. Permita convidar pessoas sem fricção, mesmo antes de o serviço de envio de e-mails em produção estar configurado (cópia direta do link de convite com token).

---

## 2. Análise de Alternativas Avaliadas

### Alternativa A: CASL / ABAC Dinâmico em Tempo de Execução
- **Descrição:** Regras granulares de atributo armazenadas em JSON e avaliadas a cada ação (`can('update', 'Post')`).
- **Pontos Positivos:** Extrema flexibilidade para regras condicionais complexas.
- **Pontos Negativos:** Alto overhead computacional, complexidade desnecessária para o estágio atual do produto e maior probabilidade de bugs de permissão.
- **Decisão:** Rejeitada para o MVP. O modelo RBAC hierárquico atende 100% dos casos de uso com código previsível e auditável.

### Alternativa B: RBAC Hierárquico Centralizado (Abordagem Escolhida)
- **Descrição:** 4 papéis canônicos (`owner`, `admin`, `member`, `viewer`) com pesos numéricos e helpers puros `hasMinRole(userRole, requiredRole)`.
- **Pontos Positivos:** Desempenho em nanossegundos, tipagem forte no TypeScript, testes unitários triviais e total aderência ao Better-Auth e Drizzle ORM.
- **Decisão:** **Aprovada.**

---

## 3. Padrão de Segurança para Convites (Tokens Opaque)

Para o fluxo de convites:
- Utilizamos UUIDv4 gerados no servidor e persistidos na coluna `id` da tabela `invitations`.
- O link de convite toma o formato: `/accept-invite?token=<INVITATION_UUID>`.
- O endpoint de aceite valida:
  1. Se o convite existe.
  2. Se o status é `pending`.
  3. Se a data atual não ultrapassa `expiresAt` (janela padrão de 7 dias).
  4. Se o usuário já pertence à organização (evita duplicatas na tabela `members`).
  5. Se aceito, atualiza o status para `accepted` e cria o vínculo em `members`.

---

## 4. Referências

- Matriz de Permissões: `_reversa_sdd/permissions.md`
- OWASP API Security Top 10 - Broken Function Level Authorization (BFLA)
- Better-Auth Organizations Plugin Documentation
