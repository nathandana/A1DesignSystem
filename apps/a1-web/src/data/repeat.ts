/**
 * Data repeat config + row selection (A1-94). A node's `repeat` says which dataset
 * to repeat over, how many rows to show (`limit`), and whether to pick them at
 * random (`random`). Random selection is *seeded by the node id* so it's stable
 * across re-renders (it never reshuffles every frame) yet differs per element.
 */
export interface RepeatConfig {
  dataset: string;
  /** Max rows to render. Null/0 = all. */
  limit?: number | null;
  /** Pick the rows at random (seeded, stable) instead of the first N. */
  random?: boolean;
}

/** Accept the legacy string form (`"users"`) or the `{ dataset, limit, random }` object. */
export function normalizeRepeat(repeat: unknown): RepeatConfig | null {
  if (!repeat) return null;
  if (typeof repeat === 'string') return { dataset: repeat };
  if (typeof repeat === 'object') {
    const r = repeat as { dataset?: unknown; limit?: unknown; random?: unknown };
    if (typeof r.dataset === 'string' && r.dataset) {
      return {
        dataset: r.dataset,
        limit: typeof r.limit === 'number' ? r.limit : null,
        random: !!r.random,
      };
    }
  }
  return null;
}

// Deterministic PRNG (mulberry32 over an FNV-1a seed) so a random selection stays
// stable per node across renders rather than reshuffling on every frame.
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The dataset row indices to render for a repeat, in order. Returns indices into
 * the FULL dataset (so bindings resolve to the right row). Random order is seeded
 * by `seedKey` (the node id) so it's stable; `limit` (≥ 1) caps the count.
 */
export function pickRepeatIndices(rowCount: number, cfg: RepeatConfig, seedKey: string): number[] {
  let indices = Array.from({ length: rowCount }, (_, i) => i);
  if (cfg.random) {
    const rnd = mulberry32(hashSeed(`${seedKey}:${rowCount}`));
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rnd() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
  if (cfg.limit != null && cfg.limit >= 1) indices = indices.slice(0, cfg.limit);
  return indices;
}
