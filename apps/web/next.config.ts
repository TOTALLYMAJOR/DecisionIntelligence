import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const nextConfig: NextConfig = {
  outputFileTracingRoot: repositoryRoot,
  output: 'standalone',
  reactStrictMode: true,
  typedRoutes: false,
  transpilePackages: ['@limitless/core', '@limitless/ai', '@limitless/ingestion'],
};

export default nextConfig;
