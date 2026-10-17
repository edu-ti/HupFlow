# Investigação Técnica: Recomendador de Hashtags com IA & Coleções Salvas

> Identificador da Feature: `028-hupflow-ai-hashtag-recommender`  
> Data: `2026-10-16`  

---

## 1. Desafios Arquiteturais

1. **Equilíbrio entre Criatividade da IA e Precisão Semântica**:
   - A IA generativa às vezes sugere hashtags muito genéricas (ex: `#Post`, `#News`, `#Life`) ou excessivamente longas (ex: `#ComoCriarUmPostSemBurnoutEm2026`).
   - Solução: Criar um validador/filtro que garanta comprimento ideal (entre 3 e 25 caracteres), remoção de acentos e pontuações, descarte de stopwords e enriquecimento com tags de nicho conhecidas.

2. **Diferenciação Algorítmica por Rede Social**:
   - **LinkedIn**: penaliza posts com mais de 5 hashtags. O ideal são 3 a 5 tags focadas em mercado (`#SaaS`, `#B2B`, `#Liderança`).
   - **X (Twitter)**: limite rígido de 280 caracteres. O algoritmo prioriza palavras-chave no próprio texto; 1 a 2 hashtags são o limite recomendado.
   - **Instagram**: aceita até 30 tags, mas o próprio time do Instagram recomenda entre 3 e 5 de alta relevância para categorização correta no algoritmo de tópicos.
   - **Threads**: suporta apenas 1 tag clicável por post como identificador de tópico.

3. **Fallback Resiliente para Ambientes Offline/CI**:
   - Em conformidade com o padrão HupFlow Clean-Room visto em `copywriter.ts`, quando `OPENAI_API_KEY` estiver ausente, o motor deve executar extração semântica baseada em heurísticas e dicionários canônicos de 8 nichos de mercado (Tech, Marketing, Vendas, Finanças, Produtividade, Design, Saúde, Negócios).

4. **Multi-Tenancy e Isolamento de Coleções**:
   - A tabela `hashtag_sets` deve isolar coleções por `organizationId` com cascata de deleção vinculada à tabela `organizations`.

---

## 2. Decisão de Design de Dados

A tabela `hashtag_sets` armazenará:
- `id`: identificador `hts_...`
- `organization_id`: referência multi-tenant obrigatória
- `name`: nome da coleção (ex: "SaaS & B2B Tech")
- `category`: categoria ou nicho temático
- `tags`: array JSON contendo as hashtags salvas (sem o `#` para flexibilidade)
- `usage_count`: contador de vezes que o grupo foi injetado em posts
- `created_at`, `updated_at`
