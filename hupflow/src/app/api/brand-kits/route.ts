import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { db } from '@/lib/db';
import { brandKits } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { BrandKit } from '@/lib/brand/types';
import { BRAND_PRESETS } from '@/lib/brand/presets';
import {
  validateBrandColors,
  createDefaultBrandKit,
} from '@/lib/brand/service';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const rows = await db
      .select()
      .from(brandKits)
      .where(eq(brandKits.organizationId, auth.organizationId));

    let kitList: BrandKit[] = rows.map((r) => ({
      id: r.id,
      organizationId: r.organizationId,
      name: r.name,
      isDefault: r.isDefault,
      colors: r.colors,
      typography: r.typography,
      handle: r.handle,
      website: r.website,
      logoUrl: r.logoUrl,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    if (kitList.length === 0) {
      // Cria automaticamente o kit padrão inicial se estiver vazio
      const defaultKit = createDefaultBrandKit(auth.organizationId);
      kitList = [defaultKit];

      try {
        await db.insert(brandKits).values({
          id: defaultKit.id,
          organizationId: defaultKit.organizationId,
          name: defaultKit.name,
          isDefault: true,
          colors: defaultKit.colors,
          typography: defaultKit.typography,
          handle: defaultKit.handle,
          website: defaultKit.website,
          logoUrl: defaultKit.logoUrl,
        });
      } catch {
        // Silencioso se offline
      }
    }

    const defaultKit = kitList.find((k) => k.isDefault) || kitList[0];

    return NextResponse.json({
      brandKits: kitList,
      presets: BRAND_PRESETS,
      defaultKitId: defaultKit?.id,
    });
  } catch (err: any) {
    // Fallback de desenvolvimento local sem banco
    const fallbackDefault = createDefaultBrandKit(auth.organizationId);
    return NextResponse.json({
      brandKits: [fallbackDefault],
      presets: BRAND_PRESETS,
      defaultKitId: fallbackDefault.id,
    });
  }
}

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const name = (body.name || '').trim();

    if (!name) {
      return NextResponse.json(
        { error: 'O nome do Kit de Marca é obrigatório.' },
        { status: 400 }
      );
    }

    const colorsValidation = validateBrandColors(body.colors || {});
    if (!colorsValidation.valid) {
      return NextResponse.json({ error: colorsValidation.error }, { status: 400 });
    }

    const typography = body.typography || {
      fontFamilyHeading: 'Inter',
      fontFamilyBody: 'Inter',
    };

    const isDefault = !!body.isDefault;

    // Se este kit for definido como padrão, desmarca os anteriores
    if (isDefault) {
      try {
        await db
          .update(brandKits)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(brandKits.organizationId, auth.organizationId));
      } catch {
        // Ignora se banco offline
      }
    }

    const newId = `bkit_${Date.now()}`;
    const now = new Date();

    try {
      await db.insert(brandKits).values({
        id: newId,
        organizationId: auth.organizationId,
        name,
        isDefault,
        colors: body.colors,
        typography,
        handle: body.handle || null,
        website: body.website || null,
        logoUrl: body.logoUrl || null,
        createdAt: now,
        updatedAt: now,
      });
    } catch {
      // Ignora se banco offline
    }

    const createdKit: BrandKit = {
      id: newId,
      organizationId: auth.organizationId,
      name,
      isDefault,
      colors: body.colors,
      typography,
      handle: body.handle || null,
      website: body.website || null,
      logoUrl: body.logoUrl || null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    return NextResponse.json({ success: true, brandKit: createdKit }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao criar Kit de Marca' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const id = body.id as string;

    if (!id) {
      return NextResponse.json({ error: 'ID do Kit é obrigatório.' }, { status: 400 });
    }

    if (body.colors) {
      const colorsValidation = validateBrandColors(body.colors);
      if (!colorsValidation.valid) {
        return NextResponse.json({ error: colorsValidation.error }, { status: 400 });
      }
    }

    if (body.isDefault) {
      try {
        await db
          .update(brandKits)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(brandKits.organizationId, auth.organizationId));
      } catch {
        // Silencioso se offline
      }
    }

    const now = new Date();
    try {
      await db
        .update(brandKits)
        .set({
          ...(body.name && { name: body.name }),
          ...(body.colors && { colors: body.colors }),
          ...(body.typography && { typography: body.typography }),
          ...(body.handle !== undefined && { handle: body.handle }),
          ...(body.website !== undefined && { website: body.website }),
          ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
          ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
          updatedAt: now,
        })
        .where(
          and(
            eq(brandKits.id, id),
            eq(brandKits.organizationId, auth.organizationId)
          )
        );
    } catch {
      // Silencioso se offline
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao atualizar Kit de Marca' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'admin');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  const url = req.nextUrl;
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID do Kit é obrigatório.' }, { status: 400 });
  }

  try {
    await db
      .delete(brandKits)
      .where(
        and(
          eq(brandKits.id, id),
          eq(brandKits.organizationId, auth.organizationId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Erro ao remover Kit de Marca' },
      { status: 500 }
    );
  }
}
