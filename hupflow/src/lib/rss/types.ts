export type RssFeedStatus = 'active' | 'paused' | 'error';

export type RssItemStatus = 'pending' | 'drafted' | 'published' | 'ignored';

export interface RssFeed {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  status: RssFeedStatus;
  autoPublish: boolean;
  targetNetworks: string[];
  lastFetchedAt?: string | null;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RssFeedItem {
  id: string;
  feedId: string;
  organizationId: string;
  guid: string;
  title: string;
  link: string;
  summary?: string | null;
  imageUrl?: string | null;
  pubDate?: string | null;
  status: RssItemStatus;
  postId?: string | null;
  createdAt: string;
}

export interface ParsedFeedItem {
  guid: string;
  title: string;
  link: string;
  summary: string;
  imageUrl?: string | null;
  pubDate?: string | null;
}

export interface ParsedFeedResult {
  title: string;
  description?: string;
  link?: string;
  items: ParsedFeedItem[];
}

export interface CreateRssFeedInput {
  name: string;
  url: string;
  autoPublish?: boolean;
  targetNetworks?: string[];
}

export interface SynthesizeRssPostInput {
  itemId: string;
  network?: 'linkedin' | 'x' | 'instagram' | 'threads';
  tone?: 'educational' | 'professional' | 'provocative' | 'casual';
}

export interface SynthesizeRssPostResult {
  content: string;
  hooks: string[];
  hashtags: string[];
  targetNetwork: string;
}
