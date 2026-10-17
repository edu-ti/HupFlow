import { PlanTier, PlanConfig, PlanLimits } from './types';

export const PLANS: Record<PlanTier, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    tagline: 'Ideal para criadores individuais iniciando nas redes',
    priceMonthly: 49,
    currency: 'BRL',
    limits: {
      maxSocialAccounts: 3,
      maxTeamMembers: 1,
      maxPostsPerMonth: 30,
      maxStorageBytes: 5 * 1024 * 1024 * 1024, // 5 GB
      hasAiCopywriter: true,
      hasVectorPdfExport: false,
      hasPrioritySupport: false,
    },
    features: [
      'Até 3 contas sociais conectadas',
      '1 usuário no workspace',
      '30 posts agendados por mês',
      '5 GB de armazenamento de mídias',
      'Estúdio de carrosséis 2D (PNG)',
      'Copywriting básico com IA',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'O plano perfeito para agências e criadores profissionais',
    priceMonthly: 149,
    currency: 'BRL',
    badge: 'Mais Popular',
    limits: {
      maxSocialAccounts: 10,
      maxTeamMembers: 5,
      maxPostsPerMonth: -1, // Ilimitado
      maxStorageBytes: 25 * 1024 * 1024 * 1024, // 25 GB
      hasAiCopywriter: true,
      hasVectorPdfExport: true,
      hasPrioritySupport: false,
    },
    features: [
      'Até 10 contas sociais conectadas',
      'Até 5 membros na equipe',
      'Publicações e agendamentos ilimitados',
      '25 GB de biblioteca de mídia',
      'Exportação em PDF vetorial para LinkedIn',
      'Copywriter e Carrosséis IA ilimitados',
      'Controle de papéis RBAC completo',
    ],
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    tagline: 'Para grandes times, múltiplas marcas e operações em escala',
    priceMonthly: 349,
    currency: 'BRL',
    badge: 'Escala Total',
    limits: {
      maxSocialAccounts: -1, // Ilimitado
      maxTeamMembers: 15,
      maxPostsPerMonth: -1, // Ilimitado
      maxStorageBytes: 100 * 1024 * 1024 * 1024, // 100 GB
      hasAiCopywriter: true,
      hasVectorPdfExport: true,
      hasPrioritySupport: true,
    },
    features: [
      'Contas sociais ilimitadas',
      'Até 15 colaboradores na equipe',
      'Publicações e agendamentos ilimitados',
      '100 GB de armazenamento de mídias',
      'Exportação em PDF vetorial para LinkedIn',
      'Relatórios e métricas avançadas',
      'Suporte prioritário dedicado',
    ],
  },
};

/**
 * Retorna as configurações do plano especificado ou fallback para starter.
 */
export function getPlanConfig(tier?: string | null): PlanConfig {
  if (tier === 'pro' || tier === 'agency' || tier === 'starter') {
    return PLANS[tier];
  }
  return PLANS.starter;
}

/**
 * Valida se uma operação pode ser realizada contra a cota do plano contratado.
 */
export function checkResourceQuota(
  tier: PlanTier,
  resource: 'socialAccounts' | 'teamMembers' | 'postsThisMonth' | 'storageBytes',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number; reason?: string } {
  const plan = getPlanConfig(tier);
  let limit: number;

  switch (resource) {
    case 'socialAccounts':
      limit = plan.limits.maxSocialAccounts;
      break;
    case 'teamMembers':
      limit = plan.limits.maxTeamMembers;
      break;
    case 'postsThisMonth':
      limit = plan.limits.maxPostsPerMonth;
      break;
    case 'storageBytes':
      limit = plan.limits.maxStorageBytes;
      break;
  }

  // Limite ilimitado
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: Infinity };
  }

  if (currentUsage >= limit) {
    const resourceNames: Record<string, string> = {
      socialAccounts: 'contas sociais conectadas',
      teamMembers: 'membros na equipe',
      postsThisMonth: 'posts agendados no mês',
      storageBytes: 'espaço de armazenamento de mídias',
    };

    return {
      allowed: false,
      limit,
      remaining: 0,
      reason: `Você atingiu o limite de ${limit} ${resourceNames[resource]} do plano ${plan.name}. Faça upgrade para continuar expandindo.`,
    };
  }

  return {
    allowed: true,
    limit,
    remaining: limit - currentUsage,
  };
}
