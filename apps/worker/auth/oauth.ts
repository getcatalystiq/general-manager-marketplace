import { Hono } from 'hono';
import type { HonoEnv } from '../src/types.js';
import { getSessionFromRequest } from './users.js';

export const oauthRoutes = new Hono<HonoEnv>();

// Helper to store pending auth request in D1
async function storePendingAuthRequest(env: any, requestId: string, data: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state?: string;
  codeChallenge: string;
  codeChallengeMethod: string;
}) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
  await env.DB.prepare(`
    INSERT INTO oauth_pending_requests (request_id, client_id, redirect_uri, scope, state, code_challenge, code_challenge_method, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    requestId,
    data.clientId,
    data.redirectUri,
    data.scope,
    data.state || null,
    data.codeChallenge,
    data.codeChallengeMethod,
    expiresAt,
    new Date().toISOString()
  ).run();
}

// Helper to get and delete pending auth request from D1
async function getAndDeletePendingAuthRequest(env: any, requestId: string) {
  const result = await env.DB.prepare(`
    SELECT * FROM oauth_pending_requests WHERE request_id = ? AND expires_at > ?
  `).bind(requestId, new Date().toISOString()).first();

  if (result) {
    await env.DB.prepare(`DELETE FROM oauth_pending_requests WHERE request_id = ?`).bind(requestId).run();
  }

  return result;
}

// Helper to store auth code in D1
async function storeAuthCode(env: any, code: string, data: {
  clientId: string;
  userId: string;
  organizationId: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  redirectUri: string;
}) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await env.DB.prepare(`
    INSERT INTO oauth_auth_codes (code, client_id, user_id, organization_id, scope, code_challenge, code_challenge_method, redirect_uri, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    code,
    data.clientId,
    data.userId,
    data.organizationId,
    data.scope,
    data.codeChallenge,
    data.codeChallengeMethod,
    data.redirectUri,
    expiresAt,
    new Date().toISOString()
  ).run();
}

// Helper to get and delete auth code from D1
async function getAndDeleteAuthCode(env: any, code: string) {
  const result = await env.DB.prepare(`
    SELECT * FROM oauth_auth_codes WHERE code = ?
  `).bind(code).first();

  if (result) {
    await env.DB.prepare(`DELETE FROM oauth_auth_codes WHERE code = ?`).bind(code).run();
  }

  return result;
}

// Authorization endpoint - shows login page or redirects if logged in
oauthRoutes.get('/authorize', async (c) => {
  const {
    client_id,
    redirect_uri,
    response_type,
    scope,
    state,
    code_challenge,
    code_challenge_method
  } = c.req.query();

  // Validate required parameters
  if (response_type !== 'code') {
    return c.json({ error: 'unsupported_response_type' }, 400);
  }

  if (!client_id || !redirect_uri || !code_challenge) {
    return c.json({ error: 'invalid_request', error_description: 'Missing required parameters' }, 400);
  }

  if (code_challenge_method !== 'S256') {
    return c.json({ error: 'invalid_request', error_description: 'Only S256 code_challenge_method supported' }, 400);
  }

  // Check if user is already logged in via session
  const session = await getSessionFromRequest(c);

  if (session) {
    // User is logged in, generate code and redirect
    const code = crypto.randomUUID();
    await storeAuthCode(c.env, code, {
      clientId: client_id,
      userId: session.userId,
      organizationId: session.organizationId,
      scope: scope || 'openid profile tasks',
      codeChallenge: code_challenge,
      codeChallengeMethod: code_challenge_method,
      redirectUri: redirect_uri,
    });

    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set('code', code);
    if (state) {
      redirectUrl.searchParams.set('state', state);
    }

    return c.redirect(redirectUrl.toString());
  }

  // Store pending auth request in D1
  const requestId = crypto.randomUUID();
  await storePendingAuthRequest(c.env, requestId, {
    clientId: client_id,
    redirectUri: redirect_uri,
    scope: scope || 'openid profile tasks',
    state,
    codeChallenge: code_challenge,
    codeChallengeMethod: code_challenge_method
  });

  // Show login page
  return c.html(getLoginPage(requestId, client_id));
});

// Handle login form submission during OAuth flow
oauthRoutes.post('/authorize/login', async (c) => {
  const body = await c.req.parseBody();
  const email = body['email'] as string;
  const password = body['password'] as string;
  const requestId = body['request_id'] as string;

  const pendingRequest = await getAndDeletePendingAuthRequest(c.env, requestId);
  if (!pendingRequest) {
    return c.html(getLoginPage(requestId, '', 'Authorization request expired. Please try again.'));
  }

  // Map DB columns to expected property names
  const pendingData = {
    clientId: pendingRequest.client_id as string,
    redirectUri: pendingRequest.redirect_uri as string,
    scope: pendingRequest.scope as string,
    state: pendingRequest.state as string | undefined,
    codeChallenge: pendingRequest.code_challenge as string,
    codeChallengeMethod: pendingRequest.code_challenge_method as string,
  };

  const env = c.env;

  // Validate credentials
  const user = await env.DB.prepare(`
    SELECT id, organization_id, email, password_hash
    FROM users WHERE email = ?
  `).bind(email.toLowerCase()).first();

  if (!user || !user.password_hash) {
    return c.html(getLoginPage(requestId, pendingData.clientId, 'Invalid email or password'));
  }

  const valid = await verifyPassword(password, user.password_hash as string);
  if (!valid) {
    return c.html(getLoginPage(requestId, pendingData.clientId, 'Invalid email or password'));
  }

  // Create session
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, organization_id, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(sessionId, user.id, user.organization_id, expiresAt, new Date().toISOString()).run();

  // Generate authorization code
  const code = crypto.randomUUID();
  await storeAuthCode(env, code, {
    clientId: pendingData.clientId,
    userId: user.id as string,
    organizationId: user.organization_id as string,
    scope: pendingData.scope,
    codeChallenge: pendingData.codeChallenge,
    codeChallengeMethod: pendingData.codeChallengeMethod,
    redirectUri: pendingData.redirectUri,
  });

  // Redirect with code
  const redirectUrl = new URL(pendingData.redirectUri);
  redirectUrl.searchParams.set('code', code);
  if (pendingData.state) {
    redirectUrl.searchParams.set('state', pendingData.state);
  }

  // Set session cookie and redirect
  c.header('Set-Cookie', `gm_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);
  return c.redirect(redirectUrl.toString());
});

// Token endpoint
oauthRoutes.post('/token', async (c) => {
  const body = await c.req.parseBody();
  const grantType = body['grant_type'] as string;

  if (grantType === 'authorization_code') {
    return handleAuthorizationCode(c, body);
  } else if (grantType === 'refresh_token') {
    return handleRefreshToken(c, body);
  }

  return c.json({ error: 'unsupported_grant_type' }, 400);
});

async function handleAuthorizationCode(c: any, body: Record<string, string | File>) {
  const code = body['code'] as string;
  const codeVerifier = body['code_verifier'] as string;
  const clientId = body['client_id'] as string;
  const redirectUri = body['redirect_uri'] as string;

  if (!code || !codeVerifier || !clientId) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const authCode = await getAndDeleteAuthCode(c.env, code);
  if (!authCode) {
    return c.json({ error: 'invalid_grant', error_description: 'Invalid or expired code' }, 400);
  }

  // Verify code hasn't expired
  if (new Date(authCode.expires_at as string) < new Date()) {
    return c.json({ error: 'invalid_grant', error_description: 'Code expired' }, 400);
  }

  // Verify client ID
  if (authCode.client_id !== clientId) {
    return c.json({ error: 'invalid_grant', error_description: 'Client ID mismatch' }, 400);
  }

  // Verify redirect URI if provided
  if (redirectUri && authCode.redirect_uri !== redirectUri) {
    return c.json({ error: 'invalid_grant', error_description: 'Redirect URI mismatch' }, 400);
  }

  // Verify PKCE code verifier
  const expectedChallenge = await sha256Base64Url(codeVerifier);
  if (expectedChallenge !== authCode.code_challenge) {
    return c.json({ error: 'invalid_grant', error_description: 'Code verifier mismatch' }, 400);
  }

  // Fetch user info for token payload
  const env = c.env;
  const userInfo = await env.DB.prepare(`
    SELECT u.email, o.name as org_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = ?
  `).bind(authCode.user_id).first();

  const extra = {
    email: userInfo?.email as string,
    orgName: userInfo?.org_name as string,
  };

  // Generate tokens
  const accessToken = await generateToken(authCode.user_id as string, authCode.organization_id as string, 'access', 3600, extra);
  const refreshToken = await generateToken(authCode.user_id as string, authCode.organization_id as string, 'refresh', 86400 * 30, extra);

  // Store refresh token in DB
  await env.DB.prepare(`
    INSERT INTO oauth_tokens (id, user_id, organization_id, token_hash, token_type, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(),
    authCode.user_id,
    authCode.organization_id,
    await sha256Base64Url(refreshToken),
    'refresh',
    new Date(Date.now() + 86400 * 30 * 1000).toISOString(),
    new Date().toISOString()
  ).run();

  return c.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken,
    scope: authCode.scope
  });
}

async function handleRefreshToken(c: any, body: Record<string, string | File>) {
  const refreshToken = body['refresh_token'] as string;

  if (!refreshToken) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const env = c.env;
  const tokenHash = await sha256Base64Url(refreshToken);
  const result = await env.DB.prepare(`
    SELECT user_id, organization_id, expires_at
    FROM oauth_tokens
    WHERE token_hash = ? AND token_type = 'refresh'
  `).bind(tokenHash).first();

  if (!result) {
    return c.json({ error: 'invalid_grant', error_description: 'Invalid refresh token' }, 400);
  }

  if (new Date(result.expires_at as string) < new Date()) {
    await env.DB.prepare(`DELETE FROM oauth_tokens WHERE token_hash = ?`).bind(tokenHash).run();
    return c.json({ error: 'invalid_grant', error_description: 'Refresh token expired' }, 400);
  }

  // Fetch user info for token payload
  const userInfo = await env.DB.prepare(`
    SELECT u.email, o.name as org_name
    FROM users u
    JOIN organizations o ON u.organization_id = o.id
    WHERE u.id = ?
  `).bind(result.user_id).first();

  const extra = {
    email: userInfo?.email as string,
    orgName: userInfo?.org_name as string,
  };

  const accessToken = await generateToken(
    result.user_id as string,
    result.organization_id as string,
    'access',
    3600,
    extra
  );

  return c.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600
  });
}

// Token revocation endpoint
oauthRoutes.post('/revoke', async (c) => {
  const body = await c.req.parseBody();
  const token = body['token'] as string;

  if (!token) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const env = c.env;
  const tokenHash = await sha256Base64Url(token);
  await env.DB.prepare(`DELETE FROM oauth_tokens WHERE token_hash = ?`).bind(tokenHash).run();

  return c.text('', 200);
});

// Dynamic Client Registration (RFC 7591)
// Allows Claude and other MCP clients to register dynamically
oauthRoutes.post('/register', async (c) => {
  const body = await c.req.json() as {
    client_name?: string;
    redirect_uris?: string[];
    grant_types?: string[];
    response_types?: string[];
    token_endpoint_auth_method?: string;
    scope?: string;
  };

  // Generate a client_id for this registration
  const clientId = `mcp-client-${crypto.randomUUID()}`;

  // For public clients using PKCE, we don't require a client_secret
  const response: Record<string, unknown> = {
    client_id: clientId,
    client_name: body.client_name || 'MCP Client',
    redirect_uris: body.redirect_uris || [],
    grant_types: body.grant_types || ['authorization_code', 'refresh_token'],
    response_types: body.response_types || ['code'],
    token_endpoint_auth_method: 'none', // Public client with PKCE
    scope: body.scope || 'openid profile tasks approvals settings',
    client_id_issued_at: Math.floor(Date.now() / 1000),
  };

  // Store the client registration in D1 (optional - for tracking)
  try {
    await c.env.DB.prepare(`
      INSERT INTO oauth_clients (client_id, client_name, redirect_uris, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(
      clientId,
      response.client_name,
      JSON.stringify(body.redirect_uris || []),
      new Date().toISOString()
    ).run();
  } catch {
    // Table might not exist yet - that's ok for now
  }

  return c.json(response, 201);
});

// Helper functions
async function sha256Base64Url(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateToken(
  userId: string,
  organizationId: string,
  type: string,
  expiresIn: number,
  extra?: { email?: string; orgName?: string }
): Promise<string> {
  const payload = {
    sub: userId,
    org: organizationId,
    type,
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    iat: Math.floor(Date.now() / 1000),
    jti: crypto.randomUUID(),
    ...(extra?.email && { email: extra.email }),
    ...(extra?.orgName && { orgName: extra.orgName }),
  };

  // Simple base64 encoding (use proper JWT signing with secret in production)
  return btoa(JSON.stringify(payload));
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return false;

  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
  const expectedHash = atob(hashB64);

  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  const key = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );

  const actualHash = String.fromCharCode(...new Uint8Array(hash));
  return actualHash === expectedHash;
}

function getLoginPage(requestId: string, clientId: string, error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in - General Manager</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo h1 {
      font-size: 24px;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .logo p {
      color: #666;
      font-size: 14px;
    }
    .error {
      background: #fee2e2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    button:active {
      transform: translateY(0);
    }
    .footer {
      text-align: center;
      margin-top: 24px;
      color: #666;
      font-size: 14px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .client-info {
      text-align: center;
      padding: 12px;
      background: #f3f4f6;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 13px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <h1>General Manager</h1>
      <p>AI Operations Assistant</p>
    </div>

    ${clientId ? `<div class="client-info">Authorizing access for <strong>${escapeHtml(clientId)}</strong></div>` : ''}

    ${error ? `<div class="error">${escapeHtml(error)}</div>` : ''}

    <form method="POST" action="/oauth/authorize/login">
      <input type="hidden" name="request_id" value="${escapeHtml(requestId)}">

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required autocomplete="email" autofocus>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
      </div>

      <button type="submit">Sign In</button>
    </form>

    <div class="footer">
      Don't have an account? <a href="/register">Sign up</a>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
