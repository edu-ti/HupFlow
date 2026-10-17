'use client';

import React, { useState } from 'react';
import {
  AffiliatePartner,
  AffiliateTier,
} from '@/lib/affiliates/types';
import {
  Award,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
  ArrowUpRight,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface AffiliatePartnerCardProps {
  partner: AffiliatePartner;
  onPayout?: (partnerId: string, amountBrl: number) => void;
  onDelete?: (partnerId: string) => void;
}

export function AffiliatePartnerCard({
  partner,
  onPayout,
  onDelete,
}: AffiliatePartnerCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(partner.availableBalanceBrl);

  const referralUrl = `https://hupflow.com/r/${partner.referralCode}`;

  const copyReferralUrl = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierBadge = (tier: AffiliateTier, pct: number) => {
    switch (tier) {
      case 'diamond':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            Diamond ({pct}%)
          </span>
        );
      case 'gold':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Gold ({pct}%)
          </span>
        );
      case 'silver':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-slate-400/20 to-zinc-400/20 text-slate-200 border border-slate-400/30 flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-slate-300" />
            Silver ({pct}%)
          </span>
        );
      case 'bronze':
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-orange-800/20 to-amber-900/20 text-amber-400 border border-amber-800/30 flex items-center gap-1.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Bronze ({pct}%)
          </span>
        );
    }
  };

  const handleConfirmPayout = () => {
    if (payoutAmount <= 0 || payoutAmount > partner.availableBalanceBrl) return;
    onPayout?.(partner.id, payoutAmount);
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg space-y-4 hover:border-zinc-700 transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {getTierBadge(partner.tier, partner.commissionPct)}
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {partner.referralCode}
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-1.5">{partner.name}</h3>
          <p className="text-xs text-zinc-400">{partner.email}</p>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(partner.id)}
            className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg transition"
            title="Excluir parceiro"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Referral Link Box */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950 border border-zinc-800/80 text-xs">
        <span className="font-mono text-zinc-300 truncate max-w-[260px]">
          {referralUrl}
        </span>
        <button
          onClick={copyReferralUrl}
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 ml-2 flex-shrink-0"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? 'Copiado!' : 'Copiar Link'}
        </button>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 py-2 border-y border-zinc-800/80 text-xs">
        <div className="space-y-0.5">
          <span className="text-zinc-500 block">Clientes Ativos</span>
          <span className="font-bold text-white flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            {partner.activeCustomersCount} assinantes
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-zinc-500 block">MRR Gerado</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            R$ {partner.monthlyRecurringRevenueBrl.toLocaleString('pt-BR')}/mês
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-zinc-500 block">Total de Ganhos</span>
          <span className="font-semibold text-zinc-300 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
            R$ {partner.totalEarningsBrl.toLocaleString('pt-BR')}
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-zinc-500 block">Saldo Disponível</span>
          <span className="font-bold text-amber-300 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            R$ {partner.availableBalanceBrl.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Payout & Actions Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] text-zinc-400">
          <span>{partner.payoutMethod.toUpperCase()}: </span>
          <span className="font-mono text-zinc-300">{partner.payoutKey}</span>
        </div>

        {partner.availableBalanceBrl > 0 ? (
          <button
            onClick={() => {
              setPayoutAmount(partner.availableBalanceBrl);
              setIsPayoutModalOpen(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 flex items-center gap-1 transition"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Liquidar Saque
          </button>
        ) : (
          <span className="text-[11px] text-zinc-500">Sem saldo a liquidar</span>
        )}
      </div>

      {/* Payout Confirmation Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Liquidação de Comissões
            </h4>
            <p className="text-xs text-zinc-400">
              Transferência para <strong>{partner.name}</strong> via {partner.payoutMethod.toUpperCase()} (Chave: {partner.payoutKey}).
            </p>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Valor do Saque (R$):</label>
              <input
                type="number"
                min={1}
                max={partner.availableBalanceBrl}
                value={payoutAmount}
                onChange={e => setPayoutAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm bg-zinc-950 border border-zinc-800 rounded-lg text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPayout}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
