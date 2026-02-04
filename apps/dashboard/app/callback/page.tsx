'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'https://general-manager.tools-7b7.workers.dev';
const DASHBOARD_URL = typeof window !== 'undefined' ? window.location.origin : 'https://gm-dashboard.pages.dev';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(params.get('error_description') || errorParam);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        return;
      }

      // Get PKCE verifier from session storage
      const verifier = sessionStorage.getItem('gm_pkce_verifier');
      if (!verifier) {
        setError('Session expired. Please try logging in again.');
        return;
      }

      setStatus('Exchanging code for token...');

      try {
        const response = await fetch(`${MCP_SERVER_URL}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: 'gm-dashboard',
            code_verifier: verifier,
            redirect_uri: `${DASHBOARD_URL}/callback`,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error_description || data.error || 'Token exchange failed');
        }

        const tokens = await response.json();

        // Store tokens
        localStorage.setItem('gm_access_token', tokens.access_token);
        if (tokens.refresh_token) {
          localStorage.setItem('gm_refresh_token', tokens.refresh_token);
        }

        // Decode user info from token
        const payload = JSON.parse(atob(tokens.access_token));

        // Create user object from token payload
        // The /api/users/me endpoint requires session cookies which don't work cross-origin
        const user = {
          id: payload.sub,
          email: payload.email || 'user@example.com',
          organizationId: payload.org,
          organizationName: payload.orgName || 'Organization',
        };

        localStorage.setItem('gm_user', JSON.stringify(user));

        // Clear PKCE verifier
        sessionStorage.removeItem('gm_pkce_verifier');

        setStatus('Success! Redirecting...');

        // Redirect to dashboard
        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
}
