'use client';

import { useState, useEffect, useCallback } from 'react';
import { WalletDashboard } from './components/WalletDashboard';
import { AssetSelector } from './components/AssetSelector';
import { OrderForm } from './components/OrderForm';
import { PositionsLedger } from './components/PositionsLedger';
import { PnLModal } from './components/PnLModal';
import { useWebSocket } from './hooks/useWebSocket';
import { Position, ClosedPosition, WalletState } from './types';
import {
  calculateMargin,
  calculatePnl,
  checkTrigger,
} from './utils/calculations';

export default function App() {
  const [symbol, setSymbol] = useState('BTC-USD');
  const [wallet, setWallet] = useState<WalletState>({
    availableBalance: 10000,
    totalEquity: 10000,
    unrealizedPnl: 0,
  });
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedPosition, setClosedPosition] = useState<ClosedPosition | null>(
    null
  );

  const { tickerData, isConnected } = useWebSocket(symbol);

  // Update positions with current prices
  useEffect(() => {
    if (!tickerData) return;

    setPositions((prev) =>
      prev.map((pos) => {
        if (pos.symbol !== symbol) return pos;

        const { pnl, roePercent } = calculatePnl(
          pos.direction,
          pos.entryPrice,
          tickerData.price,
          pos.quantity,
          pos.leverage
        );

        return {
          ...pos,
          currentPrice: tickerData.price,
          unrealizedPnl: pnl,
          roePercent,
        };
      })
    );
  }, [tickerData, symbol]);

  // Calculate total unrealized PnL
  useEffect(() => {
    const totalPnl = positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
    const totalMargin = positions.reduce(
      (sum, pos) => sum + pos.lockedMargin,
      0
    );

    setWallet((prev) => ({
      ...prev,
      totalEquity: prev.availableBalance + totalMargin + totalPnl,
      unrealizedPnl: totalPnl,
    }));
  }, [positions]);

  // Check TP/SL triggers
  useEffect(() => {
    positions.forEach((pos) => {
      if (pos.symbol !== symbol) return;

      const { triggered, type } = checkTrigger(pos, tickerData?.price || 0);

      if (triggered && type) {
        handleClosePosition(pos.id, type);
      }
    });
  }, [tickerData, positions, symbol]);

  const handleSetBalance = useCallback((balance: number) => {
    setWallet({
      availableBalance: balance,
      totalEquity: balance,
      unrealizedPnl: 0,
    });
    setPositions([]);
  }, []);

  const handlePlaceOrder = useCallback(
    (order: {
      direction: 'LONG' | 'SHORT';
      leverage: number;
      quantity: number;
      takeProfit: number | null;
      stopLoss: number | null;
    }) => {
      if (!tickerData) return;

      const margin = calculateMargin(
        order.quantity,
        order.leverage,
        tickerData.price
      );

      if (margin > wallet.availableBalance) {
        return;
      }

      const newPosition: Position = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        symbol,
        direction: order.direction,
        leverage: order.leverage,
        quantity: order.quantity,
        lockedMargin: margin,
        entryPrice: tickerData.price,
        currentPrice: tickerData.price,
        takeProfit: order.takeProfit,
        stopLoss: order.stopLoss,
        unrealizedPnl: 0,
        roePercent: 0,
        timestamp: Date.now(),
      };

      setPositions((prev) => [...prev, newPosition]);
      setWallet((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance - margin,
      }));
    },
    [tickerData, wallet.availableBalance, symbol]
  );

  const handleClosePosition = useCallback(
    (positionId: string, reason: 'MANUAL' | 'TP' | 'SL' = 'MANUAL') => {
      setPositions((prev) => {
        const position = prev.find((p) => p.id === positionId);
        if (!position) return prev;

        const closed: ClosedPosition = {
          id: position.id,
          symbol: position.symbol,
          direction: position.direction,
          leverage: position.leverage,
          quantity: position.quantity,
          lockedMargin: position.lockedMargin,
          entryPrice: position.entryPrice,
          exitPrice: position.currentPrice,
          takeProfit: position.takeProfit,
          stopLoss: position.stopLoss,
          realizedPnl: position.unrealizedPnl,
          roePercent: position.roePercent,
          closeReason: reason,
          timestamp: Date.now(),
        };

        setClosedPosition(closed);
        return prev.filter((p) => p.id !== positionId);
      });
    },
    []
  );

  const handleConfirmPnL = useCallback(() => {
    if (!closedPosition) return;

    setWallet((prev) => ({
      ...prev,
      availableBalance:
        prev.availableBalance +
        closedPosition.lockedMargin +
        closedPosition.realizedPnl,
    }));

    setClosedPosition(null);
  }, [closedPosition]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0b0e11' }}>
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">₿</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">CryptoFutures</h1>
              <p className="text-slate-500 text-xs">
                Perpetual Trading Simulator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-semibold border border-amber-500/30">
              DEMO MODE
            </span>
          </div>
        </header>

        {/* Wallet Dashboard */}
        <WalletDashboard wallet={wallet} onSetBalance={handleSetBalance} />

        {/* Asset Selector */}
        <AssetSelector
          currentSymbol={symbol}
          tickerData={tickerData}
          isConnected={isConnected}
          onLoadAsset={setSymbol}
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Order Form */}
          <div className="lg:col-span-1">
            <OrderForm
              symbol={symbol}
              currentPrice={tickerData?.price || 0}
              availableBalance={wallet.availableBalance}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>

          {/* Positions Ledger */}
          <div className="lg:col-span-2">
            <PositionsLedger
              positions={positions}
              onClosePosition={(id) => handleClosePosition(id, 'MANUAL')}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-slate-600 text-xs border-t border-slate-800 mt-8">
          <p>
            ⚠️ This is a simulated trading environment. No real money is
            involved.
          </p>
          <p className="mt-1">
            Prices provided by Coinbase WebSocket Feed • For educational
            purposes only
          </p>
        </footer>
      </div>

      {/* PnL Modal */}
      <PnLModal closedPosition={closedPosition} onConfirm={handleConfirmPnL} />
    </div>
  );
}
