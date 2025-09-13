import { useState, useEffect, useCallback } from 'react';
import { StreamEvent } from '../types';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export const useStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSource) {
      eventSource.close();
    }

    setConnectionStatus('connecting');
    const es = new EventSource('/api/stream');
    
    es.onopen = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
    };

    es.onerror = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    es.addEventListener('seat_open', (event) => {
      const data: StreamEvent = JSON.parse(event.data);
      console.log('Seat opened:', data);
      // Handle seat open event
    });

    es.addEventListener('hold_taken', (event) => {
      const data: StreamEvent = JSON.parse(event.data);
      console.log('Hold taken:', data);
      // Handle hold taken event
    });

    es.addEventListener('hold_expired', (event) => {
      const data: StreamEvent = JSON.parse(event.data);
      console.log('Hold expired:', data);
      // Handle hold expired event
    });

    setEventSource(es);
  }, [eventSource]);

  const disconnect = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, [eventSource]);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
  };
};
