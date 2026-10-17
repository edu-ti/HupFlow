import {
  SocialProvider,
  AnalyticsKPIs,
  DailyMetricPoint,
  ChannelBreakdown,
  TopPostMetric,
  AnalyticsResponse,
} from './types';

/**
 * Calcula a taxa de engajamento percentual com 2 casas decimais.
 * Fórmula: ((likes + comments + shares) / reach) * 100
 */
export function calculateEngagementRate(
  likes: number,
  comments: number,
  shares: number,
  reach: number
): number {
  if (reach <= 0) return 0;
  const totalInteractions = likes + comments + shares;
  const rate = (totalInteractions / reach) * 100;
  return Math.round(rate * 100) / 100;
}

/**
 * Converte percentual para número inteiro em base 10000 (ex: 4.85% -> 485)
 */
export function rateToBase10000(ratePercentage: number): number {
  return Math.round(ratePercentage * 100);
}

/**
 * Converte número inteiro em base 10000 de volta para percentual (ex: 485 -> 4.85)
 */
export function base10000ToRate(baseVal: number): number {
  return baseVal / 100;
}

/**
 * Gera uma lista contínua de datas no formato YYYY-MM-DD para os últimos N dias.
 */
export function generateDailyDateRange(days: number): string[] {
  const dates: string[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  return dates;
}

/**
 * Preenche lacunas em uma série temporal diária para garantir continuidade no gráfico.
 */
export function fillDailySeries(
  rawPoints: { date: string; impressions: number; reach: number; engagements: number }[],
  days: number
): DailyMetricPoint[] {
  const dates = generateDailyDateRange(days);
  const map = new Map<string, { impressions: number; reach: number; engagements: number }>();

  for (const p of rawPoints) {
    const existing = map.get(p.date) || { impressions: 0, reach: 0, engagements: 0 };
    map.set(p.date, {
      impressions: existing.impressions + p.impressions,
      reach: existing.reach + p.reach,
      engagements: existing.engagements + p.engagements,
    });
  }

  return dates.map((date) => {
    const found = map.get(date);
    return {
      date,
      impressions: found?.impressions || 0,
      reach: found?.reach || 0,
      engagements: found?.engagements || 0,
    };
  });
}

/**
 * Consolida a distribuição de engajamento e alcance por canal.
 */
export function calculateChannelBreakdown(
  items: { provider: SocialProvider; reach: number; engagements: number; count: number }[]
): ChannelBreakdown[] {
  const providerNames: Record<SocialProvider, string> = {
    instagram: 'Instagram',
    threads: 'Threads',
    linkedin: 'LinkedIn',
    x: 'X (Twitter)',
  };

  const map = new Map<SocialProvider, { reach: number; engagements: number; posts: number }>();

  for (const it of items) {
    const current = map.get(it.provider) || { reach: 0, engagements: 0, posts: 0 };
    map.set(it.provider, {
      reach: current.reach + it.reach,
      engagements: current.engagements + it.engagements,
      posts: current.posts + it.count,
    });
  }

  const totalReachGlobal = Array.from(map.values()).reduce((acc, v) => acc + v.reach, 0);

  const result: ChannelBreakdown[] = [];
  const providers: SocialProvider[] = ['instagram', 'threads', 'linkedin', 'x'];

  for (const p of providers) {
    const data = map.get(p);
    if (!data && items.length > 0) continue;

    const reach = data?.reach || 0;
    const engagements = data?.engagements || 0;
    const posts = data?.posts || 0;

    const rate = reach > 0 ? Math.round(((engagements / reach) * 100) * 100) / 100 : 0;
    const pct = totalReachGlobal > 0 ? Math.round((reach / totalReachGlobal) * 1000) / 10 : 0;

    result.push({
      provider: p,
      name: providerNames[p],
      totalPosts: posts,
      totalReach: reach,
      totalEngagements: engagements,
      engagementRate: rate,
      percentage: pct,
    });
  }

  return result.sort((a, b) => b.totalReach - a.totalReach);
}

/**
 * Gerador de dados demonstrativos e realistas para dev/testes ou novos workspaces.
 */
export function generateMockAnalyticsData(
  period: '7d' | '30d' | '90d',
  providerFilter: 'all' | SocialProvider = 'all'
): AnalyticsResponse {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const dates = generateDailyDateRange(days);

  const baseReach = providerFilter === 'all' ? 1200 : 500;
  const baseImpressions = baseReach * 1.45;

  const dailySeries: DailyMetricPoint[] = dates.map((date, idx) => {
    // Curva orgânica realista com oscilações suaves
    const factor = 0.8 + 0.4 * Math.sin((idx / days) * Math.PI * 3) + (idx % 7 === 5 ? 0.35 : 0);
    const reach = Math.round(baseReach * factor);
    const impressions = Math.round(baseImpressions * factor);
    const engagements = Math.round(reach * (0.045 + 0.025 * Math.cos(idx)));

    return {
      date,
      impressions,
      reach,
      engagements,
    };
  });

  const totalImpressions = dailySeries.reduce((acc, p) => acc + p.impressions, 0);
  const totalReach = dailySeries.reduce((acc, p) => acc + p.reach, 0);
  const totalEngagements = dailySeries.reduce((acc, p) => acc + p.engagements, 0);
  const averageEngagementRate = totalReach > 0 ? Math.round((totalEngagements / totalReach) * 10000) / 100 : 0;

  const channelBreakdown: ChannelBreakdown[] = [
    {
      provider: 'instagram',
      name: 'Instagram',
      totalPosts: Math.round(days * 0.4),
      totalReach: Math.round(totalReach * 0.48),
      totalEngagements: Math.round(totalEngagements * 0.52),
      engagementRate: 6.85,
      percentage: 48.0,
    },
    {
      provider: 'linkedin',
      name: 'LinkedIn',
      totalPosts: Math.round(days * 0.25),
      totalReach: Math.round(totalReach * 0.28),
      totalEngagements: Math.round(totalEngagements * 0.24),
      engagementRate: 5.4,
      percentage: 28.0,
    },
    {
      provider: 'threads',
      name: 'Threads',
      totalPosts: Math.round(days * 0.2),
      totalReach: Math.round(totalReach * 0.15),
      totalEngagements: Math.round(totalEngagements * 0.16),
      engagementRate: 6.7,
      percentage: 15.0,
    },
    {
      provider: 'x',
      name: 'X (Twitter)',
      totalPosts: Math.round(days * 0.15),
      totalReach: Math.round(totalReach * 0.09),
      totalEngagements: Math.round(totalEngagements * 0.08),
      engagementRate: 5.6,
      percentage: 9.0,
    },
  ];

  const topPosts: TopPostMetric[] = [
    {
      id: 'mock_top_1',
      content: '7 Estratégias Comprovadas para Escalar Carrosséis Visuais com IA Sem Perder a Identidade da Marca 🚀',
      provider: 'instagram',
      publishedAt: dates[dates.length - 3] + 'T14:30:00Z',
      impressions: 4820,
      reach: 3640,
      likes: 312,
      comments: 64,
      shares: 48,
      engagementRate: 11.65,
    },
    {
      id: 'mock_top_2',
      content: 'Por que o algoritmo do LinkedIn valoriza PDFs vetoriais nativos mais do que imagens estáticas isoladas...',
      provider: 'linkedin',
      publishedAt: dates[dates.length - 6] + 'T09:15:00Z',
      impressions: 3950,
      reach: 2890,
      likes: 204,
      comments: 38,
      shares: 22,
      engagementRate: 9.13,
    },
    {
      id: 'mock_top_3',
      content: 'Bastidores da criação: do prompt no Copywriter IA à publicação agendada multicanal no HupFlow 💡',
      provider: 'threads',
      publishedAt: dates[dates.length - 9] + 'T18:00:00Z',
      impressions: 2180,
      reach: 1650,
      likes: 115,
      comments: 29,
      shares: 14,
      engagementRate: 9.58,
    },
    {
      id: 'mock_top_4',
      content: 'Produtividade de marketing: automatizando a fila semanal sem perder o toque artesanal de copywriting.',
      provider: 'x',
      publishedAt: dates[dates.length - 12] + 'T11:45:00Z',
      impressions: 1840,
      reach: 1390,
      likes: 88,
      comments: 16,
      shares: 9,
      engagementRate: 8.13,
    },
  ];

  return {
    period,
    provider: providerFilter,
    kpis: {
      totalImpressions,
      totalReach,
      totalEngagements,
      averageEngagementRate,
      impressionsTrend: '+14.2%',
      reachTrend: '+11.8%',
      engagementsTrend: '+19.6%',
      rateTrend: '+1.4%',
    },
    dailySeries,
    channelBreakdown:
      providerFilter === 'all'
        ? channelBreakdown
        : channelBreakdown.filter((c) => c.provider === providerFilter),
    topPosts:
      providerFilter === 'all'
        ? topPosts
        : topPosts.filter((p) => p.provider === providerFilter),
  };
}
