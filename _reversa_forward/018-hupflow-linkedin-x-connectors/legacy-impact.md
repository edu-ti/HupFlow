# Legacy Impact: Conectores Oficiais LinkedIn Marketing API & X (Twitter) API v2

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data: `2026-10-16`  
> Política de edição: `allowLegacyEdits: true` (liberado em `allowedPaths: ["hupflow/**"]`)  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/04-social-connectors.md`, `_reversa_sdd/postiz-backend-api/contracts.md`)  
> Nota: Feature greenfield em ambiente clean-room, sem legado pré-existente.  

---

## 1. Mapeamento de Arquivos e Impacto

| Arquivo afetado | Componente SDD | Tipo | Severidade | Justificativa |
|-----------------|----------------|:----:|:----------:|---------------|
| `hupflow/src/lib/connectors/types.ts` | `sdd/04-social-connectors` | `modificado` | LOW | Tipos estendidos com `documentTitle`, `isThread`, `threadNodes` e `SocialAccountSummary`. |
| `hupflow/src/lib/connectors/pkce.ts` | `sdd/04-social-connectors` | `componente-novo` | MEDIUM | Utilitário criptográfico RFC 7636 e particionador de nós de threads do X. |
| `hupflow/src/lib/connectors/connectors.test.ts` | `sdd/04-social-connectors` | `componente-novo` | LOW | Testes unitários para PKCE, particionador de threads e publicação de carrosséis PDF. |
| `hupflow/src/lib/connectors/linkedin.ts` | `sdd/04-social-connectors` | `modificado` | HIGH | Implementação de publicação UGC e upload de documentos PDF nativos para carrosséis LinkedIn. |
| `hupflow/src/lib/connectors/x-twitter.ts` | `sdd/04-social-connectors` | `modificado` | HIGH | Implementação de OAuth 2.0 PKCE real e publicação encadeada de threads (`in_reply_to_tweet_id`). |
| `hupflow/src/app/api/connectors/accounts/route.ts` | `sdd/04-social-connectors` | `componente-novo` | HIGH | Rotas REST GET, POST (com verificação de cota de plano via `checkResourceQuota`) e DELETE. |
| `hupflow/src/app/api/connectors/publish/route.ts` | `sdd/04-social-connectors` | `componente-novo` | HIGH | Endpoint unificado de publicação com descriptografia AES-256-GCM sob demanda. |
| `hupflow/src/app/(dashboard)/accounts/page.tsx` | `sdd/04-social-connectors` | `modificado` | HIGH | Tela de contas sociais integrada à API com medidor de cotas do plano e tratamento de erros. |

---

## 2. Diff Conceitual por Componente

- **`sdd/04-social-connectors`**:
  - Camada de conectores enriquecida com suporte a documentos PDF no LinkedIn e threads no X.
  - Segurança de tokens mantida através de AES-256-GCM com IV e AuthTag isolados.
  - Integração nativa com a governança de faturamento da Feature 017 (`checkResourceQuota`).

---

## 3. Preservadas

*(Feature greenfield em clean-room, nenhum código legado modificado)*

---

## 4. Modificadas

- Conectores `linkedin.ts` e `x-twitter.ts` elevados a prontidão de produção.
- Interface `/accounts` conectada com backend real e verificação de capacidade.
