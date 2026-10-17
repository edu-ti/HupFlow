import {
  VerticalChannelType,
  VerticalMediaSpec,
  VerticalMediaValidationResult,
  VerticalVideoPost,
  VerticalPublishSummary,
} from './types';

export function validateVerticalMediaRequirements(
  spec: VerticalMediaSpec,
  channel: VerticalChannelType
): VerticalMediaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const ratio = spec.width / spec.height;
  // 9:16 is ~0.5625. We accept variance between 0.52 and 0.62.
  if (ratio > 0.65 || ratio < 0.5) {
    errors.push(`Proporção de vídeo inválida (${spec.width}x${spec.height}). Deve ser estritamente vertical 9:16.`);
  }

  if (spec.width < 720 || spec.height < 1280) {
    errors.push('Resolução abaixo do mínimo aceito (mínimo 720x1280 HD).');
  } else if (spec.width < 1080 || spec.height < 1920) {
    warnings.push('Recomendado 1080x1920 (Full HD) para máxima retenção e qualidade algorítmica.');
  }

  if (spec.durationSeconds < 3) {
    errors.push('Duração mínima de vídeo é de 3 segundos.');
  }

  if (channel === 'youtube_shorts') {
    if (spec.durationSeconds > 60) {
      errors.push('YouTube Shorts aceita vídeos com duração máxima de 60 segundos.');
    }
  } else if (channel === 'tiktok') {
    if (spec.durationSeconds > 600) {
      errors.push('TikTok Content Posting API aceita vídeos de no máximo 10 minutos (600s).');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function formatTikTokPublishPayload(post: VerticalVideoPost) {
  return {
    post_info: {
      title: post.title,
      description: post.caption,
      privacy_level: post.privacyLevel.toUpperCase(),
      disable_duet: post.tiktokSettings.disableDuet,
      disable_stitch: post.tiktokSettings.disableStitch,
      disable_comment: post.tiktokSettings.disableComments,
      brand_content_toggle: false,
      is_aigc: post.tiktokSettings.isAiGenerated,
    },
    source_info: {
      source: 'PULL_FROM_URL',
      video_url: post.videoUrl,
    },
  };
}

export function formatYouTubeShortsPublishPayload(post: VerticalVideoPost) {
  // Guarantee #Shorts is present for algorithm auto-tagging
  const cleanTitle = post.title.includes('#Shorts') ? post.title : `${post.title} #Shorts`;
  const cleanDescription = post.caption.includes('#Shorts') ? post.caption : `${post.caption}\n\n#Shorts`;

  return {
    snippet: {
      title: cleanTitle.slice(0, 100),
      description: cleanDescription,
      categoryId: '22', // People & Blogs / General
    },
    status: {
      privacyStatus: post.privacyLevel === 'friends_only' ? 'unlisted' : post.privacyLevel,
      selfDeclaredMadeForKids: post.youtubeSettings.isMadeForKids,
    },
  };
}

export function summarizeVerticalChannelPortfolio(
  posts: VerticalVideoPost[]
): VerticalPublishSummary {
  const totalPosts = posts.length;
  const scheduledCount = posts.filter(p => p.status === 'scheduled').length;
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const tiktokPostsCount = posts.filter(p => p.channels.includes('tiktok')).length;
  const youtubeShortsCount = posts.filter(p => p.channels.includes('youtube_shorts')).length;

  const totalDuration = posts.reduce((acc, p) => acc + (p.durationSeconds || 0), 0);
  const averageDurationSeconds = totalPosts > 0 ? Math.round(totalDuration / totalPosts) : 0;

  return {
    totalPosts,
    scheduledCount,
    publishedCount,
    tiktokPostsCount,
    youtubeShortsCount,
    averageDurationSeconds,
  };
}

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
