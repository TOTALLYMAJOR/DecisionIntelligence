import { promptRecords, projects } from '@limitless/core';
import { db } from './client';
import { upsertPromptFixture } from './repository';

const workspace = await db.workspace.upsert({
  where: { slug: 'major-mike' },
  create: { slug: 'major-mike', name: 'Major Mike Architecting Workspace' },
  update: {},
});

for (const project of projects) {
  await db.project.upsert({
    where: { workspaceId_slug: { workspaceId: workspace.id, slug: project.id.toLowerCase().replace(/[^a-z0-9]+/g, '-') } },
    create: {
      workspaceId: workspace.id,
      slug: project.id.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: project.name,
      description: project.role,
      status: project.status,
    },
    update: { name: project.name, description: project.role, status: project.status },
  });
}

for (const prompt of promptRecords) await upsertPromptFixture(workspace.id, prompt);
console.log(`Seeded ${promptRecords.length} prompt records into workspace ${workspace.slug}.`);
await db.$disconnect();
