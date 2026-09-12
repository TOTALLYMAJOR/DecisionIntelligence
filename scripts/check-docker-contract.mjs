import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const compose = read('docker-compose.yml');
const dockerfile = read('Dockerfile');
const dockerignore = read('.dockerignore');
const packageJson = JSON.parse(read('package.json'));

const failures = [];
const requireText = (source, value, label) => {
  if (!source.includes(value)) failures.push(`${label}: missing ${JSON.stringify(value)}`);
};

for (const service of ['web', 'worker', 'postgres', 'postgres-init', 'redis', 'minio', 'minio-init', 'db-init']) {
  requireText(compose, `  ${service}:`, 'compose service contract');
}

for (const target of ['AS dependencies', 'AS source', 'AS web-builder', 'AS web', 'AS worker', 'AS tools']) {
  requireText(dockerfile, target, 'Dockerfile target contract');
}

for (const manifest of [
  'apps/web/package.json',
  'apps/worker/package.json',
  'packages/ai/package.json',
  'packages/core/package.json',
  'packages/db/package.json',
  'packages/ingestion/package.json',
]) {
  requireText(dockerfile, `COPY ${manifest} ${manifest}`, 'workspace manifest cache contract');
}

for (const ignored of ['.env', '.env.*', 'node_modules', '.git']) {
  requireText(dockerignore, ignored, 'Docker build-context privacy contract');
}

for (const script of ['docker:up', 'docker:run', 'docker:down', 'docker:verify', 'docker:reset']) {
  if (!packageJson.scripts?.[script]) failures.push(`package script contract: missing ${script}`);
}

requireText(compose, 'AI_WRITEBACK_ENABLED: ${AI_WRITEBACK_ENABLED:-false}', 'AI authority boundary');
requireText(compose, 'condition: service_completed_successfully', 'bootstrap dependency contract');
requireText(compose, '/api/health', 'web health contract');
requireText(compose, '/tmp/limitless-worker-ready', 'worker health contract');
requireText(compose, 'internal: true', 'backend network isolation contract');

if (/COPY\s+\.env(?:\s|$)/m.test(dockerfile) || /ARG\s+(OPENAI_API_KEY|ANTHROPIC_API_KEY|AUTH_SECRET)/m.test(dockerfile)) {
  failures.push('Dockerfile may not copy secret files or accept provider secrets as build arguments.');
}

if (failures.length > 0) {
  console.error('Docker contract: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Docker build and Compose authority contract: PASS');
