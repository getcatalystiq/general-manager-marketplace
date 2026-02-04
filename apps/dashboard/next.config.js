/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['@gm/shared'],
  images: {
    unoptimized: true
  },
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_MCP_SERVER_URL: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'https://general-manager.tools-7b7.workers.dev',
    NEXT_PUBLIC_ORCHESTRATOR_URL: process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || 'https://gm-mock-orchestrator.tools-7b7.workers.dev'
  }
};

module.exports = nextConfig;
