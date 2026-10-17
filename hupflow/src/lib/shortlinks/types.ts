export type SocialNetwork =
  | 'instagram'
  | 'threads'
  | 'linkedin'
  | 'x'
  | 'direct';

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface ShortLink {
  id: string;
  organizationId: string;
  slug: string;
  destinationUrl: string;
  title: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  totalClicks: number;
  lastClickedAt?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShortLinkInput {
  destinationUrl: string;
  title: string;
  customSlug?: string;
  utmCampaign?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
}

export interface ShortLinkVariant {
  network: SocialNetwork;
  label: string;
  url: string;
  utmSource: string;
}

export interface ShortLinkClickRecord {
  id: string;
  shortLinkId: string;
  organizationId: string;
  referer?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
  channelHint?: string | null;
  clickedAt: string;
}
