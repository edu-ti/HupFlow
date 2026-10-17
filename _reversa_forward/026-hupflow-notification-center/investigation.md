# Investigação Técnica: Central de Notificações In-App

> Identificador: `026-hupflow-notification-center`  
> Data: `2026-10-16`  

---

## 1. Análise da Arquitetura Atual

1. **Top Navbar Existente (`layout.tsx`)**:
   - O cabeçalho possui área de navegação à esquerda e bloco de status/perfil à direita (`AES-256 Safe` e avatar `HF`).
   - O componente de Notificações (`NotificationBell`) deve ser inserido entre o selo e o avatar, com popover posicionado de forma absoluta (`right-0 mt-2 z-50`) com backdrop dismiss (clicar fora fecha).

2. **Isolamento de Usuário & Organização**:
   - Cada notificação pertence a um `userId` e está restrita ao contexto da `organizationId` ativa.
   - Um usuário em múltiplos workspaces verá apenas as notificações referentes ao workspace selecionado no seletor.

3. **Performance & Polling Eficiente**:
   - A listagem inicial busca as notificações recentes e a contagem de não lidas via `GET /api/notifications`.
   - Marcação de leitura via `PATCH /api/notifications` atualiza o estado local imediatamente (otimista) e confirma no backend via SQL atômico.
