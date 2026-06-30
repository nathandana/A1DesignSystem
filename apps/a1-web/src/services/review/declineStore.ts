/**
 * Persistent "declined finding" memory for the Virtual reviewers (Designer, Architect).
 *
 * Filing a finding as a ticket is already remembered via the ticket itself (the finding's
 * ref is embedded in the ticket description). Declining a finding is the opposite decision —
 * "I've seen this and don't want it" — and it needs its own memory so a re-run doesn't
 * surface it again. These are local, per-reviewer decisions on a dev-only tool, so they live
 * in `localStorage` keyed by a reviewer namespace; nothing is synced.
 *
 * Keyed by the finding's stable signature (`${modelId}::${findingId}`), the same key used for
 * file-as-ticket de-duplication — so a decline is naturally scoped to the audited target.
 */

export interface DeclineRecord {
  /** Optional note on why it was declined. */
  comment?: string;
  /** ISO timestamp of the decision. */
  at: string;
}

export type DeclineMap = Record<string, DeclineRecord>;

const keyFor = (namespace: string): string => `a1-virtual-declines-${namespace}`;

/** Every declined finding for a reviewer, keyed by signature. Safe without storage. */
export function loadDeclines(namespace: string): DeclineMap {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(keyFor(namespace)) : null;
    return raw ? (JSON.parse(raw) as DeclineMap) : {};
  } catch {
    return {};
  }
}

function save(namespace: string, map: DeclineMap): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(keyFor(namespace), JSON.stringify(map));
  } catch {
    /* ignore quota / disabled storage */
  }
}

/** Remember a decline (with an optional comment). Overwrites any prior decline for the sig. */
export function declineFinding(namespace: string, sig: string, comment?: string): void {
  const map = loadDeclines(namespace);
  map[sig] = { comment: comment?.trim() || undefined, at: new Date().toISOString() };
  save(namespace, map);
}

/** Forget a decline (the finding becomes actionable again). */
export function undoDecline(namespace: string, sig: string): void {
  const map = loadDeclines(namespace);
  if (map[sig]) {
    delete map[sig];
    save(namespace, map);
  }
}
