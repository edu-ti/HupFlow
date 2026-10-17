# Investigation: 042-hupflow-content-repurposing-matrix

## Contexto Arquitetural
- O maior gargalo de consistência para marcas e agências não é a falta de ideias, mas o tempo gasto adaptando manualmente um conteúdo longo (ex: um artigo de blog de 1.500 palavras ou a transcrição de um podcast de 30 minutos) para as peculiaridades de cada rede social: o LinkedIn exige carrosséis de 7 slides; o X exige threads rápidas e concisas; o Instagram/TikTok exige roteiros verticais dinâmicos de 60 segundos; e newsletters exigem resumos executivos.
- A **Feature 042 (`042-hupflow-content-repurposing-matrix`)** cria a infraestrutura de decomposição atômica de conteúdo para multiplicar o ROI de cada peça produzida.

## Decisões de Design Clean-Room
1. **Pipeline de Decomposição Atômica (`decomposeLongFormContent`)**:
   - Analisa o texto de entrada, isolando parágrafos, sentenças de impacto (*soundbites*), subtítulos e listas numeradas.
   - Distribui o conteúdo para 4 geradores especializados sem perder o contexto central da tese.
2. **Proteção de Limites de Plataforma**:
   - Thread X garante `tweet.length <= 280` caracteres em cada um dos 5 tweets gerados.
   - Carrossel cria exatamente 7 slides balanceados para o Estúdio de Carrosséis.
   - Roteiro Reels calcula estimativa de tempo total de fala (`~140 palavras/minuto`).
