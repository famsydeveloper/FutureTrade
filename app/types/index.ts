export interface Position {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  leverage: number;
  quantity: number;
  lockedMargin: number;
  entryPrice: number;
  currentPrice: number;
  takeProfit: number | null;
  stopLoss: number | null;
  unrealizedPnl: number;
  roePercent: number;
  timestamp: number;
}

export interface ClosedPosition {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  leverage: number;
  quantity: number;
  lockedMargin: number;
  entryPrice: number;
  exitPrice: number;
  takeProfit: number | null;
  stopLoss: number | null;
  realizedPnl: number;
  roePercent: number;
  closeReason: 'MANUAL' | 'TP' | 'SL';
  timestamp: number;
}

export interface TickerData {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export interface WalletState {
  availableBalance: number;
  totalEquity: number;
  unrealizedPnl: number;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}