# Investigação Técnica: White-Label Client Portals & External Approvals

## 1. Arquitetura de Acesso Magic-Link (`/portal/[token]`)
- Clientes externos de agências não possuem (nem desejam ter) conta na tabela `users` do Better-Auth.
- O acesso é concedido via **Capability Token** (`ptl_<24_chars_base62>`) na rota pública `src/app/portal/[token]/page.tsx`.
- Caso a agência configure um `accessPin` (4 a 6 dígitos numéricos), a API pública exige o cabeçalho/parâmetro `x-portal-pin` ou validação no formulário antes de liberar as ações de aprovação.

## 2. Máquina de Estados de Entregas do Portal (`PortalDeliverableStatus`)
Cada item submetido ao portal (`PortalDeliverable`) transita entre:
- `pending_review`: Aguardando avaliação do cliente.
- `approved`: Aprovado pelo cliente externo (registra `reviewedBy`, `reviewedAt`, `feedbackNote`).
- `changes_requested`: Cliente solicitou ajustes (exige comentário explicativo `feedbackNote` com pelo menos 3 caracteres para evitar rejeições vazias).

## 3. Personalização White-Label Dinâmica
- A cor primária da marca (`brandColor`, ex: `#6366F1`, `#10B981`, `#EC4899`, `#F59E0B`) é validada por regex hexadecimal (`isValidHexColor`) e aplicada aos botões de ação, selos e cabeçalho do portal público.
- A flag `hideHupflowBranding` permite ocultar o rodapé "Powered by HupFlow Clean Studio" para agências Enterprise/Agency.
