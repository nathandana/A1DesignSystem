/**
 * Backlog — shared types and vocabularies for the lightweight ticketing tool.
 *
 * This is the single source of truth for the app's status/type/priority/complexity
 * /scope vocabularies, their human labels, and the MessageBadge tone mapping. The
 * DB enforces the same enums via check constraints in `supabase/schema.sql`, and the
 * local-sync CLI (`scripts/backlog-sync.mjs`) mirrors the grouping order — keep all
 * three in step when changing a vocabulary.
 */

// ── Vocabularies ──────────────────────────────────────────────────────────────

export const TYPES = ['feature', 'bug', 'chore'] as const;
export type TicketType = (typeof TYPES)[number];

export const STATUSES = [
  'new', 'triaged', 'accepted', 'in_progress', 'done', 'released', 'wont_fix', 'duplicate',
] as const;
export type TicketStatus = (typeof STATUSES)[number];

/** The ordered workflow lanes shown on the board (terminal states sit in their own group). */
export const STATUS_FLOW = ['new', 'triaged', 'accepted', 'in_progress', 'done', 'released'] as const;
export const TERMINAL_STATUSES = ['wont_fix', 'duplicate'] as const;

export const PRIORITIES = ['p0', 'p1', 'p2', 'p3'] as const; // requester *suggests*; nullable
export type Priority = (typeof PRIORITIES)[number];

export const COMPLEXITIES = ['xs', 's', 'm', 'l', 'xl'] as const; // mirrors TODO.md effort; nullable
export type Complexity = (typeof COMPLEXITIES)[number];

export const SCOPE_KINDS = [
  'general', 'component', 'foundation', 'theme', 'pattern', 'project', 'package', 'app',
] as const;
export type ScopeKind = (typeof SCOPE_KINDS)[number];

// ── Human labels (English fallbacks; translatable copies live in labels/backlog.json) ──

export const STATUS_LABELS: Record<TicketStatus, string> = {
  new: 'New',
  triaged: 'Triaged',
  accepted: 'Accepted',
  in_progress: 'In progress',
  done: 'Done',
  released: 'Released',
  wont_fix: "Won't fix",
  duplicate: 'Duplicate',
};

export const TYPE_LABELS: Record<TicketType, string> = {
  feature: 'Feature',
  bug: 'Bug',
  chore: 'Chore',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  p0: 'P0 · Critical',
  p1: 'P1 · High',
  p2: 'P2 · Medium',
  p3: 'P3 · Low',
};

export const COMPLEXITY_LABELS: Record<Complexity, string> = {
  xs: 'XS', s: 'S', m: 'M', l: 'L', xl: 'XL',
};

/** Spelled-out complexity, for places that show the size in full (e.g. the ticket dialog). */
export const COMPLEXITY_FULL: Record<Complexity, string> = {
  xs: 'Extra small', s: 'Small', m: 'Medium', l: 'Large', xl: 'Extra large',
};

export const SCOPE_LABELS: Record<ScopeKind, string> = {
  general: 'General',
  component: 'Component',
  foundation: 'Foundation',
  theme: 'Theme',
  pattern: 'Pattern',
  project: 'Project',
  package: 'Package',
  app: 'App',
};

// ── MessageBadge tones ('neutral' | 'info' | 'success' | 'warn' | 'error') ──────

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warn' | 'error';

export const STATUS_TONE: Record<TicketStatus, BadgeTone> = {
  new: 'info',
  triaged: 'info',
  accepted: 'info',
  in_progress: 'warn',
  done: 'success',
  released: 'success',
  wont_fix: 'neutral',
  duplicate: 'neutral',
};

export const TYPE_TONE: Record<TicketType, BadgeTone> = {
  feature: 'info',
  bug: 'error',
  chore: 'neutral',
};

export const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  p0: 'error', p1: 'warn', p2: 'info', p3: 'neutral',
};

export const TYPE_ICON: Record<TicketType, string> = {
  feature: 'lightbulb',
  bug: 'bug_report',
  chore: 'handyman',
};

export const STATUS_ICON: Record<TicketStatus, string> = {
  new: 'fiber_new',
  triaged: 'rule',
  accepted: 'task_alt',
  in_progress: 'autorenew',
  done: 'done',
  released: 'rocket_launch',
  wont_fix: 'block',
  duplicate: 'content_copy',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/** The human ticket reference, e.g. `A1-42`. */
export function ticketRef(n: number): string {
  return `A1-${n}`;
}

/** True for statuses that close a ticket (kept off the active board lanes). */
export function isTerminal(status: TicketStatus): boolean {
  return (TERMINAL_STATUSES as readonly string[]).includes(status);
}

// ── Records ─────────────────────────────────────────────────────────────────

export interface BacklogScope {
  kind: ScopeKind;
  ref?: string | null;
  label?: string | null;
}

export interface BacklogItem {
  id: string;
  number: number;
  title: string;
  description: string | null;
  type: TicketType;
  status: TicketStatus;
  priority: Priority | null;
  complexity: Complexity | null;
  scopeKind: ScopeKind;
  scopeRef: string | null;
  scopeLabel: string | null;
  createdBy: string | null;
  createdByEmail: string | null;
  assigneeId: string | null;
  assigneeEmail: string | null;
  awaitingRequester: boolean;
  duplicateOf: string | null;
  attachmentRefs: string[];
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CommentKind = 'comment' | 'question' | 'answer' | 'activity';

export interface BacklogComment {
  id: string;
  itemId: string;
  kind: CommentKind;
  body: string | null;
  meta: Record<string, unknown> | null;
  userId: string | null;
  userEmail: string | null;
  createdAt: string;
}

export type NotificationKind = 'assigned' | 'question' | 'answer' | 'status' | 'comment' | 'vote';

export interface BacklogNotification {
  id: string;
  userId: string;
  itemId: string | null;
  kind: NotificationKind;
  body: string | null;
  read: boolean;
  createdAt: string;
}

/** Fields a requester can set when creating a ticket. */
export interface CreateTicketInput {
  title: string;
  description?: string | null;
  type?: TicketType;
  priority?: Priority | null;
  complexity?: Complexity | null;
  scope?: BacklogScope;
  attachmentRefs?: string[];
}

/** Editable fields on an existing ticket. */
export type UpdateTicketPatch = Partial<{
  title: string;
  description: string | null;
  type: TicketType;
  status: TicketStatus;
  priority: Priority | null;
  complexity: Complexity | null;
  scopeKind: ScopeKind;
  scopeRef: string | null;
  scopeLabel: string | null;
  assigneeId: string | null;
  assigneeEmail: string | null;
  awaitingRequester: boolean;
  duplicateOf: string | null;
  attachmentRefs: string[];
}>;

export interface BacklogUser {
  id: string;
  email: string;
}
