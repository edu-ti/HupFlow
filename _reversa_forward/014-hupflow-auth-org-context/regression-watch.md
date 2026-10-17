# Regression Watch: Autenticação, Sessões Better-Auth & Contexto Multi-Tenant de Organização

> Identificador: `014-hupflow-auth-org-context`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/01-auth-multitenant.md`)  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W011 | `requirements.md#RN-01` | O `organizationId` NUNCA deve ser aceito a partir do corpo da requisição JSON em rotas protegidas; deve ser derivado da sessão do usuário | Presença | Rota de API protegida aceitando `organizationId` arbitrário do body da requisição |
| W012 | `requirements.md#RN-02` | Operações de leitura, atualização ou exclusão devem incluir filtro explícito por `organizationId` para mitigar BOLA | Presença | Consulta `delete` ou `update` no Drizzle sem cláusula `eq(table.organizationId, activeOrgId)` |
| W013 | `requirements.md#RN-03` | Em ambiente de produção (`NODE_ENV === 'production'`), requisições sem cookie de sessão válido devem receber HTTP 401 | Comportamento | Resolução de sessão retornando tenant mock ou dados em produção quando a requisição não possui credenciais |

---

## 2. Observações

- **RF-01**: Helper `getAuthContext` testado via suíte automatizada `session.test.ts`.
- **RF-02**: Rotas `/api/media/presign`, `/api/media/confirm` e `/api/media` inspecionadas e blindadas contra spoofing de tenant.
- **RF-03**: Rotas `/api/ai/carousel` e `/api/ai/copywriter` blindadas com `requireAuthContext`.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
