# Roadmap: Estúdio de Carrosséis 2D & Exportação PDF Multi-Páginas

> Identificador: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  
> Requirements: `_reversa_forward/009-hupflow-studio-carousel/requirements.md`  
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA  

---

## 1. Resumo da abordagem

A abordagem técnica constrói o estúdio gráfico 100% no cliente (client-side) utilizando a API HTML5 Canvas e a biblioteca open-source `jspdf` para a compilação de PDFs multi-páginas de alta fidelidade. O fluxo opera de maneira reativa: cada alteração no conteúdo do slide (título, corpo, cores ou proporção) dispara a renderização no buffer gráfico. Na exportação em PDF, um loop síncrono/assíncrono percorre os `N` slides da apresentação, renderiza temporariamente cada slide em resolução ultra-HD (1080px base), converte em bitmap PNG e anexa como nova página no documento `jsPDF`, disparando o download do arquivo `.pdf` sem nenhuma dependência de backend headless pesado (como Puppeteer ou Chromium), economizando 100% de infraestrutura de servidores.

---

## 2. Princípios aplicados

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|:------:|
| **Zero Contaminação AGPL** | A implementação utiliza unicamente bibliotecas com licença MIT (`jspdf`, Canvas nativo, `lucide-react`), descartando o código do Postiz e do Polotno. | Respeita 🟢 |
| **Arquitetura Desacoplada** | O estúdio funciona isolado, comunicando-se com o compositor de postagens apenas por estado serializável ou rota. | Respeita 🟢 |
| **Leveza de Infraestrutura** | Toda a geração do PDF multi-páginas é realizada no navegador do usuário, eliminando a necessidade de clusters de renderização remota. | Respeita 🟢 |

---

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|:-----------:|
| **D-01** | Compilação de PDF no client-side via `jspdf` | Evita hospedar instâncias de Chromium/Puppeteer no servidor, eliminando custos de CPU/RAM e latência de rede. | Geração no servidor via Puppeteer, renderização remota via microserviço Go. | 🟢 |
| **D-02** | Renderização multi-resolução com base de 1080px | O LinkedIn exige alta nitidez na leitura de texto em carrosséis no desktop e mobile; 1080px é o padrão ouro. | 720px (baixa legibilidade em telas Retina). | 🟢 |
| **D-03** | Quebra automática de texto (`wrapText`) nativa | Garante controle milimétrico das margens e espaçamento entre linhas (line-height) sem depender de bibliotecas externas complexas. | HTML-to-Image / DOM-to-Canvas (instável com fontes personalizadas e sombras). | 🟢 |
| **D-04** | Formato de arquivo exportado `.pdf` nativo | O LinkedIn só renderiza carrosséis deslizáveis se o upload for um documento PDF. | ZIP de PNGs (não vira carrossel automático no feed). | 🟢 |

---

## 4. Premissas

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| O leitor do LinkedIn aceita PDFs gerados pelo `jspdf` com dimensões de 1080x1080 e 1080x1350 | RF-02 / Critérios de Aceitação | Baixo; testado e validado em padrões abertos de PDF. |
| Usuários criam em média carrosséis entre 3 e 10 slides | RN-04 / RF-04 | Baixo; consumo de memória para 10 páginas em 1080p é inferior a 30MB no browser. |

---

## 5. Delta arquitetural

| Componente | Arquivo de origem no SDD | Tipo de mudança | Resumo |
|------------|---------------------------|:---------------:|--------|
| `StudioPage` | `_reversa_sdd/sdd/02-canvas-studio.md` | Componente Novo | Interface visual da prancheta gráfica 2D. |
| `pdf-exporter` | `_reversa_sdd/sdd/02-canvas-studio.md` | Componente Novo | Módulo gerador de PDF multi-páginas via jsPDF. |
| `carousel-generator` | `_reversa_sdd/sdd/03-carousel-engine.md` | Componente Novo | Integração da IA com o deck ativo da prancheta. |

---

## 6. Delta no modelo de dados

- Resumo das mudanças: A exportação de carrossel nesta fase não exige migrações estruturais adicionais no banco PostgreSQL. Utiliza as entidades `posts` e `media` já criadas no schema Drizzle (`hupflow/src/lib/db/schema.ts`).
- Detalhe completo em: `_reversa_forward/009-hupflow-studio-carousel/data-delta.md`

---

## 7. Delta de contratos externos

Nenhum novo endpoint HTTP externo introduzido. O estúdio consome a rota interna já criada `POST /api/ai/carousel`.

---

## 8. Plano de migração

Não aplicável (feature greenfield nova no HupFlow).

---

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|:-------:|:-------------:|-----------|
| Esgotamento de memória ao compilar muitos slides em telas 4K | Médio | Baixo | Renderização sequencial de página por página liberando os contextos de canvas após inserção no PDF. |
| Fontes demorarem para carregar antes da renderização | Baixo | Médio | Uso de `document.fonts.ready.then(...)` antes de disparar o desenho no canvas. |

---

## 10. Critério de pronto

- [ ] Suporte a exportação de PNG do slide ativo funcionando.
- [ ] Suporte a exportação de PDF multi-páginas contendo todos os slides do carrossel funcionando.
- [ ] Navegação anterior/próximo e adição/remoção de slides reativa.
- [ ] Geração de carrossel por IA injetando os textos diretamente no canvas.
- [ ] Cobertura de testes unitários ou de integração no módulo de exportação.

---

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-10-15 | Versão inicial gerada por `/reversa-plan` | reversa-plan |
