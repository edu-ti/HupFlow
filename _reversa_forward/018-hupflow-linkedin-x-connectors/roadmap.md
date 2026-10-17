# Roadmap: Conectores Oficiais LinkedIn Marketing API & X (Twitter) API v2

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data: `2026-10-16`  
> Requisitos: `_reversa_forward/018-hupflow-linkedin-x-connectors/requirements.md`  

---

## Fases de Execução

### Fase 1, Preparação
- [ ] Refinar `types.ts` com suporte a `documentUrl`, `documentTitle`, `threadNodes`, `isThread` e `SocialAccountItem`.
- [ ] Criar utilitário criptográfico PKCE em `src/lib/connectors/pkce.ts` (`generateCodeVerifier`, `generateCodeChallenge`).

### Fase 2, Testes (TDD)
- [ ] Criar testes unitários em `src/lib/connectors/connectors.test.ts` validando:
  - Geração e verificação matemática de hashes PKCE (RFC 7636).
  - Particionamento inteligente de threads de tweets (>280 caracteres).
  - Payload UGC e Documentos PDF do LinkedIn.
  - Bloqueio de conexão de contas ao atingir o teto de cota do plano.

### Fase 3, Núcleo dos Conectores & APIs
- [ ] Implementar suporte completo a Documentos PDF e URN de autor em `linkedin.ts`.
- [ ] Implementar publicação de Threads com encadeamento de IDs e OAuth 2.0 PKCE em `x-twitter.ts`.
- [ ] Criar rotas `/api/connectors/accounts` (`GET` para listar contas conectadas, `POST` para conectar validando cota do plano via `checkResourceQuota`, `DELETE` para desconectar).
- [ ] Criar rota unificada de publicação `/api/connectors/publish` (`POST`) para despacho direto ou teste de canal.

### Fase 4, Integração Frontend
- [ ] Atualizar tela `/accounts` (`src/app/(dashboard)/accounts/page.tsx`) com dados reais da API, badges de status, alerta de cota de plano atingida e modal de conexão rápida.

### Fase 5, Polimento & Governança
- [ ] Executar suíte completa de testes com `tsx`.
- [ ] Executar validação estática `tsc --noEmit` em todo o workspace.
- [ ] Gerar `legacy-impact.md`, `regression-watch.md` e adendo em `_reversa_sdd/addenda/018-hupflow-linkedin-x-connectors.md`.
- [ ] Sincronizar `.reversa/active-requirements.json`, `state.json` e `SESSION_HANDOFF.md`.
