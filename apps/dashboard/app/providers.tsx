'use client';

import { ReactNode } from 'react';
import { MCPProvider } from '../lib/mcp-context';
import { AuthProvider } from '../lib/auth';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MCPProvider>
        {children}
      </MCPProvider>
    </AuthProvider>
  );
}
