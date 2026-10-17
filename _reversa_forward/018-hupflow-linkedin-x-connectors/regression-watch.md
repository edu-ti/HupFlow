# Regression Watch: Conectores Oficiais LinkedIn Marketing API & X (Twitter) API v2

> Identificador: `018-hupflow-linkedin-x-connectors`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/04-social-connectors.md`)  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W023 | `requirements.md#RNF-01` | Tokens de autenticação social (LinkedIn e X) devem ser armazenados estritamente criptografados em AES-256-GCM | Presença | Gravação direta de texto puro nas colunas `encryptedAccessToken` ou `encryptedRefreshToken` |
| W024 | `requirements.md#RN-01` | A conexão de novas contas deve invocar `checkResourceQuota` e bloquear adições acima do teto do plano | Comportamento | Conta vinculada sem validação de cotas do plano contratado (retorno 201 quando `allowed: false`) |
| W025 | `requirements.md#RN-02` | Tweets no X não podem ultrapassar 280 caracteres, exigindo particionamento encadeado em threads | Comportamento | Falha na API do X por estouro do limite de 280 caracteres em posts longos |

---

## 2. Observações

- **RF-01**: Fluxo OAuth 2.0 PKCE conforme RFC 7636.
- **RF-02**: Suporte a Documentos PDF de carrossel no LinkedIn.
- **RF-03**: Suporte a Threads no X com `in_reply_to_tweet_id`.
- **RF-04**: Isolamento multi-tenant garantido em todas as rotas de contas sociais.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
