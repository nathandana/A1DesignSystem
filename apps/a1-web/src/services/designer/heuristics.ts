/**
 * The Virtual Designer's knowledge — design-craft heuristics it "knows by heart", each a
 * pure check over a DesignModel. Deterministic and offline: the same tokens always produce
 * the same findings.
 *
 * Add a heuristic by pushing a `{ id, name, category, principle, check }` onto `HEURISTICS`.
 * Keep each check focused on one principle and returning concrete, actionable findings.
 * This first slice reviews the token *scales*; component- and page-level checks come later.
 */
import type { Finding, Heuristic, ScaleStep } from './types';

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Consecutive growth ratios across a scale's steps (steps[i] / steps[i-1]). */
function ratios(steps: ScaleStep[]): number[] {
  const r: number[] = [];
  for (let i = 1; i < steps.length; i += 1) r.push(steps[i].px / steps[i - 1].px);
  return r;
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** A step counts as an outlier jump when it grows ≥ 1.6× the scale's typical ratio. */
const RHYTHM_FACTOR = 1.6;

const fmt = (px: number): string => (Number.isInteger(px) ? `${px}px` : `${Number(px.toFixed(2))}px`);

// ── Heuristics ──────────────────────────────────────────────────────────────────

/** A scale must increase step over step — a later step that isn't larger is a defect. */
const ordering: Heuristic = {
  id: 'scale-ordering',
  name: 'Scale ordering',
  category: 'Consistency',
  principle: 'A scale must increase step over step — a later step smaller than an earlier one is a defect.',
  check(model) {
    const out: Finding[] = [];
    for (const scale of model.scales) {
      for (let i = 1; i < scale.steps.length; i += 1) {
        const prev = scale.steps[i - 1];
        const cur = scale.steps[i];
        if (cur.px <= prev.px) {
          out.push({
            id: `scale-ordering-${scale.id}-${cur.key}`,
            heuristic: 'Scale ordering',
            category: scale.category,
            principle: 'A scale must increase step over step.',
            severity: 'warning',
            title: `${scale.name} scale is out of order at "${cur.key}"`,
            detail: `${scale.name} "${cur.key}" (${fmt(cur.px)}) is not larger than "${prev.key}" (${fmt(prev.px)}) — the scale doesn't increase monotonically, so picking by name doesn't pick by size.`,
            suggestion: `Retune or reorder so every ${scale.noun} is strictly larger than the previous step.`,
            nodes: [prev.token, cur.token],
          });
        }
      }
    }
    return out;
  },
};

/** Two named steps that resolve to the same value are redundant. */
const redundancy: Heuristic = {
  id: 'scale-redundancy',
  name: 'Redundant scale step',
  category: 'Consistency',
  principle: 'Two named steps with the same value are redundant — give designers one way to express one value.',
  check(model) {
    const out: Finding[] = [];
    for (const scale of model.scales) {
      const byPx = new Map<number, string[]>();
      for (const s of scale.steps) {
        const arr = byPx.get(s.px) ?? [];
        arr.push(s.key);
        byPx.set(s.px, arr);
      }
      for (const [px, keys] of byPx) {
        if (keys.length > 1) {
          out.push({
            id: `scale-redundancy-${scale.id}-${keys.join('-')}`,
            heuristic: 'Redundant scale step',
            category: scale.category,
            principle: 'Two steps with the same value are redundant.',
            severity: 'suggestion',
            title: `${scale.name} has duplicate steps (${keys.join(', ')})`,
            detail: `${scale.name} steps ${keys.map((k) => `"${k}"`).join(' and ')} both resolve to ${fmt(px)}. A duplicated step makes the scale feel arbitrary and gives two names for one value.`,
            suggestion: `Collapse to a single step, or retune so each ${scale.noun} is visually distinct.`,
            nodes: keys.map((k) => scale.steps.find((s) => s.key === k)!.token),
          });
        }
      }
    }
    return out;
  },
};

/** A scale should grow by a steady ratio; one step that jumps far more breaks the rhythm. */
const rhythm: Heuristic = {
  id: 'scale-rhythm',
  name: 'Scale rhythm',
  category: 'Consistency',
  principle: 'A scale should grow by a steady ratio; a step that jumps far more than its neighbours feels abrupt.',
  check(model) {
    const out: Finding[] = [];
    for (const scale of model.scales) {
      if (scale.steps.length < 4) continue;
      const rs = ratios(scale.steps);
      const med = median(rs);
      if (med <= 0) continue;
      for (let i = 0; i < rs.length; i += 1) {
        if (rs[i] >= med * RHYTHM_FACTOR) {
          const a = scale.steps[i];
          const b = scale.steps[i + 1];
          out.push({
            id: `scale-rhythm-${scale.id}-${b.key}`,
            heuristic: 'Scale rhythm',
            category: scale.category,
            principle: 'A scale should grow by a steady ratio.',
            severity: 'suggestion',
            title: `${scale.name} jumps abruptly at "${b.key}"`,
            detail: `${scale.name} grows ×${rs[i].toFixed(2)} from "${a.key}" (${fmt(a.px)}) to "${b.key}" (${fmt(b.px)}), against a typical ×${med.toFixed(2)} elsewhere — the step reads as a gap in the scale.`,
            suggestion: `Add an intermediate step or retune "${b.key}" so the ${scale.noun} grows in rhythm with the rest of the scale.`,
            nodes: [a.token, b.token],
          });
        }
      }
    }
    return out;
  },
};

/** Size is the first signal of hierarchy — a heading shouldn't match a body size. */
const headingBodyDistinction: Heuristic = {
  id: 'type-hierarchy-collision',
  name: 'Heading vs body distinction',
  category: 'Hierarchy',
  principle: 'Size is the first signal of hierarchy — a heading at a body size only reads as a heading by weight.',
  check(model) {
    const heading = model.scales.find((s) => s.id === 'type-heading');
    const body = model.scales.find((s) => s.id === 'type-body');
    if (!heading || !body) return [];
    const out: Finding[] = [];
    for (const h of heading.steps) {
      const hit = body.steps.find((b) => b.px === h.px);
      if (hit) {
        out.push({
          id: `type-collision-${h.key}-${hit.key}`,
          heuristic: 'Heading vs body distinction',
          category: 'Hierarchy',
          principle: 'Size is the first signal of hierarchy.',
          severity: 'suggestion',
          title: `Heading "${h.key}" is the same size as body "${hit.key}"`,
          detail: `heading-${h.key} and body-${hit.key} both resolve to ${fmt(h.px)}. At identical sizes this heading only reads as a heading through weight or colour — it's easy to miss, and it softens the type hierarchy.`,
          suggestion: `Step heading-${h.key} up to the next size, or make sure its weight clearly separates it from body text.`,
          nodes: [h.token, hit.token],
        });
      }
    }
    return out;
  },
};

/** Note the scales that are dialled in — a designer records strengths, not only problems. */
const scaleCraft: Heuristic = {
  id: 'scale-craft',
  name: 'Scale craft',
  category: 'Consistency',
  principle: 'A well-built scale is monotonic, free of duplicates, and grows in a steady rhythm.',
  check(model) {
    const out: Finding[] = [];
    for (const scale of model.scales) {
      if (scale.steps.length < 4) continue;
      const monotonic = scale.steps.every((s, i) => i === 0 || s.px > scale.steps[i - 1].px);
      const unique = new Set(scale.steps.map((s) => s.px)).size === scale.steps.length;
      const rs = ratios(scale.steps);
      const med = median(rs);
      const steady = med > 0 && rs.every((r) => r < med * RHYTHM_FACTOR);
      if (monotonic && unique && steady) {
        out.push({
          id: `scale-craft-${scale.id}`,
          heuristic: 'Scale craft',
          category: scale.category,
          principle: 'A well-built scale is monotonic, duplicate-free, and steady.',
          severity: 'praise',
          title: `${scale.name} scale is dialled in`,
          detail: `${scale.steps.length} steps, strictly increasing, no duplicates, and a steady rhythm (~×${med.toFixed(2)}). Clean.`,
        });
      }
    }
    return out;
  },
};

export const HEURISTICS: Heuristic[] = [ordering, redundancy, rhythm, headingBodyDistinction, scaleCraft];
