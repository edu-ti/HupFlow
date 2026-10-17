export type WatermarkPosition =
  | 'bottom_right'
  | 'bottom_left'
  | 'top_right'
  | 'top_left'
  | 'center';

export type WatermarkType = 'logo' | 'text' | 'combined';

export interface WatermarkSettings {
  id: string;
  organizationId: string;
  watermarkType: WatermarkType;
  position: WatermarkPosition;
  opacity: number; // 10 a 100
  scalePercent: number; // 5 a 35%
  marginPx: number; // Margem das bordas em pixels
  customText?: string | null;
  logoUrl?: string | null;
  autoApply: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateWatermarkSettingsInput {
  watermarkType?: WatermarkType;
  position?: WatermarkPosition;
  opacity?: number;
  scalePercent?: number;
  marginPx?: number;
  customText?: string | null;
  logoUrl?: string | null;
  autoApply?: boolean;
}

export interface WatermarkCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WatermarkApiResponse {
  settings: WatermarkSettings;
  brandKitDefaults?: {
    handle?: string | null;
    logoUrl?: string | null;
  };
}
