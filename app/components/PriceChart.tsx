import { Card, CardContent } from './ui/card';
import { TickerData } from '../types';
import { formatPrice, formatCompact } from '../utils/calculations';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface PriceChartProps {
  tickerData: TickerData | null;
  priceHistory: { time: number; price: number }[];
  symbol: string;
}

export function PriceChart({ tickerData, priceHistory, symbol }: PriceChartProps) {
  const displaySymbol = symbol.replace('-USD', '');
  const isPositive = tickerData ? tickerData.change24h >= 0 : true;
  
  const minPrice = Math.min(...priceHistory.map(p => p.price), tickerData?.low24h || Infinity);
  const maxPrice = Math.max(...priceHistory.map(p => p.price), tickerData?.high24h || 0);
  const priceRange = maxPrice - minPrice;

  return (
    <div className="bg-[#1e2329] rounded-lg overflow-hidden">
      {/* Price Header */}
      <div className="p-4 border-b border-[#2b3139]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#f0b90b] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">{displaySymbol.slice(0, 2)}</span>
            </div>
            <div>
              <div className="text-white font-semibold">{displaySymbol}USDT Perpetual</div>
              <div className="text-[#848e9c] text-xs">Binance Futures</div>
            </div>
          </div>
          
          {tickerData && (
            <div className="text-right">
              <div className="text-white font-mono text-xl font-semibold">
                ${formatPrice(tickerData.price, tickerData.price < 1 ? 4 : 2)}
              </div>
              <div className={`flex items-center gap-2 text-sm ${isPositive ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{isPositive ? '+' : ''}{tickerData.change24h.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-[#848e9c]" />
          <span className="text-[#848e9c] text-sm">Price Chart</span>
        </div>
        
        <div className="h-32 relative bg-[#0b0e11] rounded-lg overflow-hidden">
          {priceHistory.length > 1 ? (
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? '#0ecb81' : '#f6465d'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? '#0ecb81' : '#f6465d'} stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area */}
              <path
                d={`
                  M 0 ${priceRange > 0 ? ((maxPrice - priceHistory[0].price) / priceRange) * 120 + 6 : 64}
                  ${priceHistory.map((p, i) => {
                    const x = (i / (priceHistory.length - 1)) * 100;
                    const y = priceRange > 0 ? ((maxPrice - p.price) / priceRange) * 120 + 6 : 64;
                    return `L ${x}% ${y}`;
                  }).join(' ')}
                  L 100% 128 L 0 128 Z
                `}
                fill="url(#lineGradient)"
              />
              
              {/* Line */}
              <path
                d={`
                  M 0 ${priceRange > 0 ? ((maxPrice - priceHistory[0].price) / priceRange) * 120 + 6 : 64}
                  ${priceHistory.map((p, i) => {
                    const x = (i / (priceHistory.length - 1)) * 100;
                    const y = priceRange > 0 ? ((maxPrice - p.price) / priceRange) * 120 + 6 : 64;
                    return `L ${x}% ${y}`;
                  }).join(' ')}
                `}
                fill="none"
                stroke={isPositive ? '#0ecb81' : '#f6465d'}
                strokeWidth="2"
              />
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full text-[#848e9c]">
              Loading chart...
            </div>
          )}
          
          {/* Price labels */}
          <div className="absolute right-2 top-2 text-[#848e9c] text-xs font-mono">
            {maxPrice > 0 && `$${formatPrice(maxPrice)}`}
          </div>
          <div className="absolute right-2 bottom-2 text-[#848e9c] text-xs font-mono">
            {minPrice > 0 && `$${formatPrice(minPrice)}`}
          </div>
        </div>
      </div>

      {/* Stats */}
      {tickerData && (
        <div className="grid grid-cols-3 gap-px bg-[#2b3139] text-xs">
          <div className="bg-[#1e2329] p-3">
            <div className="text-[#848e9c] mb-1">24h High</div>
            <div className="text-white font-mono">${formatPrice(tickerData.high24h)}</div>
          </div>
          <div className="bg-[#1e2329] p-3">
            <div className="text-[#848e9c] mb-1">24h Low</div>
            <div className="text-white font-mono">${formatPrice(tickerData.low24h)}</div>
          </div>
          <div className="bg-[#1e2329] p-3">
            <div className="text-[#848e9c] mb-1">24h Vol</div>
            <div className="text-white font-mono">{formatCompact(tickerData.volume24h)}</div>
          </div>
        </div>
      )}
    </div>
  );
}