/**
 * Backlog — local "AI" duplicate / similarity finder (no API, no model credits).
 *
 * Mirrors the Virtual Team philosophy (services/backlog/personas): a deterministic,
 * in-browser heuristic that runs offline and online alike, with no calls to a model.
 * Given a target ticket and the rest of the backlog, it ranks the other tickets by
 * textual + structural similarity so the UI can surface "these look like the same thing"
 * and offer to merge them — the two halves of A1-161 "Link Tickets".
 *
 * Method: term-frequency cosine similarity over a tokenised title + description (title
 * terms weighted higher so the headline drives the match), plus small bonuses for a
 * shared scope and a matching type. Cheap, explainable, and reproducible — every match
 * carries the reasons it scored, so the suggestion is never a black box.
 *
 * This is intentionally a self-contained module so a future, smarter matcher (an
 * embedding model behind the Dev Agent server, say) can replace `findSimilar` without
 * touching the store or UI.
 */
import { SCOPE_LABELS, TYPE_LABELS } from './types';
import type { BacklogItem, TicketStatus } from './types';

export interface SimilarMatch {
  item: BacklogItem;
  /** 0–1 similarity score (1 = effectively identical text, scope, and type). */
  score: number;
  /** Short human reasons, e.g. "Shared terms: menu, dropdown" · "Same scope: Component". */
  reasons: string[];
  /** The strongest shared terms (for a compact reason chip). */
  sharedTerms: string[];
}

// Common English + backlog-domain words that carry little signal for matching. Kept
// deliberately small — over-pruning hurts recall more than a few weak terms hurt it.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 'to', 'of', 'in',
  'on', 'at', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its',
  'this', 'that', 'these', 'those', 'with', 'as', 'from', 'into', 'onto', 'over',
  'under', 'out', 'up', 'down', 'off', 'about', 'can', 'cant', 'cannot', 'should',
  'would', 'could', 'will', 'wont', 'do', 'does', 'did', 'not', 'no', 'yes', 'we', 'i',
  'you', 'they', 'he', 'she', 'them', 'our', 'your', 'their', 'my', 'me', 'us', 'add',
  'added', 'adds', 'new', 'use', 'uses', 'using', 'used', 'make', 'makes', 'need',
  'needs', 'want', 'when', 'what', 'which', 'who', 'where', 'how', 'why', 'some', 'any',
  'all', 'one', 'two', 'more', 'ticket', 'tickets', 'feature', 'bug', 'chore', 'please',
  'also', 'etc', 'via', 'per', 'set', 'so', 'just', 'like', 'than', 'too', 'very',
]);

/** Lower-case word tokens (keeps tech tokens like `a11y`, `c++`, `top-header`). */
function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9+#-]*/g) || [])
    .map((t) => t.replace(/^[-+]+|[-+]+$/g, ''))
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/** Term-frequency map; title terms get extra weight so the headline drives the match. */
function termVector(title: string, description: string | null | undefined): Map<string, number> {
  const vec = new Map<string, number>();
  const bump = (tokens: string[], weight: number) => {
    for (const t of tokens) vec.set(t, (vec.get(t) ?? 0) + weight);
  };
  bump(tokenize(title), 3);
  bump(tokenize(description ?? ''), 1);
  return vec;
}

/** Cosine similarity of two TF vectors + the shared terms, ordered by joint weight. */
function cosine(a: Map<string, number>, b: Map<string, number>): { score: number; shared: string[] } {
  let aMag = 0;
  let bMag = 0;
  for (const v of a.values()) aMag += v * v;
  for (const v of b.values()) bMag += v * v;
  if (!aMag || !bMag) return { score: 0, shared: [] };

  // Walk the smaller map for the dot product.
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let dot = 0;
  const shared: { term: string; w: number }[] = [];
  for (const [term, av] of small) {
    const bv = large.get(term);
    if (bv) { dot += av * bv; shared.push({ term, w: av * bv }); }
  }
  shared.sort((x, y) => y.w - x.w);
  return { score: dot / Math.sqrt(aMag * bMag), shared: shared.map((s) => s.term) };
}

/** The fields the finder reads from the target (so it works for an unsaved draft too). */
export type SimilarityTarget = Pick<
  BacklogItem,
  'title' | 'description' | 'type' | 'scopeKind' | 'scopeRef' | 'scopeLabel'
> & { id?: string };

export interface FindSimilarOptions {
  /** Minimum combined score to include a match (0–1). Default 0.16. */
  threshold?: number;
  /** Max matches to return. Default 5. */
  limit?: number;
  /** Statuses to exclude from candidates. Default: the terminal/closed ones. */
  excludeStatuses?: readonly TicketStatus[];
}

const DEFAULT_EXCLUDED: readonly TicketStatus[] = ['duplicate', 'wont_fix'];

/**
 * Rank the backlog by similarity to `target`. Skips the target itself, already-merged
 * tickets, and (by default) closed/terminal ones. Returns the strongest matches first.
 */
export function findSimilar(
  target: SimilarityTarget,
  all: BacklogItem[],
  opts: FindSimilarOptions = {},
): SimilarMatch[] {
  const threshold = opts.threshold ?? 0.16;
  const limit = opts.limit ?? 5;
  const excluded = new Set<TicketStatus>(opts.excludeStatuses ?? DEFAULT_EXCLUDED);

  const targetVec = termVector(target.title, target.description);
  if (targetVec.size === 0) return [];

  const matches: SimilarMatch[] = [];
  for (const item of all) {
    if (target.id && item.id === target.id) continue;
    if (excluded.has(item.status)) continue;
    if (item.duplicateOf) continue; // already merged into something — not a fresh candidate

    const { score: textScore, shared } = cosine(targetVec, termVector(item.title, item.description));

    const reasons: string[] = [];
    let bonus = 0;
    if (target.scopeKind !== 'general' && item.scopeKind === target.scopeKind) {
      if (target.scopeRef && item.scopeRef === target.scopeRef) {
        bonus += 0.12;
        reasons.push(`Same ${SCOPE_LABELS[item.scopeKind].toLowerCase()}: ${item.scopeLabel || item.scopeRef}`);
      } else {
        bonus += 0.05;
        reasons.push(`Same scope: ${SCOPE_LABELS[item.scopeKind]}`);
      }
    }
    if (item.type === target.type) bonus += 0.03;

    const score = Math.min(1, textScore + bonus);
    if (score < threshold) continue;

    if (shared.length) reasons.unshift(`Shared terms: ${shared.slice(0, 4).join(', ')}`);
    if (item.type === target.type) reasons.push(`Both ${TYPE_LABELS[item.type].toLowerCase()}s`);

    matches.push({ item, score, reasons, sharedTerms: shared.slice(0, 4) });
  }

  matches.sort((a, b) => b.score - a.score || b.item.number - a.item.number);
  return matches.slice(0, limit);
}

/** A coarse, human label for a score — used on the similarity badge. */
export function similarityLabel(score: number): string {
  if (score >= 0.6) return 'Very similar';
  if (score >= 0.35) return 'Similar';
  return 'Possibly related';
}

/** Tone for the similarity badge (higher score → stronger signal). */
export function similarityTone(score: number): 'info' | 'warn' | 'neutral' {
  if (score >= 0.6) return 'warn';
  if (score >= 0.35) return 'info';
  return 'neutral';
}

/**
 * Suggest which of two tickets should survive a merge (the canonical "keep"). Prefers the
 * one with more votes (more demand signal), then the older ticket (lower number — the
 * original report).
 */
export function suggestCanonical(a: BacklogItem, b: BacklogItem): BacklogItem {
  if (a.voteCount !== b.voteCount) return a.voteCount > b.voteCount ? a : b;
  return a.number <= b.number ? a : b;
}
