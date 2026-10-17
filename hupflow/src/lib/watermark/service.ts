import crypto from 'node:crypto';
import { db } from '@/lib/db';
import { watermarkSettings, brandKits } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  WatermarkPosition,
  WatermarkSettings,
  UpdateWatermarkSettingsInput,
  WatermarkCoordinates,
  WatermarkApiResponse,
} from './types';

/**
 * Calcula as coordenadas geométricas exatas (x, y, largura, altura) do selo sobre a mídia.
 */
export function calculateWatermarkCoordinates(
  mediaWidth: number,
  mediaHeight: number,
  scalePercent: number,
  position: WatermarkPosition,
  marginPx: number,
  aspectRatio: number = 1.0
): WatermarkCoordinates {
  const safeScale = Math.max(5, Math.min(35, scalePercent));
  const safeMargin = Math.max(0, marginPx);

  // Largura calculada proporcionalmente à dimensão da mídia
  let width = Math.max(20, Math.round(mediaWidth * (safeScale / 100)));
  let height = Math.max(10, Math.round(width / aspectRatio));

  // Ajuste se ultrapassar a altura máxima da mídia
  if (height > mediaHeight - safeMargin * 2) {
    height = Math.max(10, mediaHeight - safeMargin * 2);
    width = Math.round(height * aspectRatio);
  }

  let x = safeMargin;
  let y = safeMargin;

  switch (position) {
    case 'top_left':
      x = safeMargin;
      y = safeMargin;
      break;
    case 'top_right':
      x = mediaWidth - width - safeMargin;
      y = safeMargin;
      break;
    case 'bottom_left':
      x = safeMargin;
      y = mediaHeight - height - safeMargin;
      break;
    case 'bottom_right':
      x = mediaWidth - width - safeMargin;
      y = mediaHeight - height - safeMargin;
      break;
    case 'center':
      x = Math.round((mediaWidth - width) / 2);
      y = Math.round((mediaHeight - height) / 2);
      break;
  }

  // Clamping estrito anti-overflow
  x = Math.max(0, Math.min(x, Math.max(0, mediaWidth - width)));
  y = Math.max(0, Math.min(y, Math.max(0, mediaHeight - height)));

  return { x, y, width, height };
}

/**
 * Valida e limita os limites operacionais de opacidade, escala e margem.
 */
export function validateWatermarkInputs(
  input: Partial<UpdateWatermarkSettingsInput>
): { opacity: number; scalePercent: number; marginPx: number } {
  const opacity =
    input.opacity !== undefined ? Math.max(10, Math.min(100, Math.round(input.opacity))) : 85;
  const scalePercent =
    input.scalePercent !== undefined
      ? Math.max(5, Math.min(35, Math.round(input.scalePercent)))
      : 15;
  const marginPx =
    input.marginPx !== undefined ? Math.max(0, Math.min(120, Math.round(input.marginPx))) : 24;

  return { opacity, scalePercent, marginPx };
}

/**
 * Retorna configurações canônicas padrão do workspace.
 */
export function getDefaultWatermarkSettings(organizationId: string): WatermarkSettings {
  const now = new Date().toISOString();
  return {
    id: `wmk_default_${organizationId}`,
    organizationId,
    watermarkType: 'combined',
    position: 'bottom_right',
    opacity: 85,
    scalePercent: 15,
    marginPx: 24,
    customText: null,
    logoUrl: null,
    autoApply: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Obtém as preferências ativas de marca d'água integradas com o Brand Kit padrão.
 */
export async function getWatermarkSettings(organizationId: string): Promise<WatermarkApiResponse> {
  // 1. Busca Brand Kit ativo para obter defaults da marca
  let brandDefaults = { handle: null as string | null, logoUrl: null as string | null };
  try {
    const brandRows = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.organizationId, organizationId));

    const defaultKit = brandRows.find((b) => b.isDefault) || brandRows[0];
    if (defaultKit) {
      brandDefaults = {
        handle: defaultKit.handle || null,
        logoUrl: defaultKit.logoUrl || null,
      };
    }
  } catch (err) {
    console.warn('[WatermarkService] Falha ao ler Brand Kit padrão:', err);
  }

  // 2. Busca registro gravado no banco
  const rows = await db
    .select()
    .from(watermarkSettings)
    .where(eq(watermarkSettings.organizationId, organizationId))
    .limit(1);

  if (rows.length === 0) {
    const defaults = getDefaultWatermarkSettings(organizationId);
    defaults.customText = brandDefaults.handle;
    defaults.logoUrl = brandDefaults.logoUrl;
    return {
      settings: defaults,
      brandKitDefaults: brandDefaults,
    };
  }

  const r = rows[0];
  return {
    settings: {
      id: r.id,
      organizationId: r.organizationId,
      watermarkType: r.watermarkType as any,
      position: r.position as any,
      opacity: r.opacity,
      scalePercent: r.scalePercent,
      marginPx: r.marginPx,
      customText: r.customText || brandDefaults.handle,
      logoUrl: r.logoUrl || brandDefaults.logoUrl,
      autoApply: r.autoApply,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    },
    brandKitDefaults: brandDefaults,
  };
}

/**
 * Cria ou atualiza as configurações de marca d'água do workspace.
 */
export async function upsertWatermarkSettings(
  organizationId: string,
  input: UpdateWatermarkSettingsInput
): Promise<WatermarkSettings> {
  const validated = validateWatermarkInputs(input);
  const now = new Date();

  const existing = await db
    .select()
    .from(watermarkSettings)
    .where(eq(watermarkSettings.organizationId, organizationId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(watermarkSettings)
      .set({
        watermarkType: input.watermarkType || existing[0].watermarkType,
        position: input.position || existing[0].position,
        opacity: validated.opacity,
        scalePercent: validated.scalePercent,
        marginPx: validated.marginPx,
        customText: input.customText !== undefined ? input.customText : existing[0].customText,
        logoUrl: input.logoUrl !== undefined ? input.logoUrl : existing[0].logoUrl,
        autoApply: input.autoApply !== undefined ? input.autoApply : existing[0].autoApply,
        updatedAt: now,
      })
      .where(eq(watermarkSettings.id, existing[0].id));

    return {
      id: existing[0].id,
      organizationId,
      watermarkType: (input.watermarkType || existing[0].watermarkType) as any,
      position: (input.position || existing[0].position) as any,
      opacity: validated.opacity,
      scalePercent: validated.scalePercent,
      marginPx: validated.marginPx,
      customText: input.customText !== undefined ? input.customText : existing[0].customText,
      logoUrl: input.logoUrl !== undefined ? input.logoUrl : existing[0].logoUrl,
      autoApply: input.autoApply !== undefined ? input.autoApply : existing[0].autoApply,
      createdAt: existing[0].createdAt.toISOString(),
      updatedAt: now.toISOString(),
    };
  }

  const id = `wmk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  await db.insert(watermarkSettings).values({
    id,
    organizationId,
    watermarkType: input.watermarkType || 'combined',
    position: input.position || 'bottom_right',
    opacity: validated.opacity,
    scalePercent: validated.scalePercent,
    marginPx: validated.marginPx,
    customText: input.customText || null,
    logoUrl: input.logoUrl || null,
    autoApply: input.autoApply ?? false,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    organizationId,
    watermarkType: input.watermarkType || 'combined',
    position: input.position || 'bottom_right',
    opacity: validated.opacity,
    scalePercent: validated.scalePercent,
    marginPx: validated.marginPx,
    customText: input.customText || null,
    logoUrl: input.logoUrl || null,
    autoApply: input.autoApply ?? false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}
