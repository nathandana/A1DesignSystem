/**
 * Map backlog tickets that have shipped, by reading the CHANGELOG. Entries reference their
 * ticket as `(A1-<n>)` (the convention in project-workflows.md). A ref under a versioned
 * heading (`## 0.10.0 — …`) is treated as **released**; a ref under `## Unreleased` is
 * **done** (work complete, not yet released). The bulk Virtual PO run uses this to move
 * tickets that have been worked on forward.
 */
import type { TicketStatus } from '../types';

const RANK: TicketStatus[] = ['done', 'released'];

export function shippedStatusByNumber(changelog: string | undefined): Map<number, TicketStatus> {
  const map = new Map<number, TicketStatus>();
  if (!changelog) return map;

  // Split into sections by `## ` headings (the first chunk is the file preamble).
  for (const section of changelog.split(/^##\s+/m).slice(1)) {
    const heading = section.split('\n', 1)[0].trim();
    const status: TicketStatus = /^unreleased\b/i.test(heading) ? 'done' : 'released';
    for (const m of section.matchAll(/\bA1-(\d+)\b/g)) {
      const n = Number(m[1]);
      const current = map.get(n);
      // Prefer the strongest status if a ticket is referenced in more than one section.
      if (!current || RANK.indexOf(status) > RANK.indexOf(current)) map.set(n, status);
    }
  }
  return map;
}
