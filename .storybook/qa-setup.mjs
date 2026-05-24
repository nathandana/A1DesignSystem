// Clears stale per-story artifacts before a QA test run.
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT       = fileURLToPath(new URL('..', import.meta.url));
const BASELINES  = join(ROOT, 'visual-baselines');
const REPORTS    = join(ROOT, 'reports');
const A11Y_DIR   = join(REPORTS, '.a11y');
const VISUAL_DIR = join(REPORTS, '.visual');
const DIFFS_DIR  = join(REPORTS, 'visual', 'diffs');
const SCAN_LOG   = join(REPORTS, '.scan.log');

for (const d of [BASELINES, A11Y_DIR, VISUAL_DIR, DIFFS_DIR]) mkdirSync(d, { recursive: true });

for (const dir of [A11Y_DIR, VISUAL_DIR, DIFFS_DIR]) {
  for (const f of readdirSync(dir)) unlinkSync(join(dir, f));
}

writeFileSync(SCAN_LOG, '');
