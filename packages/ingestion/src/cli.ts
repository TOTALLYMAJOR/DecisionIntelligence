import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { parseCodexPromptArchive } from './archive-parser';

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg) {
  console.error('Usage: npm run ingest -- <prompt-archive.md> [output.json]');
  process.exit(1);
}

const input = resolve(inputArg);
const output = resolve(outputArg || `var/exports/${basename(inputArg)}.parsed.json`);
const source = await readFile(input, 'utf8');
const report = parseCodexPromptArchive(source, basename(input));
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`Parsed ${report.records.length} prompts to ${output}.`);
if (report.warnings.length) console.log(`${report.warnings.length} warning(s) recorded in the report.`);
