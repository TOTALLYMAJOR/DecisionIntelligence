import { createHash } from 'node:crypto';
import { access, readFile, readdir, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import type {
  DecisionImpactDomain,
  RepositoryFileEvidence,
  RepositorySnapshot,
} from '@limitless/core';

const supportedExtensions = new Set([
  '.cjs',
  '.css',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.prisma',
  '.sql',
  '.toml',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

const excludedDirectoryNames = new Set([
  '.git',
  '.next',
  '.turbo',
  '.cache',
  'build',
  'coverage',
  'dist',
  'generated',
  'node_modules',
  'out',
]);

const excludedFileNames = new Set(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);

const stopWords = new Set([
  'also',
  'about',
  'architecture',
  'after',
  'before',
  'becomes',
  'change',
  'could',
  'from',
  'into',
  'keeping',
  'order',
  'preserve',
  'proposed',
  'recommendation',
  'should',
  'step',
  'their',
  'there',
  'these',
  'this',
  'while',
  'with',
  'work',
]);

const domainTerms: Record<DecisionImpactDomain, string[]> = {
  authority: [
    'authority',
    'approval',
    'authorize',
    'canonical',
    'owner',
    'permission',
    'promotion',
    'tenant',
    'workspace',
  ],
  data: ['database', 'migration', 'prisma', 'record', 'schema', 'storage'],
  workflow: [
    'approval',
    'execution',
    'handoff',
    'lifecycle',
    'queue',
    'review',
    'state',
    'status',
    'workflow',
  ],
  interfaces: ['api', 'client', 'contract', 'integration', 'provider', 'route', 'webhook'],
  security: ['auth', 'credential', 'permission', 'privacy', 'secret', 'tenant', 'token'],
  operations: [
    'deploy',
    'execution',
    'incident',
    'monitor',
    'observability',
    'recovery',
    'retry',
    'rollback',
    'worker',
  ],
  commercial: ['invoice', 'margin', 'payment', 'price', 'quote', 'refund', 'subscription', 'tax'],
  evidence: ['audit', 'evidence', 'proof', 'receipt', 'test', 'verify'],
};

type RepositoryScanOptions = {
  maxFiles?: number;
  maxFileBytes?: number;
  maxEvidence?: number;
};

type IndexedFile = RepositoryFileEvidence & {
  relevanceScore: number;
};

const sha256 = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');

const normalizeRelativePath = (root: string, target: string) =>
  path.relative(root, target).split(path.sep).join('/');

const isSensitiveFile = (name: string) => {
  const lower = name.toLowerCase();
  return (
    lower === '.env' ||
    lower.startsWith('.env.') ||
    lower.includes('credential') ||
    lower.includes('secret') ||
    lower === 'id_rsa' ||
    ['.key', '.p12', '.pem', '.pfx'].some((suffix) => lower.endsWith(suffix))
  );
};

const isPrivateEvidencePath = (relativePath: string) =>
  relativePath === 'var/evidence' ||
  relativePath.startsWith('var/evidence/') ||
  relativePath === 'var/exports' ||
  relativePath.startsWith('var/exports/');

const queryTerms = (query: string) =>
  [
    ...new Set(
      query
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter((term) => term.length >= 4 && !stopWords.has(term)),
    ),
  ].slice(0, 32);

const evidenceKind = (relativePath: string): RepositoryFileEvidence['kind'] => {
  const lower = relativePath.toLowerCase();
  if (/(^|\/)(test|tests|__tests__|spec)(\/|\.|-)|\.(test|spec)\.[^.]+$/.test(lower)) return 'test';
  if (lower.endsWith('.prisma') || lower.includes('/migrations/') || lower.endsWith('.sql'))
    return 'schema';
  if (
    lower === 'agents.md' ||
    lower === 'claude.md' ||
    lower.includes('/adr/') ||
    lower.includes('/decisions/')
  )
    return 'governance';
  if (
    lower.endsWith('.json') ||
    lower.endsWith('.toml') ||
    lower.endsWith('.yaml') ||
    lower.endsWith('.yml') ||
    /(^|\/)(dockerfile|next\.config|eslint\.config)/.test(lower)
  )
    return 'configuration';
  if (lower.endsWith('.md') || lower.startsWith('docs/')) return 'documentation';
  return 'implementation';
};

const detectedDomains = (matchedTerms: string[]) =>
  (Object.entries(domainTerms) as Array<[DecisionImpactDomain, string[]]>)
    .filter(([, terms]) => terms.some((domainTerm) => matchedTerms.includes(domainTerm)))
    .map(([domain]) => domain);

const kindBoost: Record<RepositoryFileEvidence['kind'], number> = {
  implementation: 8,
  test: 10,
  schema: 9,
  configuration: 6,
  governance: 7,
  documentation: 2,
};

const inspectFile = async (
  root: string,
  absolutePath: string,
  byteSize: number,
  terms: string[],
): Promise<IndexedFile> => {
  const content = await readFile(absolutePath);
  const relativePath = normalizeRelativePath(root, absolutePath);
  const text = content.toString('utf8');
  const searchable = (relativePath + '\n' + text).toLowerCase();
  const matchedTerms = terms.filter((term) => searchable.includes(term)).slice(0, 8);
  const domains = detectedDomains(matchedTerms);
  const contentHash = sha256(content);
  const kind = evidenceKind(relativePath);
  const pathMatches = matchedTerms.filter((term) =>
    relativePath.toLowerCase().includes(term),
  ).length;
  const relevanceScore =
    matchedTerms.length * 12 + pathMatches * 8 + domains.length * 2 + kindBoost[kind];

  return {
    id:
      'REPO-' +
      sha256(relativePath + ':' + contentHash)
        .slice(0, 12)
        .toUpperCase(),
    relativePath,
    contentHash,
    byteSize,
    lineCount: text.length === 0 ? 0 : text.split(/\r?\n/).length,
    kind,
    domains,
    matchedTerms,
    sourceGrade: 'VERIFIED',
    relevanceGrade: 'INFERRED',
    relevanceScore,
  };
};

export const findRepositoryRoot = async (startPath: string) => {
  let current = await realpath(startPath);
  for (let depth = 0; depth < 8; depth += 1) {
    try {
      await Promise.all([
        access(path.join(current, 'package.json')),
        access(path.join(current, 'AGENTS.md')),
      ]);
      return current;
    } catch {
      const parent = path.dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  throw new Error('No governed repository root found.');
};

export const scanRepositoryEvidence = async (
  rootPath: string,
  query: string,
  options: RepositoryScanOptions = {},
): Promise<RepositorySnapshot> => {
  const root = await realpath(rootPath);
  const rootStats = await stat(root);
  if (!rootStats.isDirectory()) throw new Error('Repository scan root must be a directory.');

  const maxFiles = Math.min(Math.max(options.maxFiles ?? 500, 1), 2_000);
  const maxFileBytes = Math.min(Math.max(options.maxFileBytes ?? 192_000, 1_024), 1_000_000);
  const maxEvidence = Math.min(Math.max(options.maxEvidence ?? 12, 1), 50);
  const terms = queryTerms(query);
  const indexed: IndexedFile[] = [];
  const warnings: string[] = [];
  let capped = false;

  const visit = async (directory: string): Promise<void> => {
    const entries = (await readdir(directory, { withFileTypes: true })).toSorted((left, right) =>
      left.name.localeCompare(right.name),
    );

    for (const entry of entries) {
      if (indexed.length >= maxFiles) {
        capped = true;
        return;
      }

      const absolutePath = path.join(directory, entry.name);
      const relativePath = normalizeRelativePath(root, absolutePath);

      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) {
        if (excludedDirectoryNames.has(entry.name) || isPrivateEvidencePath(relativePath)) continue;
        await visit(absolutePath);
        if (capped) return;
        continue;
      }

      if (!entry.isFile()) continue;
      if (excludedFileNames.has(entry.name) || isSensitiveFile(entry.name)) continue;
      if (!supportedExtensions.has(path.extname(entry.name).toLowerCase())) continue;

      const fileStats = await stat(absolutePath);
      if (fileStats.size > maxFileBytes) continue;
      indexed.push(await inspectFile(root, absolutePath, fileStats.size, terms));
    }
  };

  await visit(root);

  if (capped) warnings.push('File inspection reached the configured cap; the snapshot is partial.');

  const relevant = indexed
    .filter((file) => file.matchedTerms.length > 0)
    .toSorted(
      (left, right) =>
        right.relevanceScore - left.relevanceScore ||
        left.relativePath.localeCompare(right.relativePath),
    )
    .slice(0, maxEvidence)
    .map(({ relevanceScore: _relevanceScore, ...file }) => file);

  if (relevant.length === 0) {
    warnings.push('No static file matched the meaningful terms in the decision brief.');
  }

  let repositoryName = path.basename(root);
  try {
    const packageManifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')) as {
      name?: unknown;
    };
    if (typeof packageManifest.name === 'string' && packageManifest.name.trim()) {
      repositoryName = packageManifest.name.trim().slice(0, 120);
    }
  } catch {
    warnings.push('The repository package manifest could not be read.');
  }

  const manifestHash = sha256(
    indexed
      .map((file) => file.relativePath + ':' + file.contentHash)
      .toSorted()
      .join('\n'),
  );

  return {
    repositoryName,
    manifestHash,
    observedAt: new Date().toISOString(),
    inspectedFileCount: indexed.length,
    capped,
    evidence: relevant,
    warnings,
    authorityBoundary:
      'VERIFIED means the listed static file bytes and matched terms were observed in this snapshot. Relevance remains INFERRED. The snapshot does not inspect Git history, execute code, prove runtime behavior, or authorize a change.',
  };
};
