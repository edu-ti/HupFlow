export type BioThemePreset =
  | 'midnight'
  | 'minimal_light'
  | 'sunset_gradient'
  | 'ocean_breeze'
  | 'emerald_luxe';

export interface BioSocialLinks {
  [key: string]: string | undefined;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  github?: string;
  website?: string;
}

export interface BioCustomTheme {
  bgGradient?: string;
  bgColor?: string;
  cardBg?: string;
  textColor?: string;
  accentColor?: string;
  buttonStyle?: 'rounded' | 'pill' | 'square';
}

export interface BioProfile {
  id: string;
  workspaceId: string;
  handle: string;
  title: string;
  bio?: string | null;
  avatarUrl?: string | null;
  theme: BioThemePreset;
  customThemeConfig?: BioCustomTheme | null;
  socialLinks: BioSocialLinks;
  showPostsShowcase: boolean;
  isPublished: boolean;
  totalViews: number;
  createdAt: number;
  updatedAt: number;
}

export interface BioLink {
  id: string;
  profileId: string;
  title: string;
  subtitle?: string | null;
  url: string;
  icon?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  clickCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface BioShowcasePost {
  id: string;
  title: string;
  coverUrl?: string;
  publishedAt: number;
  channels: string[];
}

export interface BioPublicData {
  profile: BioProfile;
  links: BioLink[];
  recentPosts?: BioShowcasePost[];
}

export interface BioStats {
  totalViews: number;
  totalClicks: number;
  ctr: number;
}
