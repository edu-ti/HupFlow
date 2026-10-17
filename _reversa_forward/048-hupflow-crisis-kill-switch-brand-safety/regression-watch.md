# Pontos de Atenção & Monitoramento de Regressão — Feature 048

## W100 — Prevenção de Avalanche na Retomada (Post Avalanche Effect)
- **Risco**: Quando um Kill Switch fica ativado por várias horas ou dias, dezenas de publicações agendadas acumulam e vencem. Se a fila for despausada de forma ingênua, todas as publicações vencidas seriam disparadas simultaneamente para as APIs das redes sociais, gerando bloqueios por rate limit ou constrangimento público.
- **Salvaguarda**: `reconcileFrozenPostsOnResume` exige escolha de estratégia explícita (`hold_for_review` ou `reschedule_next_day`), retendo os posts vencidos para revisão manual antes de qualquer envio.

## W101 — Validação de Permissão RBAC Estrita (Admin Only)
- **Risco**: Membros sem autorização da diretoria pausarem a agência por engano ou atacantes abusarem do endpoint para negar serviço.
- **Salvaguarda**: A rota `/api/brand-safety/kill-switch` exige papel mínimo de `admin` via `requireOrgRole(req, 'admin')` e exige a digitação exata da frase de confirmação `"CONFIRMAR PAUSA"`.
