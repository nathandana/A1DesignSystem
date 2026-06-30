/**
 * Virtual Product Owner — a deterministic, local stand-in for a PO's judgement (no API).
 *
 * Its job is business value: it reads each ticket's text/type/scope/votes (and the rest of
 * the backlog for context) and sets type, priority, and size from impact + urgency signals, then
 * offers a *bank* of clarifying questions a PO would ask. The runner picks the most useful
 * ones the PO hasn't already asked (each question carries a stable `key`), so it varies its
 * questions and never repeats one you've answered. All heuristic — fully offline.
 */
import { SCOPE_LABELS, isTerminal, ticketRef } from '../types';
import type { BacklogItem, Complexity, Priority } from '../types';
import type { Persona, PersonaContext, PersonaQuestion, PersonaVerdict } from './types';

// Signal vocabularies — the PO's "judgement" encoded as keyword matches.
const RX = {
  critical: /\b(security|vulnerab\w*|data[- ]?loss|cannot save|can.?t save|crash\w*|exploit|leak|broken build|blocker|blocking)\b/,
  highValue: /\b(bug|broken|breaks?|fix|fails?|failure|error|regression|wrong|incorrect|stale|misleading|missing|accessib\w*|a11y|wcag|contrast)\b/,
  userFacing: /\b(user|users|customer|onboard\w*|sign[- ]?up|sign[- ]?in|log[- ]?in|checkout|form|navigat\w*|prototype|publish|share|home page|landing|mobile|responsive)\b/,
  lowValue: /\b(someday|nice[- ]to[- ]have|cosmetic|polish|experiment\w*|research|feasibilit\w*|explore|maybe|eventually|stretch|future idea|idea space)\b/,
  large: /\b(epic|rewrite|re-?architect\w*|migrat\w*|pipeline|architecture|crdt|multiplayer|real[- ]?time|infrastructure|framework|engine|swift\w*|native|kit|platform|end[- ]to[- ]end|across (the|all))\b/,
  small: /\b(tweak|rename|typo|wording|copy|label|toggle|single|one[- ]line|small|minor|hide|show|swap|bump)\b/,
  acceptance: /\b(should|acceptance|done when|definition of done|expected|criteria)\b/,
  value: /\b(so that|in order to|because|business value|impact|conversion|revenue|retention|drop[- ]?off|friction|users? (can|need|want))\b/,
  persona: /\b(user|users|customer|requester|developer|designer|maintainer|admin|agent|team)\b/,
  metric: /\b(metric|measure|track|signal|kpi|conversion|adoption|usage|completion|success rate)\b/,
};

const BROAD_SCOPES = new Set(['foundation', 'component', 'package', 'app']);

function countMatches(text: string, rx: RegExp): number {
  return (text.match(new RegExp(rx.source, 'gi')) || []).length;
}
function cap(s: string): string { return s.charAt(0).toUpperCase() + s.slice(1); }

/** Another open ticket on the exact same scope target (e.g. the same component) — used to relate work. */
function findRelated(item: BacklogItem, items?: BacklogItem[]): BacklogItem | null {
  if (!items || !item.scopeRef || item.scopeKind === 'general') return null;
  return items.find((o) => o.id !== item.id
    && o.scopeKind === item.scopeKind && o.scopeRef === item.scopeRef
    && !isTerminal(o.status) && o.status !== 'released') || null;
}

// The PO's question bank for a ticket, ordered by usefulness. The runner asks the top few
// the PO hasn't already asked (so it cycles through them as the ticket evolves), never the
// same one twice.
function buildQuestions(item: BacklogItem, text: string, context?: PersonaContext): PersonaQuestion[] {
  const q: PersonaQuestion[] = [];
  const desc = (item.description ?? '').trim();

  // Business value — the headline, as a quick multiple-choice. Asked once.
  if (!RX.value.test(text)) {
    q.push({
      key: 'value',
      text: 'What business value does this deliver — and who feels the pain if we skip it?',
      options: [
        'Drives adoption / reach — more users or usage',
        'Removes user friction / cuts support load',
        'Improves quality, reliability, or accessibility',
        'Strategic — a platform/foundation for later work',
      ],
      allowOther: true,
    });
  }

  // Scope-aware (gives a codebase-flavoured question rather than a generic one).
  if (item.scopeKind === 'component') {
    q.push({ key: 'scope-component', text: 'Which variants, sizes, and states does this affect across the component, and is there an accessibility (keyboard/contrast/ARIA) impact?' });
  } else if (item.scopeKind === 'foundation' || item.scopeKind === 'theme') {
    q.push({ key: 'scope-theme', text: 'Which tokens or themes does this ripple to — do light, accessible, and heritage all need updating?' });
  } else if (item.scopeKind === 'general') {
    q.push({ key: 'scope-narrow', text: 'Which specific surface, page, or component does this actually touch? Pinning it down makes the impact measurable.' });
  }

  // Backlog-aware — relate to overlapping work.
  const related = findRelated(item, context?.items);
  if (related) {
    q.push({ key: 'dependency', text: `This overlaps ${ticketRef(related.number)} ("${related.title}") on the same ${SCOPE_LABELS[item.scopeKind]}. Are they related — should they ship together, or does one block the other?` });
  }

  // Light on detail.
  if (desc.length < 80) {
    q.push({ key: 'detail', text: "This is light on detail — what's the expected behaviour, and what does success look like for the user?" });
  }

  // Who's it for.
  if ((item.type === 'feature' || item.type === 'epic') && !RX.persona.test(text)) {
    q.push({ key: 'users', text: "Who's the primary user here, and what job are they trying to get done?" });
  }

  // Slice a big one.
  if (RX.large.test(text) && !RX.small.test(text)) {
    q.push({ key: 'slice', text: "This looks large — what's the thinnest slice that still ships value, so we can start there?" });
  }

  // Success signal.
  if ((item.type === 'feature' || item.type === 'epic') && !RX.metric.test(text)) {
    q.push({ key: 'success', text: 'How will we know it worked — what behaviour, signal, or metric should move?' });
  }

  // Risk / edge cases.
  if (item.type === 'bug' || RX.large.test(text)) {
    q.push({ key: 'risk', text: "What's the main risk or edge case to watch when building this?" });
  }

  // Acceptance criteria — the catch-all, last.
  if (!RX.acceptance.test(text)) {
    q.push({ key: 'acceptance', text: "Can we pin down the acceptance criteria so we agree when it's done?" });
  }

  return q;
}

export const productOwner: Persona = {
  id: 'product-owner',
  name: 'Virtual Product Owner',
  role: 'Product Owner',
  email: 'product-owner@a1.virtual',
  icon: 'workspace_premium',
  blurb: 'Maximises business value — promotes large work to epics, sets priority and size, and asks varied, scope-aware questions.',
  signature: 'PO review —',
  revision: 2,

  evaluate(item: BacklogItem, context?: PersonaContext): PersonaVerdict | null {
    const text = `${item.title}\n${item.description ?? ''}`.toLowerCase();
    const reasons: string[] = [];

    // ── Priority: impact + urgency ──────────────────────────────────────────
    let priority: Priority;
    if (RX.critical.test(text)) {
      priority = 'p0';
      reasons.push('flags a critical or blocking risk');
    } else {
      let score = 0;
      if (item.type === 'bug') { score += 2; reasons.push('a defect'); }
      if (item.type === 'epic') { score += 1; reasons.push('a strategic epic'); }
      const hv = Math.min(countMatches(text, RX.highValue), 3);
      if (hv) score += hv;
      if (RX.userFacing.test(text)) { score += 1; reasons.push('user-facing'); }
      if (BROAD_SCOPES.has(item.scopeKind)) { score += 1; reasons.push(`broad ${item.scopeKind}-level impact`); }
      const voteBoost = Math.min(Math.floor(item.voteCount / 3), 3);
      if (voteBoost) { score += voteBoost; reasons.push(`${item.voteCount} vote${item.voteCount === 1 ? '' : 's'} of demand`); }
      if (RX.lowValue.test(text)) { score -= 3; reasons.push('low-urgency / exploratory'); }

      priority = score >= 4 ? 'p1' : score >= 1 ? 'p2' : 'p3';
      if (item.type === 'bug' && priority === 'p3') priority = 'p2'; // a defect is at least medium
    }

    // ── Size: rough effort ──────────────────────────────────────────────────
    let sizeScore = 0;
    if (item.type === 'epic') sizeScore += 2;
    sizeScore += countMatches(text, RX.large) * 2;
    sizeScore -= countMatches(text, RX.small) * 2;
    const descLen = (item.description ?? '').length;
    if (descLen > 600) sizeScore += 2; else if (descLen > 300) sizeScore += 1;
    const parts = (text.match(/\band\b|;|\bthen\b|\+/g) || []).length;
    if (parts >= 6) sizeScore += 1;
    if (['app', 'package', 'project'].includes(item.scopeKind)) sizeScore += 1;
    let complexity: Complexity =
      sizeScore >= 4 ? 'xl' : sizeScore >= 2 ? 'l' : sizeScore >= 0 ? 'm' : sizeScore >= -2 ? 's' : 'xs';
    // Respect an existing explicit large estimate, and keep epics large by definition.
    if (item.complexity === 'l' || item.complexity === 'xl') complexity = item.complexity;
    if (item.type === 'epic' && complexity !== 'l' && complexity !== 'xl') complexity = 'l';

    const rationale = reasons.length
      ? `${cap(reasons.slice(0, 3).join(', '))}.`
      : 'Looks reasonably scoped; setting a baseline priority and size.';

    // Return the full ordered question bank; the runner asks the unasked top few.
    const type = item.type === 'feature' && (complexity === 'l' || complexity === 'xl')
      ? 'epic'
      : undefined;

    return { type, priority, complexity, questions: buildQuestions(item, text, context), rationale };
  },
};
