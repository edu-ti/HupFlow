# Regression Watch: Feature 022 - Fluxo Editorial de Aprovações

> Identificador: `022-hupflow-post-approval-workflows`  
> Data: `2026-10-16`  
> Status: Ativo  

---

## 1. Itens de Monitoramento

| ID | Área / Componente | Condição Crítica | Risco Mitigado |
|----|-------------------|------------------|----------------|
| **W035** | `src/lib/approvals/service.ts` | Bloqueio de aprovação direta de rascunhos sem submissão prévia | Evitar pular a etapa de submissão e rastreabilidade de quem enviou o post |
| **W036** | `src/lib/approvals/service.ts` | Verificação estrita de RBAC `admin` para aprovação ou rejeição | Impedir que membros comuns aprovem seus próprios posts ou de terceiros |
| **W037** | `src/lib/approvals/service.ts` | Exigência de justificativa de no mínimo 5 caracteres na rejeição | Garantir que o autor receba orientações construtivas ao ter um post devolvido |

---

## 2. Estratégia de Verificação

1. **Testes Unitários**: Execução do script `src/lib/approvals/approvals.test.ts`.
2. **Checagem Estática**: Compilação TypeScript com `npx tsc --noEmit`.
3. **Verificação de Regressão Cruzada**: Garantir que as publicações agendadas e os conectores sociais permaneçam 100% operacionais.
