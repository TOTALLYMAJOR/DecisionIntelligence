import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const violations = [];
const collect = (directory) => {
  const files = [];
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...collect(path));
    else if (/\.(ts|tsx)$/.test(name)) files.push(path);
  }
  return files;
};
for (const path of collect(join(process.cwd(), 'apps/web'))) {
  const text = readFileSync(path, 'utf8');
  if (/from ['"](?:openai|@anthropic-ai\/sdk)['"]/.test(text)) violations.push(`${relative(process.cwd(), path)} imports a provider SDK directly`);
  if (/from ['"]@limitless\/db['"]/.test(text) && !path.includes('/app/api/')) violations.push(`${relative(process.cwd(), path)} imports persistence outside an API boundary`);
}
for (const path of collect(join(process.cwd(), 'packages/core'))) {
  const text = readFileSync(path, 'utf8');
  if (/from ['"](?:openai|@anthropic-ai\/sdk|@prisma\/client|bullmq)['"]/.test(text)) violations.push(`${relative(process.cwd(), path)} violates pure-domain boundaries`);
}
if (violations.length) {
  console.error('Boundary violations:');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}
console.log('Architecture boundary scan: PASS');
