import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatPrice, formatCurrency, calculateMargin } from '../utils/calculations';

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  availableBalance: number;
  onPlaceOrder: (order: {
    direction: 'LONG' | 'SHORT';
    leverage: number;
    quantity: number;
    takeProfit: number | null;
    stopLoss: number | null;
  }) => void;
}

const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 20, 25, 50, 75, 100, 125];

export function OrderForm({ symbol, currentPrice, availableBalance, onPlaceOrder }: OrderFormProps) {
  const [direction, setDirection] = useState<'LONG' | 'SHORT'>('LONG');
  const [leverage, setLeverage] = useState(20);
  const [quantity, setQuantity] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');

  useEffect(() => {
    setError('');
  }, [quantity, leverage, direction]);

  const numericQuantity = parseFloat(quantity) || 0;
  const margin = calculateMargin(numericQuantity, leverage, currentPrice);
  const notionalValue = numericQuantity * currentPrice;
  const canAfford = margin <= availableBalance && margin > 0;

  const handlePlaceOrder = () => {
    setError('');

    if (numericQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (margin > availableBalance) {
      setError('Insufficient Balance');
      return;
    }

    const tp = takeProfit ? parseFloat(takeProfit) : null;
    const sl = stopLoss ? parseFloat(stopLoss) : null;

    if (direction === 'LONG') {
      if (tp && tp <= currentPrice) {
        setError('TP must be above entry for LONG');
        return;
      }
      if (sl && sl >= currentPrice) {
        setError('SL must be below entry for LONG');
        return;
      }
    } else {
      if (tp && tp >= currentPrice) {
        setError('TP must be below entry for SHORT');
        return;
      }
      if (sl && sl <= currentPrice) {
        setError('SL must be above entry for SHORT');
        return;
      }
    }

    onPlaceOrder({
      direction,
      leverage,
      quantity: numericQuantity,
      takeProfit: tp,
      stopLoss: sl,
    });

    setQuantity('');
    setTakeProfit('');
    setStopLoss('');
  };

  const setQuickQuantity = (percentage: number) => {
    const maxQuantity = (availableBalance * leverage * percentage) / (100 * currentPrice);
    setQuantity(maxQuantity.toFixed(6));
  };

  const displaySymbol = symbol.replace('-USD', '');

  return (
    <div className="bg-[#1e2329] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-[#2b3139]">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">Place Order</span>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Order Type Tabs */}
        <div className="flex gap-1 bg-[#0b0e11] rounded p-1">
          <button
            onClick={() => setOrderType('MARKET')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              orderType === 'MARKET' 
                ? 'bg-[#f0b90b] text-black' 
                : 'text-[#848e9c] hover:text-white'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('LIMIT')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              orderType === 'LIMIT' 
                ? 'bg-[#f0b90b] text-black' 
                : 'text-[#848e9c] hover:text-white'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Leverage Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[#848e9c] text-xs">Leverage</Label>
            <span className="text-[#f0b90b] font-mono font-semibold">{leverage}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="125"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full h-1 bg-[#2b3139] rounded-lg appearance-none cursor-pointer accent-[#f0b90b]"
          />
          <div className="flex justify-between text-[10px] text-[#848e9c]">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>75x</span>
            <span>125x</span>
          </div>
        </div>

        {/* Direction Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDirection('LONG')}
            className={`py-2.5 rounded text-sm font-semibold transition-all ${
              direction === 'LONG'
                ? 'bg-[#0ecb81] text-white'
                : 'bg-[#2b3139] text-[#848e9c] hover:bg-[#363c45]'
            }`}
          >
            Open Long
          </button>
          <button
            onClick={() => setDirection('SHORT')}
            className={`py-2.5 rounded text-sm font-semibold transition-all ${
              direction === 'SHORT'
                ? 'bg-[#f6465d] text-white'
                : 'bg-[#2b3139] text-[#848e9c] hover:bg-[#363c45]'
            }`}
          >
            Open Short
          </button>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <Label className="text-[#848e9c] text-xs">Size ({displaySymbol})</Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-[#0b0e11] border-[#2b3139] text-white font-mono pr-16 focus:border-[#f0b90b]"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setQuickQuantity(pct)}
                  className="px-1.5 py-0.5 text-[10px] bg-[#2b3139] text-[#848e9c] rounded hover:bg-[#363c45] hover:text-white"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TP/SL */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-[#0ecb81] text-xs flex items-center gap-1">
              TP <span className="text-[#848e9c]">(Optional)</span>
            </Label>
            <Input
              type="number"
              placeholder="Price"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="bg-[#0b0e11] border-[#2b3139] text-white font-mono text-sm focus:border-[#0ecb81]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#f6465d] text-xs flex items-center gap-1">
              SL <span className="text-[#848e9c]">(Optional)</span>
            </Label>
            <Input
              type="number"
              placeholder="Price"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="bg-[#0b0e11] border-[#2b3139] text-white font-mono text-sm focus:border-[#f6465d]"
            />
          </div>
        </div>

        {/* Cost Info */}
        {numericQuantity > 0 && (
          <div className="bg-[#0b0e11] rounded p-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#848e9c]">Cost</span>
              <span className="text-white font-mono">{formatCurrency(margin)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#848e9c]">Max</span>
              <span className="text-white font-mono">{formatCurrency(availableBalance)}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-[#f6465d]/10 border border-[#f6465d]/30 rounded p-2 text-[#f6465d] text-xs">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handlePlaceOrder}
          disabled={!canAfford}
          className={`w-full py-3 rounded font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            direction === 'LONG'
              ? 'bg-[#0ecb81] hover:bg-[#0db574] text-white'
              : 'bg-[#f6465d] hover:bg-[#d94055] text-white'
          }`}
        >
          {direction === 'LONG' ? 'Open Long' : 'Open Short'} {displaySymbol}
        </button>
      </div>
    </div>
  );
}