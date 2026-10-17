# Regression Watch: Agendamento & Campanhas em Lote com IA (AI Bulk Scheduler)

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/05-scheduler-engine.md`)  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W026 | `requirements.md#RN-03` | Campanhas em lote devem validar o saldo mensal de posts contra `checkResourceQuota` e bloquear excedentes | Comportamento | Resposta 200/201 permitindo agendamento que supere o teto contratado do plano |
| W027 | `requirements.md#RN-02` | Nenhum slot de agendamento pode ser gerado no passado relativo ao momento da requisição | Comportamento | Campo `scheduledAt` com timestamp anterior ao `new Date()` |
| W028 | `requirements.md#RN-01` | Todas as publicações geradas devem conter `organizationId` e `authorId` da sessão ativa | Presença | Inserções na tabela `posts` sem o ID da organização ativa |

---

## 2. Observações

- **RF-01**: Motor de slots suporta qualquer combinação de dias da semana e horários.
- **RF-02**: Geração com IA atribui arquétipos editoriais para evitar redundância de temas.
- **RF-03**: Suporte a carrosséis de 4 slides alternados com posts simples de texto.
- **RF-04**: Modo preview seguro para aprovação humana antes da gravação no banco.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
