import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { findRepositoryRoot, scanRepositoryEvidence } from './repository-scanner';

const temporaryRoots: string[] = [];

const createRepository = async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'limitless-repository-scan-'));
  temporaryRoots.push(root);
  await mkdir(path.join(root, 'apps', 'web', 'app', 'api', 'refunds'), { recursive: true });
  await mkdir(path.join(root, 'packages', 'db', 'prisma'), { recursive: true });
  await mkdir(path.join(root, 'packages', 'db', 'src', 'generated'), { recursive: true });
  await mkdir(path.join(root, 'node_modules', 'unsafe'), { recursive: true });
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ name: 'scan-fixture' }));
  await writeFile(path.join(root, 'AGENTS.md'), '# Human approval governs canonical state.');
  await writeFile(
    path.join(root, 'apps', 'web', 'app', 'api', 'refunds', 'route.ts'),
    'export const refund = async () => authorizeTenant();',
  );
  await writeFile(
    path.join(root, 'packages', 'db', 'prisma', 'schema.prisma'),
    'model Refund { id String @id providerReceipt String }',
  );
  await writeFile(path.join(root, '.env.local'), 'PAYMENT_SECRET=do-not-read');
  await writeFile(path.join(root, 'node_modules', 'unsafe', 'index.ts'), 'refund payment tenant');
  await writeFile(
    path.join(root, 'packages', 'db', 'src', 'generated', 'client.ts'),
    'refund payment tenant',
  );
  return root;
};

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('repository evidence scanner', () => {
  it('returns bounded repository-relative evidence without reading sensitive or generated files', async () => {
    const root = await createRepository();
    const snapshot = await scanRepositoryEvidence(
      root,
      'Replace the payment provider while preserving tenant refund authority.',
    );

    expect(snapshot.repositoryName).toBe('scan-fixture');
    expect(snapshot.inspectedFileCount).toBe(4);
    expect(snapshot.evidence.length).toBeGreaterThan(0);
    expect(snapshot.evidence.every((item) => !path.isAbsolute(item.relativePath))).toBe(true);
    expect(snapshot.evidence.some((item) => item.relativePath.includes('.env'))).toBe(false);
    expect(snapshot.evidence.some((item) => item.relativePath.includes('node_modules'))).toBe(
      false,
    );
    expect(snapshot.evidence.some((item) => item.relativePath.includes('generated'))).toBe(false);
    expect(snapshot.evidence.every((item) => item.sourceGrade === 'VERIFIED')).toBe(true);
    expect(snapshot.evidence.every((item) => item.relevanceGrade === 'INFERRED')).toBe(true);
    expect(snapshot.evidence.some((item) => item.domains.includes('commercial'))).toBe(true);
    expect(snapshot.evidence.every((item) => !item.domains.includes('evidence'))).toBe(true);
    expect(JSON.stringify(snapshot)).not.toContain(root);
    expect(JSON.stringify(snapshot)).not.toContain('do-not-read');
  });

  it('ignores symlinks and reports a partial snapshot when the file cap is reached', async () => {
    const root = await createRepository();
    await symlink(
      path.join(root, 'apps', 'web', 'app', 'api', 'refunds', 'route.ts'),
      path.join(root, 'linked-refund.ts'),
    );
    const snapshot = await scanRepositoryEvidence(root, 'refund authority', { maxFiles: 2 });

    expect(snapshot.capped).toBe(true);
    expect(snapshot.inspectedFileCount).toBe(2);
    expect(snapshot.evidence.some((item) => item.relativePath === 'linked-refund.ts')).toBe(false);
    expect(snapshot.warnings).toContain(
      'File inspection reached the configured cap; the snapshot is partial.',
    );
  });

  it('finds the governed root from a nested application directory', async () => {
    const root = await createRepository();
    const nested = path.join(root, 'apps', 'web');
    await expect(findRepositoryRoot(nested)).resolves.toBe(root);
  });
});
