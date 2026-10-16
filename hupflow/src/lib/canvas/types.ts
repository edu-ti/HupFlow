export type AspectRatio = '1:1' | '4:5' | '9:16';

export type SlideType = 'cover' | 'content' | 'quote' | 'statistic' | 'cta';

export interface SlideData {
  slideNumber: number;
  type: SlideType;
  headline: string;
  bodyText: string;
  highlightText?: string;
  suggestedIcon?: string;
}

export interface ColorPalette {
  background: string;
  primaryText: string;
  accentColor: string;
}

export interface SlideDimensions {
  width: number;
  height: number;
  displayAspect: string;
}

export interface CarouselDeck {
  topic: string;
  targetAudience: string;
  aspectRatio: AspectRatio;
  colorPalette: ColorPalette;
  slides: SlideData[];
}

export interface CarouselExportOptions {
  fileName?: string;
  authorHandle?: string;
  quality?: number; // 0.1 a 1.0
}
