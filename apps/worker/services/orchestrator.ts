import type { Env } from '../src/types.js';
import type { Task } from '@gm/shared';

interface OrchestratorEvent {
  type: 'progress' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  result?: Record<string, unknown>;
  error?: { message: string; code?: string };
}

export class OrchestratorClient {
  private env: Env;
  private organizationId: string;

  constructor(env: Env, organizationId: string) {
    this.env = env;
    this.organizationId = organizationId;
  }

  async executeTask(
    taskId: string,
    category: string | null,
    params: Record<string, unknown>,
    onProgress: (event: OrchestratorEvent) => Promise<void>
  ): Promise<{ success: boolean; result?: Record<string, unknown>; error?: { message: string; code?: string } }> {
    const orchestratorUrl = this.env.ORCHESTRATOR_URL;

    if (!orchestratorUrl) {
      // Simulate execution if no orchestrator configured
      return this.simulateExecution(taskId, onProgress);
    }

    try {
      const response = await fetch(`${orchestratorUrl}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.env.ORCHESTRATOR_API_KEY}`,
          'X-Organization-Id': this.organizationId
        },
        body: JSON.stringify({
          taskId,
          type: category,
          params
        })
      });

      if (!response.ok) {
        throw new Error(`Orchestrator error: ${response.status}`);
      }

      // Stream response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let result: { success: boolean; result?: Record<string, unknown>; error?: { message: string; code?: string } } = { success: false };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const events = chunk.split('\n\n').filter(Boolean);

        for (const eventStr of events) {
          if (!eventStr.startsWith('data: ')) continue;

          try {
            const event: OrchestratorEvent = JSON.parse(eventStr.slice(6));

            // Notify progress callback
            await onProgress(event);

            // Handle completion
            if (event.type === 'completed') {
              result = { success: true, result: event.result };
            } else if (event.type === 'failed') {
              result = { success: false, error: event.error };
            }
          } catch (parseError) {
            console.error('Failed to parse orchestrator event:', parseError);
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Orchestrator execution error:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
          code: 'ORCHESTRATOR_ERROR'
        }
      };
    }
  }

  async cancelTask(taskId: string): Promise<boolean> {
    const orchestratorUrl = this.env.ORCHESTRATOR_URL;

    if (!orchestratorUrl) {
      return true; // Simulated success
    }

    try {
      const response = await fetch(`${orchestratorUrl}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.env.ORCHESTRATOR_API_KEY}`,
          'X-Organization-Id': this.organizationId
        },
        body: JSON.stringify({ taskId })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to cancel task:', error);
      return false;
    }
  }

  private async simulateExecution(
    taskId: string,
    onProgress: (event: OrchestratorEvent) => Promise<void>
  ): Promise<{ success: boolean; result?: Record<string, unknown>; error?: { message: string; code?: string } }> {
    const steps = [
      { progress: 10, message: 'Initializing task...' },
      { progress: 25, message: 'Fetching data...' },
      { progress: 50, message: 'Processing data...' },
      { progress: 75, message: 'Generating results...' },
      { progress: 100, message: 'Complete' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 200));
      await onProgress({
        type: 'progress',
        progress: step.progress,
        message: step.message
      });
    }

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (success) {
      const result = {
        summary: `Task ${taskId} completed successfully`,
        data: {
          processedItems: Math.floor(Math.random() * 100) + 1,
          duration: '2.5s',
          timestamp: new Date().toISOString()
        }
      };

      await onProgress({
        type: 'completed',
        result
      });

      return { success: true, result };
    } else {
      const error = {
        message: 'Simulated failure for testing',
        code: 'MOCK_ERROR'
      };

      await onProgress({
        type: 'failed',
        error
      });

      return { success: false, error };
    }
  }
}

// Helper function to create signed requests (HMAC)
export async function signRequest(
  payload: string,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

// Verify orchestrator response signature
export async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const expectedSignature = await signRequest(payload, secret);
  return signature === expectedSignature;
}
