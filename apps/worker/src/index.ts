import { writeFile } from 'node:fs/promises';

import { analyzeWithConfiguredProviders } from '@limitless/ai';
import { promptRecords } from '@limitless/core';

const mode = process.env.WORKER_MODE?.trim() || (process.env.DATA_MODE === 'prisma' ? 'redis' : 'fixture');
const readinessPath = '/tmp/limitless-worker-ready';

const markReady = async (workerMode: string) => {
  await writeFile(readinessPath, JSON.stringify({ workerMode, readyAt: new Date().toISOString() }), 'utf8');
};

const startFixtureWorker = async () => {
  console.log('[worker] fixture mode active; no Redis connection required.');
  console.log(`[worker] representative evidence corpus: ${promptRecords.length} prompts.`);
  console.log('[worker] set WORKER_MODE=redis after starting Docker infrastructure.');
  await markReady('fixture');
  const interval = setInterval(() => console.log('[worker] fixture heartbeat — candidate authority remains review-only.'), 60_000);
  const shutdown = () => {
    clearInterval(interval);
    console.log('[worker] stopped.');
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

const startRedisWorker = async () => {
  const { Worker } = await import('bullmq');
  const IORedis = (await import('ioredis')).default;
  const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null });
  const worker = new Worker(
    'candidate-analysis',
    async (job) => {
      const payload = job.data as { task: 'extract-principles' | 'propose-patterns' | 'profile-claims' | 'explain-lineage'; instruction: string; evidenceIds: string[] };
      const evidence = promptRecords
        .filter((prompt) => payload.evidenceIds.includes(prompt.libraryId))
        .map((prompt) => ({ id: prompt.libraryId, label: prompt.title, text: prompt.originalText, sourceType: 'prompt' as const }));
      return analyzeWithConfiguredProviders({ task: payload.task, instruction: payload.instruction, evidence });
    },
    { connection },
  );

  worker.on('completed', (job) => console.log(`[worker] completed candidate analysis ${job.id}`));
  worker.on('failed', (job, error) => console.error(`[worker] failed ${job?.id}: ${error.message}`));
  console.log('[worker] BullMQ candidate-analysis worker ready.');
  await markReady('redis');

  const shutdown = async () => {
    await worker.close();
    await connection.quit();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

if (mode === 'redis') await startRedisWorker();
else await startFixtureWorker();
