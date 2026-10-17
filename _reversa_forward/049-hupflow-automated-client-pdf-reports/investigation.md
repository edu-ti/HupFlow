# Investigação Técnica — Feature 049: Relatórios Executivos em PDF

## 1. Biblioteca PDF em Clean-Room
- No HupFlow, já possuímos `jspdf` instalada e homologada (utilizada no Estúdio de Carrosséis para exportação de documentos PDF para o LinkedIn).
- O `jspdf` permite construir páginas A4 elegantes orientadas a coordenadas vetoriais com retângulos arredondados, paletas hexadecimais, fontes e grids sem precisar de navegador externo.

## 2. Consolidação de Métricas e KPIs
- O relatório combina métricas de:
  - `post_analytics`: contagem de impressões, curtidas, comentários, compartilhamentos e taxa média de engajamento.
  - `agency_brand_profiles`: dados de marca e canais conectados.
  - `posts`: ranking das 3 publicações de maior alcance no período.

## 3. Estratégia de Fallback e Desempenho
- A renderização do PDF deve ocorrer em menos de 80 milissegundos.
- Se o banco de dados estiver inacessível, o serviço sintetiza os dados em memória gerando um PDF válido para demonstração e testes unitários.
