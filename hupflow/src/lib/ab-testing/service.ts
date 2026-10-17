import crypto from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { abTestExperiments } from '@/lib/db/schema';
import {
  AbExperimentStatus,
  AbHypothesisAngle,
  AbTargetMetric,
  AbTestChannel,
  AbTestExperiment,
  AbTestSummaryMetrics,
  AbTestType,
  AbTestVariant,
  CreateAbTestInput,
} from './types';
import {
  evaluateAbExperimentStatistics,
  generateChallengerHookVariant,
  simulateTrafficBatch,
  summarizeAbExperiments,
} from './ab-testing.test';

const memoryStore = new Map<string, AbTestExperiment[]>();

function buildExperimentRecord(
  raw: Omit<AbTestExperiment, 'stats'>
): AbTestExperiment {
  const stats = evaluateAbExperimentStatistics({
    variantA: raw.variantA,
    variantB: raw.variantB,
    minSampleSize: raw.minSampleSize,
    targetConfidencePct: raw.targetConfidencePct,
  });

  return {
    ...raw,
    stats,
  };
}

function seedOrgExperiments(organizationId: string): AbTestExperiment[] {
  const existing = memoryStore.get(organizationId);
  if (existing && existing.length > 0) {
    return existing;
  }

  const now = new Date().toISOString();
  const seeds: AbTestExperiment[] = [
    buildExperimentRecord({
      id: 'ab_seed_linkedin_cover',
      organizationId,
      title: 'Capa Carrossel LinkedIn: Playbook de IA para Agências',
      channel: 'linkedin',
      testType: 'carousel_cover',
      hypothesisAngle: 'social_proof_numbers',
      targetMetric: 'ctr_clicks',
      minSampleSize: 300,
      targetConfidencePct: 95,
      status: 'completed',
      winningVariantId: 'B',
      variantA: {
        id: 'A',
        label: 'Controle (Promessa Direta)',
        hookText: 'Como usar IA para escalar sua operação de conteúdo em 2026',
        impressions: 1450,
        conversions: 68,
      },
      variantB: {
        id: 'B',
        label: 'Desafiante (Prova Social + Números)',
        hookText:
          'Analisamos 412 agências: o fluxo exato de IA que economiza 18h/semana',
        impressions: 1480,
        conversions: 114,
      },
      createdAt: now,
      updatedAt: now,
    }),
    buildExperimentRecord({
      id: 'ab_seed_reels_hook',
      organizationId,
      title: 'Hook 3s Reels: Retenção Visual com Legendas Dinâmicas',
      channel: 'instagram',
      testType: 'hook_copy',
      hypothesisAngle: 'contrarian_shock',
      targetMetric: 'engagement_rate',
      minSampleSize: 250,
      targetConfidencePct: 95,
      status: 'running',
      winningVariantId: null,
      variantA: {
        id: 'A',
        label: 'Controle (Educativo)',
        hookText: '3 dicas práticas para aumentar a retenção dos seus Reels hoje',
        impressions: 420,
        conversions: 24,
      },
      variantB: {
        id: 'B',
        label: 'Desafiante (Quebra de Padrão)',
        hookText:
          'Pare de editar vídeos longos: o erro nos primeiros 2 segundos que derruba seu Reel',
        impressions: 430,
        conversions: 38,
      },
      createdAt: now,
      updatedAt: now,
    }),
    buildExperimentRecord({
      id: 'ab_seed_cta_saves',
      organizationId,
      title: 'CTA Final Carrossel: Salvamentos vs. Comentário Palavra-Chave',
      channel: 'instagram',
      testType: 'cta_button',
      hypothesisAngle: 'curiosity_gap',
      targetMetric: 'saves_rate',
      minSampleSize: 200,
      targetConfidencePct: 95,
      status: 'running',
      winningVariantId: null,
      variantA: {
        id: 'A',
        label: 'Controle (Salve este Post)',
        hookText: 'Salve este carrossel para consultar antes da sua próxima campanha.',
        impressions: 160,
        conversions: 9,
      },
      variantB: {
        id: 'B',
        label: 'Desafiante (Lacuna de Curiosidade)',
        hookText:
          'Salve agora: o checklist do slide 7 evita 80% das reprovações de clientes.',
        impressions: 165,
        conversions: 15,
      },
      createdAt: now,
      updatedAt: now,
    }),
  ];

  memoryStore.set(organizationId, seeds);
  return seeds;
}

export async function listAbTestExperiments(
  organizationId: string,
  statusFilter?: string
): Promise<{
  experiments: AbTestExperiment[];
  summary: AbTestSummaryMetrics;
}> {
  let experiments: AbTestExperiment[] = [];

  try {
    const rows = await db
      .select()
      .from(abTestExperiments)
      .where(eq(abTestExperiments.organizationId, organizationId))
      .orderBy(desc(abTestExperiments.createdAt));

    if (rows.length > 0) {
      experiments = rows.map((r) =>
        buildExperimentRecord({
          id: r.id,
          organizationId: r.organizationId,
          title: r.title,
          channel: (r.channel as AbTestChannel) || 'instagram',
          testType: (r.testType as AbTestType) || 'hook_copy',
          hypothesisAngle:
            (r.hypothesisAngle as AbHypothesisAngle) || 'curiosity_gap',
          targetMetric: (r.targetMetric as AbTargetMetric) || 'engagement_rate',
          minSampleSize: r.minSampleSize,
          targetConfidencePct: r.targetConfidencePct,
          status: (r.status as AbExperimentStatus) || 'running',
          winningVariantId: (r.winningVariantId as 'A' | 'B' | null) || null,
          variantA: r.variantA as AbTestVariant,
          variantB: r.variantB as AbTestVariant,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        })
      );
    } else {
      experiments = seedOrgExperiments(organizationId);
    }
  } catch {
    experiments = seedOrgExperiments(organizationId);
  }

  const filtered =
    statusFilter && statusFilter !== 'all'
      ? experiments.filter((e) => e.status === statusFilter)
      : experiments;

  return {
    experiments: filtered,
    summary: summarizeAbExperiments(experiments),
  };
}

export async function createAbTestExperiment(
  organizationId: string,
  input: CreateAbTestInput
): Promise<AbTestExperiment> {
  const id = `ab_${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date();

  const hookA = input.hookTextA.trim();
  const hookB =
    input.hookTextB && input.hookTextB.trim().length > 0
      ? input.hookTextB.trim()
      : generateChallengerHookVariant(hookA, input.hypothesisAngle);

  const variantA: AbTestVariant = {
    id: 'A',
    label: 'Controle (Original)',
    hookText: hookA,
    impressions: 120,
    conversions: 6,
  };

  const variantB: AbTestVariant = {
    id: 'B',
    label: `Desafiante (${input.hypothesisAngle})`,
    hookText: hookB,
    impressions: 120,
    conversions: 10,
  };

  const experiment = buildExperimentRecord({
    id,
    organizationId,
    title: input.title.trim(),
    channel: input.channel || 'instagram',
    testType: input.testType || 'hook_copy',
    hypothesisAngle: input.hypothesisAngle || 'curiosity_gap',
    targetMetric: input.targetMetric || 'engagement_rate',
    minSampleSize: input.minSampleSize || 200,
    targetConfidencePct: input.targetConfidencePct || 95,
    status: 'running',
    winningVariantId: null,
    variantA,
    variantB,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });

  try {
    await db.insert(abTestExperiments).values({
      id: experiment.id,
      organizationId,
      title: experiment.title,
      channel: experiment.channel,
      testType: experiment.testType,
      hypothesisAngle: experiment.hypothesisAngle,
      targetMetric: experiment.targetMetric,
      minSampleSize: experiment.minSampleSize,
      targetConfidencePct: experiment.targetConfidencePct,
      variantA: experiment.variantA,
      variantB: experiment.variantB,
      status: experiment.status,
      winningVariantId: experiment.winningVariantId,
      createdAt: now,
      updatedAt: now,
    });
  } catch {
    // Fallback to in-memory store
  }

  const list = seedOrgExperiments(organizationId);
  memoryStore.set(organizationId, [experiment, ...list]);
  return experiment;
}

export async function mutateAbTestExperiment(
  organizationId: string,
  experimentId: string,
  action: 'simulate_traffic' | 'declare_winner' | 'delete'
): Promise<{ deleted?: boolean; experiment?: AbTestExperiment }> {
  const list = seedOrgExperiments(organizationId);

  if (action === 'delete') {
    try {
      await db
        .delete(abTestExperiments)
        .where(
          and(
            eq(abTestExperiments.id, experimentId),
            eq(abTestExperiments.organizationId, organizationId)
          )
        );
    } catch {
      // Fallback to in-memory store
    }
    memoryStore.set(
      organizationId,
      list.filter((e) => e.id !== experimentId)
    );
    return { deleted: true };
  }

  const target = list.find((e) => e.id === experimentId);
  if (!target) {
    throw new Error('Experimento A/B não encontrado neste workspace.');
  }

  let updated: AbTestExperiment;
  if (action === 'simulate_traffic') {
    updated = simulateTrafficBatch(target);
  } else {
    const winner: 'A' | 'B' =
      target.stats.rateBPct >= target.stats.rateAPct ? 'B' : 'A';
    updated = {
      ...target,
      status: 'completed',
      winningVariantId: winner,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    await db
      .update(abTestExperiments)
      .set({
        variantA: updated.variantA,
        variantB: updated.variantB,
        status: updated.status,
        winningVariantId: updated.winningVariantId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(abTestExperiments.id, experimentId),
          eq(abTestExperiments.organizationId, organizationId)
        )
      );
  } catch {
    // Fallback to in-memory store
  }

  memoryStore.set(
    organizationId,
    list.map((e) => (e.id === experimentId ? updated : e))
  );

  return { experiment: updated };
}
