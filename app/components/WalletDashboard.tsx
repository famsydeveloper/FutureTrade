import { useState } from 'react';
import { WalletState } from '../types';
import { formatCurrency } from '../utils/calculations';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Wallet, TrendingUp, DollarSign, Edit3 } from 'lucide-react';

interface WalletDashboardProps {
  wallet: WalletState;
  onSetBalance: (balance: number) => void;
}

export function WalletDashboard({ wallet, onSetBalance }: WalletDashboardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBalance, setNewBalance] = useState<string>('');

  const handleSetBalance = () => {
    const balance = parseFloat(newBalance);
    if (!isNaN(balance) && balance > 0) {
      onSetBalance(balance);
      setNewBalance('');
      setIsEditing(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Wallet className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-slate-300 font-semibold text-lg">Simulated Wallet</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Set Balance
          </Button>
        </div>

        {isEditing && (
          <div className="flex gap-2 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <Input
              type="number"
              placeholder="Enter starting balance..."
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
            />
            <Button
              onClick={handleSetBalance}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6"
            >
              Set
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400 text-sm">Available Balance</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {formatCurrency(wallet.availableBalance)}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span className="text-slate-400 text-sm">Total Equity</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {formatCurrency(wallet.totalEquity)}
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className={`w-4 h-4 ${wallet.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
              <span className="text-slate-400 text-sm">Unrealized PnL</span>
            </div>
            <div className={`text-2xl font-bold font-mono ${wallet.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(wallet.unrealizedPnl)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}