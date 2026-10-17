import {
  AgencyBrandProfile,
  AgencyPortfolioSummary,
  FilterBrandsOptions,
} from './types';

export function filterAgencyBrands(
  brands: AgencyBrandProfile[],
  options: FilterBrandsOptions = {}
): AgencyBrandProfile[] {
  const { query, niche, favoritesOnly, status } = options;
  const q = query?.trim().toLowerCase();

  return brands
    .filter(b => {
      if (favoritesOnly && !b.isFavorite) {
        return false;
      }

      if (status && b.status !== status) {
        return false;
      }

      if (niche && niche !== 'all' && b.niche.toLowerCase() !== niche.toLowerCase()) {
        return false;
      }

      if (q) {
        const nameMatch = b.brandName.toLowerCase().includes(q);
        const slugMatch = b.slug.toLowerCase().includes(q);
        const nicheMatch = b.niche.toLowerCase().includes(q);
        const tagMatch = b.tags.some(t => t.toLowerCase().includes(q));
        if (!nameMatch && !slugMatch && !nicheMatch && !tagMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // 1. Favorites always first
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;

      // 2. Highest scheduled posts count next
      if (b.scheduledPostsCount !== a.scheduledPostsCount) {
        return b.scheduledPostsCount - a.scheduledPostsCount;
      }

      // 3. Alphabetical name
      return a.brandName.localeCompare(b.brandName);
    });
}

export function calculateAgencyPortfolioSummary(
  brands: AgencyBrandProfile[]
): AgencyPortfolioSummary {
  const totalBrands = brands.length;
  if (totalBrands === 0) {
    return {
      totalBrands: 0,
      activeBrands: 0,
      totalConnectedChannels: 0,
      totalScheduledPosts: 0,
      favoriteBrandsCount: 0,
      averageQuotaUtilizationPct: 0,
    };
  }

  const activeBrands = brands.filter(b => b.status === 'active').length;
  const totalConnectedChannels = brands.reduce((acc, b) => acc + (b.connectedChannelsCount || 0), 0);
  const totalScheduledPosts = brands.reduce((acc, b) => acc + (b.scheduledPostsCount || 0), 0);
  const favoriteBrandsCount = brands.filter(b => b.isFavorite).length;

  const totalQuota = brands.reduce((acc, b) => acc + (b.monthlyPostQuota || 60), 0);
  const averageQuotaUtilizationPct =
    totalQuota > 0 ? Math.round((totalScheduledPosts / totalQuota) * 1000) / 10 : 0;

  return {
    totalBrands,
    activeBrands,
    totalConnectedChannels,
    totalScheduledPosts,
    favoriteBrandsCount,
    averageQuotaUtilizationPct,
  };
}

// -------------------------------------------------------------------
// Test Execution Suite
// -------------------------------------------------------------------
function runAgencyUnitTests() {
  console.log('--- Running Feature 043 Agency Multi-Brand Switcher Unit Tests ---');

  const now = new Date().toISOString();
  const mockBrands: AgencyBrandProfile[] = [
    {
      id: 'brand-01',
      organizationId: 'org-alfa',
      brandName: 'Alfa Suplementos',
      slug: 'alfa-suplementos',
      niche: 'Saúde & Fitness',
      colorHex: '#10b981',
      tier: 'premium',
      isFavorite: true,
      connectedChannelsCount: 4,
      scheduledPostsCount: 18,
      monthlyPostQuota: 60,
      status: 'active',
      tags: ['whey', 'fitness', 'ecommerce'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand-02',
      organizationId: 'org-beta',
      brandName: 'Beta Capital Investimentos',
      slug: 'beta-capital',
      niche: 'Finanças & B2B',
      colorHex: '#3b82f6',
      tier: 'enterprise_vip',
      isFavorite: false,
      connectedChannelsCount: 3,
      scheduledPostsCount: 25,
      monthlyPostQuota: 80,
      status: 'active',
      tags: ['investimentos', 'wealth', 'financas'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand-03',
      organizationId: 'org-gama',
      brandName: 'Gama Moda Sustentável',
      slug: 'gama-moda',
      niche: 'E-commerce Moda',
      colorHex: '#ec4899',
      tier: 'standard',
      isFavorite: true,
      connectedChannelsCount: 2,
      scheduledPostsCount: 5,
      monthlyPostQuota: 30,
      status: 'onboarding',
      tags: ['moda', 'sustentavel', 'lookbook'],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'brand-04',
      organizationId: 'org-delta',
      brandName: 'Delta Construtora',
      slug: 'delta-construtora',
      niche: 'Imobiliário',
      colorHex: '#f59e0b',
      tier: 'standard',
      isFavorite: false,
      connectedChannelsCount: 1,
      scheduledPostsCount: 0,
      monthlyPostQuota: 30,
      status: 'paused',
      tags: ['imoveis', 'loteamento'],
      createdAt: now,
      updatedAt: now,
    },
  ];

  // 1. Test filtering by query
  const searchResults = filterAgencyBrands(mockBrands, { query: 'fitness' });
  if (searchResults.length !== 1 || searchResults[0].slug !== 'alfa-suplementos') {
    throw new Error('Search query by tag failed');
  }

  // 2. Test sorting: favorites must appear first
  const allFiltered = filterAgencyBrands(mockBrands, {});
  if (allFiltered.length !== 4) throw new Error('Expected 4 brands in total');
  if (!allFiltered[0].isFavorite || !allFiltered[1].isFavorite) {
    throw new Error('Favorites must be sorted first');
  }
  // Between the 2 favorites (Alfa with 18 posts vs Gama with 5 posts), Alfa must be 1st
  if (allFiltered[0].id !== 'brand-01') {
    throw new Error('Highest scheduled posts favorite should be first');
  }

  // 3. Test favoritesOnly filter
  const favoritesOnly = filterAgencyBrands(mockBrands, { favoritesOnly: true });
  if (favoritesOnly.length !== 2) {
    throw new Error(`Expected 2 favorites, got ${favoritesOnly.length}`);
  }

  // 4. Test niche filter
  const financeBrands = filterAgencyBrands(mockBrands, { niche: 'Finanças & B2B' });
  if (financeBrands.length !== 1 || financeBrands[0].id !== 'brand-02') {
    throw new Error('Niche filter failed');
  }

  // 5. Test status filter
  const activeBrands = filterAgencyBrands(mockBrands, { status: 'active' });
  if (activeBrands.length !== 2) {
    throw new Error(`Expected 2 active brands, got ${activeBrands.length}`);
  }

  // 6. Test portfolio summary calculations
  const summary = calculateAgencyPortfolioSummary(mockBrands);
  if (summary.totalBrands !== 4) throw new Error(`Expected 4 brands, got ${summary.totalBrands}`);
  if (summary.activeBrands !== 2) throw new Error(`Expected 2 active brands, got ${summary.activeBrands}`);
  if (summary.totalConnectedChannels !== 10) throw new Error(`Expected 10 channels, got ${summary.totalConnectedChannels}`);
  if (summary.totalScheduledPosts !== 48) throw new Error(`Expected 48 scheduled posts, got ${summary.totalScheduledPosts}`);
  if (summary.favoriteBrandsCount !== 2) throw new Error(`Expected 2 favorites, got ${summary.favoriteBrandsCount}`);
  // totalQuota = 60+80+30+30 = 200. totalPosts = 48. utilization = (48/200)*100 = 24.0%
  if (summary.averageQuotaUtilizationPct !== 24.0) {
    throw new Error(`Expected 24.0% utilization, got ${summary.averageQuotaUtilizationPct}%`);
  }

  console.log('✅ All Feature 043 Agency Multi-Brand Switcher unit tests passed successfully!');
}

runAgencyUnitTests();
