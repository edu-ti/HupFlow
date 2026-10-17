# Requisitos: White-Label Client Portals & External Approvals

> Identificador: `033-hupflow-white-label-client-portals`  
> Data: `2026-10-17`  
> Autor: Antigravity (Reversa Autonomous Pipeline)  
> Status: Aprovado  

---

## 1. Contexto & Proposta de Valor
Agências de marketing digital, estúdios de social media e consultores enfrentam uma grande fricção ao aprovar cronogramas de posts e carrosséis com clientes finais: enviar planilhas, PDFs no WhatsApp ou exigir que o cliente crie uma conta e senha na plataforma da agência gera atrasos e baixa adesão.

O **HupFlow White-Label Client Portals** resolve esse gargalo oferecendo:
1. **Portal Externo Sem Fricção de Login (`/portal/[token]`)**: Link seguro com token criptográfico de alta entropia (e proteção opcional por PIN de 4-6 dígitos), onde o cliente final visualiza apenas as peças pendentes e aprovadas da sua marca.
2. **Branding White-Label Customizável**: Cabeçalho com nome do cliente, logotipo da agência/cliente, cor primária da marca (`brandColor`), mensagem de boas-vindas e opção de ocultar a assinatura "Powered by HupFlow" (para planos Agency).
3. **Aprovação e Pedido de Ajuste em 1 Clique**: O cliente externo pode clicar em **"Aprovar Publicação"** ou **"Solicitar Alteração"** diretamente em cada card de carrossel/post, registrando seu nome, feedback estruturado e carimbo de data/hora.
4. **Métricas de Aprovação & SLA do Portal**: Taxa de aprovação do cliente, tempo médio de resposta, total de itens aprovados vs. em revisão.
5. **Painel Gerencial `/settings/portals`**: Criação de múltiplos portais por cliente/projeto, regeneração de link mágico (`token`), configuração de branding, simulador ao vivo (`ClientPortalPreview.tsx`) e acompanhamento de feedbacks recebidos.

---

## 2. Requisitos Funcionais (RF)
- **RF-001**: O sistema deve armazenar portais de clientes (`client_portals`) vinculados ao `organization_id`, contendo: `id`, `clientName`, `projectTitle`, `token` (único, URL-safe), `brandColor`, `logoUrl`, `welcomeMessage`, `accessPin` (opcional), `hideHupflowBranding` (boolean), `isActive` (boolean) e lista de entregas/itens (`deliverables`) com status (`pending_review`, `approved`, `changes_requested`).
- **RF-002**: O gerador de tokens (`generatePortalToken`) deve produzir tokens URL-safe com prefixo `ptl_` e alta entropia criptográfica, além de sanitizar e validar códigos PIN opcionais (`validatePortalPin`).
- **RF-003**: A rota pública `/portal/[token]` (e sua API `/api/portals/public/[token]`) deve retornar os dados do portal sem exigir sessão Better-Auth, validando o PIN caso o portal possua proteção por código.
- **RF-004**: O endpoint público `POST /api/portals/review` deve permitir ao cliente aprovar (`approved`) ou pedir ajustes (`changes_requested`) em um item do portal, anexando comentário (`feedbackNote`) e nome do aprovador (`reviewerName`), atualizando o status da entrega de forma atômica.
- **RF-005**: No dashboard (`/settings/portals`), membros do workspace (`member` / `admin` / `owner`) podem criar portais, adicionar/editar entregas para revisão, copiar o link público `/portal/[token]` em 1 clique e visualizar o portal no componente `ClientPortalPreview.tsx`.

---

## 3. Requisitos Não-Funcionais (RNF)
- **RNF-001 (Clean-Room & Zero AGPL)**: Implementação 100% autoral em TypeScript, sem dependências restritivas.
- **RNF-002 (Isolamento Multi-Tenant & Segurança de Token)**: Tokens de portal únicos e não sequenciais; revogação instantânea via `isActive = false` ou rotação de token.
- **RNF-003 (Tipagem Estrita)**: Conformidade 100% validada via `npx tsc --noEmit`.
