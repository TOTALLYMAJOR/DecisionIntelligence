import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', '.next', 'node_modules', 'coverage', 'var']);
const patterns = [
  { name: 'OpenAI key', regex: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g },
  { name: 'Anthropic key', regex: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g },
  { name: 'GitHub token', regex: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/g },
  { name: 'Private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
];
const extensions = new Set(['.ts','.tsx','.js','.mjs','.cjs','.json','.md','.toml','.yml','.yaml','.env','.example','.sh','.css','.prisma','.sql']);
let findings = 0;
const walk = (directory) => {
  for (const name of readdirSync(directory)) {
    if (ignored.has(name)) continue;
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) { walk(path); continue; }
    if (stat.size > 2_000_000) continue;
    if (![...extensions].some((extension) => name.endsWith(extension)) && !['AGENTS.md','CLAUDE.md','README.md'].includes(name)) continue;
    const text = readFileSync(path, 'utf8');
    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      if (pattern.regex.test(text)) {
        findings += 1;
        console.error(`${pattern.name} pattern found in ${relative(root, path)}`);
      }
    }
  }
};
walk(root);
if (findings > 0) process.exit(1);
console.log('Secret-pattern scan: PASS');
