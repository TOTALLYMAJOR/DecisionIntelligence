import { compilerModules } from './fixtures';
import type { CompiledPrompt, CompilerModule } from './types';

const sectionFor = (module: CompilerModule) => {
  const bullets = module.contract.map((line) => `- ${line}`).join('\n');
  return `## ${module.title}\n\n${module.purpose}\n\n${bullets}`;
};

export const compileArchitectingPrompt = (problem: string, moduleIds: string[]): CompiledPrompt => {
  const selected = moduleIds
    .map((id) => compilerModules.find((module) => module.moduleId === id))
    .filter((module): module is CompilerModule => Boolean(module));

  if (selected.length === 0) throw new Error('Select at least one known architecting module.');

  const conflicts = selected.flatMap((module) =>
    module.conflictsWith.filter((conflict) => moduleIds.includes(conflict)).map((conflict) => `${module.moduleId} conflicts with ${conflict}`),
  );
  if (conflicts.length > 0) throw new Error(`Module conflict: ${conflicts.join('; ')}`);

  const moduleSections = selected.map(sectionFor).join('\n\n');
  const markdown = `# Agent Work Order — ${problem.slice(0, 90)}\n\n` +
    `You are acting as a principal product-systems architect and implementation engineer. Execute the bounded work directly.\n\n` +
    `## Objective\n\n${problem.trim()}\n\n` +
    `## Governing Contract\n\n${moduleSections}\n\n` +
    `## Required Delivery\n\n` +
    `- State the exact repository evidence inspected.\n` +
    `- Separate confirmed facts, assumptions, and blocked conditions.\n` +
    `- Make the smallest complete change permitted by the selected modules.\n` +
    `- Run focused validation before broad gates.\n` +
    `- Report files changed, commands run, results, residual risks, and rollback.\n` +
    `- Do not claim deployment, provider acceptance, human acceptance, or customer outcome without corresponding evidence.\n\n` +
    `## Module Provenance\n\n${selected.map((module) => `- ${module.title}: ${module.moduleId} (${module.evidenceGrade})`).join('\n')}\n`;

  return {
    title: `Agent Work Order — ${problem.slice(0, 90)}`,
    problem,
    moduleIds: selected.map((module) => module.moduleId),
    markdown,
    provenance: [
      { section: 'Objective', moduleIds: [] },
      ...selected.map((module) => ({ section: module.title, moduleIds: [module.moduleId] })),
      { section: 'Required Delivery', moduleIds: selected.map((module) => module.moduleId) },
    ],
  };
};
