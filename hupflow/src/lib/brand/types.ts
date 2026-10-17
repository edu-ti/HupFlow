export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandTypography {
  fontFamilyHeading: string;
  fontFamilyBody: string;
}

export interface BrandKit {
  id: string;
  organizationId: string;
  name: string;
  isDefault: boolean;
  colors: BrandColors;
  typography: BrandTypography;
  handle?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandKitPreset {
  id: string;
  name: string;
  description: string;
  colors: BrandColors;
  typography: BrandTypography;
}

export interface BrandKitsApiResponse {
  brandKits: BrandKit[];
  presets: BrandKitPreset[];
  defaultKitId?: string;
}
