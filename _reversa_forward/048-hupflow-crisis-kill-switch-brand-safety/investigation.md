# Investigação Técnica — Feature 048: Kill Switch & Brand Safety

## 1. Análise do Fluxo Existente de Postagens e Agendamento
- Atualmente, as publicações agendadas dependem de rotas como `/api/scheduler`, `/api/composer` e serviços de postagem nos conectores (`meta`, `linkedin`, `twitter`, `vertical`).
- Para garantir que nenhuma publicação seja disparada durante uma crise de marca, o estado de segurança deve ser consultável em $O(1)$ tanto em memória quanto no banco PostgreSQL através de `isOrganizationInCrisisMode(organizationId)`.

## 2. Padrão de Bloqueio Seguro (Brand Safety Guard)
- Função pura `evaluateBrandSafetyStatus` para verificar se um post individual ou lote tem autorização de envio.
- Proteção contra "Descongelamento em Avalanche" (Post Avalanche): quando uma agência desativa o kill switch após 48 horas de crise, posts antigos com horários passados não devem ser postados todos juntos. Em vez disso, o sistema deve converter posts vencidos para status `held_for_review` ou postergar suas datas.

## 3. Segurança & Permissões (RBAC)
- A ativação do Kill Switch requer papel mínimo de `admin` ou `owner` (`requireOrgRole(req, 'admin')`).
- Visualizadores (`viewer`) e membros normais (`member`) podem visualizar o estado e os logs de crise, mas não têm permissão para pausar ou restaurar o envio da agência.
