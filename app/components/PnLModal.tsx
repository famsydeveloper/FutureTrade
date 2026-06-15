import { useEffect } from 'react';
import { ClosedPosition } from '../types';
import { formatPrice, formatCurrency, formatPercent } from '../utils/calculations';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Target, Shield, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PnLModalProps {
  closedPosition: ClosedPosition | null;
  onConfirm: () => void;
}

export function PnLModal({ closedPosition, onConfirm }: PnLModalProps) {
  useEffect(() => {
    if (closedPosition) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [closedPosition]);

  if (!closedPosition) return null;

  const isProfit = closedPosition.realizedPnl >= 0;
  const directionColor = closedPosition.direction === 'LONG' 
    ? 'from-emerald-500 to-teal-500' 
    : 'from-red-500 to-rose-500';
  const pnlColor = isProfit ? 'text-emerald-400' : 'text-red-400';
  const bgGlow = isProfit ? 'shadow-emerald-500/30' : 'shadow-red-500/30';
  const closeReasonText = closedPosition.closeReason === 'TP' 
    ? 'Take Profit Triggered' 
    : closedPosition.closeReason === 'SL' 
      ? 'Stop Loss Triggered' 
      : 'Market Closed';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`w-full max-w-lg rounded-2xl shadow-2xl ${bgGlow}`}
          style={{ backgroundColor: '#181a20' }}
        >
          {/* Header */}
          <div className={`relative p-6 rounded-t-2xl bg-gradient-to-r ${directionColor}`}>
            <div className="absolute inset-0 bg-black/20 rounded-t-2xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  {closedPosition.direction === 'LONG' ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">
                    {closedPosition.symbol.replace('-USD', '')} / USDT
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-white/20 rounded text-white text-xs font-bold">
                      {closedPosition.direction}
                    </span>
                    <span className="px-2 py-0.5 bg-white/20 rounded text-white text-xs font-bold">
                      {closedPosition.leverage}x
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/70 text-xs">{closeReasonText}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Price Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Entry Price</div>
                <div className="text-white font-mono text-lg font-semibold">
                  ${formatPrice(closedPosition.entryPrice)}
                </div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Exit Price</div>
                <div className="text-white font-mono text-lg font-semibold">
                  ${formatPrice(closedPosition.exitPrice)}
                </div>
              </div>
            </div>

            {/* TP/SL Info */}
            {(closedPosition.takeProfit || closedPosition.stopLoss) && (
              <div className="flex gap-3">
                {closedPosition.takeProfit && (
                  <div className="flex-1 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
                      <Target className="w-3 h-3" />
                      Take Profit
                    </div>
                    <div className="text-emerald-400 font-mono font-semibold">
                      ${formatPrice(closedPosition.takeProfit)}
                    </div>
                  </div>
                )}
                {closedPosition.stopLoss && (
                  <div className="flex-1 bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                    <div className="flex items-center gap-2 text-red-400 text-xs mb-1">
                      <Shield className="w-3 h-3" />
                      Stop Loss
                    </div>
                    <div className="text-red-400 font-mono font-semibold">
                      ${formatPrice(closedPosition.stopLoss)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Position Details */}
            <div className="bg-slate-800/40 rounded-xl p-4 space-y-2 border border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Position Size</span>
                <span className="text-white font-mono">{closedPosition.quantity.toFixed(4)} {closedPosition.symbol.replace('-USD', '')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Locked Margin</span>
                <span className="text-white font-mono">{formatCurrency(closedPosition.lockedMargin)}</span>
              </div>
            </div>

            {/* PnL Result */}
            <div className={`rounded-xl p-6 text-center ${isProfit ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
              <div className="text-slate-400 text-sm mb-2">Net Profit / Loss</div>
              <div className={`text-4xl font-bold font-mono mb-2 ${pnlColor}`}>
                {formatCurrency(closedPosition.realizedPnl)}
              </div>
              <div className={`text-5xl font-black font-mono ${pnlColor}`}>
                {formatPercent(closedPosition.roePercent)}
              </div>
              <div className="text-slate-500 text-xs mt-2">Return on Equity</div>
            </div>

            {/* Settlement Info */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Returned to Balance</span>
                <span className="text-white font-mono font-semibold text-lg">
                  {formatCurrency(closedPosition.lockedMargin + closedPosition.realizedPnl)}
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={onConfirm}
              className={`w-full py-4 text-lg font-bold ${
                isProfit 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-black' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Confirm & Collect
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}