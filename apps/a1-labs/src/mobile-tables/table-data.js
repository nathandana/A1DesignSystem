// Simple and complex inventory datasets for the mobile data table experiment,
// built from the shared Labs inventory so they are the same every time.
import { buildInventory } from '../sample-data/inventory.js'
export { stockStatus, STATUS_TONES } from '../sample-data/inventory.js'
const MONTHS = ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

/** AP-style short date, such as "Oct. 3, 2026". */
export const apDate = date => `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

/**
 * Columns: { key, label, type?, align?, format?, inline? } — `type` matches A1
 * DataTable column types; `format` turns a value into display text; `inline`
 * phrases it for a compact one-line summary ("28 in stock").
 */
export const SIMPLE_COLUMNS = [
  { key: 'name', label: 'Product' },
  { key: 'stock', label: 'In stock', type: 'number', align: 'end', format: String, inline: v => `${v} in stock` },
  { key: 'price', label: 'Price', type: 'currency', align: 'end', format: money.format },
]

export const COMPLEX_COLUMNS = [
  { key: 'name', label: 'Product' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'stock', label: 'In stock', type: 'number', align: 'end', format: String, inline: v => `${v} in stock` },
  { key: 'reorder', label: 'Reorder at', type: 'number', align: 'end', format: String, inline: v => `reorder at ${v}` },
  { key: 'price', label: 'Price', type: 'currency', align: 'end', format: money.format },
  { key: 'cost', label: 'Unit cost', type: 'currency', align: 'end', format: money.format, inline: v => `${money.format(v)} cost` },
  { key: 'margin', label: 'Margin', align: 'end', format: value => `${value}%`, inline: v => `${v}% margin` },
  { key: 'updated', label: 'Last updated', inline: v => `updated ${v}` },
  { key: 'status', label: 'Status', type: 'badge' },
]

/** { simple, complex } datasets of `count` products, each { columns, rows }. */
export function buildDatasets(count = 'small') {
  const products = buildInventory(count)
  const complexRows = products.map(item => ({ ...item, updated: apDate(new Date(`${item.updated}T00:00:00Z`)) }))
  return {
    simple: { columns: SIMPLE_COLUMNS, rows: products.map(({ id, name, stock, price }) => ({ id, name, stock, price })) },
    complex: { columns: COMPLEX_COLUMNS, rows: complexRows },
  }
}

/** A value phrased for a compact summary line. */
export const inlineText = (column, row) => (column.inline ? column.inline(row[column.key]) : cellText(column, row))

/** Display text for a cell. */
export const cellText = (column, row) => (column.format ? column.format(row[column.key]) : String(row[column.key] ?? ''))

/** Rows grouped by `key`, groups in first-appearance order: [{ label, rows }]. */
export function groupRows(rows, key) {
  const groups = new Map()
  for (const row of rows) {
    if (!groups.has(row[key])) groups.set(row[key], [])
    groups.get(row[key]).push(row)
  }
  return [...groups].map(([label, items]) => ({ label, rows: items })).sort((a, b) => a.label.localeCompare(b.label))
}
