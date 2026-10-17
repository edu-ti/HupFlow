import { BrandColors, BrandKit, BrandKitPreset } from './types';
import { ColorPalette } from '@/lib/canvas/types';
import { BRAND_PRESETS } from './presets';

const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Valida se uma string é um código hexadecimal de cor válido (#RGB ou #RRGGBB).
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  return HEX_COLOR_REGEX.test(color.trim());
}

/**
 * Valida se todas as 5 chaves da paleta corporativa contêm cores hexadecimais válidas.
 */
export function validateBrandColors(colors: Partial<BrandColors>): {
  valid: boolean;
  error?: string;
} {
  const requiredKeys: (keyof BrandColors)[] = [
    'primary',
    'secondary',
    'accent',
    'background',
    'text',
  ];

  for (const key of requiredKeys) {
    const val = colors[key];
    if (!val) {
      return { valid: false, error: `A cor "${key}" é obrigatória.` };
    }
    if (!isValidHexColor(val)) {
      return {
        valid: false,
        error: `O valor "${val}" para a cor "${key}" não é um código hexadecimal válido (ex: #6366F1).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Converte as cores de um Brand Kit para o formato ColorPalette consumido pelo Canvas 2D e Carrosséis.
 */
export function brandColorsToCanvasPalette(colors: BrandColors): ColorPalette {
  return {
    background: colors.background,
    primaryText: colors.text,
    accentColor: colors.primary,
  };
}

/**
 * Gera um Brand Kit padrão a partir do primeiro preset canônico.
 */
export function createDefaultBrandKit(organizationId: string): BrandKit {
  const preset = BRAND_PRESETS[0];
  const now = new Date().toISOString();

  return {
    id: `bkit_${organizationId}_default`,
    organizationId,
    name: 'Identidade HupFlow Padrão',
    isDefault: true,
    colors: { ...preset.colors },
    typography: { ...preset.typography },
    handle: '@hupflow',
    website: 'https://hupflow.com',
    logoUrl: null,
    createdAt: now,
    updatedAt: now,
  };
}
