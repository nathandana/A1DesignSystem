/**
 * Backlog — smart search (A1-187). Local, deterministic, no API/model credits, in the same
 * spirit as `similarity.ts` and the Virtual Team personas.
 *
 * "Smart" means more than a title substring match:
 *  - **Relevance ranking** — matches are scored over weighted fields (title > scope/labels >
 *    description) and returned best-first, not in board order.
 *  - **A1-number aware** — `A1-187`, `a1187`, or a bare `187` jump straight to that ticket.
 *  - **Multi-term AND** — every free term must appear somewhere, so `menu dropdown` needs both.
 *  - **Field qualifiers** — `is:open` / `is:closed`, `type:bug`, `status:in progress`,
 *    `priority:p1`, `scope:component` narrow the set; combine freely with free text.
 *
 * `smartSearchBacklog(items, query)` returns the matching tickets, most relevant first.
 */
import {
  PRIORITIES, PRIORITY_LABELS, SCOPE_KINDS, SCOPE_LABELS, STATUSES, STATUS_LABELS,
  TYPES, TYPE_LABELS, ticketRef,
} from './types';
import type { BacklogItem, Priority, ScopeKind, TicketStatus, TicketType } from './types';

// Closed/terminal statuses — drives `is:open` / `is:closed` (mirrors the page's "open" stat).
const CLOSED_STATUSES = new Set<TicketStatus>(['released', 'wont_fix', 'duplicate']);

// ── Query parsing ───────────────────────────────────────────────────────────

export interface ParsedQuery {
  /** Free-text terms (lower-cased), AND-matched across fields. */
  terms: string[];
  /** A1 ticket number from a ref-like term (e.g. "a1-187" or "187"), if any. */
  ref: number | null;
  /** Field qualifiers (each an AND filter). */
  types: Set<TicketType>;
  statuses: Set<TicketStatus>;
  priorities: Set<Priority>;
  scopes: Set<ScopeKind>;
  /** From `is:open` / `is:closed`. */
  openState: 'open' | 'closed' | null;
}

function lc(s: string): string { return s.toLowerCase(); }

/** "in progress" / "in-progress" → "in_progress" so labels and keys both resolve. */
function normKey(s: string): string { return lc(s).trim().replace(/[\s-]+/g, '_'); }

const TYPE_BY_KEY = new Map<string, TicketType>();
for (const t of TYPES) { TYPE_BY_KEY.set(t, t); TYPE_BY_KEY.set(normKey(TYPE_LABELS[t]), t); TYPE_BY_KEY.set(`${t}s`, t); }

const STATUS_BY_KEY = new Map<string, TicketStatus>();
for (const s of STATUSES) { STATUS_BY_KEY.set(s, s); STATUS_BY_KEY.set(normKey(STATUS_LABELS[s]), s); }

const SCOPE_BY_KEY = new Map<string, ScopeKind>();
for (const k of SCOPE_KINDS) { SCOPE_BY_KEY.set(k, k); SCOPE_BY_KEY.set(normKey(SCOPE_LABELS[k]), k); }

const PRIORITY_BY_KEY = new Map<string, Priority>();
for (const p of PRIORITIES) { PRIORITY_BY_KEY.set(p, p); PRIORITY_BY_KEY.set(p.replace('p', ''), p); }

/** A ref-like token → ticket number (a1-187 / a1187 / 187), else null. */
function refNumber(token: string): number | null {
  const m = lc(token).match(/^(?:a1[-\s]?)?(\d{1,7})$/);
  return m ? parseInt(m[1], 10) : null;
}

export function parseSearch(query: string): ParsedQuery {
  const parsed: ParsedQuery = {
    terms: [], ref: null,
    types: new Set(), statuses: new Set(), priorities: new Set(), scopes: new Set(),
    openState: null,
  };
  for (const raw of query.trim().split(/\s+/).filter(Boolean)) {
    const q = raw.match(/^([a-z]+):(.+)$/i);
    if (q) {
      const key = lc(q[1]);
      const val = q[2];
      if (key === 'is') {
        const v = normKey(val);
        if (v === 'open') parsed.openState = 'open';
        else if (v === 'closed') parsed.openState = 'closed';
        continue;
      }
      if (key === 'type' && TYPE_BY_KEY.has(normKey(val))) { parsed.types.add(TYPE_BY_KEY.get(normKey(val))!); continue; }
      if (key === 'status' && STATUS_BY_KEY.has(normKey(val))) { parsed.statuses.add(STATUS_BY_KEY.get(normKey(val))!); continue; }
      if (key === 'priority' && PRIORITY_BY_KEY.has(normKey(val))) { parsed.priorities.add(PRIORITY_BY_KEY.get(normKey(val))!); continue; }
      if (key === 'scope' && SCOPE_BY_KEY.has(normKey(val))) { parsed.scopes.add(SCOPE_BY_KEY.get(normKey(val))!); continue; }
      // Unknown qualifier — fall through and treat the whole token as free text.
    }
    const ref = refNumber(raw);
    if (ref !== null && parsed.ref === null) parsed.ref = ref;
    parsed.terms.push(lc(raw));
  }
  return parsed;
}

// ── Scoring ─────────────────────────────────────────────────────────────────

/** The searchable text of a ticket, per field, with each field's relevance weight. */
function fields(item: BacklogItem): { text: string; weight: number }[] {
  return [
    { text: lc(item.title), weight: 6 },
    { text: lc(ticketRef(item.number)), weight: 5 },
    { text: lc(item.scopeLabel || SCOPE_LABELS[item.scopeKind] || ''), weight: 3 },
    { text: `${lc(TYPE_LABELS[item.type])} ${item.priority ? lc(PRIORITY_LABELS[item.priority]) : ''} ${lc(STATUS_LABELS[item.status])}`, weight: 2 },
    { text: lc(item.description || ''), weight: 1 },
  ];
}

function passesQualifiers(item: BacklogItem, q: ParsedQuery): boolean {
  if (q.types.size && !q.types.has(item.type)) return false;
  if (q.statuses.size && !q.statuses.has(item.status)) return false;
  if (q.priorities.size && (!item.priority || !q.priorities.has(item.priority))) return false;
  if (q.scopes.size && !q.scopes.has(item.scopeKind)) return false;
  if (q.openState === 'open' && CLOSED_STATUSES.has(item.status)) return false;
  if (q.openState === 'closed' && !CLOSED_STATUSES.has(item.status)) return false;
  return true;
}

export interface SearchHit { item: BacklogItem; score: number }

/**
 * Rank `items` against `query`. Returns matches best-first. An empty/whitespace query
 * returns every item (unranked) so callers can use it as a pass-through.
 */
export function searchBacklog(items: BacklogItem[], query: string): SearchHit[] {
  if (!query.trim()) return items.map((item) => ({ item, score: 0 }));
  const q = parseSearch(query);
  const hasQualifiers = q.types.size || q.statuses.size || q.priorities.size || q.scopes.size || q.openState;

  const hits: SearchHit[] = [];
  for (const item of items) {
    if (!passesQualifiers(item, q)) continue;

    // Direct A1-number hit — surface it strongly regardless of the free-term match.
    const refHit = q.ref !== null && item.number === q.ref;

    let score = refHit ? 100 : 0;
    let allTermsMatch = true;

    if (q.terms.length) {
      const fs = fields(item);
      for (const term of q.terms) {
        // A bare number term that equals this ticket's ref counts as matched.
        if (refNumber(term) === item.number) { score += 50; continue; }
        let best = 0;
        for (const f of fs) if (f.text.includes(term)) best = Math.max(best, f.weight);
        if (best === 0) { allTermsMatch = false; break; }
        score += best;
      }
    }

    if (!allTermsMatch) continue;
    // Qualifier-only query (no free terms) → include everything that passed, ordered by recency.
    if (!q.terms.length && !hasQualifiers) continue;
    hits.push({ item, score });
  }

  hits.sort((a, b) => b.score - a.score || b.item.number - a.item.number);
  return hits;
}

/** Convenience: just the matching tickets, most relevant first. */
export function smartSearchBacklog(items: BacklogItem[], query: string): BacklogItem[] {
  if (!query.trim()) return items;
  return searchBacklog(items, query).map((h) => h.item);
}
