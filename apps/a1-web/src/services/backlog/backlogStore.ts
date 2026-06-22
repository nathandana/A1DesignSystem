/**
 * Backlog — store facade. Picks a backend (Supabase when configured + signed in,
 * else local), then layers the cross-cutting behaviour on top of the backend
 * primitives: writing an `activity` log entry and routing in-app notifications when
 * a ticket's status / priority / assignee changes or a comment / question lands.
 *
 * Mirrors services/historyDb.js: dormant until `setBacklogUser` is called, guarded
 * so it degrades gracefully when nothing is configured.
 */
import { supabaseConfigured } from '../../lib/supabase.js';
import type { AddNotificationRow, BacklogBackend } from './backend';
import { createLocalBackend } from './localBackend';
import { createSupabaseBackend } from './supabaseBackend';
import {
  COMPLEXITY_LABELS, PRIORITY_LABELS, STATUS_LABELS, ticketRef,
} from './types';
import type {
  BacklogComment, BacklogItem, BacklogNotification, BacklogUser, CommentKind,
  CreateTicketInput, NotificationKind, UpdateTicketPatch,
} from './types';

let currentUser: BacklogUser | null = null;
let backend: BacklogBackend | null = null;
let backendKey = '';

/** Set the signed-in user tagged on new tickets/comments (called on auth change). */
export function setBacklogUser(user: { id: string; email: string } | null): void {
  currentUser = user ? { id: user.id, email: user.email } : null;
  backend = null; // rebuild against the new user
}

export function getBacklogUser(): BacklogUser | null {
  return currentUser;
}

/** True when tickets are shared/multi-user (vs. the local single-browser fallback). */
export function isCloudBacklog(): boolean {
  return !!(supabaseConfigured && currentUser);
}

function getBackend(): BacklogBackend {
  const key = isCloudBacklog() ? `cloud:${currentUser!.id}` : 'local';
  if (!backend || backendKey !== key) {
    backend = isCloudBacklog()
      ? createSupabaseBackend(() => currentUser)
      : createLocalBackend(() => currentUser);
    backendKey = key;
  }
  return backend;
}

// ── Reads ─────────────────────────────────────────────────────────────────

export function listItems(): Promise<BacklogItem[]> { return getBackend().listItems(); }
export function listComments(itemId: string): Promise<BacklogComment[]> {
  return getBackend().listComments(itemId);
}
export function votedItemIds(): Promise<string[]> { return getBackend().votedItemIds(); }
export function listNotifications(): Promise<BacklogNotification[]> {
  return getBackend().listNotifications();
}
export function markNotificationsRead(ids: string[]): Promise<void> {
  return getBackend().markRead(ids);
}
export function subscribe(cb: () => void): () => void { return getBackend().subscribe(cb); }

// ── Create ──────────────────────────────────────────────────────────────────

export async function createItem(input: CreateTicketInput): Promise<BacklogItem> {
  return getBackend().createItem({
    title: input.title.trim(),
    description: input.description?.trim() || null,
    type: input.type ?? 'feature',
    priority: input.priority ?? null,
    complexity: input.complexity ?? null,
    scopeKind: input.scope?.kind ?? 'general',
    scopeRef: input.scope?.ref ?? null,
    scopeLabel: input.scope?.label ?? null,
    createdBy: currentUser?.id ?? null,
    createdByEmail: currentUser?.email ?? null,
    attachmentRefs: input.attachmentRefs ?? [],
  });
}

// ── Update (with activity log + notifications) ────────────────────────────────

const actorId = () => currentUser?.id ?? null;
const actorEmail = () => currentUser?.email ?? 'Someone';

/** Recipients for a ticket event: creator + assignee, minus the actor, de-duped. */
function recipients(item: BacklogItem): { id: string; }[] {
  const ids = new Set<string>();
  if (item.createdBy && item.createdBy !== actorId()) ids.add(item.createdBy);
  if (item.assigneeId && item.assigneeId !== actorId()) ids.add(item.assigneeId);
  return [...ids].map((id) => ({ id }));
}

export async function updateItem(
  prev: BacklogItem, patch: UpdateTicketPatch,
): Promise<BacklogItem | null> {
  const updated = await getBackend().updateItem(prev.id, patch);
  if (!updated) return null;

  const ref = ticketRef(prev.number);
  const activity: { body: string; meta: Record<string, unknown> }[] = [];
  const notifs: AddNotificationRow[] = [];

  if (patch.status && patch.status !== prev.status) {
    activity.push({
      body: `Status: ${STATUS_LABELS[prev.status]} → ${STATUS_LABELS[updated.status]}`,
      meta: { field: 'status', from: prev.status, to: updated.status },
    });
    for (const r of recipients(updated)) {
      notifs.push({ userId: r.id, itemId: prev.id, kind: 'status',
        body: `${ref} moved to ${STATUS_LABELS[updated.status]}` });
    }
  }
  if ('priority' in patch && patch.priority !== prev.priority) {
    activity.push({
      body: `Priority: ${prev.priority ? PRIORITY_LABELS[prev.priority] : '—'} → ${updated.priority ? PRIORITY_LABELS[updated.priority] : '—'}`,
      meta: { field: 'priority', from: prev.priority, to: updated.priority },
    });
  }
  if ('complexity' in patch && patch.complexity !== prev.complexity) {
    activity.push({
      body: `Complexity: ${prev.complexity ? COMPLEXITY_LABELS[prev.complexity] : '—'} → ${updated.complexity ? COMPLEXITY_LABELS[updated.complexity] : '—'}`,
      meta: { field: 'complexity', from: prev.complexity, to: updated.complexity },
    });
  }
  if ('assigneeId' in patch && patch.assigneeId !== prev.assigneeId) {
    const who = updated.assigneeEmail || 'Unassigned';
    activity.push({
      body: `Assignee: ${prev.assigneeEmail || 'Unassigned'} → ${who}`,
      meta: { field: 'assignee', from: prev.assigneeId, to: updated.assigneeId },
    });
    if (updated.assigneeId && updated.assigneeId !== actorId()) {
      notifs.push({ userId: updated.assigneeId, itemId: prev.id, kind: 'assigned',
        body: `${actorEmail()} assigned ${ref} to you` });
    }
  }

  const be = getBackend();
  for (const a of activity) {
    await be.addComment({ itemId: prev.id, kind: 'activity', body: a.body, meta: a.meta,
      userId: actorId(), userEmail: currentUser?.email ?? null });
  }
  await be.addNotifications(notifs);
  return updated;
}

// ── Merge / link (A1-161) ─────────────────────────────────────────────────────

/**
 * Merge `duplicate` into `canonical` — "join two similar tickets into one". The duplicate
 * is closed (status `duplicate`, `duplicateOf` → canonical) and its thread, votes, and
 * description move to the survivor so nothing is lost. Writes a clear activity note on
 * both tickets and notifies the survivor's creator. Returns the closed duplicate.
 */
/**
 * Link two tickets as related (A1-218) — a symmetric link written to both sides' `links`
 * arrays. Distinct from merging: both tickets stay open. No-op if they're the same or
 * already linked.
 */
export async function linkTickets(a: BacklogItem, b: BacklogItem): Promise<void> {
  if (a.id === b.id) return;
  const be = getBackend();
  if (!(a.links ?? []).includes(b.id)) {
    await be.updateItem(a.id, { links: Array.from(new Set([...(a.links ?? []), b.id])) });
  }
  if (!(b.links ?? []).includes(a.id)) {
    await be.updateItem(b.id, { links: Array.from(new Set([...(b.links ?? []), a.id])) });
  }
}

/** Remove a link between two tickets (A1-218) — clears it from both sides. */
export async function unlinkTickets(a: BacklogItem, b: BacklogItem): Promise<void> {
  const be = getBackend();
  await be.updateItem(a.id, { links: (a.links ?? []).filter((id) => id !== b.id) });
  await be.updateItem(b.id, { links: (b.links ?? []).filter((id) => id !== a.id) });
}

export async function mergeTickets(
  duplicate: BacklogItem, canonical: BacklogItem,
): Promise<BacklogItem | null> {
  if (duplicate.id === canonical.id) return null;
  const be = getBackend();
  const dupRef = ticketRef(duplicate.number);
  const canRef = ticketRef(canonical.number);

  // 1) Move the discussion thread + votes onto the survivor.
  await be.mergeItem(duplicate.id, canonical.id);

  // 2) Preserve the duplicate's description as a comment so no agreed content is dropped.
  const desc = (duplicate.description ?? '').trim();
  if (desc) {
    await be.addComment({
      itemId: canonical.id, kind: 'comment',
      body: `Merged from ${dupRef} — “${duplicate.title}”:\n\n${desc}`,
      meta: { mergedFrom: duplicate.id, mergedFromRef: dupRef },
      userId: actorId(), userEmail: currentUser?.email ?? null,
    });
  }

  // 3) Activity note on the survivor.
  await be.addComment({
    itemId: canonical.id, kind: 'activity',
    body: `Merged ${dupRef} (“${duplicate.title}”) into this ticket`,
    meta: { field: 'merge', mergedFrom: duplicate.id, mergedFromRef: dupRef },
    userId: actorId(), userEmail: currentUser?.email ?? null,
  });

  // 4) Close the duplicate (this logs the status change + notifies its stakeholders).
  const closed = await updateItem(duplicate, {
    status: 'duplicate', duplicateOf: canonical.id, awaitingRequester: false,
  });

  // 5) Activity note + link on the closed duplicate.
  await be.addComment({
    itemId: duplicate.id, kind: 'activity',
    body: `Closed as a duplicate of ${canRef} (“${canonical.title}”)`,
    meta: { field: 'merge', duplicateOf: canonical.id, duplicateOfRef: canRef },
    userId: actorId(), userEmail: currentUser?.email ?? null,
  });

  // 6) Tell the survivor's creator that a ticket was merged into theirs.
  if (canonical.createdBy && canonical.createdBy !== actorId()) {
    await be.addNotifications([{
      userId: canonical.createdBy, itemId: canonical.id, kind: 'comment',
      body: `${actorEmail()} merged ${dupRef} into ${canRef}`,
    }]);
  }

  return closed ?? duplicate;
}

// ── Comments / Q&A thread ─────────────────────────────────────────────────────

export async function addComment(
  item: BacklogItem, kind: CommentKind, body: string,
): Promise<BacklogComment> {
  const be = getBackend();
  const comment = await be.addComment({
    itemId: item.id, kind, body: body.trim(),
    userId: actorId(), userEmail: currentUser?.email ?? null,
  });
  const ref = ticketRef(item.number);
  const notifs: AddNotificationRow[] = [];

  if (kind === 'question') {
    // Route the question into the requester's queue.
    await be.updateItem(item.id, { awaitingRequester: true });
    if (item.createdBy && item.createdBy !== actorId()) {
      notifs.push({ userId: item.createdBy, itemId: item.id, kind: 'question',
        body: `${actorEmail()} asked a question on ${ref}` });
    }
  } else if (kind === 'answer') {
    await be.updateItem(item.id, { awaitingRequester: false });
    if (item.assigneeId && item.assigneeId !== actorId()) {
      notifs.push({ userId: item.assigneeId, itemId: item.id, kind: 'answer',
        body: `${actorEmail()} answered on ${ref}` });
    }
  } else {
    for (const r of recipients(item)) {
      notifs.push({ userId: r.id, itemId: item.id, kind: 'comment',
        body: `${actorEmail()} commented on ${ref}` });
    }
  }
  await be.addNotifications(notifs);
  return comment;
}

/**
 * Add a comment authored by a virtual-team persona (the Virtual Team feature). The
 * comment is tagged in `meta` and carries the persona's virtual email so the UI can
 * render it as the persona rather than the signed-in user. Questions still route to the
 * requester's queue + notify them, exactly like a human-asked question.
 */
export async function addPersonaComment(
  item: BacklogItem, kind: CommentKind, body: string,
  persona: { id: string; name: string; email: string },
  extraMeta?: Record<string, unknown>,
): Promise<BacklogComment> {
  const be = getBackend();
  const comment = await be.addComment({
    itemId: item.id, kind, body: body.trim(),
    meta: { persona: persona.id, personaName: persona.name, ...(extraMeta ?? {}) },
    userId: actorId(), userEmail: persona.email,
  });
  if (kind === 'question') {
    await be.updateItem(item.id, { awaitingRequester: true });
    if (item.createdBy && item.createdBy !== actorId()) {
      await be.addNotifications([{
        userId: item.createdBy, itemId: item.id, kind: 'question',
        body: `${persona.name} asked a question on ${ticketRef(item.number)}`,
      }]);
    }
  }
  return comment;
}

/**
 * Answer a specific question comment inline (e.g. a multiple-choice answer to a PO
 * question). Links to the question via `meta.answersCommentId`, records the chosen
 * option, clears the awaiting-answer flag, and notifies the assignee.
 */
export async function answerQuestion(
  item: BacklogItem, questionId: string, body: string, choice?: string,
): Promise<BacklogComment> {
  const be = getBackend();
  const comment = await be.addComment({
    itemId: item.id, kind: 'answer', body: body.trim(),
    meta: { answersCommentId: questionId, ...(choice ? { choice } : {}) },
    userId: actorId(), userEmail: currentUser?.email ?? null,
  });
  await be.updateItem(item.id, { awaitingRequester: false });
  if (item.assigneeId && item.assigneeId !== actorId()) {
    await be.addNotifications([{
      userId: item.assigneeId, itemId: item.id, kind: 'answer',
      body: `${actorEmail()} answered on ${ticketRef(item.number)}`,
    }]);
  }
  return comment;
}

// ── Votes ─────────────────────────────────────────────────────────────────

export async function setVote(item: BacklogItem, voted: boolean): Promise<void> {
  const be = getBackend();
  await be.setVote(item.id, voted);
  if (voted && item.createdBy && item.createdBy !== actorId()) {
    await be.addNotifications([{ userId: item.createdBy, itemId: item.id, kind: 'vote',
      body: `${actorEmail()} upvoted ${ticketRef(item.number)}` }]);
  }
}

export async function removeItem(id: string): Promise<void> { return getBackend().removeItem(id); }

export type { NotificationKind };
