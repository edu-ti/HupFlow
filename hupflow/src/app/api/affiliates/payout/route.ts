import { NextRequest, NextResponse } from 'next/server';
import { requireOrgRole } from '@/lib/auth/rbac';
import { processPartnerPayout } from '@/lib/affiliates/service';

export async function POST(req: NextRequest) {
  const authResult = await requireOrgRole(req, 'member');
  if ('response' in authResult) return authResult.response;
  const { auth } = authResult;

  try {
    const body = await req.json();
    const { partnerId, amountBrl, paymentReference } = body;

    if (!partnerId) {
      return NextResponse.json(
        { error: 'ID do parceiro é obrigatório.' },
        { status: 400 }
      );
    }

    if (!amountBrl || typeof amountBrl !== 'number' || amountBrl <= 0) {
      return NextResponse.json(
        { error: 'Valor do saque em R$ deve ser maior que zero.' },
        { status: 400 }
      );
    }

    const result = await processPartnerPayout(auth.organizationId, {
      partnerId,
      amountBrl,
      paymentReference,
    });

    if (!result.success || !result.partner) {
      return NextResponse.json(
        { error: 'Parceiro não encontrado ou saldo insuficiente.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      partner: result.partner,
      payoutAmount: result.payoutAmount,
      message: `Saque de R$ ${result.payoutAmount} liquidado com sucesso.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha ao processar saque do afiliado' },
      { status: 500 }
    );
  }
}
