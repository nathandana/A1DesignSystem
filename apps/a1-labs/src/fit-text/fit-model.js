// Line breaking and sizing for fitted type: every line is scaled to fill the
// container's width, so lines with fewer or narrower letters are set larger.

const words = text => text.split(/\s+/).filter(Boolean)

/**
 * Split text into display lines.
 * - 'written': the author's own line breaks.
 * - 'words': one word per line.
 * - 'balanced': `count` lines of roughly equal character length, keeping word order.
 */
export function splitLines(text, mode = 'written', count = 3) {
  if (mode === 'words') return words(text)
  if (mode === 'written') return text.split(/\n+/).map(line => line.trim().replace(/\s+/g, ' ')).filter(Boolean)
  return balance(words(text), count)
}

/** Break words into at most `count` lines whose longest line is as short as possible. */
export function balance(list, count) {
  const lines = Math.max(1, Math.min(count, list.length))
  if (list.length === 0) return []
  const lengths = list.map(word => word.length)
  const span = (from, to) => lengths.slice(from, to).reduce((sum, n) => sum + n, 0) + (to - from - 1)
  // best[i][k]: smallest possible longest line for the first i words in k lines.
  const best = Array.from({ length: list.length + 1 }, () => Array(lines + 1).fill(Infinity))
  const cut = Array.from({ length: list.length + 1 }, () => Array(lines + 1).fill(0))
  best[0][0] = 0
  for (let i = 1; i <= list.length; i++) {
    for (let k = 1; k <= lines; k++) {
      for (let j = k - 1; j < i; j++) {
        const worst = Math.max(best[j][k - 1], span(j, i))
        if (worst < best[i][k]) { best[i][k] = worst; cut[i][k] = j }
      }
    }
  }
  const result = []
  for (let i = list.length, k = lines; k > 0; k--) {
    const j = cut[i][k]
    result.unshift(list.slice(j, i).join(' '))
    i = j
  }
  return result
}

/**
 * Font sizes (px) that make each line fill `available` px.
 * `widths` are the lines' widths when set at `reference` px. 'each' fills every
 * line; 'match' uses one size so the longest line fills the width. Sizes are
 * clamped to [min, max]; a line that would need less than `min` is flagged to wrap.
 * @returns {Array<{ size: number, wraps: boolean }>}
 */
export function fitSizes(widths, available, { reference = 100, min = 0, max = Infinity, mode = 'each' } = {}) {
  const ideal = widths.map(width => (width > 0 ? (reference * available) / width : max))
  const shared = Math.min(...ideal)
  return ideal.map(size => {
    const target = mode === 'match' ? shared : size
    return { size: Math.max(min, Math.min(max, target)), wraps: target < min }
  })
}
