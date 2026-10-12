// Data helpers for the bulk actions experiment: removing deleted products from
// the data set and remembering which were deleted (so they stay gone).

/** The data set without the given ids, plus how many were removed. */
export function removeRows(rows, ids, idKey = 'id') {
  const remove = new Set(ids.map(String))
  const remaining = rows.filter(row => !remove.has(String(row[idKey])))
  return { rows: remaining, removed: rows.length - remaining.length }
}

/** Ids already deleted, merged with newly deleted ones (unique, as strings). */
export const mergeDeleted = (previous, ids) => [...new Set([...previous, ...ids].map(String))]

/** Read a saved list of deleted ids; anything unreadable counts as none. */
export function readDeleted(storage, key) {
  try {
    const value = JSON.parse(storage?.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.map(String) : []
  } catch {
    return []
  }
}

/** Save the deleted ids, ignoring storage that is full or unavailable. */
export function writeDeleted(storage, key, ids) {
  try {
    if (ids.length) storage?.setItem(key, JSON.stringify(ids))
    else storage?.removeItem(key)
  } catch {
    // Private browsing or blocked storage: deletions last until the page reloads.
  }
}

// Mirrors A1 DataTable's sort comparison (numbers numerically, everything
// else with a numeric, case-insensitive locale compare; empty values last).
function compareValues(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/**
 * The rows A1 DataTable shows on `page` for a `sort` ({ key, direction } or
 * null) and `pageSize`, so the experiment knows exactly what is on screen.
 */
export function pageRows(rows, sort, page, pageSize) {
  const sorted = sort
    ? [...rows].sort((a, b) => (sort.direction === 'desc' ? -1 : 1) * compareValues(a[sort.key], b[sort.key]))
    : rows
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(Math.max(page, 1), pages)
  return sorted.slice((current - 1) * pageSize, current * pageSize)
}

/**
 * What the "select all" style should offer. 'page' when every row on the page
 * is selected but more exist; 'all' when every row in the data set is
 * selected (and that's more than a page); otherwise null.
 */
export function selectAllState(selectedIds, pageIds, total) {
  const selected = new Set(selectedIds.map(String))
  if (total > pageIds.length && selected.size === total) return 'all'
  if (total > pageIds.length && pageIds.length > 0 && pageIds.every(id => selected.has(String(id)))) return 'page'
  return null
}
