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
