import {
  VerticalChannelType,
  VerticalMediaSpec,
  VerticalMediaValidationResult,
  VerticalVideoPost,
  VerticalPublishSummary,
} from './types';
import {
  validateVerticalMediaRequirements,
  formatTikTokPublishPayload,
  formatYouTubeShortsPublishPayload,
  summarizeVerticalChannelPortfolio,
} from './vertical-utils';

export {
  validateVerticalMediaRequirements,
  formatTikTokPublishPayload,
  formatYouTubeShortsPublishPayload,
  summarizeVerticalChannelPortfolio,
};

// -------------------------------------------------------------------
// Test Execution Suite
// -------------------------------------------------------------------
function runVerticalConnectorsUnitTests() {
  console.log('--- Running Feature 046 TikTok & YouTube Shorts Connectors Unit Tests ---');

  // 1. Valid 9:16 Video
  const validSpec: VerticalMediaSpec = {
    width: 1080,
    height: 1920,
    durationSeconds: 45,
  };
  const validTikTok = validateVerticalMediaRequirements(validSpec, 'tiktok');
  if (!validTikTok.isValid || validTikTok.errors.length > 0) {
    throw new Error('Valid 1080x1920 45s video should pass TikTok validation');
  }

  const validShorts = validateVerticalMediaRequirements(validSpec, 'youtube_shorts');
  if (!validShorts.isValid || validShorts.errors.length > 0) {
    throw new Error('Valid 1080x1920 45s video should pass Shorts validation');
  }

  // 2. Reject Horizontal Video (1920x1080)
  const invalidAspect: VerticalMediaSpec = {
    width: 1920,
    height: 1080,
    durationSeconds: 30,
  };
  const invalidAspectResult = validateVerticalMediaRequirements(invalidAspect, 'tiktok');
  if (invalidAspectResult.isValid || invalidAspectResult.errors.length === 0) {
    throw new Error('Horizontal video must be rejected');
  }

  // 3. Reject Duration > 60s for YouTube Shorts
  const longVideo: VerticalMediaSpec = {
    width: 1080,
    height: 1920,
    durationSeconds: 75,
  };
  const longShortsResult = validateVerticalMediaRequirements(longVideo, 'youtube_shorts');
  if (longShortsResult.isValid) {
    throw new Error('YouTube Shorts must reject videos longer than 60 seconds');
  }
  // But TikTok should allow 75s
  const longTikTokResult = validateVerticalMediaRequirements(longVideo, 'tiktok');
  if (!longTikTokResult.isValid) {
    throw new Error('TikTok must allow 75s videos');
  }

  // 4. Payload formatting
  const mockPost: VerticalVideoPost = {
    id: 'vert-01',
    organizationId: 'org-test',
    title: '3 Dicas Rápidas de Produtividade',
    caption: 'Veja como dobrar sua eficiência em 2026.',
    videoUrl: 'https://cdn.hupflow.com/v/prod.mp4',
    channels: ['tiktok', 'youtube_shorts'],
    durationSeconds: 42,
    width: 1080,
    height: 1920,
    privacyLevel: 'public',
    tiktokSettings: {
      disableComments: false,
      disableDuet: false,
      disableStitch: false,
      isAiGenerated: true,
    },
    youtubeSettings: {
      isMadeForKids: false,
      containsPaidPromotion: false,
    },
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const ttPayload = formatTikTokPublishPayload(mockPost);
  if (!ttPayload.post_info.is_aigc) throw new Error('TikTok AIGC disclosure mismatch');

  const ytPayload = formatYouTubeShortsPublishPayload(mockPost);
  if (!ytPayload.snippet.title.includes('#Shorts')) throw new Error('YouTube payload must contain #Shorts');

  // 5. Portfolio Summary
  const summary = summarizeVerticalChannelPortfolio([mockPost, { ...mockPost, id: 'vert-02', channels: ['tiktok'], durationSeconds: 28, status: 'published' }]);
  if (summary.totalPosts !== 2) throw new Error('Expected 2 posts');
  if (summary.publishedCount !== 1) throw new Error('Expected 1 published');
  if (summary.tiktokPostsCount !== 2) throw new Error('Expected 2 TikTok posts');
  if (summary.youtubeShortsCount !== 1) throw new Error('Expected 1 YouTube Shorts post');
  if (summary.averageDurationSeconds !== 35) throw new Error(`Expected 35s avg, got ${summary.averageDurationSeconds}`);

  console.log('✅ All Feature 046 TikTok & YouTube Shorts Connectors unit tests passed successfully!');
}

runVerticalConnectorsUnitTests();
