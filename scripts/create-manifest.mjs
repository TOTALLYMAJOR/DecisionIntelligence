import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', '.next', 'node_modules', 'coverage']);
const records = [];
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    if (ignored.has(name) || name === 'ARTIFACT_MANIFEST.json') continue;
    const path = join(directory, name);
    const relativePath = relative(root, path).replaceAll('\\', '/');
    if (relativePath === 'packages/db/src/generated' || name.endsWith('.tsbuildinfo')) continue;
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else {
      const bytes = readFileSync(path);
      records.push({ path: relativePath, bytes: stat.size, sha256: createHash('sha256').update(bytes).digest('hex') });
    }
  }
};
walk(root);
records.sort((a,b)=>a.path.localeCompare(b.path));
const manifest = { name: 'limitless-architecting-os-starter', version: '0.1.0', generatedAt: new Date().toISOString(), authority: 'Artifact integrity manifest only; it does not establish build, provider, or runtime acceptance.', fileCount: records.length, totalBytes: records.reduce((sum,item)=>sum+item.bytes,0), files: records };
writeFileSync(join(root,'ARTIFACT_MANIFEST.json'), `${JSON.stringify(manifest,null,2)}\n`);
console.log(`Manifested ${records.length} files.`);
