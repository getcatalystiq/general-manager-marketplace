'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  organizationId: string;
  organizationName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'https://general-manager.tools-7b7.workers.dev';
const DASHBOARD_URL = typeof window !== 'undefined' ? window.location.origin : 'https://gm-dashboard.pages.dev';

// PKCE helpers
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const verifier = generateRandomString(64);
  const hashed = await sha256(verifier);
  const challenge = base64UrlEncode(hashed);
  return { verifier, challenge };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const storedToken = localStorage.getItem('gm_access_token');
    const storedUser = localStorage.getItem('gm_user');

    if (storedToken && storedUser) {
      try {
        // Verify token is not expired
        const payload = JSON.parse(atob(storedToken));
        if (payload.exp * 1000 > Date.now()) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('gm_refresh_token');
          if (refreshToken) {
            refreshAccessToken(refreshToken);
            return;
          }
          // Clear expired tokens
          localStorage.removeItem('gm_access_token');
          localStorage.removeItem('gm_user');
          localStorage.removeItem('gm_refresh_token');
        }
      } catch {
        localStorage.removeItem('gm_access_token');
        localStorage.removeItem('gm_user');
      }
    }
    setLoading(false);
  }, []);

  async function refreshAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${MCP_SERVER_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('gm_access_token', data.access_token);
        setAccessToken(data.access_token);

        // Decode user from token
        const payload = JSON.parse(atob(data.access_token));
        const storedUser = localStorage.getItem('gm_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        // Refresh failed, clear everything
        localStorage.removeItem('gm_access_token');
        localStorage.removeItem('gm_user');
        localStorage.removeItem('gm_refresh_token');
      }
    } catch {
      localStorage.removeItem('gm_access_token');
      localStorage.removeItem('gm_user');
      localStorage.removeItem('gm_refresh_token');
    }
    setLoading(false);
  }

  async function login() {
    const { verifier, challenge } = await generatePKCE();

    // Store verifier for token exchange
    sessionStorage.setItem('gm_pkce_verifier', verifier);

    // Redirect to OAuth
    const params = new URLSearchParams({
      client_id: 'gm-dashboard',
      redirect_uri: `${DASHBOARD_URL}/callback`,
      response_type: 'code',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      scope: 'openid profile tasks approvals settings',
    });

    window.location.href = `${MCP_SERVER_URL}/oauth/authorize?${params}`;
  }

  function logout() {
    localStorage.removeItem('gm_access_token');
    localStorage.removeItem('gm_refresh_token');
    localStorage.removeItem('gm_user');
    setUser(null);
    setAccessToken(null);

    // Redirect to MCP server logout to clear the session cookie
    const redirectUri = encodeURIComponent(`${DASHBOARD_URL}/?logged_out=true`);
    window.location.href = `${MCP_SERVER_URL}/api/users/logout?redirect_uri=${redirectUri}`;
  }

  return (
    <AuthContext.Provider value={{ user, loading, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, login } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Check if user just logged out
      const params = new URLSearchParams(window.location.search);
      if (params.get('logged_out') === 'true') {
        // Clear the query param and show login prompt
        window.history.replaceState({}, '', window.location.pathname);
        setShowLoginPrompt(true);
      } else {
        login();
      }
    }
  }, [loading, user, login]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && showLoginPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Signed Out</h1>
          <p className="text-gray-600 mb-6">You have been successfully signed out.</p>
          <button
            onClick={() => { setShowLoginPrompt(false); login(); }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Redirecting to login...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
