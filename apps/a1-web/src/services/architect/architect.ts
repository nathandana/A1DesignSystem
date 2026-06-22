/**
 * Virtual Information Architect — the profile + the audit runner.
 *
 * `auditNav(nav)` runs every heuristic over a NavModel and returns a sorted ArchitectReport.
 * It is pure and offline (no API / model credits), like the Virtual Team personas, but
 * read-only: the architect reports and suggests; it never mutates anything.
 */
import { HEURISTICS } from './heuristics';
import type { ArchitectProfile, ArchitectReport, NavModel, NavNode, Severity } from './types';
import { SEVERITY_ORDER } from './types';

export const informationArchitect: ArchitectProfile = {
  id: 'information-architect',
  name: 'Virtual Information Architect',
  role: 'Information Architect',
  icon: 'account_tree',
  blurb:
    'Audits information architecture — site/menu structure, grouping & hierarchy, naming clarity, redundancy, depth, and scalability — against IA/UX heuristics, grouped by concern, and reports findings with concrete suggestions. Read-only: it advises, it never changes anything (you can file any finding as a ticket).',
};

function countNodes(items: NavNode[]): number {
  let n = 0;
  for (const item of items) {
    n += 1;
    if (item.children?.length) n += countNodes(item.children);
  }
  return n;
}

function maxDepth(items: NavNode[], depth = 1): number {
  let max = items.length ? depth : 0;
  for (const item of items) {
    if (item.children?.length) max = Math.max(max, maxDepth(item.children, depth + 1));
  }
  return max;
}

/** Run all heuristics over `nav` and return a report sorted most-urgent first. */
export function auditNav(nav: NavModel): ArchitectReport {
  // Each heuristic stamps its category onto the findings it produces.
  const findings = HEURISTICS.flatMap((h) => h.check(nav).map((f) => ({ ...f, category: f.category ?? h.category })));

  findings.sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));

  const counts = { critical: 0, warning: 0, suggestion: 0, praise: 0 } as Record<Severity, number>;
  for (const f of findings) counts[f.severity] += 1;

  return {
    navId: nav.id,
    navName: nav.name,
    findings,
    counts,
    topLevelCount: nav.items.length,
    maxDepth: maxDepth(nav.items),
    nodeCount: countNodes(nav.items),
  };
}
