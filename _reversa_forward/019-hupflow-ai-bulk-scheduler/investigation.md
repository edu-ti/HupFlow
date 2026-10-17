# Investigation: Campanhas em Lote com IA & Algoritmo de Projeção Temporal

> Identificador: `019-hupflow-ai-bulk-scheduler`  
> Data: `2026-10-16`  

---

## 1. Algoritmo de Projeção de Slots de Publicação

Para distribuir postagens de forma natural ao longo de semanas/meses:
1. O usuário seleciona os dias da semana desejados (ex: Terça = 2, Quinta = 4) e o horário de publicação (ex: "10:00").
2. O algoritmo inicia na data base (hoje ou data informada). Se hoje for Terça mas o horário já passou, o primeiro slot válido avança para a próxima ocorrência.
3. Para cada slot, a data é calculada com `setHours` e `setMinutes` exatos.
4. O loop avança até que `count` slots sejam gerados, pulando automaticamente finais de semana ou dias não selecionados.

---

## 2. Orquestração de Conteúdo com IA

Um erro comum em geradores de postagem é gerar 8 variações do mesmo texto. Para garantir valor real:
- O motor atribui um papel editorial a cada post:
  - Post 1: *O Gancho / Diagnóstico do Problema*
  - Post 2: *Mito vs Verdade ou Contradição do Mercado*
  - Post 3: *Guia Passo a Passo (Carrossel)*
  - Post 4: *Estudo de Caso / Exemplo Prático*
  - Post 5: *Checklist de Execução Imediata*
  - Post 6: *Os 3 Maiores Erros a Evitar*
  - Post 7: *Framework / Método Proprietário (Carrossel)*
  - Post 8: *Chamada para Ação (CTA) & Conclusão da Campanha*
- Cada nó gera: título do post, copy adaptada para os canais, hashtags recomendadas e estrutura de slides caso seja carrossel.

---

## 3. Conformidade Clean-Room

- Sem dependência de bibliotecas proprietárias de agendamento.
- Verificação atômica de cota com `checkResourceQuota` para não permitir que o usuário agende mais posts do que o plano permite.
