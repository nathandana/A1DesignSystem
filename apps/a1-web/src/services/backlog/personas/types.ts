/**
 * Virtual team — local, deterministic "personas" that review the backlog like a real
 * team would, WITHOUT any API calls (no model credits spent). Each persona is its own
 * well-defined module: a pure `evaluate(item)` that turns a ticket's own fields into a
 * verdict (type, priority, size, clarifying questions, rationale). The runner applies those
 * verdicts to the store, attributing comments to the persona.
 *
 * Add a persona by writing a module that exports a `Persona` and registering it in
 * `index.ts`. The runner and the dev-only Virtual Team panel are generic over personas.
 */
import type { BacklogItem, Complexity, Priority, TicketStatus, TicketType } from '../types';

/**
 * A clarifying question a persona asks. When `options` are present the ticket shows a
 * mini multiple-choice form the requester can answer inline (plus a free-text "Other"
 * when `allowOther`). Stored on the question comment's `meta`.
 */
export interface PersonaQuestion {
  /** Stable id for the question kind — so the runner never re-asks one it already asked. */
  key: string;
  text: string;
  options?: string[];
  /** Offer a free-text "Other…" choice (defaults on when options are present). */
  allowOther?: boolean;
}

/** Wider context handed to a persona so it can reason about the rest of the backlog. */
export interface PersonaContext {
  /** All current tickets (for relating/duplicating, e.g. "this overlaps A1-12"). */
  items?: BacklogItem[];
}

/** What a persona proposes for a single ticket. `null` from evaluate() = skip the ticket. */
export interface PersonaVerdict {
  /** Proposed ticket type (applied only when it differs). */
  type?: TicketType;
  /** Proposed priority (applied only when it differs from the ticket's current value). */
  priority?: Priority | null;
  /** Proposed size/complexity (applied only when it differs). */
  complexity?: Complexity | null;
  /** Clarifying questions to post as the persona (gated so they aren't piled on). */
  questions: PersonaQuestion[];
  /** One-line, in-voice reasoning shown in the persona's review note. */
  rationale: string;
}

export interface Persona {
  /** Stable id (also stored in comment.meta.persona). */
  id: string;
  /** Display name, e.g. "Virtual Product Owner". */
  name: string;
  /** Role label, e.g. "Product Owner". */
  role: string;
  /** Virtual author email tagged on the persona's comments, e.g. product-owner@a1.virtual. */
  email: string;
  /** Material Symbols icon name. */
  icon: string;
  /** One-line description of what this persona does. */
  blurb: string;
  /** Prefix for the persona's review notes, e.g. "PO review —". */
  signature: string;
  /** Increment when review policy changes so existing tickets are deliberately reassessed. */
  revision?: number;
  /** Evaluation from the ticket's fields (+ optional backlog context). Return null to skip. */
  evaluate(item: BacklogItem, context?: PersonaContext): PersonaVerdict | null;
}

/** A single ticket the persona would touch (used by the dry-run preview + the result). */
export interface PersonaChange {
  ref: string;
  title: string;
  typeFrom?: TicketType;
  type?: TicketType;
  priorityFrom: Priority | null;
  priority?: Priority | null;
  complexity?: Complexity | null;
  questions: number;
  /** Set when the ticket was moved forward because the CHANGELOG shows it shipped. */
  statusFrom?: TicketStatus;
  status?: TicketStatus;
}

/** Result of reviewing a single ticket (used by the per-ticket review button). */
export interface PersonaItemOutcome {
  /** `unchanged` = already reviewed, nothing changed since; `declined` = persona skipped it. */
  reason: 'reviewed' | 'unchanged' | 'declined';
  /** The persona changed type/priority/size or asked a question. */
  acted: boolean;
  type?: TicketType;
  typeFrom: TicketType;
  priority?: Priority | null;
  priorityFrom: Priority | null;
  complexity?: Complexity | null;
  questions: number;
  rationale: string;
}

export interface PersonaRunSummary {
  persona: string;
  personaName: string;
  dryRun: boolean;
  /** Non-terminal, non-released tickets considered. */
  total: number;
  /** Already reviewed and unchanged since — skipped this run. */
  skipped: number;
  /** Newly reviewed or re-reviewed (content changed since the last review). */
  reviewed: number;
  /** Of the reviewed, those the persona changed or questioned. */
  acted: number;
  retyped: number;
  reprioritized: number;
  resized: number;
  questions: number;
  /** Tickets moved forward because the CHANGELOG shows they shipped (bulk run only). */
  moved: number;
  changes: PersonaChange[];
}
