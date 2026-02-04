import type { DurableObjectState } from '@cloudflare/workers-types';

interface SessionData {
  organizationId: string;
  userId: string;
  createdAt: string;
  lastAccessedAt: string;
}

export class McpSession {
  private state: DurableObjectState;
  private sessionData: SessionData | null = null;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/init':
        return this.handleInit(request);
      case '/get':
        return this.handleGet();
      case '/touch':
        return this.handleTouch();
      case '/destroy':
        return this.handleDestroy();
      default:
        return new Response('Not found', { status: 404 });
    }
  }

  private async handleInit(request: Request): Promise<Response> {
    const body = await request.json() as { organizationId: string; userId: string };

    this.sessionData = {
      organizationId: body.organizationId,
      userId: body.userId,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    await this.state.storage.put('session', this.sessionData);

    return new Response(JSON.stringify(this.sessionData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleGet(): Promise<Response> {
    if (!this.sessionData) {
      this.sessionData = await this.state.storage.get('session') || null;
    }

    if (!this.sessionData) {
      return new Response('Session not found', { status: 404 });
    }

    return new Response(JSON.stringify(this.sessionData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleTouch(): Promise<Response> {
    if (!this.sessionData) {
      this.sessionData = await this.state.storage.get('session') || null;
    }

    if (!this.sessionData) {
      return new Response('Session not found', { status: 404 });
    }

    this.sessionData.lastAccessedAt = new Date().toISOString();
    await this.state.storage.put('session', this.sessionData);

    return new Response(JSON.stringify(this.sessionData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private async handleDestroy(): Promise<Response> {
    await this.state.storage.deleteAll();
    this.sessionData = null;

    return new Response('Session destroyed', { status: 200 });
  }

  // Alarm for session cleanup after inactivity
  async alarm(): Promise<void> {
    const session = await this.state.storage.get<SessionData>('session');
    if (!session) return;

    const lastAccess = new Date(session.lastAccessedAt).getTime();
    const now = Date.now();
    const hoursSinceAccess = (now - lastAccess) / (1000 * 60 * 60);

    // Clean up sessions inactive for more than 24 hours
    if (hoursSinceAccess > 24) {
      await this.state.storage.deleteAll();
    }
  }
}
