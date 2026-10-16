import { NETWORK_CONFIGS, SocialNetwork } from './types';

/**
 * Remove tags HTML e normaliza quebras de linha para envio seguro às APIs sociais.
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  return html
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Retorna se o texto ultrapassa o limite da rede social e os valores numéricos.
 */
export function checkCharLimit(text: string, network: SocialNetwork) {
  const config = NETWORK_CONFIGS[network] || NETWORK_CONFIGS.linkedin;
  const length = text.length;
  const isOver = length > config.charLimit;
  const remaining = config.charLimit - length;

  return {
    length,
    limit: config.charLimit,
    isOver,
    remaining,
  };
}
