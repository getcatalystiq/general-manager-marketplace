import { Hono } from 'hono';
import type { HonoEnv } from '../src/types.js';

export const userRoutes = new Hono<HonoEnv>();

// Register a new user and organization
userRoutes.post('/register', async (c) => {
  const body = await c.req.json() as {
    email: string;
    password: string;
    organizationName: string;
  };

  const { email, password, organizationName } = body;

  if (!email || !password || !organizationName) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400);
  }

  const env = c.env;

  // Check if email already exists
  const existing = await env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (existing) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  const userId = crypto.randomUUID();
  const organizationId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO organizations (id, name, created_at)
      VALUES (?, ?, ?)
    `).bind(organizationId, organizationName, now),
    env.DB.prepare(`
      INSERT INTO users (id, organization_id, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(userId, organizationId, email.toLowerCase(), passwordHash, 'owner', now),
    env.DB.prepare(`
      INSERT INTO settings (id, organization_id, autonomy_overrides, notification_prefs, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(crypto.randomUUID(), organizationId, '{}', '{}', now)
  ]);

  return c.json({
    success: true,
    user: {
      id: userId,
      email: email.toLowerCase(),
      organizationId,
      organizationName
    }
  }, 201);
});

// Login endpoint (returns session cookie)
userRoutes.post('/login', async (c) => {
  const body = await c.req.json() as {
    email: string;
    password: string;
  };

  const { email, password } = body;

  if (!email || !password) {
    return c.json({ error: 'Missing email or password' }, 400);
  }

  const env = c.env;

  const user = await env.DB.prepare(`
    SELECT id, organization_id, email, password_hash, role
    FROM users WHERE email = ?
  `).bind(email.toLowerCase()).first();

  if (!user || !user.password_hash) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const valid = await verifyPassword(password, user.password_hash as string);
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  // Create session
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  await env.DB.prepare(`
    INSERT INTO sessions (id, user_id, organization_id, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).bind(sessionId, user.id, user.organization_id, expiresAt, new Date().toISOString()).run();

  // Set session cookie
  c.header('Set-Cookie', `gm_session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`);

  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      organizationId: user.organization_id,
      role: user.role
    }
  });
});

// Logout (API)
userRoutes.post('/logout', async (c) => {
  const cookie = c.req.header('Cookie');
  const sessionId = cookie?.match(/gm_session=([^;]+)/)?.[1];

  if (sessionId) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }

  c.header('Set-Cookie', 'gm_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return c.json({ success: true });
});

// Logout with redirect (for cross-origin logout)
userRoutes.get('/logout', async (c) => {
  const redirectUri = c.req.query('redirect_uri') || 'https://gm-dashboard.pages.dev';

  const cookie = c.req.header('Cookie');
  const sessionId = cookie?.match(/gm_session=([^;]+)/)?.[1];

  if (sessionId) {
    await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
  }

  c.header('Set-Cookie', 'gm_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  return c.redirect(redirectUri);
});

// Get current user (from session)
userRoutes.get('/me', async (c) => {
  const cookie = c.req.header('Cookie');
  const sessionId = cookie?.match(/gm_session=([^;]+)/)?.[1];

  if (!sessionId) {
    return c.json({ error: 'Not authenticated' }, 401);
  }

  const env = c.env;
  const session = await env.DB.prepare(`
    SELECT s.user_id, s.organization_id, s.expires_at, u.email, u.role, o.name as org_name
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    JOIN organizations o ON s.organization_id = o.id
    WHERE s.id = ?
  `).bind(sessionId).first();

  if (!session || new Date(session.expires_at as string) < new Date()) {
    c.header('Set-Cookie', 'gm_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
    return c.json({ error: 'Session expired' }, 401);
  }

  return c.json({
    user: {
      id: session.user_id,
      email: session.email,
      organizationId: session.organization_id,
      organizationName: session.org_name,
      role: session.role
    }
  });
});

// Password hashing using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
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

  const saltB64 = btoa(String.fromCharCode(...salt));
  const hashB64 = btoa(String.fromCharCode(...new Uint8Array(hash)));

  return `${saltB64}:${hashB64}`;
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

// Helper to get session from request
export async function getSessionFromRequest(c: any): Promise<{
  userId: string;
  organizationId: string;
} | null> {
  const cookie = c.req.header('Cookie');
  const sessionId = cookie?.match(/gm_session=([^;]+)/)?.[1];

  if (!sessionId) return null;

  const session = await c.env.DB.prepare(`
    SELECT user_id, organization_id, expires_at
    FROM sessions WHERE id = ?
  `).bind(sessionId).first();

  if (!session || new Date(session.expires_at as string) < new Date()) {
    return null;
  }

  return {
    userId: session.user_id as string,
    organizationId: session.organization_id as string
  };
}
