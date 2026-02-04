import { createMiddleware } from 'hono/factory';
import type { HonoEnv } from '../src/types.js';

export const authMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'unauthorized', error_description: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.slice(7);

  try {
    // Decode token (simple base64 for demo - use proper JWT verification in production)
    const payload = JSON.parse(atob(token));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: 'unauthorized', error_description: 'Token expired' }, 401);
    }

    // Verify user exists and is active
    const env = c.env;
    const user = await env.DB.prepare(`
      SELECT u.id, u.email, u.organization_id, u.role
      FROM users u
      WHERE u.id = ? AND u.organization_id = ?
    `).bind(payload.sub, payload.org).first();

    if (!user) {
      return c.json({ error: 'unauthorized', error_description: 'User not found' }, 401);
    }

    // Set context variables
    c.set('organizationId', payload.org);
    c.set('userId', payload.sub);
    c.set('user', {
      id: user.id as string,
      email: user.email as string,
      organizationId: user.organization_id as string,
      role: user.role as string
    });

    await next();
  } catch (error) {
    console.error('Auth error:', error);
    return c.json({ error: 'unauthorized', error_description: 'Invalid token' }, 401);
  }
});

// Optional: Rate limiting middleware per organization
export const rateLimitMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
  // Cloudflare has built-in rate limiting, but we can add custom logic here
  // For now, just pass through
  await next();
});
