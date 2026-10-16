# Actions: Estúdio de Carrosséis 2D & Exportação PDF Multi-Páginas

> Identificador: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  
> Roadmap: `_reversa_forward/009-hupflow-studio-carousel/roadmap.md`  

## Resumo

| Métrica | Valor |
|---------|:-----:|
| Total de ações | 8 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

---

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T001 | Adicionar dependência `jspdf` no package.json do HupFlow | - | `[//]` | `hupflow/package.json` | 🟢 | `[X]` |
| T002 | Definir tipagem estrita de exportação de mídia e deck multi-slides (`CarouselExportOptions`, `SlideDimensions`) | - | `[//]` | `hupflow/src/lib/canvas/types.ts` | 🟢 | `[X]` |

---

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T003 | Criar testes unitários para cálculo de proporções de aspecto e quebra de linha de texto | T002 | `[//]` | `hupflow/src/lib/canvas/canvas-utils.test.ts` | 🟢 | `[X]` |

---

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T004 | Implementar utilitário de desenho em canvas buffer com quebra de texto vetorial e espera de fontes | T002 | - | `hupflow/src/lib/canvas/canvas-renderer.ts` | 🟢 | `[X]` |
| T005 | Implementar motor de exportação em PDF multi-páginas (`exportCarouselToPdf`) usando jsPDF | T001, T004 | - | `hupflow/src/lib/canvas/pdf-exporter.ts` | 🟢 | `[X]` |

---

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T006 | Integrar botões "Baixar Slide (PNG)" e "Baixar Carrossel (PDF)" na UI do Studio conectando aos exporters | T005 | - | `hupflow/src/app/(dashboard)/studio/page.tsx` | 🟢 | `[X]` |
| T007 | Adicionar controles de adicionar slide, duplicar e excluir slide na prancheta interativa | T004 | - | `hupflow/src/app/(dashboard)/studio/page.tsx` | 🟢 | `[X]` |

---

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|:------------:|:-----------:|--------------|:-----------:|:------:|
| T008 | Adicionar estado de loading com spinner durante a compilação do PDF e atalhos de teclado (Setas) | T006 | `[//]` | `hupflow/src/app/(dashboard)/studio/page.tsx` | 🟢 | `[X]` |

---

## Notas de execução

- Todas as 8 ações atômicas foram implementadas e verificadas no HupFlow.
- O motor de exportação em PDF gera páginas vetorizadas nas proporções 1:1, 4:5 e 9:16 nativamente no navegador, sem custo de servidores headless.
- Adicionados atalhos de teclado `ArrowLeft` e `ArrowRight` e botões de duplicar/excluir/adicionar slides.

---

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Execução e conclusão de todas as 8 ações (T001-T008) da Feature 009 | reversa-coding |
