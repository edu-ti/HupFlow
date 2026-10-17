export type RepurposingSourceType = 'youtube_transcript' | 'blog_post' | 'podcast_audio' | 'pdf_whitepaper' | 'webinar_notes';

export type RepurposingTone = 'authoritative' | 'casual_storytelling' | 'provocative_growth' | 'didactic_educational' | 'minimalist_bullet';

export type RepurposingKitStatus = 'draft' | 'approved' | 'scheduled' | 'published';

export interface CarouselSlideItem {
  slideNumber: number;
  badge: string;
  headline: string;
  body: string;
  visualCue: string;
}

export interface XThreadTweet {
  tweetNumber: number;
  content: string;
  charCount: number;
  hookType: 'question' | 'contrarian' | 'data_nugget' | 'takeaway';
}

export interface VerticalReelScript {
  durationSeconds: number;
  hook: {
    durationSec: number;
    spokenLine: string;
    onScreenText: string;
    bRollVisual: string;
  };
  keyPoints: Array<{
    timestampSec: number;
    title: string;
    actionCue: string;
    spokenText: string;
  }>;
  callToAction: {
    durationSec: number;
    spokenLine: string;
    stickerOrGraphic: string;
  };
}

export interface ExecutiveNewsletter {
  subjectLine: string;
  previewText: string;
  greeting: string;
  coreInsight: string;
  keyBulletTakeaways: string[];
  ctaButtonText: string;
  ctaUrl: string;
  readingTimeMinutes: number;
}

export interface ContentRepurposingKit {
  id: string;
  organizationId: string;
  title: string;
  sourceType: RepurposingSourceType;
  sourceUrl?: string;
  sourceWordCount: number;
  tone: RepurposingTone;
  status: RepurposingKitStatus;
  carouselSlides: CarouselSlideItem[];
  xThread: XThreadTweet[];
  reelScript: VerticalReelScript;
  newsletter: ExecutiveNewsletter;
  tags: string[];
  estimatedTimeSavedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepurposingKitInput {
  title: string;
  sourceType: RepurposingSourceType;
  sourceUrl?: string;
  rawText: string;
  tone?: RepurposingTone;
  tags?: string[];
}

export interface RepurposingSummaryMetrics {
  totalKits: number;
  totalSlidesGenerated: number;
  totalTweetsGenerated: number;
  totalReelScriptsGenerated: number;
  totalNewslettersGenerated: number;
  totalHoursSaved: number;
}
