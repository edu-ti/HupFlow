# Pontos de Atenção & Monitoramento de Regressão — Feature 049

## W102 — Performance e Consumo de Memória em PDFs com Múltiplas Páginas
- **Risco**: A compilação em lote de relatórios para dezenas de clientes em cronjobs de início de mês poderia esgotar a memória heap do servidor se instâncias inteiras de buffers permanecessem abertas.
- **Salvaguarda**: `buildExecutiveReportPdf` gera PDFs compactos e vetoriais de aproximadamente 11 KB por documento, executados em streaming sem acúmulo no processo.

## W103 — Multi-tenant e Isolamento de Métricas Confidenciais
- **Risco**: Vazamento de taxas de conversão ou engajamento de uma marca concorrente nos relatórios de outra agência.
- **Salvaguarda**: Tanto a consulta quanto o endpoint de streaming de download (`/api/reports/download?id=...`) exigem autenticação ativa e filtram os relatórios por `organizationId` via RBAC.
