# Requirements: Editor TipTap & Preview Realista Multicanal

> Identificador: `011-hupflow-composer-tiptap-editor`  
> Data: `2026-10-15`  
> Pasta de especificações SDD: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

Esta feature aprimora o Compositor de Publicações do HupFlow, integrando o editor rich-text TipTap com barra de formatação ergonômica (negrito, itálico, listas, citações), suporte a emojis rápidos, injeção de carrosséis/mídias vindos do Estúdio e pré-visualização fidedigna em mockups visuais nativos de cada rede social (Card de feed do LinkedIn com carrossel deslizável, Tweet no X, post no feed do Instagram e publicação no Threads).

---

## 2. Contexto a partir do legado e especificações SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/sdd/04-composer-copywriter.md` | Editor TipTap com StarterKit, CharacterCount e gerador de IA por plataforma. | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | Experiência de composição com preview simultâneo e adaptado para cada rede social. | 🟢 |
| `_reversa_sdd/sdd/02-canvas-studio.md` | Comunicação direta entre o Estúdio de Carrosséis e o Compositor via estado de mídia. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Mariana (Social Media Manager)** | Ver exatamente como o carrossel e o texto formatado vão aparecer no feed antes de aprovar com o cliente. | Clica na aba "Preview LinkedIn", vê o mock nativo com avatar, nome da empresa e o carrossel em PDF deslizável com as setas. |
| **Lucas (Solopreneur)** | Escrever com rapidez usando atalhos de teclado de negrito e listas sem perder a clareza visual. | Seleciona trechos importantes para destacar com negrito e quebras de linha calculadas, observando o contador dinâmico de caracteres. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Compatibilidade de Markdown / Plain Text):** Como nem todas as redes suportam formatação rich-text nativa (o X e o LinkedIn suportam texto plano com unicode ou formatação nativa de parágrafos), o editor deve exportar tanto HTML limpo quanto Plain Text com espaçamento correto. 🟢
2. **RN-02 (Preview Fidedigno WYSIWYG):** O painel de preview deve simular com precisão a tipografia, cores, botões de curtir/comentar e proporções reais da interface de cada rede social selecionada. 🟢
3. **RN-03 (Anexação de Mídias do Estúdio):** O compositor deve permitir anexar um carrossel em PDF (LinkedIn) ou um conjunto de slides PNG com visualizador de miniaturas removíveis. 🟢
4. **RN-04 (Contagem Estrita de Caracteres):** O indicador de contagem deve calcular os limites específicos: LinkedIn (3.000), Instagram (2.200), Threads (500) e X/Twitter (280), emitindo alerta visual quando ultrapassado. 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Barra de ferramentas com ações rápidas de formatação (Bold, Italic, BulletList, OrderedList, Blockquote). | Must | O usuário clica nos botões ou usa atalhos (Ctrl+B, Ctrl+I) e o texto reflete a formatação instantaneamente. | 🟢 |
| **RF-02** | Painel de Preview Nativo com alternância entre LinkedIn, X, Instagram e Threads. | Must | Cada aba de preview renderiza um card mockup estilizado de acordo com o design system da respectiva rede. | 🟢 |
| **RF-03** | Área de mídias anexadas com suporte a PDF e imagens com preview de miniatura. | Must | Mídias adicionadas aparecem em um carrossel horizontal de miniaturas com botão de remover. | 🟢 |
| **RF-04** | Seletor rápido de emojis categorizados para inserção direta no cursor. | Should | Um menu suspenso de emojis permite inserir ícones populares com 1 clique. | 🟢 |
| **RF-05** | Integração contínua com os ganchos magnéticos e hashtags da IA. | Must | Clicar em um gancho da IA atualiza o conteúdo do editor TipTap preservando o histórico de undo/redo. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Ergonomia** | Interface livre de distrações, responsiva e otimizada para digitação contínua. | Experiência de usuário premium ("WOW factor") sem travamentos. | 🟢 |
| **Desempenho** | Renderização do preview com atualização reativa a cada digitação com debounce de 50ms. | Digitação fluida a 60fps sem lag perceptível. | 🟢 |
| **Acessibilidade** | Contraste adequado no modo escuro e labels acessíveis em todos os botões de ação. | Padrões WCAG AA. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Formatação de texto e contagem de caracteres
  Dado que o usuário está digitando no Compositor
  Quando ele seleciona uma palavra e clica no botão "Negrito"
  Então a palavra é envolvida em negrito visual
  E o contador de caracteres é atualizado em tempo real

Cenário: Visualização de preview nativo do LinkedIn
  Dado que o usuário tem um post com texto e carrossel em PDF anexado
  Quando ele seleciona a aba de preview "LinkedIn"
  Então o sistema renderiza o mockup fiel do feed do LinkedIn
  E exibe o cabeçalho com perfil, texto com quebras de linha e o leitor de carrossel

Cenário: Alerta de excesso de caracteres para o X/Twitter
  Dado que o texto possui 290 caracteres
  Quando o usuário seleciona o canal "X / Twitter"
  Então o badge de caracteres fica em vermelho destacando "290 / 280"
  E o botão de agendamento fica desabilitado para prevenir erro na API
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| RF-01 (Barra de ferramentas de formatação) | **Must** | Essencial para estruturação de parágrafos e ênfase no texto. |
| RF-02 (Mockups de Preview Nativo) | **Must** | Elimina a incerteza do criador de conteúdo antes de publicar. |
| RF-03 (Área de mídias anexadas) | **Must** | Conecta o estúdio gráfico ao fluxo de agendamento. |
| RF-04 (Seletor de Emojis) | **Should** | Agiliza a inserção de elementos visuais sem trocar de janela. |
| RF-05 (Integração IA com TipTap) | **Must** | Mantém a sinergia entre o assistente de redação e o editor. |

---

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

---

## 10. Lacunas

> Nenhuma lacuna crítica pendente. Todos os requisitos estão alinhados com `_reversa_sdd/sdd/04-composer-copywriter.md`.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-requirements` para a Feature 011 | reversa-requirements |
