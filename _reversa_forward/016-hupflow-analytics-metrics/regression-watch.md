# Regression Watch: Dashboard de Analytics & Métricas Sociais

> Identificador: `016-hupflow-analytics-metrics`  
> Data: `2026-10-16`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD (`_reversa_sdd/sdd/05-scheduler-engine.md`)  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W017 | `requirements.md#RN-01` | Consultas de métricas devem sempre filtrar por `organizationId` da sessão ativa | Presença | Consulta em `postAnalytics` sem cláusula `eq(postAnalytics.organizationId, auth.organizationId)` |
| W018 | `requirements.md#RN-02` | O cálculo da taxa de engajamento deve retornar 0 quando o alcance for zero, sem causar `NaN` ou divisão por zero | Comportamento | Resposta da API retornando `NaN` ou `null` no campo `engagementRate` |
| W019 | `requirements.md#6` | Os gráficos analíticos devem ser renderizados nativamente em SVG sem dependências proprietárias | Presença | Inclusão de bibliotecas externas pesadas ou proprietárias de charting no bundle |

---

## 2. Observações

- **RF-01**: Tabela `postAnalytics` integrada e tipada no Drizzle ORM.
- **RF-02**: Funções puras validadas com 100% de cobertura de cenários em `calculator.test.ts`.
- **RF-03**: Endpoint `/api/analytics` protegido com `requireOrgRole(req, 'viewer')`.
- **RF-04**: Componente `AnalyticsAreaChart` responsivo com tooltips no hover.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
