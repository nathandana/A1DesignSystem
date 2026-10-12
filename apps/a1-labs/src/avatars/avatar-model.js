// Pure helpers for the Labs avatar study: everything derived from a name is
// deterministic, so the same person always gets the same initials, tint and
// pattern across sessions, sizes and pages.

export const AVATAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl']
export const AVATAR_RADII = ['none', 'sm', 'md', 'lg', 'xl', 'full']
export const AVATAR_CONTENT = ['initials', 'image', 'icon', 'pattern']
export const AVATAR_COLORS = ['neutral', 'tinted', 'accent']
export const AVATAR_BORDERS = ['none', 'hairline', 'ring', 'gradient']
export const AVATAR_STATUSES = ['online', 'away', 'busy', 'offline']
// Tinted palette: each tone pairs a semantic status surface with its text colour.
export const AVATAR_TINTS = ['info', 'success', 'warn', 'error']

export const STATUS_LABELS = { online: 'Online', away: 'Away', busy: 'Busy', offline: 'Offline' }

// Initials from the first and last words; one letter when count is 1.
// Array.from keeps surrogate pairs (e.g. emoji or astral letters) intact.
export function initialsFor(name, count = 2) {
  const words = String(name ?? '').trim().split(/\s+/u).filter(Boolean)
  if (!words.length) return ''
  const first = Array.from(words[0])[0] ?? ''
  if (count === 1 || words.length === 1) return first
  return first + (Array.from(words[words.length - 1])[0] ?? '')
}

// FNV-1a: small, fast and stable across platforms.
export function hashName(name) {
  let hash = 0x811c9dc5
  for (const char of String(name ?? '').trim().toLocaleLowerCase()) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash >>> 0
}

export const tintFor = name => AVATAR_TINTS[hashName(name) % AVATAR_TINTS.length]

// A symmetric identicon: the left half (plus centre column) comes from the hash
// bits and is mirrored to the right. Always fills at least one cell per row so
// the pattern never renders empty.
export function patternFor(name, cells = 5) {
  const half = Math.ceil(cells / 2)
  let bits = hashName(name) || 1
  const rows = []
  for (let row = 0; row < cells; row++) {
    const left = []
    for (let col = 0; col < half; col++) {
      left.push((bits & 1) === 1)
      bits = (bits >>> 1) || hashName(`${name}:${row}:${col}`)
    }
    if (!left.some(Boolean)) left[row % half] = true
    const right = left.slice(0, cells - half).reverse()
    rows.push([...left, ...right])
  }
  return rows
}

// Accessible name: the person, plus their status when shown.
export const avatarLabel = (name, status) =>
  [String(name ?? '').trim(), status && STATUS_LABELS[status]].filter(Boolean).join(', ')
