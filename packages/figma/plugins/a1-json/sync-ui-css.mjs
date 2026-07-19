// Backward-compatible entry point for the old CSS sync command.
// The plugin build now generates dist/ui.html from src/ui.html and inlines
// A1 Pure CSS as part of that build.
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const buildScript = resolve(here, 'scripts/build.mjs');
const result = spawnSync(process.execPath, [buildScript], { stdio: 'inherit' });

process.exit(result.status ?? 1);
