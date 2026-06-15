import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Search, TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from 'lucide-react';
import { TickerData } from '../types';
import { formatPrice, formatCurrency } from '../utils/calculations';

interface AssetSelectorProps {
  currentSymbol: string;
  tickerData: TickerData | null;
  isConnected: boolean;
  onLoadAsset: (symbol: string) => void;
}

const POPULAR_PAIRS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'DOGE-USD', 'ADA-USD', 'AVAX-USD', 'DOT-USD'];

export function AssetSelector({ currentSymbol, tickerData, isConnected, onLoadAsset }: AssetSelectorProps) {
  const [inputSymbol, setInputSymbol] = useState('');

  const handleLoad = () => {
    if (inputSymbol.trim()) {
      let symbol = inputSymbol.toUpperCase().trim();
      if (!symbol.includes('-')) {
        symbol = symbol + '-USD';
      }
      onLoadAsset(symbol);
      setInputSymbol('');
    }
  };

  const displaySymbol = currentSymbol.replace('-USD', '');

  return (
    <Card className="bg-slate-900 border-slate-700 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Symbol Input */}
          <div className="flex gap-2 flex-shrink-0">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Enter symbol (BTC, ETH...)"
                value={inputSymbol}
                onChange={(e) => setInputSymbol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 font-mono"
              />
            </div>
            <Button
              onClick={handleLoad}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6"
            >
              Load Asset
            </Button>
          </div>

          {/* Current Asset Info */}
          <div className="flex-1 flex items-center justify-between bg-slate-800/40 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {displaySymbol.slice(0, 3)}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{displaySymbol}</div>
                  <div className="text-slate-500 text-xs">Perpetual</div>
                </div>
              </div>
              
              <div className="h-8 w-px bg-slate-700" />
              
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-xs ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isConnected ? 'LIVE' : 'RECONNECTING...'}
                </span>
              </div>
            </div>

            {tickerData && (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-white font-mono text-2xl font-bold">
                    ${formatPrice(tickerData.price, tickerData.price < 1 ? 4 : 2)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${tickerData.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tickerData.change24h >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {tickerData.change24h >= 0 ? '+' : ''}{tickerData.change24h.toFixed(2)}%
                  </div>
                </div>
                
                <div className="hidden md:flex flex-col gap-1 text-xs">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">24h High</span>
                    <span className="text-emerald-400 font-mono">${formatPrice(tickerData.high24h, 2)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">24h Low</span>
                    <span className="text-red-400 font-mono">${formatPrice(tickerData.low24h, 2)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">24h Vol</span>
                    <span className="text-slate-300 font-mono">{formatCurrency(tickerData.volume24h)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Select */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {POPULAR_PAIRS.map((pair) => (
            <Button
              key={pair}
              variant="ghost"
              size="sm"
              onClick={() => onLoadAsset(pair)}
              className={`text-xs font-mono ${
                currentSymbol === pair 
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {pair.replace('-USD', '')}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}