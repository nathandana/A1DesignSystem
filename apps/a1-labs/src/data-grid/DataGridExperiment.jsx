import React, { useEffect, useMemo, useState } from 'react'
import { Button, Inset, MessageBadge, Paragraph, Section, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { DataGrid, SelectColumn, textEditor } from '@gtivr4/a1-design-system-react/components/data-grid/DataGrid.jsx'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { acceptEdits, changedCells, sortRows, totals } from './grid-model.js'
import { buildInventory, stockStatus, STATUS_TONES } from '../sample-data/inventory.js'
import { DatasetSize } from '../sample-data/DatasetSize.jsx'
import { DATASET_SIZES, MAX_ITEMS } from '../sample-data/sizes.js'
import './data-grid-lab.css'

// Labs page: A1's experimental DataGrid (react-data-grid themed with A1
// tokens) as an editable configurable inventory, with its features switchable.

const SAMPLE = buildInventory(MAX_ITEMS)
const NUMERIC = ['stock', 'price']
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const count = new Intl.NumberFormat('en-US')

const DENSITIES = [{ value: 'compact', label: 'Compact' }, { value: 'default', label: 'Default' }, { value: 'comfortable', label: 'Comfortable' }]
const LABELS = { name: 'Product', sku: 'SKU', category: 'Category', stock: 'In stock', price: 'Price' }

const rowKeyGetter = row => row.id
const px = name => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return Number.parseFloat(value) * (value.endsWith('rem') ? Number.parseFloat(getComputedStyle(document.documentElement).fontSize) : 1)
}

export function DataGridExperiment({ experiment, onOpenSettings }) {
  const [allRows, setRows] = useState(SAMPLE)
  const [itemCount, setItemCount] = useState(DATASET_SIZES.medium)
  const rows = useMemo(() => allRows.slice(0, itemCount), [allRows, itemCount])
  const [editable, setEditable] = useState(true)
  const [selectable, setSelectable] = useState(true)
  const [sortable, setSortable] = useState(true)
  const [resizable, setResizable] = useState(true)
  const [frozen, setFrozen] = useState(true)
  const [showTotals, setShowTotals] = useState(true)
  const [density, setDensity] = useState('default')
  const [sortColumns, setSortColumns] = useState([])
  const [selected, setSelected] = useState(() => new Set())
  const [message, setMessage] = useState('')
  const [rowHeight, setRowHeight] = useState(40)

  useEffect(() => { setRowHeight(px(`--component-field-${density}-height`) || 40) }, [density])

  const sorted = useMemo(() => sortRows(rows, sortable ? sortColumns : [], NUMERIC), [rows, sortColumns, sortable])
  const sum = useMemo(() => totals(rows, NUMERIC), [rows])
  const stockValue = useMemo(() => rows.reduce((total, row) => total + row.stock * row.price, 0), [rows])
  const edits = changedCells(SAMPLE, rows)

  const columns = useMemo(() => {
    const text = key => ({
      key, name: LABELS[key], resizable, sortable, frozen: key === 'name' && frozen,
      renderEditCell: editable ? textEditor : undefined,
      minWidth: key === 'name' ? 150 : 84,
    })
    const number = (key, format = String, total = true) => ({
      ...text(key), cellClass: 'a1-grid-lab__number', headerCellClass: 'a1-grid-lab__number', summaryCellClass: 'a1-grid-lab__number a1-grid-lab__total',
      renderCell: ({ row }) => format(row[key]),
      // Unit prices don't add up to anything meaningful, so Price has no total.
      renderSummaryCell: () => (total ? format(sum[key]) : null),
    })
    return [
      ...(selectable ? [SelectColumn] : []),
      { ...text('name'), renderSummaryCell: () => <span className="a1-grid-lab__total">{sum.count} products</span> },
      text('sku'),
      text('category'),
      number('stock', count.format),
      number('price', money.format, false),
      {
        key: 'status', name: 'Status', resizable, minWidth: 120,
        renderCell: ({ row }) => {
          const label = stockStatus(row.stock)
          const tone = STATUS_TONES[label]
          return <span className="a1-grid-lab__badge"><MessageBadge status={tone} subtle size="sm" icon={null}>{label}</MessageBadge></span>
        },
      },
      {
        key: 'value', name: 'Stock value', resizable, minWidth: 104,
        cellClass: 'a1-grid-lab__number', headerCellClass: 'a1-grid-lab__number', summaryCellClass: 'a1-grid-lab__number a1-grid-lab__total',
        renderCell: ({ row }) => money.format(row.stock * row.price),
        renderSummaryCell: () => money.format(stockValue),
      },
    ]
  }, [editable, selectable, sortable, resizable, frozen, sum, stockValue])

  const changeRows = edited => {
    const { rows: next, rejected } = acceptEdits(allRows, edited, NUMERIC)
    setRows(next)
    setMessage(rejected.length ? `${LABELS[rejected[0].key]} needs a whole number of 0 or more, so “${rejected[0].value}” wasn’t saved.` : '')
  }
  const reset = () => { setRows(SAMPLE); setSelected(new Set()); setSortColumns([]); setMessage('') }

  const status = [
    selectable && `${selected.size} selected`,
    `${edits} ${edits === 1 ? 'cell' : 'cells'} edited`,
  ].filter(Boolean).join(' · ')

  const configuration = (
    <Inset space={16}>
      <Stack gap={24}>
        <DatasetSize value={itemCount} onChange={value => { setItemCount(value); setSelected(new Set()); setMessage('') }} />
        <Stack gap={12}>
          <Switch label="Edit cells" checked={editable} onChange={setEditable} />
          <Switch label="Row selection" checked={selectable} onChange={setSelectable} />
          <Switch label="Sort by column" checked={sortable} onChange={setSortable} />
          <Switch label="Resize columns" checked={resizable} onChange={setResizable} />
          <Switch label="Freeze product column" checked={frozen} onChange={setFrozen} />
          <Switch label="Totals row" checked={showTotals} onChange={setShowTotals} />
        </Stack>
        <Toolbar label="Density">
          <ToolbarGroup aria-label="Density" value={density} onChange={setDensity} showLabels options={DENSITIES} />
        </Toolbar>
        <Button variant="secondary" icon="restart_alt" onClick={reset}>Reset data</Button>
        <Paragraph size="sm" color="muted">
          The grid is react-data-grid (7.0.0-beta.59) themed with A1 tokens: A1’s experimental DataGrid wrapper, not yet a published component. Double-click a cell or press Enter to edit; arrow keys move between cells.
        </Paragraph>
      </Stack>
    </Inset>
  )

  return (
    <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
      <Section padding="none">
        <Stack gap={16} className="a1-grid-lab">
          <DataGrid aria-label="Inventory" columns={columns} rows={sorted} rowKeyGetter={rowKeyGetter}
            onRowsChange={changeRows} rowHeight={rowHeight} headerRowHeight={rowHeight}
            sortColumns={sortable ? sortColumns : []} onSortColumnsChange={sortable ? setSortColumns : undefined}
            selectedRows={selectable ? selected : undefined} onSelectedRowsChange={selectable ? setSelected : undefined}
            bottomSummaryRows={showTotals ? [{ id: 'totals' }] : undefined}
            style={{ '--a1-grid-row-height': `${rowHeight}px`, '--a1-grid-row-count': sorted.length + 1 + (showTotals ? 1 : 0) }} />
          <Paragraph size="sm" color="muted" role="status">{message || status}</Paragraph>
        </Stack>
      </Section>
    </ExperimentLayout>
  )
}
