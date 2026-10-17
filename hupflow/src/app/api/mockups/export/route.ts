import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { generateDeviceSvgFrame } from '@/lib/mockups/mockups.test';
import { DeviceType, DeviceOrientation, MockupTheme } from '@/lib/mockups/types';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;

  try {
    const body = await req.json();
    const { deviceType, orientation, finishColor, mediaUrl } = body;

    const svgContent = generateDeviceSvgFrame(
      (deviceType as DeviceType) || 'iphone_16_pro',
      (orientation as DeviceOrientation) || 'portrait',
      (finishColor as MockupTheme) || 'titanium_black',
      mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
    );

    return NextResponse.json({
      success: true,
      svgContent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao gerar SVG do mockup' },
      { status: 500 }
    );
  }
}
