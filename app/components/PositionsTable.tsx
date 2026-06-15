import { Position } from '../types';
import { formatPrice, formatCurrency, formatPercent } from '../utils/calculations';
import { X, Target, Shield } from 'lucide-react';

interface PositionsTableProps {
  positions: Position[];
  onClosePosition: (positionId: string) => void;
}

export function PositionsTable({ positions, onClosePosition }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <div className="bg-[#1e2329] rounded-lg p-8">
        <div className="text-center text-[#848e9c]">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">No Open Positions</p>
          <p className="text-xs mt-1">Place an order to start trading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2329] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[#2b3139]">
        <span className="text-white font-semibold text-sm">Open Positions ({positions.length})</span>
      </div>
      
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[#848e9c] border-b border-[#2b3139]">
              <th className="text-left py-2 px-3 font-medium">Symbol</th>
              <th className="text-left py-2 px-3 font-medium">Side</th>
              <th className="text-right py-2 px-3 font-medium">Lev.</th>
              <th className="text-right py-2 px-3 font-medium">Size</th>
              <th className="text-right py-2 px-3 font-medium">Margin</th>
              <th className="text-right py-2 px-3 font-medium">Entry</th>
              <th className="text-right py-2 px-3 font-medium">Mark</th>
              <th className="text-right py-2 px-3 font-medium">PnL</th>
              <th className="text-right py-2 px-3 font-medium">ROE%</th>
              <th className="text-center py-2 px-3 font-medium">TP/SL</th>
              <th className="text-center py-2 px-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => {
              const pnlColor = pos.unrealizedPnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]';
              const sideColor = pos.direction === 'LONG' 
                ? 'bg-[#0ecb81]/20 text-[#0ecb81]' 
                : 'bg-[#f6465d]/20 text-[#f6465d]';
              
              return (
                <tr key={pos.id} className="border-b border-[#2b3139] hover:bg-[#0b0e11]/50">
                  <td className="py-2 px-3">
                    <span className="text-white font-medium">{pos.symbol.replace('-USD', '')}USDT</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${sideColor}`}>
                      {pos.direction}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-[#f0b90b] font-mono">{pos.leverage}x</td>
                  <td className="py-2 px-3 text-right text-white font-mono">{pos.quantity.toFixed(4)}</td>
                  <td className="py-2 px-3 text-right text-white font-mono">{formatCurrency(pos.lockedMargin)}</td>
                  <td className="py-2 px-3 text-right text-white font-mono">{formatPrice(pos.entryPrice)}</td>
                  <td className="py-2 px-3 text-right text-white font-mono">{formatPrice(pos.currentPrice)}</td>
                  <td className={`py-2 px-3 text-right font-mono font-medium ${pnlColor}`}>
                    {formatCurrency(pos.unrealizedPnl)}
                  </td>
                  <td className={`py-2 px-3 text-right font-mono font-bold ${pnlColor}`}>
                    {formatPercent(pos.roePercent)}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col items-end gap-0.5">
                      {pos.takeProfit && (
                        <span className="text-[#0ecb81] font-mono flex items-center gap-1">
                          <Target className="w-2.5 h-2.5" /> {formatPrice(pos.takeProfit)}
                        </span>
                      )}
                      {pos.stopLoss && (
                        <span className="text-[#f6465d] font-mono flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" /> {formatPrice(pos.stopLoss)}
                        </span>
                      )}
                      {!pos.takeProfit && !pos.stopLoss && (
                        <span className="text-[#848e9c]">-</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onClosePosition(pos.id)}
                      className="px-2 py-1 bg-[#f6465d]/20 text-[#f6465d] rounded text-[10px] font-medium hover:bg-[#f6465d]/30"
                    >
                      Close
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-2 p-2">
        {positions.map((pos) => {
          const pnlColor = pos.unrealizedPnl >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]';
          const sideColor = pos.direction === 'LONG' 
            ? 'bg-[#0ecb81]/20 text-[#0ecb81] border-[#0ecb81]/30' 
            : 'bg-[#f6465d]/20 text-[#f6465d] border-[#f6465d]/30';
          
          return (
            <div key={pos.id} className="bg-[#0b0e11] rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">{pos.symbol.replace('-USD', '')}USDT</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${sideColor}`}>
                    {pos.direction} {pos.leverage}x
                  </span>
                </div>
                <button
                  onClick={() => onClosePosition(pos.id)}
                  className="px-2 py-1 bg-[#f6465d]/20 text-[#f6465d] rounded text-xs font-medium"
                >
                  Close
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-[#848e9c]">Size</div>
                  <div className="text-white font-mono">{pos.quantity.toFixed(4)}</div>
                </div>
                <div>
                  <div className="text-[#848e9c]">Entry</div>
                  <div className="text-white font-mono">${formatPrice(pos.entryPrice)}</div>
                </div>
                <div>
                  <div className="text-[#848e9c]">Mark</div>
                  <div className="text-white font-mono">${formatPrice(pos.currentPrice)}</div>
                </div>
              </div>
              
              <div className={`flex justify-between items-center p-2 rounded ${pos.unrealizedPnl >= 0 ? 'bg-[#0ecb81]/10' : 'bg-[#f6465d]/10'}`}>
                <div>
                  <div className="text-[#848e9c] text-[10px]">PnL</div>
                  <div className={`font-mono font-bold ${pnlColor}`}>{formatCurrency(pos.unrealizedPnl)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[#848e9c] text-[10px]">ROE</div>
                  <div className={`font-mono font-bold text-lg ${pnlColor}`}>{formatPercent(pos.roePercent)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}