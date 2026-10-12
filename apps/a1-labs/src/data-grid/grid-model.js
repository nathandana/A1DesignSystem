// Data helpers for the data grid experiment: sorting, number checks on edit,
// totals and a count of edited cells. react-data-grid shows rows but leaves
// sorting and validation to the app.

/** Sorted copy of `rows` by react-data-grid `sortColumns` ({ columnKey, direction }[]), first column first. */
export function sortRows(rows, sortColumns, numericKeys = []) {
  if (!sortColumns.length) return rows
  return [...rows].sort((a, b) => {
    for (const { columnKey, direction } of sortColumns) {
      const x = a[columnKey]
      const y = b[columnKey]
      const order = numericKeys.includes(columnKey) ? Number(x) - Number(y) : String(x).localeCompare(String(y), undefined, { sensitivity: 'base' })
      if (order !== 0) return direction === 'ASC' ? order : -order
    }
    return 0
  })
}

/**
 * Accept edited rows, turning numeric columns back into numbers. A value that
 * isn't a number (or is negative) keeps its previous value and is reported.
 * Rows keep their original order, even when they were edited while sorted.
 * @returns {{ rows: object[], rejected: Array<{ id: unknown, key: string, value: string }> }}
 */
export function acceptEdits(previous, edited, numericKeys, idKey = 'id') {
  const after = new Map(edited.map(row => [row[idKey], row]))
  const rejected = []
  const rows = previous.map(old => {
    const row = after.get(old[idKey]) ?? old
    const next = { ...row }
    for (const key of numericKeys) {
      if (next[key] === old[key]) continue
      const text = String(next[key]).trim().replace(/[$,\s]/g, '')
      const value = Number(text)
      if (text === '' || !Number.isFinite(value) || value < 0) {
        rejected.push({ id: row[idKey], key, value: String(next[key]) })
        next[key] = old[key]
      } else next[key] = value
    }
    return next
  })
  return { rows, rejected }
}

/** Totals for numeric columns, plus the row count. */
export function totals(rows, numericKeys) {
  return Object.fromEntries([['count', rows.length], ...numericKeys.map(key => [key, rows.reduce((sum, row) => sum + Number(row[key] || 0), 0)])])
}

/** How many cells differ from the original data (rows matched by id). */
export function changedCells(original, current, idKey = 'id') {
  const before = new Map(original.map(row => [row[idKey], row]))
  let count = 0
  for (const row of current) {
    const old = before.get(row[idKey])
    if (!old) continue
    for (const key of Object.keys(row)) if (key !== idKey && row[key] !== old[key]) count += 1
  }
  return count
}
