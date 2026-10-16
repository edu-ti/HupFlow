# Requirements: Estúdio de Carrosséis 2D & Exportação PDF Multi-Páginas

> Identificador: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  
> Pasta de especificações SDD: `_reversa_sdd/`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA  

---

## 1. Resumo executivo

O HupFlow Studio entrega um ambiente nativo e proprietário para criação, edição e exportação de carrosséis educativos de alto impacto para redes sociais, especialmente LinkedIn e Instagram. Ele substitui de ponta a ponta a dependência de bibliotecas comerciais fechadas (como o Polotno SDK) por um Canvas 2D vetorizado (HTML5 Canvas / Fabric.js), suportando geração assistida por IA, múltiplos slides com sincronização de paletas e geração de documentos PDF multi-páginas de alta fidelidade para publicação como documento nativo no LinkedIn.

---

## 2. Contexto a partir do legado e especificações SDD

| Fonte | Trecho relevante | Confidência |
|-------|------------------|:-----------:|
| `_reversa_sdd/sdd/02-canvas-studio.md` | Estúdio de design 2D baseado em Canvas/Fabric.js v6 com prancheta multi-slides e proporções sociais. | 🟢 |
| `_reversa_sdd/sdd/03-carousel-engine.md` | Motor de geração de carrosséis estruturados validados via Zod e Vercel AI SDK. | 🟢 |
| `_reversa_sdd/prd.md#escopo-mvp` | Geração de carrosséis em PDF para LinkedIn e imagens em PNG para Instagram/X. | 🟢 |
| `_reversa_sdd/architecture.md` | Clean-room software engineering livre de dependências AGPL e licenças pagas por assento. | 🟢 |

---

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Lucas (Solopreneur / Dev)** | Gerar autoridade técnica no LinkedIn com carrosséis didáticos em menos de 10 minutos. | Digita o tema de um artigo técnico, a IA gera 5 slides com ganchos e insights, Lucas ajusta as cores e exporta diretamente o PDF para o LinkedIn. |
| **Mariana (Social Media Manager)** | Produzir carrosséis padronizados na identidade visual da marca dos seus clientes. | Define paleta de cores (Midnight Indigo), insere os textos revisados no editor lateral e faz download tanto dos PNGs individuais quanto do PDF multi-páginas. |

---

## 4. Regras de negócio novas ou alteradas

1. **RN-01 (Independência de Licença):** O motor de renderização do estúdio gráfico deve utilizar exclusivamente tecnologias de código aberto sob licença MIT/Apache (HTML5 Canvas, Fabric.js, jsPDF), sendo estritamente proibido o uso de SDKs com licenças comerciais restritivas por assento. 🟢
2. **RN-02 (Proporções Sociais Obrigatórias):** O estúdio deve oferecer alternância fluida entre proporções padrão: `1:1` (1080x1080px), `4:5` (1080x1350px) e `9:16` (1080x1920px), recalculando o layout dos slides sem distorção dos textos. 🟢
3. **RN-03 (Exportação em PDF Multi-Páginas):** A exportação de carrossel para LinkedIn deve gerar um arquivo `.pdf` contendo exatamente uma página por slide, preservando a resolução vetorial de 1080px de largura e a ordem sequencial dos slides de 1 a N. 🟢
4. **RN-04 (Persistência e Estrutura dos Slides):** Cada slide de um carrossel deve conter campos bem definidos: `headline`, `bodyText`, `highlightText`, `type` (`cover`, `content`, `statistic`, `quote`, `cta`) e paleta de cores associada. 🟢
5. **RN-05 (Sincronização com o Compositor):** Ao clicar em "Enviar para Agendamento", o texto consolidado e as mídias do carrossel devem ser automaticamente carregados no Compositor de Posts (`/composer`). 🟢

---

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|:----------:|--------------------|:-----------:|
| **RF-01** | Renderização 2D em tempo real com quebra automática de texto (`wrapText`) e padding configurável. | Must | O canvas desenha título, corpo, tags e rodapés com espaçamento proporcional sem cortar palavras na borda. | 🟢 |
| **RF-02** | Exportação de carrossel completo em documento PDF (jsPDF) contendo todos os slides em páginas sequenciais. | Must | O usuário clica em "Baixar Carrossel (PDF)" e recebe um arquivo PDF compatível com o leitor de documentos do LinkedIn. | 🟢 |
| **RF-03** | Exportação de slide individual em PNG de alta definição (1080x1080px / 1080x1350px). | Must | O botão "Baixar Slide (PNG)" gera o download instantâneo do slide em exibição com 72 a 300 DPI. | 🟢 |
| **RF-04** | Navegação e reordenação de slides (Slide Anterior, Próximo Slide, Adicionar Slide, Excluir Slide). | Must | O usuário pode navegar entre os slides ou adicionar um novo slide na sequência mantendo o tema visual. | 🟢 |
| **RF-05** | Integração direta do gerador de IA com os slides ativos na prancheta. | Should | A resposta da API `/api/ai/carousel` substitui os slides atuais e aplica automaticamente a paleta gerada. | 🟢 |

---

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|:-----------:|
| **Desempenho** | A renderização de um novo slide no canvas e o cálculo do PDF para até 10 slides deve ocorrer em menos de 1,5 segundos no navegador. | Processamento client-side em Web Workers ou Canvas 2D nativo sem requisições pesadas ao servidor. | 🟢 |
| **Segurança & Licença** | 100% livre de bibliotecas com licença AGPL ou telemetria externa não autorizada. | Diretriz Clean-Room do projeto HupFlow. | 🟢 |
| **Usabilidade** | Interface Dark Mode com controles visuais contrastantes, atalhos de teclado (Setas Esquerda/Direita) e preview fiel WYSIWYG. | Feedback contínuo de design e ergonomia para criadores de conteúdo. | 🟢 |

---

## 7. Critérios de Aceitação

```gherkin
Cenário: Exportação de carrossel de 5 slides em documento PDF para o LinkedIn
  Dado que o usuário está no estúdio com um carrossel de 5 slides preenchidos
  Quando ele clica no botão "Baixar Carrossel (PDF)"
  Então o sistema compila os 5 slides em um único arquivo PDF
  E o PDF baixado possui exatamente 5 páginas nas dimensões selecionadas (ex: 1080x1080)
  E a ordem das páginas corresponde à sequência dos slides de 1 a 5

Cenário: Alternância de proporção social
  Dado que o usuário está editando um slide na proporção "1:1 Quadrado"
  Quando ele clica na opção "4:5 Retrato"
  Então o canvas é redimensionado para 1080x1350px
  E o texto e elementos visuais são reposicionados respeitando a nova área útil

Cenário: Tentativa de exportar carrossel vazio ou corrompido
  Dado que a lista de slides foi esvaziada acidentalmente
  Quando o usuário tenta acionar a exportação
  Então o sistema exibe um alerta amigável impedindo a ação
  E mantém um slide padrão ativo na prancheta
```

---

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|:------:|---------------|
| RF-01 (Renderização 2D com quebra automática de texto) | **Must** | Essencial para legibilidade e funcionamento do estúdio. |
| RF-02 (Exportação em PDF multi-páginas para LinkedIn) | **Must** | Core value proposition do HupFlow para criadores de conteúdo B2B. |
| RF-03 (Exportação de slide individual em PNG) | **Must** | Necessário para publicações no Instagram, Facebook e X. |
| RF-04 (Navegação, adição e remoção de slides) | **Must** | Controle elementar de autoria pelo usuário. |
| RF-05 (Geração e injeção automática de IA no canvas) | **Should** | Acelera a criação de conteúdo em até 10x. |

---

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

---

## 10. Lacunas

> Nenhuma lacuna crítica pendente. Todos os requisitos técnicos e de negócio estão ancorados no `_reversa_sdd/`.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-requirements` para a Feature 009 | reversa-requirements |
