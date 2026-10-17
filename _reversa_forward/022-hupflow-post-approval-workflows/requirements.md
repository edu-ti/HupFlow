# Requisitos: Fluxo Editorial de Aprovações (Post Approval Workflows)

> Identificador: `022-hupflow-post-approval-workflows`  
> Data de Início: `2026-10-16`  
> Cenário: `greenfield` (Evolução contínua do HupFlow Clean-Room)  
> Status: `requirements`  

---

## 1. Visão Geral & Objetivos de Negócio

Em agências de publicidade, equipes corporativas e operações de marketing B2B, a publicação de posts em redes sociais requer controle de qualidade rigoroso para evitar erros de copywriting, inconsistências visuais ou vazamento de informações sensíveis.
Esta feature implementa o **Fluxo Editorial de Aprovações** do HupFlow:
1. **Máquina de Estados de Publicação**:
   - `draft` (Rascunho): Conteúdo em criação pelo autor/designer.
   - `in_review` (Em Revisão): Submetido pelo autor para validação da equipe editorial/cliente.
   - `approved` (Aprovado): Post liberado para publicação manual ou agendamento automático.
   - `rejected` (Necessita Ajustes): Post devolvido ao autor com motivo detalhado e apontamentos de melhoria.
2. **Governança RBAC & Permissões**:
   - Membros comuns (`member`) podem criar rascunhos e submeter para revisão (`draft -> in_review`).
   - Apenas usuários com papel `admin` ou `owner` podem aprovar (`in_review -> approved`) ou rejeitar (`in_review -> rejected`).
   - Proteção de publicação: posts com status `in_review` ou `rejected` não podem ser despachados para as redes sociais antes da aprovação explícita.
3. **Histórico de Comentários & Auditoria**:
   - Registro de histórico em `post_approval_history` com quem solicitou, quem aprovou/rejeitou, carimbo de data/hora e justificativa.
4. **Interface da Central de Aprovações (`/approvals`)**:
   - Painel Kanban/Tabs filtrando posts pendentes de revisão, aprovados e rejeitados.
   - Visualização prévia da mídia e texto, botões de ação rápida (Aprovar com 1 clique / Rejeitar com modal de feedback).
5. **Integração no Compositor (`/composer`)**:
   - Indicador de status de aprovação e botão para "Submeter para Revisão" em vez de agendamento direto quando a organização exige aprovação.

---

## 2. Requisitos Funcionais (RF)

- **RF-001**: O sistema deve adicionar os campos `approval_status`, `submitted_by_id`, `approved_by_id`, `rejection_reason` e `reviewed_at` na tabela `posts`.
- **RF-002**: Deve ser criada a tabela `post_approval_history` para auditoria de todas as transições e feedbacks editoriais.
- **RF-003**: Apenas autores podem submeter seus rascunhos (`draft -> in_review`).
- **RF-004**: Apenas `admin` ou `owner` da organização podem aprovar ou rejeitar uma publicação pendente.
- **RF-005**: A rejeição exige o preenchimento de uma justificativa (`rejection_reason`) com no mínimo 5 caracteres.
- **RF-006**: O endpoint `/api/posts/approval` deve fornecer listagem de posts por status de aprovação e processamento atômico das ações (`submit`, `approve`, `reject`).
- **RF-007**: A tela `/approvals` deve listar posts pendentes de revisão com pré-visualização de canais e permitir aprovação/rejeição direta.
- **RF-008**: O menu de navegação do dashboard (`layout.tsx`) deve incluir o atalho "Aprovações & Revisão".

---

## 3. Requisitos Não-Funcionais & Clean-Room (RNF)

- **RNF-001 (Clean-Room)**: Implementação 100% nativa em TypeScript estrito, sem pacotes de workflow pesados ou dependências externas proprietárias.
- **RNF-002 (Isolamento Multi-tenant)**: Nenhuma organização pode visualizar ou aprovar publicações pertencentes a outro workspace.
- **RNF-003 (Conformidade TypeScript)**: Zero erros de compilação em `npx tsc --noEmit`.
- **RNF-004 (Garantia de Regressão)**: 100% de aprovação na suíte de testes unitários.
