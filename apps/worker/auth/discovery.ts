import { Hono } from 'hono';
import type { HonoEnv } from '../src/types.js';

export const discoveryRoutes = new Hono<HonoEnv>();

// OAuth 2.1 Authorization Server Metadata (RFC 8414)
discoveryRoutes.get('/oauth-authorization-server', (c) => {
  const baseUrl = new URL(c.req.url).origin;

  return c.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    registration_endpoint: `${baseUrl}/oauth/register`,
    token_endpoint_auth_methods_supported: ['none'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    response_types_supported: ['code'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: ['openid', 'profile', 'tasks', 'approvals', 'settings'],
    revocation_endpoint: `${baseUrl}/oauth/revoke`,
    introspection_endpoint: `${baseUrl}/oauth/introspect`
  });
});

// MCP Server Discovery
discoveryRoutes.get('/mcp-server', (c) => {
  const baseUrl = new URL(c.req.url).origin;

  return c.json({
    name: 'general-manager',
    version: '0.0.1',
    description: 'AI-powered general manager for small organizations',
    endpoints: {
      mcp: `${baseUrl}/mcp`,
      sse: `${baseUrl}/mcp/sse`
    },
    authentication: {
      type: 'oauth2',
      authorization_server: `${baseUrl}/.well-known/oauth-authorization-server`
    },
    capabilities: {
      tools: true,
      resources: true,
      prompts: false
    }
  });
});
