/**
 * The Virtual Designer's **composition** review — design-craft heuristics over a page's
 * component tree (a `ComponentNode[]`), as opposed to the token-scale review in `heuristics.ts`.
 * Pure and deterministic: the same page always produces the same findings. The first slice
 * encodes three documented A1 rules that are checkable from the definition alone.
 *
 * `auditPage` reviews one page; `auditProject` runs every page in a project and aggregates.
 */
import type { ComponentNode } from '../../editor/pageTypes';
import type { DesignReport, Finding, PageHeuristic, PageModel, Severity } from './types';
import { SEVERITY_ORDER } from './types';

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Depth-first walk with each node's parent. */
function walk(nodes: ComponentNode[], fn: (node: ComponentNode, parent: ComponentNode | null) => void, parent: ComponentNode | null = null): void {
  for (const n of nodes) {
    fn(n, parent);
    if (n.children?.length) walk(n.children, fn, n);
  }
}

function countNodes(nodes: ComponentNode[]): number {
  let n = 0;
  walk(nodes, () => { n += 1; });
  return n;
}

/** A button's effective variant — the A1 Button defaults to `primary` when unset. */
function buttonVariant(node: ComponentNode): string {
  const v = node.props?.variant;
  return typeof v === 'string' ? v : 'primary';
}

/** A node's visible label for messages — its text fallback, else its id. */
function labelOf(node: ComponentNode): string {
  const text = node.content?.fallback;
  return (typeof text === 'string' && text.trim()) || node.id;
}

/** Heading level from `as="h1".."h6"`, else null. */
function headingLevel(node: ComponentNode): number | null {
  const as = node.props?.as;
  if (typeof as === 'string' && /^h[1-6]$/.test(as)) return Number(as[1]);
  return null;
}

// ── Heuristics ────────────────────────────────────────────────────────────────

/** Only one primary button should appear within a single action group. */
const onePrimaryPerArea: PageHeuristic = {
  id: 'one-primary-per-area',
  name: 'One primary per decision area',
  category: 'Hierarchy',
  principle: 'Only one primary button should appear within a single form, dialog, or action group.',
  check(model) {
    const out: Finding[] = [];
    walk(model.nodes, (node) => {
      const buttons = (node.children ?? []).filter((c) => c.type === 'Button');
      if (buttons.length < 2) return;
      const primaries = buttons.filter((b) => buttonVariant(b) === 'primary');
      if (primaries.length >= 2) {
        out.push({
          id: `one-primary-${node.id}`,
          heuristic: 'One primary per decision area',
          category: 'Hierarchy',
          principle: 'Only one primary button per decision area.',
          severity: 'warning',
          title: `${primaries.length} primary buttons in one ${node.type}`,
          detail: `The ${node.type} (${node.id}) groups ${buttons.length} buttons, ${primaries.length} of them primary (${primaries.map(labelOf).join(', ')}). Multiple primary actions compete for attention and blur which one is recommended. A Button with no \`variant\` counts as primary.`,
          suggestion: 'Keep one primary and make the rest secondary or tertiary.',
          nodes: primaries.map(labelOf),
        });
      }
    });
    return out;
  },
};

/** Tertiary buttons must pair a verb-led label with a leading icon — never text-only. */
const tertiaryNeedsIcon: PageHeuristic = {
  id: 'tertiary-needs-icon',
  name: 'Tertiary needs an icon',
  category: 'Consistency',
  principle: 'Tertiary buttons must always include both a visible icon and a verb-led label.',
  check(model) {
    const out: Finding[] = [];
    walk(model.nodes, (node) => {
      if (node.type !== 'Button' || buttonVariant(node) !== 'tertiary') return;
      if (!node.props?.icon) {
        out.push({
          id: `tertiary-icon-${node.id}`,
          heuristic: 'Tertiary needs an icon',
          category: 'Consistency',
          principle: 'Tertiary buttons need a leading icon + verb.',
          severity: 'suggestion',
          title: `Tertiary button “${labelOf(node)}” has no icon`,
          detail: `“${labelOf(node)}” is a tertiary button with no \`icon\`. Tertiary actions are quiet; without a leading icon they read as plain text and are easy to miss.`,
          suggestion: 'Add a leading icon (keeping a verb-led label), or use a secondary button.',
          nodes: [labelOf(node)],
        });
      }
    });
    return out;
  },
};

/** Headings should form a single, unbroken outline — one h1, no skipped levels. */
const headingOutline: PageHeuristic = {
  id: 'heading-outline',
  name: 'Heading outline',
  category: 'Hierarchy',
  principle: 'A page outline should have a single h1 and never skip a heading level.',
  check(model) {
    const levels: { level: number; label: string; id: string }[] = [];
    walk(model.nodes, (node) => {
      if (node.type !== 'Heading') return;
      const level = headingLevel(node);
      if (level) levels.push({ level, label: labelOf(node), id: node.id });
    });
    const out: Finding[] = [];
    const h1s = levels.filter((x) => x.level === 1);
    if (h1s.length > 1) {
      out.push({
        id: 'heading-multiple-h1',
        heuristic: 'Heading outline',
        category: 'Hierarchy',
        principle: 'A page should have a single h1.',
        severity: 'warning',
        title: `Page has ${h1s.length} level-1 headings`,
        detail: `Found ${h1s.length} h1 headings (${h1s.map((x) => `“${x.label}”`).join(', ')}). A page should have exactly one top-level heading so the outline is unambiguous for assistive tech.`,
        suggestion: 'Keep one h1 and demote the others to h2+.',
        nodes: h1s.map((x) => x.label),
      });
    }
    for (let i = 1; i < levels.length; i += 1) {
      const prev = levels[i - 1];
      const cur = levels[i];
      if (cur.level > prev.level + 1) {
        out.push({
          id: `heading-skip-${cur.id}`,
          heuristic: 'Heading outline',
          category: 'Hierarchy',
          principle: 'Heading levels should not skip.',
          severity: 'suggestion',
          title: `Heading jumps from h${prev.level} to h${cur.level}`,
          detail: `“${cur.label}” (h${cur.level}) follows “${prev.label}” (h${prev.level}), skipping a level. A skipped level breaks the document outline and weakens the visual hierarchy.`,
          suggestion: `Use h${prev.level + 1} for “${cur.label}”, or restructure the section.`,
          nodes: [prev.label, cur.label],
        });
      }
    }
    return out;
  },
};

const PAGE_HEURISTICS: PageHeuristic[] = [onePrimaryPerArea, tertiaryNeedsIcon, headingOutline];

// ── Runners ──────────────────────────────────────────────────────────────────

function finalize(modelId: string, modelName: string, findings: Finding[], subtitle: string): DesignReport {
  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  const counts = { critical: 0, warning: 0, suggestion: 0, praise: 0 } as Record<Severity, number>;
  for (const f of findings) counts[f.severity] += 1;
  return { modelId, modelName, findings, counts, subtitle };
}

/** Review one page's composition. */
export function auditPage(model: PageModel): DesignReport {
  const findings = PAGE_HEURISTICS.flatMap((h) => h.check(model).map((f) => ({ ...f, category: f.category ?? h.category })));
  const nodeCount = countNodes(model.nodes);
  if (!findings.some((f) => f.severity !== 'praise')) {
    findings.push({
      id: 'page-clean',
      heuristic: 'Composition',
      category: 'Hierarchy',
      principle: 'A well-composed page has a clear outline and one primary action per area.',
      severity: 'praise',
      title: `${model.name} reads cleanly`,
      detail: `No composition issues found across ${nodeCount} node${nodeCount === 1 ? '' : 's'} — heading outline and action emphasis look intentional.`,
    });
  }
  return finalize(model.id, model.name, findings, `${nodeCount} node${nodeCount === 1 ? '' : 's'} examined`);
}

/** Review every page in a project and aggregate (findings tagged with their page). */
export function auditProject(projectId: string, projectName: string, pages: { id: string; title: string; nodes: ComponentNode[] }[]): DesignReport {
  const all: Finding[] = [];
  let nodeCount = 0;
  let reviewed = 0;
  for (const pg of pages) {
    if (!pg.nodes.length) continue;
    reviewed += 1;
    nodeCount += countNodes(pg.nodes);
    const report = auditPage({ id: pg.id, name: pg.title || 'Untitled', nodes: pg.nodes });
    for (const f of report.findings) {
      if (f.severity === 'praise') continue; // per-page praise is noise in an aggregate
      all.push({ ...f, id: `${pg.id}-${f.id}`, title: `${pg.title || 'Untitled'}: ${f.title}` });
    }
  }
  if (!all.length) {
    all.push({
      id: 'project-clean',
      heuristic: 'Composition',
      category: 'Hierarchy',
      principle: 'A well-composed project keeps a clear outline and action emphasis on every page.',
      severity: 'praise',
      title: `${projectName} reads cleanly`,
      detail: `Reviewed ${reviewed} page${reviewed === 1 ? '' : 's'} (${nodeCount} nodes) — no composition issues found.`,
    });
  }
  return finalize(projectId, `${projectName} — all pages`, all, `${reviewed} page${reviewed === 1 ? '' : 's'} · ${nodeCount} nodes examined`);
}
