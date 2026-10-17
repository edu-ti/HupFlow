export type CommerceProductCategory =
  | 'saas_plan'
  | 'digital_course'
  | 'physical_product'
  | 'consulting_service';

export type CommerceSocialChannel =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'linkedin';

export type CommerceVelocityTier =
  | 'bestseller'
  | 'high_margin'
  | 'steady'
  | 'needs_optimization';

export interface SocialCommerceAttributionMetrics {
  totalRevenueBrl: number;
  checkoutConversionPct: number;
  epcBrl: number;
  socialRpmBrl: number;
  velocityTier: CommerceVelocityTier;
}

export interface SocialCommerceProductItem {
  id: string;
  organizationId: string;
  sku: string;
  name: string;
  category: CommerceProductCategory;
  channel: CommerceSocialChannel;
  priceBrl: number;
  checkoutUrl: string;
  taggedPostsCount: number;
  taggedImpressions: number;
  productClicks: number;
  ordersCount: number;
  metrics: SocialCommerceAttributionMetrics;
  shoppableCopy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialCommerceCatalogSummary {
  totalProducts: number;
  totalRevenueBrl: number;
  totalOrders: number;
  avgCheckoutConversionPct: number;
  avgSocialRpmBrl: number;
}

export interface CreateCommerceProductInput {
  sku?: string;
  name: string;
  category: CommerceProductCategory;
  channel: CommerceSocialChannel;
  priceBrl: number;
  checkoutUrl: string;
}
