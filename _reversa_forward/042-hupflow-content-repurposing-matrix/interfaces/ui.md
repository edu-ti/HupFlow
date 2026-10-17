# UI Interfaces: 042-hupflow-content-repurposing-matrix

## Componentes & Páginas
1. **`hupflow/src/components/repurpose/RepurposingKitCard.tsx`**
   - Card interativo do kit de reaproveitamento contendo:
     - Título da campanha, tipo de fonte (`Artigo`, `Transcrição`, `Newsletter`, `Notas`) e badge de tom de voz.
     - Seletor de 4 Abas:
       - **Aba 1: Carrossel (7 Slides)**: Visualização em cartões de cada slide (Capa, Passos, CTA).
       - **Aba 2: Thread X (5 Tweets)**: Visualização da cadeia de tweets numerados com contagem de caracteres (<= 280c).
       - **Aba 3: Roteiro Reels (9:16)**: Blocos de tempo (*Gancho 3s*, *Corpo 3-30s*, *CTA Final*).
       - **Aba 4: Newsletter**: Texto executivo formatado com tópicos acionáveis.
     - Botões de ação rápida: **Copiar Formato Selecionado**, **Enviar para Compositor** e **Excluir Kit**.

2. **`hupflow/src/app/(dashboard)/settings/repurpose/page.tsx`**
   - Header executivo e 4 KPI Cards no topo:
     1. **Kits Gerados na Matriz**
     2. **Peças Sociais Multiplicadas**
     3. **Tempo Médio de Produção Economizado (Horas)**
     4. **Canais Prontos para Distribuição**
   - Formulário de Ingestão de Conteúdo Longo + Lista de Kits com `RepurposingKitCard`.
