/**
 * Persona runner — evaluates open ticket(s) with a persona and (optionally) applies the
 * verdict to the store. `runPersona` sweeps the whole backlog; `runPersonaOnItem` reviews a
 * single ticket (the per-ticket review button). Both share `reviewOne`.
 *
 * Review tag + re-evaluation: each ticket carries a per-persona `reviews[personaId]` record
 * ({ at, sig }). A ticket is skipped when its content signature matches the last review's.
 * When a human edits the title/description/type/scope (or votes change) the signature
 * changes and the persona re-reviews — but it never re-asks a question it has already asked
 * (matched by stable `key` or by text in the thread), so it varies its questions and stops
 * repeating once you've answered.
 *
 * Changelog reconciliation (bulk run): when a `changelog` is supplied, any open ticket whose
 * `A1-<n>` ref appears in it is moved forward — to **Released** under a versioned heading, or
 * **Done** under Unreleased — instead of being re-reviewed.
 */
import { addPersonaComment, listComments, listItems, updateItem } from '../backlogStore';
import {
  COMPLEXITY_LABELS, PRIORITY_LABELS, STATUS_FLOW, STATUS_LABELS,
  isTerminal, reviewSignature, ticketRef,
} from '../types';
import type { BacklogItem, Complexity, Priority, UpdateTicketPatch } from '../types';
import type {
  Persona, PersonaItemOutcome, PersonaQuestion, PersonaRunSummary, PersonaVerdict,
} from './types';
import { shippedStatusByNumber } from './shipped';

const FLOW = STATUS_FLOW as readonly string[];

function composeNote(
  persona: Persona, verdict: PersonaVerdict,
  patch: { priority?: Priority | null; complexity?: Complexity | null }, asked: number,
): string {
  const facts: string[] = [];
  if (patch.priority) facts.push(`priority → ${PRIORITY_LABELS[patch.priority]}`);
  if (patch.complexity) facts.push(`size → ${COMPLEXITY_LABELS[patch.complexity]}`);
  let note = `${persona.signature} ${verdict.rationale}`;
  if (facts.length) note += ` Adjusted ${facts.join(' and ')}.`;
  if (asked) note += ` Asked ${asked} clarifying question${asked > 1 ? 's' : ''} above.`;
  return note;
}

/**
 * Review one ticket with a persona. Returns what it did (or would do, when `dryRun`).
 * Skips a ticket whose content is unchanged since the persona's last review, and never
 * re-asks a question it has already asked.
 */
export async function reviewOne(
  persona: Persona, item: BacklogItem,
  opts: { dryRun?: boolean; items?: BacklogItem[] } = {},
): Promise<PersonaItemOutcome> {
  const dryRun = !!opts.dryRun;
  const base = { acted: false, priorityFrom: item.priority, questions: 0, rationale: '' };

  const sig = reviewSignature(item);
  if (item.reviews?.[persona.id]?.sig === sig) return { ...base, reason: 'unchanged' };

  const verdict = persona.evaluate(item, { items: opts.items ?? [] });
  if (!verdict) return { ...base, reason: 'declined' };

  const patch: UpdateTicketPatch = { reviews: { ...(item.reviews ?? {}), [persona.id]: { at: new Date().toISOString(), sig } } };
  if (verdict.priority && verdict.priority !== item.priority) patch.priority = verdict.priority;
  if (verdict.complexity && verdict.complexity !== item.complexity) patch.complexity = verdict.complexity;

  // Pick questions the persona hasn't already asked (don't repeat — match by stable key or
  // by exact text in the thread). Only when the ticket isn't already awaiting an answer.
  let willAsk: PersonaQuestion[] = [];
  if (verdict.questions.length && !item.awaitingRequester) {
    const comments = await listComments(item.id);
    const askedKeys = new Set<string>();
    const askedTexts = new Set<string>();
    for (const c of comments) {
      if (c.kind !== 'question') continue;
      if (c.meta?.persona === persona.id && typeof c.meta?.questionKey === 'string') askedKeys.add(c.meta.questionKey as string);
      if (c.body) askedTexts.add(c.body.trim());
    }
    willAsk = verdict.questions.filter((q) => !askedKeys.has(q.key) && !askedTexts.has(q.text.trim())).slice(0, 2);
  }
  const acted = 'priority' in patch || 'complexity' in patch || willAsk.length > 0;

  const outcome: PersonaItemOutcome = {
    reason: 'reviewed', acted,
    priority: patch.priority, priorityFrom: item.priority, complexity: patch.complexity,
    questions: willAsk.length, rationale: verdict.rationale,
  };
  if (dryRun) return outcome;

  const current: BacklogItem = (await updateItem(item, patch)) ?? item;
  for (const q of willAsk) {
    const meta: Record<string, unknown> = { questionKey: q.key };
    if (q.options?.length) {
      meta.options = q.options;
      if (q.allowOther ?? true) meta.allowOther = true;
    }
    await addPersonaComment(current, 'question', q.text, persona, meta);
  }
  if (acted) await addPersonaComment(current, 'comment', composeNote(persona, verdict, patch, willAsk.length), persona);
  return outcome;
}

/** Review a single ticket now (no dry-run) — used by the ticket dialog's review button. */
export function runPersonaOnItem(
  persona: Persona, item: BacklogItem, items?: BacklogItem[],
): Promise<PersonaItemOutcome> {
  return reviewOne(persona, item, { dryRun: false, items });
}

/**
 * Status-only cleanup: scan all open tickets against the CHANGELOG and move any that have
 * shipped to their correct status (Done or Released). No priority/size/question changes.
 * Used by the "Check status" button on the Virtual PO card.
 */
export async function runStatusCleanup(
  persona: Persona,
  opts: { dryRun?: boolean; changelog?: string; onProgress?: (done: number, total: number) => void } = {},
): Promise<PersonaRunSummary> {
  const dryRun = !!opts.dryRun
  const items = await listItems()
  const candidates = items.filter((i) => !isTerminal(i.status) && i.status !== 'released')
  const shipped = shippedStatusByNumber(opts.changelog)

  const summary: PersonaRunSummary = {
    persona: persona.id, personaName: persona.name, dryRun,
    total: candidates.length, skipped: 0, reviewed: 0, acted: 0,
    reprioritized: 0, resized: 0, questions: 0, moved: 0, changes: [],
  }

  let done = 0
  for (const item of candidates) {
    done += 1
    opts.onProgress?.(done, candidates.length)

    const shippedTo = shipped.get(item.number)
    if (shippedTo && FLOW.indexOf(shippedTo) > FLOW.indexOf(item.status)) {
      summary.moved += 1
      summary.changes.push({
        ref: ticketRef(item.number), title: item.title,
        priorityFrom: item.priority, statusFrom: item.status, status: shippedTo, questions: 0,
      })
      if (!dryRun) {
        await updateItem(item, { status: shippedTo })
        await addPersonaComment(item, 'comment',
          `${persona.signature} ${ticketRef(item.number)} appears in the CHANGELOG — moved to ${STATUS_LABELS[shippedTo]}.`, persona)
      }
    } else {
      summary.skipped += 1
    }
  }

  return summary
}

export async function runPersona(
  persona: Persona,
  opts: { dryRun?: boolean; changelog?: string; onProgress?: (done: number, total: number) => void } = {},
): Promise<PersonaRunSummary> {
  const dryRun = !!opts.dryRun;
  const items = await listItems();
  const candidates = items.filter((i) => !isTerminal(i.status) && i.status !== 'released');
  const shipped = shippedStatusByNumber(opts.changelog);

  const summary: PersonaRunSummary = {
    persona: persona.id, personaName: persona.name, dryRun,
    total: candidates.length, skipped: 0, reviewed: 0, acted: 0,
    reprioritized: 0, resized: 0, questions: 0, moved: 0, changes: [],
  };

  let done = 0;
  for (const item of candidates) {
    done += 1;
    opts.onProgress?.(done, candidates.length);

    // Reconcile with the CHANGELOG: a ticket that has shipped is moved forward, not reviewed.
    const shippedTo = shipped.get(item.number);
    if (shippedTo && FLOW.indexOf(shippedTo) > FLOW.indexOf(item.status)) {
      summary.moved += 1;
      summary.changes.push({
        ref: ticketRef(item.number), title: item.title,
        priorityFrom: item.priority, statusFrom: item.status, status: shippedTo, questions: 0,
      });
      if (!dryRun) {
        await updateItem(item, { status: shippedTo });
        await addPersonaComment(item, 'comment',
          `${persona.signature} ${ticketRef(item.number)} appears in the CHANGELOG — moved to ${STATUS_LABELS[shippedTo]}.`, persona);
      }
      continue;
    }

    const o = await reviewOne(persona, item, { dryRun, items });
    if (o.reason !== 'reviewed') { summary.skipped += 1; continue; }
    summary.reviewed += 1;
    if (!o.acted) continue;

    summary.acted += 1;
    if (o.priority) summary.reprioritized += 1;
    if (o.complexity) summary.resized += 1;
    summary.questions += o.questions;
    summary.changes.push({
      ref: ticketRef(item.number), title: item.title,
      priorityFrom: o.priorityFrom, priority: o.priority, complexity: o.complexity, questions: o.questions,
    });
  }

  return summary;
}
