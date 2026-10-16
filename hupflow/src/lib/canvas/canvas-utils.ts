import { AspectRatio, SlideDimensions } from './types';

/**
 * Retorna as dimensões em pixels e a classe de aspecto do Tailwind para a proporção dada.
 */
export function getDimensionsForAspectRatio(ratio: AspectRatio): SlideDimensions {
  switch (ratio) {
    case '4:5':
      return { width: 1080, height: 1350, displayAspect: 'aspect-[4/5]' };
    case '9:16':
      return { width: 1080, height: 1920, displayAspect: 'aspect-[9/16]' };
    case '1:1':
    default:
      return { width: 1080, height: 1080, displayAspect: 'aspect-square' };
  }
}

/**
 * Quebra uma string de texto em linhas que cabem na largura máxima especificada,
 * usando uma função calculadora de largura de texto (função pura desacoplada do Canvas DOM).
 */
export function calculateTextLines(
  text: string,
  maxWidth: number,
  measureWidthFn: (text: string) => number
): string[] {
  if (!text) return [];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = measureWidthFn(candidate);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}
