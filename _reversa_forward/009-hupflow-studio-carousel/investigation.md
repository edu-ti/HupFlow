# Investigação Técnica: Renderização de Carrosséis & Exportação PDF

> Feature: `009-hupflow-studio-carousel`  
> Data: `2026-10-15`  

---

## 1. Contexto e Objetivos

O LinkedIn possui uma funcionalidade única em que postagens de documentos PDF são renderizadas no feed como um carrossel deslizável interativo. Criadores de conteúdo utilizam essa mecânica para gerar altíssimo engajamento (dwell time), pois cada clique na seta de avançar página sinaliza relevância ao algoritmo da plataforma.

No sistema legado analisado:
- O **Postiz** não gerava carrosséis em PDF nativos; dependia apenas de posts com mídias simples.
- O **Polotno Studio** dependia de um backend remoto com Chromium ou de um SDK fechado pago por assento para gerar PDFs.
- O **Carousel Generator** usava React-PDF com limitações visuais e compilação pesada.

## 2. Padrão Adotado no HupFlow (Client-side Canvas + jsPDF)

A estratégia adotada no HupFlow resolve isso de forma elegante:
1. **HTML5 Canvas 2D:** Renderiza os textos, gradientes, ícones e tags diretamente no buffer gráfico do navegador.
2. **Resolução Nativa:** 1080x1080 (1:1) ou 1080x1350 (4:5).
3. **jsPDF:** Compilação vetorizada / rasterizada no cliente:
   ```javascript
   import { jsPDF } from 'jspdf';

   const doc = new jsPDF({
     orientation: width > height ? 'landscape' : 'portrait',
     unit: 'px',
     format: [width, height],
   });

   slides.forEach((slide, idx) => {
     if (idx > 0) doc.addPage([width, height]);
     const imgData = renderSlideToDataUrl(slide, width, height);
     doc.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
   });

   doc.save('carrossel-hupflow.pdf');
   ```

## 3. Benefícios Técnicos
- **Custo Zero de Servidor:** Não é necessário manter clusters de servidores headless.
- **Velocidade Instantânea:** O download inicia em milissegundos após o clique do usuário.
- **Privacidade Total:** As imagens e textos do usuário não precisam trafegar para serviços de terceiros para serem compilados em PDF.
