import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Button, ChoiceGroup, DataTable, Inset, Paragraph, Section, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { buildInventory, STATUS_TONES } from '../sample-data/inventory.js'
import { DatasetSize } from '../sample-data/DatasetSize.jsx'
import { DATASET_SIZES, MAX_ITEMS } from '../sample-data/sizes.js'
import { mergeDeleted, pageRows, readDeleted, removeRows, selectAllState, writeDeleted } from './bulk-model.js'
import './bulk-actions.css'

// Labs page: bulk actions on a table of configurable inventory, using A1 Data Table
// selection. The bulk action bar always stays in place: Delete is disabled
// until rows are selected, so nothing moves. Deleted products are removed from
// the data set and stay deleted (in this browser) until Reset. Each style in
// BULK_STYLES changes how deleted rows leave; switches add the "select all
// products" offer and move the page's select-all checkbox into the bar.

const BULK_STYLES = [
  { id: 'persistent', label: 'Always-visible bar', icon: 'table_chart', summary: 'The bar stays above the table and Delete is disabled until rows are selected, so the interface never jumps. Deleted rows disappear at once.' },
  { id: 'animate', label: 'Animate away', icon: 'auto_delete', summary: 'Deleted rows flash red, slide and fade away, then the rows below glide up into the space.' },
]
const SAMPLE = buildInventory(MAX_ITEMS)
const DENSITIES = [{ value: 'compact', label: 'Compact' }, { value: 'default', label: 'Default' }, { value: 'comfortable', label: 'Comfortable' }]
const COLUMNS = [
  { key: 'name', label: 'Product', sortable: true },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'stock', label: 'In stock', type: 'number', align: 'end', sortable: true },
  { key: 'price', label: 'Price', type: 'currency', align: 'end', sortable: true },
  { key: 'status', label: 'Status', type: 'badge', statusMap: STATUS_TONES },
]
const getRowId = row => row.id
const STORAGE_KEY = 'a1-labs-bulk-actions-deleted'
const storage = () => { try { return window.localStorage } catch { return null } }
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const ms = name => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0
// The rows on screen: table rows on wide screens, cards on narrow ones.
const visibleRows = root => [...root.querySelectorAll('.a1-data-table__desktop-row, .a1-data-table__mobile-card')].filter(row => row.getClientRects().length)

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

export function BulkActionsExperiment({ experiment, onOpenSettings }) {
  const [style, setStyle] = useState('persistent')
  const [itemCount, setItemCount] = useState(DATASET_SIZES.medium)
  const [deleted, setDeleted] = useState(() => readDeleted(storage(), STORAGE_KEY))
  const rows = useMemo(() => removeRows(SAMPLE.slice(0, itemCount), deleted).rows, [itemCount, deleted])
  const [selected, setSelected] = useState([])
  const [density, setDensity] = useState('default')
  const [zebra, setZebra] = useState(false)
  const [message, setMessage] = useState('')
  const [leaving, setLeaving] = useState(false)
  const [offerAll, setOfferAll] = useState(true)
  const [barCheckbox, setBarCheckbox] = useState(false)
  const barBoxRef = useRef(null)
  // Sort, page and page size are controlled so the page's products are known.
  const [sort, setSort] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const rootRef = useRef(null)
  const glide = useRef(null)

  // Deleted products leave the data set, and the deletion is remembered.
  useEffect(() => { writeDeleted(storage(), STORAGE_KEY, deleted) }, [deleted])

  const hasSelection = selected.length > 0
  const pageIds = useMemo(() => pageRows(rows, sort, page, pageSize).map(row => String(row.id)), [rows, sort, page, pageSize])
  const scope = offerAll ? selectAllState(selected, pageIds, rows.length) : null
  const selectedSet = useMemo(() => new Set(selected.map(String)), [selected])
  const pageAll = pageIds.length > 0 && pageIds.every(id => selectedSet.has(id))
  const pageSome = pageIds.some(id => selectedSet.has(id))
  // The bar's select-all checkbox acts on the current page, like the header one.
  const togglePage = checked => {
    setSelected(checked ? [...new Set([...selected.map(String), ...pageIds])] : selected.map(String).filter(id => !pageIds.includes(id)))
    setMessage('')
  }
  useEffect(() => { if (barBoxRef.current) barBoxRef.current.indeterminate = pageSome && !pageAll }, [pageSome, pageAll, barCheckbox])
  const selectEverything = () => { setSelected(rows.map(row => String(row.id))); setMessage('') }
  const selectPageOnly = () => { setSelected(pageIds); setMessage('') }
  const commitDelete = ids => {
    const { rows: remaining, removed } = removeRows(rows, ids)
    setDeleted(previous => mergeDeleted(previous, ids))
    setSelected([])
    setLeaving(false)
    setMessage(`${plural(removed, 'product')} deleted. ${plural(remaining.length, 'product')} remain.`)
  }
  const deleteSelected = () => {
    if (!hasSelection || leaving) return
    const ids = selected
    if (style !== 'animate' || reducedMotion()) { commitDelete(ids); return }
    // Animate away: the selected rows play their exit (CSS, keyed by
    // data-leaving), and the positions of the rows that stay are recorded so
    // they can glide up once the deleted rows are gone.
    glide.current = visibleRows(rootRef.current).filter(row => row.dataset.selected !== 'true').map(row => row.getBoundingClientRect().top)
    setLeaving(true)
    setTimeout(() => commitDelete(ids), ms('--component-bulk-actions-leave-duration'))
  }

  // After an animated delete: the rows that stayed slide from where they were
  // (FLIP), and rows pulled in from the next page fade in.
  useLayoutEffect(() => {
    const before = glide.current
    if (!before || leaving) return
    glide.current = null
    const duration = ms('--component-bulk-actions-reflow-duration')
    const easing = getComputedStyle(document.documentElement).getPropertyValue('--semantic-motion-easing-standard').trim() || 'ease'
    visibleRows(rootRef.current).forEach((row, index) => {
      if (index < before.length) {
        const offset = before[index] - row.getBoundingClientRect().top
        if (offset) row.animate([{ transform: `translateY(${offset}px)` }, { transform: 'none' }], { duration, easing })
      } else {
        row.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing })
      }
    })
  }, [rows, leaving])
  const reset = () => { setDeleted([]); setSelected([]); setPage(1); setMessage('') }
  // The status line is announced politely, including the scope of a selection.
  const status = useMemo(() => {
    if (message) return message
    if (scope === 'page') return `All ${pageIds.length} products on this page are selected, out of ${rows.length}.`
    if (scope === 'all') return `All ${rows.length} products are selected.`
    return `${plural(rows.length, 'product')} · ${selected.length} selected`
  }, [message, scope, pageIds.length, rows.length, selected.length])

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <DatasetSize value={itemCount} disabled={leaving} onChange={value => { setItemCount(value); setSelected([]); setPage(1); setMessage('') }} />
        <ChoiceGroup label="Bulk actions" name="bulk-style" columns={1} size="compact" inlineIcon value={style} onChange={setStyle}
          options={BULK_STYLES.map(item => ({ value: item.id, label: item.label, icon: item.icon, subtext: item.summary }))} />
        <Toolbar label="Density">
          <ToolbarGroup aria-label="Density" value={density} onChange={setDensity} showLabels options={DENSITIES} />
        </Toolbar>
        <Switch label="Offer to select all products" checked={offerAll} onChange={setOfferAll} />
        <Switch label="Select-all checkbox in the bar" checked={barCheckbox} onChange={setBarCheckbox} />
        <Switch label="Zebra rows" checked={zebra} onChange={setZebra} />
        <Button variant="secondary" icon="restart_alt" disabled={leaving} onClick={reset}>Reset data</Button>
        <Paragraph size="sm" color="muted">Select rows with their checkboxes, or use the header checkbox to select every row on the current page. Sort and change pages to see how the selection carries over. Deleted products stay deleted in this browser until you reset the data.</Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none">
        <Stack gap={16} className="a1-bulk-lab" ref={rootRef} data-leaving={leaving || undefined} data-bar-checkbox={barCheckbox || undefined}>
          {/* Always in place. Delete uses aria-disabled (not disabled) so it stays
              focusable: after deleting, focus stays on the button instead of being lost. */}
          <div className="a1-data-table-bulk-actions" role="region" aria-label="Bulk actions">
            {barCheckbox ? (
              <label className="a1-bulk-lab__select-page">
                <input ref={barBoxRef} type="checkbox" className="a1-data-table__checkbox" checked={pageAll}
                  aria-label={pageAll ? 'Deselect all products on this page' : 'Select all products on this page'}
                  onChange={event => togglePage(event.target.checked)} />
                <span className="a1-data-table-bulk-actions__count" aria-hidden="true">{selected.length} selected</span>
              </label>
            ) : (
              <span className="a1-data-table-bulk-actions__count">{selected.length} selected</span>
            )}
            <div className="a1-data-table-bulk-actions__controls">
              <Button variant="destructive" size="sm" icon="delete" aria-disabled={!hasSelection || leaving || undefined} onClick={deleteSelected}>Delete selected</Button>
            </div>
            {/* Select all products: make the scope of a whole-page selection clear. */}
            {scope === 'page' && (
              <span className="a1-bulk-lab__scope">
                <Paragraph as="span" size="sm">All {pageIds.length} products on this page are selected.</Paragraph>
                <Button variant="tertiary" size="sm" icon="select_all" onClick={selectEverything}>Select all {rows.length} products</Button>
              </span>
            )}
            {scope === 'all' && (
              <span className="a1-bulk-lab__scope">
                <Paragraph as="span" size="sm">All {rows.length} products are selected.</Paragraph>
                <Button variant="tertiary" size="sm" icon="check_box" onClick={selectPageOnly}>Select only this page</Button>
              </span>
            )}
          </div>
          <DataTable caption="Inventory" columns={COLUMNS} rows={rows} getRowId={getRowId}
            size={density} zebra={zebra} pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={[10, 25, 50]}
            page={page} onPageChange={setPage} sort={sort} onSortChange={setSort}
            selectable selectedRowIds={selected} onSelectedRowIdsChange={ids => { if (!leaving) { setSelected(ids); setMessage('') } }}
            emptyTitle="No products" emptyDescription="Reset the data to bring the products back." emptyIcon="inventory_2" />
          <Paragraph size="sm" color="muted" role="status">{status}</Paragraph>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
