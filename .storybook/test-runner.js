import AxeBuilder from '@axe-core/playwright';
import pixelmatch from 'pixelmatch';
import { createRequire } from 'module';
import {
  mkdirSync, writeFileSync, readFileSync, existsSync, appendFileSync,
} from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

// pngjs is CJS — use createRequire from an ESM context
const require = createRequire(import.meta.url);
const { PNG } = require('pngjs');

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT       = fileURLToPath(new URL('..', import.meta.url));
const BASELINES  = join(ROOT, 'visual-baselines');
const REPORTS    = join(ROOT, 'reports');
const A11Y_DIR   = join(REPORTS, '.a11y');
const VISUAL_DIR = join(REPORTS, '.visual');
const DIFFS_DIR  = join(REPORTS, 'visual', 'diffs');
const SCAN_LOG   = join(REPORTS, '.scan.log');

// ─── Config ───────────────────────────────────────────────────────────────────

const UPDATE         = process.env.UPDATE_SNAPSHOTS === 'true';
const DIFF_THRESHOLD = 0.02;

// ─── Stories excluded from a11y scanning ─────────────────────────────────────
// Documentation/showcase stories whose contrast issues are inherent to
// displaying colour swatches and spacing scales — not shipped component bugs.

const A11Y_SKIP_PREFIXES = [
  'foundations-breakpoints',
  'foundations-colors',
  'foundations-themes',
  'utilities-spacing',
  'rules--',
];

// ─── Lazy dir creation (idempotent; setup script handles initial clear) ───────

let _dirsReady = false;
function ensureDirs() {
  if (_dirsReady) return;
  for (const d of [BASELINES, A11Y_DIR, VISUAL_DIR, DIFFS_DIR]) mkdirSync(d, { recursive: true });
  _dirsReady = true;
}

// ─── postVisit hook ───────────────────────────────────────────────────────────

export default {
  async postVisit(page, context) {
    ensureDirs();
    await page.waitForLoadState('networkidle');

    let visualError = null;

    // ── Visual regression ──────────────────────────────────────────────────────
    try {
      const screenshot   = await page.screenshot({ animations: 'disabled' });
      const baselinePath = join(BASELINES, `${context.id}.png`);

      if (UPDATE || !existsSync(baselinePath)) {
        writeFileSync(baselinePath, screenshot);
      } else {
        const baseline = PNG.sync.read(readFileSync(baselinePath));
        const current  = PNG.sync.read(screenshot);

        if (baseline.width !== current.width || baseline.height !== current.height) {
          writeFileSync(join(DIFFS_DIR, `${context.id}-current.png`), screenshot);
          writeFileSync(
            join(VISUAL_DIR, `${context.id}.json`),
            JSON.stringify({
              id: context.id, title: context.title,
              error: `Dimensions changed: ${baseline.width}x${baseline.height} → ${current.width}x${current.height}`,
            }),
          );
          visualError = new Error(
            `[${context.id}] Screenshot dimensions changed: ` +
            `${baseline.width}x${baseline.height} → ${current.width}x${current.height}`,
          );
        } else {
          const { width, height } = baseline;
          const diff          = new PNG({ width, height });
          const numDiffPixels = pixelmatch(
            baseline.data, current.data, diff.data, width, height,
            { threshold: 0.1, includeAA: false },
          );
          const diffRatio = numDiffPixels / (width * height);

          if (diffRatio > DIFF_THRESHOLD) {
            writeFileSync(join(DIFFS_DIR, `${context.id}-baseline.png`), readFileSync(baselinePath));
            writeFileSync(join(DIFFS_DIR, `${context.id}-current.png`), screenshot);
            writeFileSync(join(DIFFS_DIR, `${context.id}-diff.png`), PNG.sync.write(diff));
            writeFileSync(
              join(VISUAL_DIR, `${context.id}.json`),
              JSON.stringify({
                id: context.id, title: context.title,
                diffPercent: (diffRatio * 100).toFixed(2),
                numDiffPixels, totalPixels: width * height,
              }),
            );
            visualError = new Error(
              `[${context.id}] Visual regression: ${(diffRatio * 100).toFixed(2)}% of pixels changed`,
            );
          }
        }
      }
    } catch (e) {
      if (!visualError) visualError = e;
    }

    // ── Accessibility (WCAG 2.0 / 2.1 / 2.2 — Levels A & AA) ─────────────────
    const skipA11y = A11Y_SKIP_PREFIXES.some(p => context.id.startsWith(p));
    if (!skipA11y) {
      try {
        const results = await new AxeBuilder({ page })
          .include('#storybook-root')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();

        if (results.violations.length > 0) {
          writeFileSync(
            join(A11Y_DIR, `${context.id}.json`),
            JSON.stringify({
              id: context.id, title: context.title,
              url: context.url, violations: results.violations,
            }),
          );
        }
      } catch (axeErr) {
        // "Axe is already running" happens when a previous story timed out
        // mid-scan; skip the a11y check for this story rather than failing.
        if (!/already running/i.test(axeErr.message)) throw axeErr;
      }
    }

    // Record this story as scanned (used for total count in reports).
    appendFileSync(SCAN_LOG, context.id + '\n');

    if (visualError) throw visualError;
  },
};
