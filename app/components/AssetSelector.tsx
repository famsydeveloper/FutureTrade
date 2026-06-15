"use client";

import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Search, TrendingUp, TrendingDown, Activity, Wifi, WifiOff } from 'lucide-react';
import { TickerData } from '../types';
import { formatPrice, formatCurrency } from '../utils/calculations';

interface AssetSelectorProps {
  currentSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  tickerData: Record<string, TickerData>;
  isConnected: boolean;
}

export const AssetSelector = ({
  currentSymbol,
  onSelectSymbol,
  tickerData,
  isConnected
}: AssetSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputSymbol, setInputSymbol] = useState(currentSymbol);

  useEffect(() => {
    setInputSymbol(currentSymbol);
  }, [currentSymbol]);

  const handleLoad = () => {
    if (inputSymbol.trim()) {
      let formatted = inputSymbol.toUpperCase().trim();
      if (!formatted.endsWith('-USD')) {
        formatted = `${formatted}-USD`;
      }
      onSelectSymbol(formatted);
    }
  };

  const displaySymbol = currentSymbol.replace('-USD', '');

  return (
    <Card className="bg-slate-900 border-slate-700 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Symbol Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter symbol (BTC, ETH...)"
                value={inputSymbol}
                onChange={(e: any) => setInputSymbol(e.target.value)}
                onKeyDown={(e: any) => e.key === 'Enter' && handleLoad()}
                className="pl-10 w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white placeholder:text-slate-500 font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleLoad}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition text-sm whitespace-nowrap"
          >
            Load Symbol
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
