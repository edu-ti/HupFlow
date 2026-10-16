# Roadmap: Editor TipTap & Preview Realista Multicanal

> Identificador: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  
> Requirements: `_reversa_forward/011-hupflow-composer-tiptap-editor/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica estrutura o Compositor do HupFlow em duas áreas principais:
1. **Editor de Texto TipTap Integrado:** Um componente client-side que utiliza `@tiptap/react` e `@tiptap/starter-kit` para formatação de texto em tempo real (negrito, itálico, listas e citações), oferecendo uma barra de ferramentas visual acessível, contagem de caracteres por rede e sincronização bidirecional com os ganchos da IA.
2. **Mockups de Preview Nativo Multicanal:** Um componente modular `PlatformPreview` que renderiza a publicação simulando com alta fidelidade a interface visual de cada plataforma social ativa (Card de feed do LinkedIn com carrossel deslizável, Tweet no X com limite de caracteres, post no Instagram e post no Threads), incluindo badges de autor, avatar e botões de engajamento nativos de cada rede.
3. **Gerenciador de Mídias Anexadas:** Miniaturas interativas que permitem importar e visualizar os slides gerados no Estúdio antes de enviar para o agendamento no BullMQ.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL** | Utilização exclusiva de `@tiptap/react` (licença MIT) e componentes React próprios. | Respeita 🟢 |
| **Ergonomia e Design WOW** | Interface escura imersiva, tipografia Plus Jakarta Sans e visualização fidedigna dos feeds. | Respeita 🟢 |
| **Sincronia Estúdio ➔ Compositor** | Conexão direta entre os carrosséis gerados no Estúdio e o fluxo de publicação. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Uso do TipTap Headless com Tailwind | Permite estilização 100% customizada e fluida no tema Dark sem os estilos engessados de editores WYSIWYG legados. | Quill / Draft.js (antigos e com bundle pesado). | 🟢 |
| **D-02** | Componente de preview nativo modular | Isola a lógica visual de cada rede em subcomponentes puros (`LinkedInMockup`, `TwitterMockup`, `InstagramMockup`, `ThreadsMockup`). | Preview genérico com texto puro (baixa atratividade para o usuário). | 🟢 |
| **D-03** | Conversão transparente de HTML para PlainText | APIs sociais como X exigem texto puro; o compositor extrai texto limpo preservando quebras de linha. | Enviar tags HTML brutas para as APIs das redes. | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| Usuários preferem alternar entre a aba de Edição e a aba de Preview Nativo | RF-02 / Critérios de Aceitação | Baixo; layout com abas limpas melhora o foco em telas menores e laptops. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `TipTapEditor` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Editor rich-text com toolbar de formatação. |
| `PlatformPreview` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Mockups realistas dos feeds das 4 redes sociais. |
| `MediaAttachments` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Novo | Galeria de miniaturas de mídias e carrosséis. |
| `ComposerPage` | `_reversa_sdd/sdd/04-composer-copywriter.md` | Componente Alterado | Orquestração da página unindo Editor, IA e Preview. |

---

## 6. Delta no modelo de dados

Nenhuma mudança estrutural no banco de dados. Os modelos `posts` e `post_channels` já suportam conteúdo de texto formatado e listas de `media_ids`.
Detalhe completo em: `_reversa_forward/011-hupflow-composer-tiptap-editor/data-delta.md`.

---

## 7. Delta de contratos externos

Nenhum contrato externo afetado. O agendamento continua despachando jobs para a fila BullMQ já existente.

---

## 8. Plano de migração

Não aplicável (feature greenfield nova no HupFlow).

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| TipTap renderizar estilos incompatíveis no SSR | Baixo | Médio | Uso de `'use client'` e renderização protegida com `immediatelyRender: false`. |

---

## 10. Critério de pronto

- [ ] Toolbar com Negrito, Itálico, Listas e Citações funcionando.
- [ ] Mockups de visualização nativa para LinkedIn, X/Twitter, Instagram e Threads.
- [ ] Seletor rápido de emojis.
- [ ] Contador de caracteres dinâmico com indicador de perigo por rede.
- [ ] Anexação e remoção de mídias com miniaturas visuais.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
