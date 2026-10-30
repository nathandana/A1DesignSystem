#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, 'system/patterns');
const ajv = new Ajv({ allErrors: true, jsonPointers: true });
const manifests = fs.readdirSync(directory).filter(name => name.endsWith('.json') && name !== 'schema.json')
  .sort().map(name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
const schema = JSON.parse(fs.readFileSync(path.join(directory, 'schema.json'), 'utf8'));
const validate = ajv.compile(schema);
const types = new Set();
for (const manifest of manifests) {
  if (!validate(manifest)) throw new Error(`${manifest.id}: ${ajv.errorsText(validate.errors)}`);
  if (types.has(manifest.type)) throw new Error(`Duplicate pattern ${manifest.type}`);
  types.add(manifest.type);
  if (!ajv.validateSchema(manifest.propsSchema)) throw new Error(`Invalid props schema: ${manifest.id}`);
  const ids = new Set();
  for (const area of manifest.areas) {
    if (ids.has(area.id)) throw new Error(`Duplicate area ${manifest.id}.${area.id}`);
    ids.add(area.id);
  }
}
const outputs = new Map([
  ['packages/react/src/patterns/contracts.generated.js', `// Generated from system/patterns/*.json by scripts/build-patterns.mjs. Do not edit.\nexport const patternManifests = ${JSON.stringify(manifests, null, 2)};\n`],
  ['packages/react/ai/pattern-contracts.generated.md', [
    '# Pattern contracts', '', 'Generated from `system/patterns/*.json`. Edit those manifests, then run `npm run build:patterns`.', '',
    ...manifests.flatMap(m => [`## ${m.name}`, '', `Type: \`${m.type}\` · Version: \`${m.version}\` · Status: ${m.status}.`, '', m.description, '',
      '| Area | Kind | Destination | Rules |', '| --- | --- | --- | --- |',
      ...m.areas.map(a => `| ${a.label} (\`${a.id}\`) | ${a.kind} | \`${a.destination}\` | ${a.rules ?? a.hint} |`), '',
      ...(m.collections ?? []).map(c => `Structured collection: **${c.label}** (\`${c.path}\`). ${c.rules}`), '',
      `Props schema and examples: [${m.id}.json](../../../system/patterns/${m.id}.json).`, '']),
  ].join('\n')],
]);
let stale = false;
for (const [file, content] of outputs) {
  const target = path.join(root, file);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) { console.error(`Stale pattern artifact: ${file}`); stale = true; }
  } else {
    fs.writeFileSync(target, content);
    console.log(`Wrote ${file}`);
  }
}
if (stale) process.exitCode = 1;
