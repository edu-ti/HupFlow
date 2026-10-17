# Regression Watch — Feature 033: White-Label Client Portals & External Approvals

Pontos de vigilância de regressão para monitorar durante a evolução dos portais White-Label e aprovações externas via Magic-Link.

---

### W068: Entropia e Revogação de Capability Tokens (`ptl_...`)
- **Cenário de Risco**: Tokens curtos ou previsíveis permitirem enumeração de portais de outros clientes, ou links antigos continuarem acessíveis após desligamento de contrato.
- **Mecanismo de Proteção**:
  - `generatePortalToken` utiliza `crypto.randomBytes(24)` codificado em Base62 com prefixo `ptl_`.
  - A agência pode rotacionar o token (`regenerateToken: true`) ou desativar o portal (`isActive: false`) a qualquer momento em `/settings/portals`.
- **Verificação**:
  - Testes unitários em `portals.test.ts` garantem comprimento de 28 caracteres, prefixo `ptl_` e não-colisão.

---

### W069: Proteção por PIN Numérico e Vazamento de Entregas
- **Cenário de Risco**: A API pública `/api/portals/public/[token]` retornar a lista de entregas (`deliverables`) antes da validação do `accessPin` quando o portal possui PIN configurado.
- **Mecanismo de Proteção**:
  - Quando `verifyPortalPinAccess` retorna `false`, `getPublicPortalByToken` retorna `pinLocked: true` e esvazia o array `deliverables: []` no servidor antes de serializar a resposta JSON.
- **Verificação**:
  - Asserções de `verifyPortalPinAccess` em `portals.test.ts` e inspeção do payload bloqueado em `service.ts`.

---

### W070: Solicitação de Ajustes sem Justificativa (`changes_requested`)
- **Cenário de Risco**: O cliente externo clicar em "Solicitar Ajuste" sem informar o que precisa ser alterado, travando o fluxo criativo da agência.
- **Mecanismo de Proteção**:
  - `applyDeliverableReview` exige obrigatoriamente `feedbackNote` com pelo menos 3 caracteres sempre que `decision === 'changes_requested'`, lançando erro amigável 400 caso esteja em branco.
- **Verificação**:
  - Teste unitário explícito com `assert.throws` em `portals.test.ts`.
