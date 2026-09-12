import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const required = [
  'AGENTS.md',
  'CLAUDE.md',
  'README.md',
  'apps/web/app/page.tsx',
  'apps/web/app/decisions/page.tsx',
  'apps/web/app/compiler/page.tsx',
  'apps/web/app/library/[libraryId]/page.tsx',
  'apps/worker/src/index.ts',
  'packages/core/src/fixtures.ts',
  'packages/core/src/decision.ts',
  'packages/core/src/compiler.ts',
  'packages/ingestion/src/repository-scanner.ts',
  'packages/ai/src/router.ts',
  'packages/db/prisma/schema.prisma',
  'packages/ingestion/src/archive-parser.ts',
  'docs/prompts/00_SETUP_REPOSITORY.md',
  'docs/product/MASTER_PROMPT.md',
];

const missing = required.filter((path) => !existsSync(resolve(path)));
if (missing.length > 0) {
  console.error('Missing required repository files:');
  missing.forEach((path) => console.error(`- ${path}`));
  process.exit(1);
}

const fixture = readFileSync(resolve('packages/core/src/fixtures.ts'), 'utf8');
const checks = [
  ['20 prompt records', /libraryId: 'LTA-[A-Z-]+-\d{3}'/g, 20],
  ['5 principles', /kind: 'principle'/g, 5],
  ['5 patterns', /kind: 'pattern'/g, 5],
  ['3 failures', /failureId: 'FAIL-/g, 3],
  ['5 profile claims', /claimId: 'PROFILE-/g, 5],
  ['6 compiler modules', /moduleId: 'MODULE-/g, 6],
];

for (const [label, pattern, minimum] of checks) {
  const count = fixture.match(pattern)?.length ?? 0;
  if (count < minimum) {
    console.error(`Fixture contract failed: expected at least ${minimum} ${label}; found ${count}.`);
    process.exit(1);
  }
}

console.log('Repository structure and walking-skeleton fixture contract: PASS');
