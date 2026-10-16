import { jsPDF } from 'jspdf';
import { CarouselDeck, CarouselExportOptions } from './types';
import { getDimensionsForAspectRatio } from './canvas-utils';
import { renderSlideToCanvas } from './canvas-renderer';

/**
 * Compila e faz o download direto no navegador de um carrossel completo em formato PDF multi-páginas,
 * pronto para ser carregado como Documento / Carrossel no LinkedIn.
 */
export async function exportCarouselToPdf(
  deck: CarouselDeck,
  options: CarouselExportOptions = {}
): Promise<Blob> {
  const { slides, aspectRatio, colorPalette } = deck;
  if (!slides || slides.length === 0) {
    throw new Error('Não há slides para exportar.');
  }

  const { width, height } = getDimensionsForAspectRatio(aspectRatio);
  const fileName = options.fileName || `hupflow-carrossel-${Date.now()}.pdf`;

  // Inicializar jsPDF com orientação e dimensões exatas em pixels
  const doc = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height],
    compress: true,
  });

  // Canvas reutilizável para cada página
  const bufferCanvas = document.createElement('canvas');

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];

    if (i > 0) {
      doc.addPage([width, height]);
    }

    renderSlideToCanvas({
      slide,
      totalSlides: slides.length,
      aspectRatio,
      palette: colorPalette,
      authorHandle: options.authorHandle,
      canvas: bufferCanvas,
    });

    const imgData = bufferCanvas.toDataURL('image/png', options.quality || 0.95);
    doc.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
  }

  // Disparar download direto no browser
  doc.save(fileName);

  return doc.output('blob');
}

/**
 * Exporta um único slide como arquivo PNG de alta resolução
 */
export function exportSingleSlideToPng(
  canvas: HTMLCanvasElement,
  slideIndex: number,
  fileName?: string
): void {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || `hupflow-slide-${slideIndex + 1}.png`;
  a.click();
}
