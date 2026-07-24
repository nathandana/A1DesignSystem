import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const sourcePath = resolve(root, 'src/code.js');
const sharedPath = resolve(root, '../a1-json/src/shared/codegen.js');
const outputPath = resolve(root, 'code.js');

const stripExports = (source) => source
  .replace(/^export\s+const\s+/gm, 'const ')
  .replace(/^export\s+function\s+/gm, 'function ');

const source = readFileSync(sourcePath, 'utf8');
const shared = stripExports(readFileSync(sharedPath, 'utf8'));
const output = source.replace(
  /import\s+\{[^}]+\}\s+from\s+['"]\.\.\/\.\.\/a1-json\/src\/shared\/codegen\.js['"];\n/,
  `${shared}\n`,
);
if (output === source) throw new Error('Dev Mode source is missing its shared codegen import.');
mkdirSync(root, { recursive: true });
writeFileSync(outputPath, output);
console.log(`Built ${outputPath}`);
