import { useState, useEffect, useRef, useCallback } from 'react';
import { TickerData } from '../types';

const COINBASE_WS_URL = 'wss://ws-feed.exchange.coinbase.com';

export function useWebSocket(symbol: string) {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [priceHistory, setPriceHistory] = useState<{ time: number; price: number }[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(COINBASE_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      const subscribeMsg = {
        type: 'subscribe',
        product_ids: [symbol],
        channels: ['ticker'],
      };
      ws.send(JSON.stringify(subscribeMsg));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'ticker') {
          const price = parseFloat(data.price || 0);
          if (price > 0) {
            setTickerData({
              symbol: symbol,
              price: price,
              change24h: parseFloat(data.open_24h || 0) > 0 
                ? ((price - parseFloat(data.open_24h || price)) / parseFloat(data.open_24h || price)) * 100 
                : 0,
              high24h: parseFloat(data.high_24h || price),
              low24h: parseFloat(data.low_24h || price),
              volume24h: parseFloat(data.volume_24h || 0),
            });
            
            setPriceHistory((prev) => {
              const newHistory = [...prev, { time: Date.now(), price }];
              return newHistory.slice(-60);
            });
          }
        }
      } catch (e) {
        console.error('WebSocket parse error:', e);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  }, [symbol]);

  useEffect(() => {
    setTickerData(null);
    setPriceHistory([]);
    
    if (wsRef.current) {
      wsRef.current.close();
    }

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [symbol, connect]);

  return { tickerData, priceHistory, isConnected };
}