import { Position } from '../types';
import { formatPrice, formatCurrency, formatPercent } from '../utils/calculations';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, TrendingUp, TrendingDown, Target, Shield } from 'lucide-react';

interface PositionsLedgerProps {
  positions: Position[];
  onClosePosition: (positionId: string) => void;
}

export function PositionsLedger({ positions, onClosePosition }: PositionsLedgerProps) {
  if (positions.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No open positions</p>
            <p className="text-sm mt-1">Place an order to start trading</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900 border-slate-700 shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg flex items-center justify-between">
          <span>Open Positions ({positions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="text-left py-3 px-2 font-medium">Symbol</th>
                <th className="text-left py-3 px-2 font-medium">Side</th>
                <th className="text-right py-3 px-2 font-medium">Leverage</th>
                <th className="text-right py-3 px-2 font-medium">Size</th>
                <th className="text-right py-3 px-2 font-medium">Margin</th>
                <th className="text-right py-3 px-2 font-medium">Entry</th>
                <th className="text-right py-3 px-2 font-medium">Mark Price</th>
                <th className="text-right py-3 px-2 font-medium">PnL</th>
                <th className="text-right py-3 px-2 font-medium">ROE</th>
                <th className="text-center py-3 px-2 font-medium">TP/SL</th>
                <th className="text-center py-3 px-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <PositionRow
                  key={position.id}
                  position={position}
                  onClose={() => onClosePosition(position.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onClose={() => onClosePosition(position.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PositionRow({ position, onClose }: { position: Position; onClose: () => void }) {
  const pnlColor = position.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400';
  const directionColor = position.direction === 'LONG' 
    ? 'bg-emerald-500/20 text-emerald-400' 
    : 'bg-red-500/20 text-red-400';

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td className="py-3 px-2">
        <span className="text-white font-semibold font-mono">{position.symbol.replace('-USD', '')}</span>
      </td>
      <td className="py-3 px-2">
        <span className={`px-2 py-1 rounded text-xs font-bold ${directionColor}`}>
          {position.direction}
        </span>
      </td>
      <td className="py-3 px-2 text-right text-amber-400 font-mono">{position.leverage}x</td>
      <td className="py-3 px-2 text-right text-white font-mono">{position.quantity.toFixed(4)}</td>
      <td className="py-3 px-2 text-right text-slate-300 font-mono">{formatCurrency(position.lockedMargin)}</td>
      <td className="py-3 px-2 text-right text-slate-300 font-mono">{formatPrice(position.entryPrice)}</td>
      <td className="py-3 px-2 text-right text-white font-mono">{formatPrice(position.currentPrice)}</td>
      <td className={`py-3 px-2 text-right font-mono font-semibold ${pnlColor}`}>
        {formatCurrency(position.unrealizedPnl)}
      </td>
      <td className={`py-3 px-2 text-right font-mono font-bold ${pnlColor}`}>
        {formatPercent(position.roePercent)}
      </td>
      <td className="py-3 px-2">
        <div className="flex flex-col items-end gap-1 text-xs">
          {position.takeProfit && (
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <Target className="w-3 h-3" /> {formatPrice(position.takeProfit)}
            </span>
          )}
          {position.stopLoss && (
            <span className="text-red-400 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3" /> {formatPrice(position.stopLoss)}
            </span>
          )}
          {!position.takeProfit && !position.stopLoss && (
            <span className="text-slate-600">--</span>
          )}
        </div>
      </td>
      <td className="py-3 px-2 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}

function PositionCard({ position, onClose }: { position: Position; onClose: () => void }) {
  const pnlColor = position.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400';
  const directionColor = position.direction === 'LONG' 
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
    : 'bg-red-500/20 text-red-400 border-red-500/50';

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold font-mono">{position.symbol.replace('-USD', '')}</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${directionColor}`}>
            {position.direction === 'LONG' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
            {position.leverage}x
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          Close
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-slate-500">Size</span>
          <div className="text-white font-mono">{position.quantity.toFixed(4)}</div>
        </div>
        <div>
          <span className="text-slate-500">Margin</span>
          <div className="text-slate-300 font-mono">{formatCurrency(position.lockedMargin)}</div>
        </div>
        <div>
          <span className="text-slate-500">Entry</span>
          <div className="text-slate-300 font-mono">${formatPrice(position.entryPrice)}</div>
        </div>
        <div>
          <span className="text-slate-500">Mark</span>
          <div className="text-white font-mono">${formatPrice(position.currentPrice)}</div>
        </div>
      </div>

      {(position.takeProfit || position.stopLoss) && (
        <div className="flex gap-2 mb-3">
          {position.takeProfit && (
            <div className="flex-1 bg-emerald-500/10 rounded p-2 text-center">
              <div className="text-emerald-400 text-xs">TP</div>
              <div className="text-emerald-400 font-mono text-sm">{formatPrice(position.takeProfit)}</div>
            </div>
          )}
          {position.stopLoss && (
            <div className="flex-1 bg-red-500/10 rounded p-2 text-center">
              <div className="text-red-400 text-xs">SL</div>
              <div className="text-red-400 font-mono text-sm">{formatPrice(position.stopLoss)}</div>
            </div>
          )}
        </div>
      )}

      <div className={`flex justify-between items-center p-3 rounded-lg ${position.unrealizedPnl >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
        <div>
          <div className="text-slate-400 text-xs">Unrealized PnL</div>
          <div className={`font-mono font-bold text-lg ${pnlColor}`}>
            {formatCurrency(position.unrealizedPnl)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-slate-400 text-xs">ROE</div>
          <div className={`font-mono font-bold text-xl ${pnlColor}`}>
            {formatPercent(position.roePercent)}
          </div>
        </div>
      </div>
    </div>
  );
}