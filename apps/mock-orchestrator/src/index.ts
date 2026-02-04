import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Plugin registry endpoint
app.get('/api/plugins', (c) => {
  const organizationId = c.req.header('X-Organization-Id');

  return c.json({
    plugins: [
      {
        id: 'general-manager-online-business',
        name: 'Online Business',
        version: '0.1.2',
        description: 'Manage your online business with AI-powered analysis',
        skills: [
          {
            id: 'saas-metrics',
            name: 'SaaS Metrics',
            description: 'Calculate MRR, churn, LTV, and other SaaS metrics',
            triggers: ['MRR', 'monthly recurring revenue', 'churn', 'LTV', 'lifetime value', 'ARR', 'CAC'],
            category: 'analytics'
          },
          {
            id: 'pricing-strategy',
            name: 'Pricing Strategy',
            description: 'Analyze and optimize pricing strategies',
            triggers: ['pricing', 'discount', 'revenue optimization', 'price point'],
            category: 'strategy'
          },
          {
            id: 'customer-success',
            name: 'Customer Success',
            description: 'Track customer health and engagement',
            triggers: ['customer health', 'engagement', 'retention', 'NPS'],
            category: 'customer'
          }
        ],
        commands: [
          {
            id: 'analyze-ads',
            name: 'Analyze Ads',
            description: 'Evaluate Google Ads performance and identify cost inefficiencies',
            parameters: [
              { name: '--from', description: 'Start date (YYYY-MM-DD)', type: 'date', required: false },
              { name: '--to', description: 'End date (YYYY-MM-DD)', type: 'date', required: false },
              { name: '--campaign', description: 'Filter by campaign name', type: 'string', required: false },
              { name: '--format', description: 'Output format', type: 'string', required: false, default: 'text' }
            ],
            requiredConnectors: ['google-ads']
          },
          {
            id: 'analyze-content',
            name: 'Analyze Content',
            description: 'Evaluate content performance metrics',
            parameters: [
              { name: '--url', description: 'Content URL to analyze', type: 'string', required: false },
              { name: '--period', description: 'Time period to analyze', type: 'string', required: false, default: '30d' }
            ],
            requiredConnectors: ['google-analytics']
          },
          {
            id: 'analyze-funnel',
            name: 'Analyze Funnel',
            description: 'Analyze conversion funnel performance',
            parameters: [
              { name: '--funnel', description: 'Funnel name to analyze', type: 'string', required: false }
            ],
            requiredConnectors: ['google-analytics', 'stripe']
          },
          {
            id: 'track-growth',
            name: 'Track Growth',
            description: 'Monitor business growth metrics',
            parameters: [
              { name: '--period', description: 'Time period', type: 'string', required: false, default: '30d' },
              { name: '--metric', description: 'Specific metric to track', type: 'string', required: false }
            ],
            requiredConnectors: ['stripe']
          }
        ]
      },
      {
        id: 'general-manager-freight-forwarders',
        name: 'Freight Forwarders',
        version: '0.1.0',
        description: 'Manage logistics operations with shipment tracking and carrier management',
        skills: [
          {
            id: 'shipment-tracking',
            name: 'Shipment Tracking',
            description: 'Track shipments and monitor delivery status',
            triggers: ['shipment', 'tracking', 'delivery', 'cargo'],
            category: 'logistics'
          },
          {
            id: 'rate-analysis',
            name: 'Rate Analysis',
            description: 'Compare and analyze shipping rates',
            triggers: ['shipping rates', 'freight rates', 'carrier pricing'],
            category: 'pricing'
          }
        ],
        commands: [
          {
            id: 'track-shipment',
            name: 'Track Shipment',
            description: 'Get real-time shipment status',
            parameters: [
              { name: '--tracking-number', description: 'Tracking number', type: 'string', required: true }
            ],
            requiredConnectors: []
          },
          {
            id: 'compare-rates',
            name: 'Compare Rates',
            description: 'Compare shipping rates across carriers',
            parameters: [
              { name: '--origin', description: 'Origin location', type: 'string', required: true },
              { name: '--destination', description: 'Destination location', type: 'string', required: true },
              { name: '--weight', description: 'Package weight in kg', type: 'number', required: true }
            ],
            requiredConnectors: []
          }
        ]
      }
    ],
    connectors: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Payment and subscription data',
        authType: 'api_key',
        status: organizationId ? 'connected' : 'disconnected'
      },
      {
        id: 'google-ads',
        name: 'Google Ads',
        description: 'Advertising performance data',
        authType: 'oauth2',
        status: organizationId ? 'connected' : 'disconnected'
      },
      {
        id: 'google-analytics',
        name: 'Google Analytics 4',
        description: 'Website traffic and conversion data',
        authType: 'oauth2',
        status: 'disconnected'
      },
      {
        id: 'postgres',
        name: 'PostgreSQL',
        description: 'Custom database connection',
        authType: 'basic',
        status: organizationId ? 'connected' : 'disconnected'
      }
    ],
    lastUpdated: new Date().toISOString()
  });
});

// Connector status endpoint
app.get('/api/connectors/status', (c) => {
  const organizationId = c.req.query('orgId');

  return c.json([
    { id: 'stripe', status: 'connected', configuredAt: new Date().toISOString() },
    { id: 'google-ads', status: 'connected', configuredAt: new Date().toISOString() },
    { id: 'google-analytics', status: 'disconnected' },
    { id: 'postgres', status: 'connected', configuredAt: new Date().toISOString() }
  ]);
});

// Execute task endpoint - streams progress updates
app.post('/execute', async (c) => {
  const body = await c.req.json() as { taskId: string; type?: string; params?: Record<string, unknown> };
  const { taskId, type, params } = body;

  // Simulate task execution with streaming progress
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send progress updates
      const steps = [
        { progress: 10, message: 'Initializing task...' },
        { progress: 25, message: 'Fetching data...' },
        { progress: 50, message: 'Processing data...' },
        { progress: 75, message: 'Generating results...' },
        { progress: 100, message: 'Complete' }
      ];

      for (const step of steps) {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 500));

        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'progress', progress: step.progress, message: step.message })}\n\n`
        ));
      }

      // Simulate random success/failure (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({
            type: 'completed',
            result: {
              summary: `Task ${taskId} completed successfully`,
              data: {
                processedItems: Math.floor(Math.random() * 100) + 1,
                duration: '2.5s',
                timestamp: new Date().toISOString()
              }
            }
          })}\n\n`
        ));
      } else {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({
            type: 'failed',
            error: {
              message: 'Simulated failure for testing',
              code: 'MOCK_ERROR'
            }
          })}\n\n`
        ));
      }

      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
});

// Cancel task endpoint
app.post('/cancel', async (c) => {
  const body = await c.req.json() as { taskId: string };
  const { taskId } = body;

  // Simulate cancellation
  return c.json({
    success: true,
    taskId,
    message: 'Task cancellation requested'
  });
});

export default app;
