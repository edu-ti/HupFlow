import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { validateVerticalMediaRequirements } from '@/lib/vertical/vertical.test';
import { VerticalChannelType } from '@/lib/vertical/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;

  try {
    const body = await req.json();
    const { width, height, durationSeconds, channel } = body;

    const validation = validateVerticalMediaRequirements(
      {
        width: Number(width) || 1080,
        height: Number(height) || 1920,
        durationSeconds: Number(durationSeconds) || 30,
      },
      (channel as VerticalChannelType) || 'tiktok'
    );

    return NextResponse.json({
      success: true,
      validation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao validar mídia' },
      { status: 500 }
    );
  }
}
