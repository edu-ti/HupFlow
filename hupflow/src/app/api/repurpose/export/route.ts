import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { getContentRepurposingKitById } from '@/lib/repurpose/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'viewer');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { kitId, format } = body;

    if (!kitId) {
      return NextResponse.json(
        { error: 'ID do kit é obrigatório.' },
        { status: 400 }
      );
    }

    const kit = await getContentRepurposingKitById(auth.organizationId, kitId);
    if (!kit) {
      return NextResponse.json(
        { error: 'Kit de reaproveitamento não encontrado.' },
        { status: 404 }
      );
    }

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: kit,
      });
    }

    // Markdown export
    const carouselMd = kit.carouselSlides
      .map(
        s => `### Slide ${s.slideNumber}: ${s.headline}\n**Tag:** ${s.badge}\n\n${s.body}\n\n*Direção Visual:* ${s.visualCue}`
      )
      .join('\n\n---\n\n');

    const threadMd = kit.xThread
      .map(t => `**Tweet ${t.tweetNumber}/5** (${t.charCount} chars):\n${t.content}`)
      .join('\n\n');

    const reelMd = `**Duração:** ${kit.reelScript.durationSeconds}s\n\n` +
      `**Hook (${kit.reelScript.hook.durationSec}s):**\n` +
      `- Fala: "${kit.reelScript.hook.spokenLine}"\n` +
      `- Texto na Tela: "${kit.reelScript.hook.onScreenText}"\n` +
      `- Visual B-Roll: ${kit.reelScript.hook.bRollVisual}\n\n` +
      `**Desenvolvimento:**\n` +
      kit.reelScript.keyPoints
        .map(
          kp => `* [${kp.timestampSec}s] **${kp.title}**: "${kp.spokenText}" (Ação: ${kp.actionCue})`
        )
        .join('\n') +
      `\n\n**CTA (${kit.reelScript.callToAction.durationSec}s):**\n` +
      `- Fala: "${kit.reelScript.callToAction.spokenLine}"\n` +
      `- Sticker/Gráfico: ${kit.reelScript.callToAction.stickerOrGraphic}`;

    const newsletterMd = `**Assunto:** ${kit.newsletter.subjectLine}\n` +
      `**Preview:** ${kit.newsletter.previewText}\n\n` +
      `${kit.newsletter.greeting}\n\n` +
      `${kit.newsletter.coreInsight}\n\n` +
      kit.newsletter.keyBulletTakeaways.join('\n') +
      `\n\n[Botão CTA: ${kit.newsletter.ctaButtonText} -> ${kit.newsletter.ctaUrl}]\n` +
      `*Tempo estimado de leitura: ${kit.newsletter.readingTimeMinutes} min*`;

    const fullMarkdown = `# KIT DE REAPROVEITAMENTO: ${kit.title}\n\n` +
      `**Origem:** ${kit.sourceType} | **Tom:** ${kit.tone} | **Economia Estimada:** ${kit.estimatedTimeSavedMinutes} min\n\n` +
      `## 1. Carrossel para Instagram/LinkedIn (7 Slides)\n\n${carouselMd}\n\n` +
      `## 2. Thread para X / Twitter (5 Tweets)\n\n${threadMd}\n\n` +
      `## 3. Roteiro Dinâmico de Reel / TikTok (60s Vertical)\n\n${reelMd}\n\n` +
      `## 4. Newsletter Executiva de Alta Retenção\n\n${newsletterMd}\n`;

    return NextResponse.json({
      success: true,
      markdown: fullMarkdown,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao exportar kit' },
      { status: 500 }
    );
  }
}
