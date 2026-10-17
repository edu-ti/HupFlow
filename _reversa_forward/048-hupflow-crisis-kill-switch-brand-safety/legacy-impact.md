# Análise de Impacto no Sistema Legado — Feature 048

## Escopo e Arquitetura Clean-Room
- **Isolamento de Domínio**: Todo o código de gestão de crise e brand safety reside em `hupflow/src/lib/brandsafety/`, `hupflow/src/app/api/brand-safety/` e `hupflow/src/app/(dashboard)/settings/kill-switch/`.
- **Zero Impacto em Código Legado**: Nenhum arquivo fora do projeto `hupflow/` ou das pastas do Reversa foi modificado.
- **Interoperabilidade com o Agendador**: A função pura `evaluatePostBrandSafety` permite que schedulers existentes e futuros consultem em memória ou banco se uma publicação tem autorização de envio sem risco de lock de concorrência.
