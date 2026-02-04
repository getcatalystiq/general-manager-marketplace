'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMCPClient, type MCPClient } from './mcp-client';

interface MCPContextValue {
  client: MCPClient;
  isConnected: boolean;
  isMCPHost: boolean;
}

const MCPContext = createContext<MCPContextValue | null>(null);

export function MCPProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMCPHost, setIsMCPHost] = useState(false);
  const client = getMCPClient();

  useEffect(() => {
    // Check if we're running inside an MCP host (iframe)
    const isInIframe = typeof window !== 'undefined' && window.parent !== window;
    setIsMCPHost(isInIframe);
    setIsConnected(isInIframe);

    if (isInIframe) {
      // Listen for connection confirmation from host
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'mcp_connected') {
          setIsConnected(true);
        }
      };
      window.addEventListener('message', handleMessage);

      // Notify parent we're ready
      window.parent.postMessage({ type: 'mcp_ready' }, '*');

      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  return (
    <MCPContext.Provider value={{ client, isConnected, isMCPHost }}>
      {children}
    </MCPContext.Provider>
  );
}

export function useMCP(): MCPContextValue {
  const context = useContext(MCPContext);
  if (!context) {
    throw new Error('useMCP must be used within an MCPProvider');
  }
  return context;
}

// Hook for subscribing to MCP events
export function useMCPEvent<T = unknown>(
  event: string,
  handler: (data: T) => void
): void {
  const { client } = useMCP();

  useEffect(() => {
    const unsubscribe = client.on<T>(event, handler);
    return unsubscribe;
  }, [client, event, handler]);
}
