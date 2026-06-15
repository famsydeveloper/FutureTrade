import { Position } from '../types';

export function calculateMargin(positionSize: number, leverage: number, price: number): number {
  return (positionSize * price) / leverage;
}

export function calculatePnl(
  direction: 'LONG' | 'SHORT',
  entryPrice: number,
  currentPrice: number,
  quantity: number,
  leverage: number
): { pnl: number; roePercent: number } {
  let pnl: number;
  
  if (direction === 'LONG') {
    pnl = (currentPrice - entryPrice) * quantity;
  } else {
    pnl = (entryPrice - currentPrice) * quantity;
  }
  
  const margin = (entryPrice * quantity) / leverage;
  const roePercent = margin > 0 ? (pnl / margin) * 100 : 0;
  
  return { pnl, roePercent };
}

export function checkTrigger(
  position: Position,
  currentPrice: number
): { triggered: boolean; type: 'TP' | 'SL' | null } {
  if (position.direction === 'LONG') {
    if (position.takeProfit && currentPrice >= position.takeProfit) {
      return { triggered: true, type: 'TP' };
    }
    if (position.stopLoss && currentPrice <= position.stopLoss) {
      return { triggered: true, type: 'SL' };
    }
  } else {
    if (position.takeProfit && currentPrice <= position.takeProfit) {
      return { triggered: true, type: 'TP' };
    }
    if (position.stopLoss && currentPrice >= position.stopLoss) {
      return { triggered: true, type: 'SL' };
    }
  }
  
  return { triggered: false, type: null };
}

export function formatPrice(price: number, decimals: number = 2): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  } else if (price >= 1) {
    return price.toFixed(decimals);
  } else {
    return price.toFixed(6);
  }
}

export function formatCurrency(amount: number): string {
  const prefix = amount >= 0 ? '' : '-';
  const absAmount = Math.abs(amount);
  return `${prefix}$${absAmount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

export function formatPercent(percent: number): string {
  const prefix = percent >= 0 ? '+' : '';
  return `${prefix}${percent.toFixed(2)}%`;
}

export function formatCompact(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}