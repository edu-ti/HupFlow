import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { getAvailableVoicesCatalog, VoiceProfile } from '@/lib/voiceover/types';

export async function GET(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;

  const url = new URL(req.url);
  const language = url.searchParams.get('language');
  const gender = url.searchParams.get('gender');

  let catalog = getAvailableVoicesCatalog();

  if (language) {
    catalog = catalog.filter((v: VoiceProfile) => v.language.toLowerCase() === language.toLowerCase());
  }
  if (gender) {
    catalog = catalog.filter((v: VoiceProfile) => v.gender.toLowerCase() === gender.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: catalog.length,
    voices: catalog,
  });
}
