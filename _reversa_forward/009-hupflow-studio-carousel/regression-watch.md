# Regression Watch: Estúdio de Carrosséis 2D & Exportação PDF Multi-Páginas

> Identificador: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  
> Âncora: `_reversa_sdd/prd.md` + specs SDD  

---

## 1. Itens de Vigilância Ativa

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W001 | `requirements.md#RF-02` | Exportação de carrossel em PDF multi-páginas via jsPDF | Presença | Falha ou ausência da função `exportCarouselToPdf` |
| W002 | `requirements.md#RN-01` | Código 100% livre de dependências AGPL e Polotno SDK | Ausência | Importação de pacotes do Postiz ou SDKs restritivos |

---

## 2. Observações

- **RF-01**: Renderização de texto com quebra automática de linha (`wrapText`) validada nos testes unitários `canvas-utils.test.ts`.
- **RF-02**: Compilação de PDF gerando 1 página por slide na resolução base de 1080px.
- **RF-03**: Exportação em PNG de slide individual com proporções `1:1`, `4:5` e `9:16`.
- **RF-04**: Navegação com atalhos de teclado (Setas) e adição/remoção de slides reativa.

---

## 3. Histórico de Re-extrações

*(Vazio - será preenchido em futuras execuções do ciclo reverso)*

---

## 4. Arquivadas

*(Vazio)*
