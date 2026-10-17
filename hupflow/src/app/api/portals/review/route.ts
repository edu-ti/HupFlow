import { NextRequest, NextResponse } from 'next/server';
import { submitExternalPortalReview } from '@/lib/portals/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.token || !body.deliverableId || !body.decision) {
      return NextResponse.json(
        { error: 'Token, item de entrega e decisão são obrigatórios.' },
        { status: 400 }
      );
    }

    const updatedPortal = await submitExternalPortalReview({
      token: body.token,
      pin: body.pin || null,
      review: {
        deliverableId: body.deliverableId,
        decision: body.decision === 'changes_requested' ? 'changes_requested' : 'approved',
        reviewerName: body.reviewerName || 'Cliente',
        feedbackNote: body.feedbackNote || null,
      },
    });

    return NextResponse.json({ portal: updatedPortal });
  } catch (err: any) {
    console.error('[Portal Review API] Erro ao registrar avaliação:', err);
    return NextResponse.json(
      { error: err.message || 'Falha ao registrar avaliação do item' },
      { status: 400 }
    );
  }
}
