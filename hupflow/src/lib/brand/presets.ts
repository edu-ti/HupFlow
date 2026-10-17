import { BrandKitPreset } from './types';

export const BRAND_PRESETS: BrandKitPreset[] = [
  {
    id: 'preset_modern_dark',
    name: 'Modern Dark (HupFlow Indigo)',
    description: 'Estética clean-room com alto contraste, tons escuros e acentos vibrantes em ciano e índigo.',
    colors: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#06B6D4',
      background: '#0B0F17',
      text: '#F8FAFC',
    },
    typography: {
      fontFamilyHeading: 'Inter',
      fontFamilyBody: 'Inter',
    },
  },
  {
    id: 'preset_neo_purple',
    name: 'Neo Purple (Criadores & Growth)',
    description: 'Gradientes modernos e energéticos em púrpura e rosa choque, ideal para criadores de audiência.',
    colors: {
      primary: '#A855F7',
      secondary: '#7E22CE',
      accent: '#F43F5E',
      background: '#0F0C20',
      text: '#F5F3FF',
    },
    typography: {
      fontFamilyHeading: 'Outfit',
      fontFamilyBody: 'Inter',
    },
  },
  {
    id: 'preset_cyber_emerald',
    name: 'Cyber Emerald (Tech & Startups)',
    description: 'Visual futurista inspirado em fintechs e inteligência artificial com acentos esmeralda.',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#38BDF8',
      background: '#061412',
      text: '#ECFDF5',
    },
    typography: {
      fontFamilyHeading: 'Plus Jakarta Sans',
      fontFamilyBody: 'Inter',
    },
  },
  {
    id: 'preset_clean_minimalist',
    name: 'Clean Minimalist (Light Mode)',
    description: 'Design editorial clássico em fundo branco com tipografia preta elegante e azul real.',
    colors: {
      primary: '#2563EB',
      secondary: '#1D4ED8',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#0F172A',
    },
    typography: {
      fontFamilyHeading: 'Inter',
      fontFamilyBody: 'Inter',
    },
  },
  {
    id: 'preset_warm_corporate',
    name: 'Warm Corporate (Executivos & Negócios)',
    description: 'Tons de grafite e acentos em âmbar e ouro, transmitindo autoridade e sofisticação.',
    colors: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#10B981',
      background: '#121214',
      text: '#F4F4F5',
    },
    typography: {
      fontFamilyHeading: 'Merriweather',
      fontFamilyBody: 'Inter',
    },
  },
];

export const DEFAULT_BRAND_PRESETS = BRAND_PRESETS;
