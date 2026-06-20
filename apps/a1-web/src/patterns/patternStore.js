/**
 * Pattern persistence. The seed patterns live in `patterns.js`; edits made in the
 * pattern editor are saved to localStorage, keyed by pattern id. The Patterns
 * page and the editor read the saved copy when present, falling back to the seed.
 */
import { PATTERNS, getPattern as getSeedPattern } from './patterns.js'

const KEY = (id) => `a1-pattern-${id}`
// Ids of user-created patterns (seed patterns live in patterns.js).
const IDS_KEY = 'a1-pattern-ids'

// Change subscription so cloud sync can push when user patterns change.
const patternListeners = new Set()
export function subscribePatterns(fn) { patternListeners.add(fn); return () => patternListeners.delete(fn) }
function notifyPatterns() { for (const fn of patternListeners) fn() }

function loadUserIds() {
  try {
    return JSON.parse(localStorage.getItem(IDS_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveUserIds(ids) {
  try {
    localStorage.setItem(IDS_KEY, JSON.stringify(ids))
  } catch {
    /* ignore quota errors */
  }
}

function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value))
}

/** Load a pattern definition: the saved edit if present, otherwise the seed. */
export function loadPattern(id) {
  try {
    const raw = localStorage.getItem(KEY(id))
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupt storage */
  }
  const seed = getSeedPattern(id)
  return seed ? clone(seed) : null
}

export function savePattern(definition) {
  try {
    localStorage.setItem(KEY(definition.pattern.id), JSON.stringify(definition))
  } catch {
    /* ignore quota errors */
  }
  notifyPatterns()
}

/** Remove a saved edit so the pattern reverts to its seed definition. */
export function resetPattern(id) {
  try {
    localStorage.removeItem(KEY(id))
  } catch {
    /* ignore */
  }
  notifyPatterns()
}

export function hasSavedPattern(id) {
  try {
    return localStorage.getItem(KEY(id)) != null
  } catch {
    return false
  }
}

/** Every pattern — seed patterns first, then user-created ones. */
export function getAllPatterns() {
  const seedIds = PATTERNS.map((p) => p.pattern.id)
  const userIds = loadUserIds().filter((id) => !seedIds.includes(id))
  return [...seedIds, ...userIds].map((id) => loadPattern(id)).filter(Boolean)
}

let counter = 0

/** A fresh, unique pattern id. */
export function newPatternId() {
  return `pattern-${Date.now()}-${(counter++).toString(36)}`
}

/** Persist a pattern definition and register it as a user pattern. */
export function registerPattern(definition) {
  savePattern(definition)
  const ids = loadUserIds()
  if (!ids.includes(definition.pattern.id)) saveUserIds([...ids, definition.pattern.id])
}

/** Restrict a pattern to a set of projects. Empty = available to every project.
 *  Persists as a saved copy (seed patterns become an edited copy). */
export function setPatternProjects(id, projectIds) {
  const def = loadPattern(id)
  if (!def) return
  def.pattern = { ...def.pattern, projectIds: Array.isArray(projectIds) ? projectIds : [] }
  savePattern(def)
}

/** The project ids a pattern is restricted to (empty = every project). */
export function getPatternProjects(id) {
  return loadPattern(id)?.pattern?.projectIds ?? []
}

/** True when a pattern is visible to the given project (unrestricted, or listed). */
export function patternAvailableToProject(meta, projectId) {
  const ids = meta?.projectIds
  if (!ids || ids.length === 0) return true
  if (!projectId) return true // no project context (e.g. standalone pattern editor)
  return ids.includes(projectId)
}

/** True when `id` is a user-created pattern (not a built-in seed). */
export function isUserPattern(id) {
  return loadUserIds().includes(id) && !PATTERNS.some((p) => p.pattern.id === id)
}

/** Duplicate a pattern (seed or user) into a new user pattern; returns it. */
export function duplicatePattern(id) {
  const src = loadPattern(id)
  if (!src) return null
  const copy = clone(src)
  copy.pattern = { ...copy.pattern, id: newPatternId(), name: `${src.pattern.name} copy` }
  registerPattern(copy)
  return copy
}

/** Delete a user pattern (its saved copy + registration). Seed patterns are
 *  left intact — call resetPattern to revert seed edits instead. */
export function deletePattern(id) {
  try { localStorage.removeItem(KEY(id)) } catch { /* ignore */ }
  saveUserIds(loadUserIds().filter((x) => x !== id))
  notifyPatterns()
}

/** Every user-created pattern definition (for cloud backup). */
export function exportUserPatterns() {
  return getAllPatterns().filter((p) => isUserPattern(p?.pattern?.id))
}

/** Restore user patterns from a cloud backup (upsert by id). Returns the count. */
export function importUserPatterns(defs) {
  if (!Array.isArray(defs)) return 0
  let n = 0
  for (const def of defs) {
    if (def?.pattern?.id) { registerPattern(def); n += 1 }
  }
  return n
}

/** Create and persist a blank pattern; returns its definition. */
export function createBlankPattern() {
  const definition = {
    schemaVersion: '1.0',
    pattern: { id: newPatternId(), name: 'New pattern', description: '', category: 'section', nodes: [] },
  }
  registerPattern(definition)
  return definition
}
