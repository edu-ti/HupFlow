export type VerticalChannelType = 'tiktok' | 'youtube_shorts';

export type VerticalPrivacyLevel = 'public' | 'unlisted' | 'private' | 'friends_only';

export type VerticalPostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';

export interface TikTokSettings {
  disableComments: boolean;
  disableDuet: boolean;
  disableStitch: boolean;
  isAiGenerated: boolean;
}

export interface YouTubeSettings {
  isMadeForKids: boolean;
  containsPaidPromotion: boolean;
}

export interface VerticalMediaSpec {
  width: number;
  height: number;
  durationSeconds: number;
}

export interface VerticalMediaValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface VerticalVideoPost {
  id: string;
  organizationId: string;
  title: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  channels: VerticalChannelType[];
  durationSeconds: number;
  width: number;
  height: number;
  privacyLevel: VerticalPrivacyLevel;
  tiktokSettings: TikTokSettings;
  youtubeSettings: YouTubeSettings;
  scheduledAt?: string;
  status: VerticalPostStatus;
  externalPublishIds?: {
    tiktokPostId?: string;
    youtubeVideoId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateVerticalPostInput {
  title: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  channels: VerticalChannelType[];
  durationSeconds: number;
  width?: number;
  height?: number;
  privacyLevel?: VerticalPrivacyLevel;
  tiktokSettings?: Partial<TikTokSettings>;
  youtubeSettings?: Partial<YouTubeSettings>;
  scheduledAt?: string;
}

export interface VerticalPublishSummary {
  totalPosts: number;
  scheduledCount: number;
  publishedCount: number;
  tiktokPostsCount: number;
  youtubeShortsCount: number;
  averageDurationSeconds: number;
}
