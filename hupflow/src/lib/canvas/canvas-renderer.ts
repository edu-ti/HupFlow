import { SlideData, ColorPalette, AspectRatio } from './types';
import { getDimensionsForAspectRatio } from './canvas-utils';

export interface RenderSlideOptions {
  slide: SlideData;
  totalSlides: number;
  aspectRatio: AspectRatio;
  palette: ColorPalette;
  authorHandle?: string;
  canvas?: HTMLCanvasElement;
}

/**
 * Renderiza um slide individual em um elemento canvas com resolução vetorial HD (1080px base).
 * Retorna o próprio canvas renderizado.
 */
export function renderSlideToCanvas(options: RenderSlideOptions): HTMLCanvasElement {
  const { slide, totalSlides, aspectRatio, palette, authorHandle = '@hupflow' } = options;
  const { width, height } = getDimensionsForAspectRatio(aspectRatio);

  const canvas = options.canvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
  if (!canvas) {
    throw new Error('Canvas element não disponível no ambiente de execução.');
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Não foi possível obter contexto 2D do Canvas.');
  }

  // 1. Fundo base
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);

  // 2. Glow radial sutil superior
  const radialGrad = ctx.createRadialGradient(
    width * 0.85,
    height * 0.15,
    60,
    width * 0.85,
    height * 0.15,
    width * 0.75
  );
  radialGrad.addColorStop(0, `${palette.accentColor}30`);
  radialGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Moldura decorativa discreta
  ctx.strokeStyle = `${palette.accentColor}25`;
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // 4. Indicador Superior de Paginação
  ctx.fillStyle = `${palette.primaryText}70`;
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`SLIDE ${slide.slideNumber} / ${totalSlides}`, 80, 100);

  // 5. Highlight Tag (se houver)
  if (slide.highlightText) {
    ctx.fillStyle = `${palette.accentColor}25`;
    ctx.beginPath();
    ctx.roundRect(80, 140, 320, 52, 12);
    ctx.fill();

    ctx.fillStyle = palette.accentColor;
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(slide.highlightText.toUpperCase(), 102, 173);
  }

  // 6. Headline / Título Principal com wrapText
  ctx.fillStyle = palette.primaryText;
  ctx.font = '800 64px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, slide.headline, 80, 290, width - 160, 78);

  // 7. Faixa divisória de acento visual
  ctx.fillStyle = palette.accentColor;
  ctx.fillRect(80, 520, 140, 8);

  // 8. Corpo do Texto com wrapText
  ctx.fillStyle = `${palette.primaryText}CC`;
  ctx.font = '400 36px "Plus Jakarta Sans", sans-serif';
  wrapText(ctx, slide.bodyText, 80, 590, width - 160, 52);

  // 9. Rodapé Institucional
  ctx.fillStyle = `${palette.primaryText}50`;
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`HupFlow Studio • ${authorHandle}`, 80, height - 80);

  return canvas;
}

/**
 * Função interna para desenhar texto quebrando linhas automaticamente no canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  if (!text) return;
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
