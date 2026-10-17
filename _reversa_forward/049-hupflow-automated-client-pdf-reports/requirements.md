# Requisitos — Feature 049: Relatórios Executivos Automáticos em PDF para Clientes de Agência

## 1. Visão Geral
Agências de marketing digital e social media gastam de 5 a 15 horas semanais consolidando capturas de tela e métricas em apresentações de slides ou PDFs manuais para enviar aos seus clientes. 

A **Feature 049** introduz o **Gerador e Agendador de Relatórios Executivos em PDF para Clientes**:
1. **Geração Automatizada Semanal/Mensal**: Consolida automaticamente dados de engajamento, impressões, alcance, taxa de conversão, crescimento de seguidores e melhores publicações no período.
2. **Template Executivo White-Label**: Aplica a identidade visual da agência ou da marca cliente (cores primárias, logo, tipografia e dados de contato).
3. **Engine Clean-Room 100% Nativo**: Construído sobre `jspdf` (MIT) já homologado no HupFlow (sem Chromium headless, sem Puppeteer pesado, sem APIs pagas de renderização de PDF externas).
4. **Resumo Executivo Gerado por IA**: Parágrafo sintético com destaques da semana ("O post em formato de Carrossel no LinkedIn obteve 3.4x mais engajamento do que a média").
5. **Histórico de Relatórios & Download Instantâneo**: Biblioteca de relatórios emitidos por marca/organização com link público assinado para visualização pelo cliente final.

## 2. Requisitos Funcionais
- **RF01**: Configuração de agendamento de relatórios em `client_report_schedules` (periodicidade: `weekly` ou `monthly`, dia de envio, destinatários por e-mail).
- **RF02**: Registro do acervo de relatórios gerados em `generated_client_reports` (URL do PDF, status, período avaliado, métricas consolidadas em JSON).
- **RF03**: Motor gerador de PDF vetorial em `src/lib/reports/pdfGenerator.ts` contendo cabeçalho executivo, grade de KPIs (Impressões, Cliques, Taxa de Engajamento, Novos Seguidores), gráfico vetorial e ranking dos Top 3 posts.
- **RF04**: Endpoint `/api/reports` (GET e POST para geração manual imediata) e `/api/reports/download` com transmissão do buffer binário PDF `application/pdf`.
- **RF05**: Interface no dashboard em `/settings/reports` com preview do relatório, biblioteca de edições anteriores e seletor de marcas da carteira.

## 3. Critérios de Aceite Clean-Room
- Zero bibliotecas AGPL e zero navegadores headless (Puppeteer/Playwright) que inflariam o bundle de produção.
- 100% de cobertura com testes unitários em `tsx`.
- Sucesso absoluto em `tsc --noEmit` (zero erros).
- Isolamento multi-tenant por `organizationId` com RBAC exigindo no mínimo `member` para gerar e `viewer` para baixar.
