/**
 * The design model the Virtual Designer audits: the system's token scales, read from the
 * **live theme** via `getComputedStyle(:root)` — so it reviews whatever theme is active,
 * using the real resolved values rather than a hand-maintained copy. The heuristics never
 * touch the DOM; this is the only place that does.
 *
 * Only the real t-shirt scale steps are included. Special-purpose aliases (radius `control`
 * which intentionally tracks `md`, radius `pill`, the `spacing-1` hairline) are excluded so
 * they aren't mis-flagged as redundant scale steps.
 */
import type { DesignModel, DesignCategory, Scale } from './types';

interface ScaleDef {
  id: string;
  name: string;
  category: DesignCategory;
  noun: string;
  /** Ordered step keys mapped to their CSS custom property. */
  steps: { key: string; token: string }[];
}

const SCALE_DEFS: ScaleDef[] = [
  {
    id: 'radius',
    name: 'Radius',
    category: 'Radius',
    noun: 'radius',
    steps: ['sm', 'md', 'lg', 'xl'].map((k) => ({ key: k, token: `--base-radius-${k}` })),
  },
  {
    id: 'spacing',
    name: 'Spacing',
    category: 'Spacing',
    noun: 'spacing step',
    steps: ['2', '4', '6', '8', '12', '16', '20', '24', '32', '40', '48', '56', '64', '96', '128', '192'].map(
      (k) => ({ key: k, token: `--base-spacing-${k}` }),
    ),
  },
  {
    id: 'type-heading',
    name: 'Heading type ramp',
    category: 'Typography',
    noun: 'heading size',
    steps: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].map((k) => ({ key: k, token: `--semantic-font-size-heading-${k}` })),
  },
  {
    id: 'type-body',
    name: 'Body type ramp',
    category: 'Typography',
    noun: 'body size',
    steps: ['xs', 'sm', 'md', 'lg', 'xl'].map((k) => ({ key: k, token: `--semantic-font-size-body-${k}` })),
  },
];

/** Parse a CSS length ("0.375rem" | "6px" | bare number) to px. 1rem = 16px. NaN if unknown. */
function toPx(value: string): number {
  const v = (value || '').trim();
  if (!v) return NaN;
  if (v.endsWith('rem')) return parseFloat(v) * 16;
  if (v.endsWith('px')) return parseFloat(v);
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Read the live token scales into a `DesignModel`. Safe to call without a DOM (returns an
 * empty model → the audit simply finds nothing). A scale needs ≥2 readable steps to be
 * worth auditing.
 */
export function readDesignModel(): DesignModel {
  const root = typeof document !== 'undefined' ? document.documentElement : null;
  const cs = root && typeof getComputedStyle !== 'undefined' ? getComputedStyle(root) : null;
  const read = (token: string): number => (cs ? toPx(cs.getPropertyValue(token)) : NaN);

  const scales: Scale[] = SCALE_DEFS.map((def) => ({
    id: def.id,
    name: def.name,
    category: def.category,
    noun: def.noun,
    steps: def.steps
      .map((s) => ({ key: s.key, token: s.token, px: read(s.token) }))
      .filter((s) => Number.isFinite(s.px) && s.px > 0),
  })).filter((scale) => scale.steps.length >= 2);

  return { id: 'tokens', name: 'Design tokens', scales };
}
