# Roadmap: Conectores Oficiais da Meta (Instagram & Threads)

> Identificador: `010-hupflow-instagram-threads-connectors`  
> Data: `2026-10-15`  
> Requirements: `_reversa_forward/010-hupflow-instagram-threads-connectors/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica implementa os dois conectores da Meta utilizando chamadas HTTP nativas com a API Fetch do Node.js, dispensando SDKs externos pesados e evitando dependências vulneráveis.
Para o **Instagram**, o conector implementa a autenticação OAuth 2.0 PKCE para obter o `access_token` inicial, troca-o imediatamente pelo token de longa duração (60 dias) e segue a especificação da Meta Graph API em dois passos: criação de container de mídia (`POST /{user-id}/media`) com verificação de status (`GET /{container-id}`) e subsequente publicação (`POST /{user-id}/media_publish`).
Para o **Threads**, o conector utiliza os novos endpoints da Threads API lançados pela Meta (`POST /v1.0/{threads-user-id}/threads` com `media_type=TEXT` e `POST /v1.0/{threads-user-id}/threads_publish`).
Ambos os conectores são registrados no `connectors/index.ts` e consumidos diretamente pelo Worker do BullMQ, garantindo disparo idempotente e tolerância a falhas.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL** | Código 100% original, baseado exclusivamente na documentação pública oficial dos desenvolvedores da Meta. | Respeita 🟢 |
| **Segurança em Repouso** | Todos os tokens passam pela função `encrypt()` antes de serem salvos no banco PostgreSQL. | Respeita 🟢 |
| **Isolamento de Falhas** | O disparo em múltiplos canais é isolado; falhas na Meta não abortam o envio para LinkedIn ou X. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Uso de fetch nativo para Graph API da Meta | Zero dependências externas; simplifica manutenção e reduz bundle. | `facebook-nodejs-business-sdk` (pesado, overhead de classes e tipos complexos). | 🟢 |
| **D-02** | Token de longa duração obtido automaticamente | Evita que o usuário precise reautenticar a cada poucas horas; duração de 60 dias. | Usar token curto e forçar login frequente. | 🟢 |
| **D-03** | Modo simulado inteligente para desenvolvimento | Permite testar todo o fluxo do sistema localmente sem exigir cadastro prévio de App no portal Meta Developers. | Bloquear o sistema se as chaves de API não estiverem no `.env`. | 🟢 |
| **D-04** | Polling assíncrono para status do container do Instagram | Vídeos e imagens de alta resolução levam alguns segundos para serem validados pela Meta antes de estarem prontos para publicação. | Tentar publicar imediatamente (causaria erro 500 intermitente). | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| Contas de Instagram do usuário são do tipo Professional / Creator | RN-01 | Baixo; documentado explicitamente na interface de conexão de contas. |
| Imagens publicadas no Instagram estão acessíveis via URL pública (CDN / R2) | RN-01 / RF-01 | Médio; imagens locais devem ser enviadas para o bucket de storage antes do disparo. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `InstagramConnector` | `_reversa_sdd/sdd/06-social-connectors.md` | Componente Novo | Conector Graph API para Instagram Feed/Carrossel. |
| `ThreadsConnector` | `_reversa_sdd/sdd/06-social-connectors.md` | Componente Novo | Conector oficial Threads API da Meta. |
| `connectors/index.ts` | `_reversa_sdd/sdd/06-social-connectors.md` | Contrato Alterado | Inclusão de `instagram` e `threads` no registry de provedores. |

---

## 6. Delta no modelo de dados

Nenhuma mudança estrutural no banco de dados. A tabela `social_accounts` já possui suporte ao campo `provider` (`text`) e tokens criptografados (`encrypted_access_token`).
Detalhe completo em: `_reversa_forward/010-hupflow-instagram-threads-connectors/data-delta.md`.

---

## 7. Delta de contratos externos

Nenhum contrato interno alterado. O consumo dos endpoints externos da Meta é abstraído pelo `SocialConnector`.

---

## 8. Plano de migração

Não aplicável (feature greenfield nova no HupFlow).

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Rate limit da Graph API da Meta (200 chamadas/hora por usuário) | Médio | Baixo | BullMQ com backoff exponencial e fila com controle de concorrência. |
| URL de imagem privada ou inacessível pela Meta | Alto | Baixo | Validação prévia da URL antes de enviar a requisição de container. |

---

## 10. Critério de pronto

- [ ] Classe `InstagramConnector` implementada e testada.
- [ ] Classe `ThreadsConnector` implementada e testada.
- [ ] Ambos os conectores registrados em `getSocialConnector`.
- [ ] Worker do BullMQ validado para disparo em canais do Instagram e Threads.
- [ ] Teste unitário de mock validado com sucesso.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
