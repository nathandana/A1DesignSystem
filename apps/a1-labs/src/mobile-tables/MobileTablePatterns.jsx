import React, { useId, useState } from 'react'
import { Accordion, Card, DataTable, DefinitionList, Heading, List, ListItem, MessageBadge, Paragraph, SelectField, Stack } from '@gtivr4/a1-design-system-react'
import { STATUS_TONES, cellText, groupRows, inlineText, stockStatus } from './table-data.js'
import './mobile-tables.css'

// Mobile presentations of one dataset ({ columns, rows }). Below the md
// breakpoint the chosen pattern shows; from md up, every pattern shows the
// standard A1 Data Table. Both are rendered and CSS shows the right one, so
// the switch follows the (previewed) viewport like a real device.

export const MOBILE_PATTERNS = [
  { id: 'cards', label: 'Cards', icon: 'view_agenda', summary: 'Fields on individual cards' },
  { id: 'compact', label: 'Compact list', icon: 'view_list', summary: 'Values in divided rows' },
  { id: 'compact-labels', label: 'Compact list with labels', icon: 'view_list', summary: 'Labels beside each value' },
  { id: 'compact-legend', label: 'Compact list with legend', icon: 'view_list', summary: 'Field names above rows' },
  { id: 'scroll', label: 'Scrolling table', icon: 'swap_horiz', summary: 'Horizontal column scrolling' },
  { id: 'frozen', label: 'Frozen first column', icon: 'view_column', summary: 'Product stays visible' },
  { id: 'expand', label: 'Expandable rows', icon: 'unfold_more', summary: 'Details on demand' },
  { id: 'pick', label: 'Pick a column', icon: 'tune', summary: 'Choose one detail' },
  { id: 'grouped', label: 'Grouped', icon: 'segment', summary: 'Sticky category headings' },
]

const PAGE_SIZE = 10
const getRowId = row => row.id
const statusBadge = value => <MessageBadge status={STATUS_TONES[value] ?? 'neutral'} subtle size="sm" icon={null}>{value}</MessageBadge>

/** A1 DataTable columns for a dataset's columns. */
export const toTableColumns = (columns, sortable = true) => columns.map(column => ({
  key: column.key,
  label: column.label,
  type: column.type,
  align: column.align,
  sortable: sortable && column.type !== 'badge',
  statusMap: column.type === 'badge' ? STATUS_TONES : undefined,
  renderCell: column.format && !column.type ? ({ value }) => column.format(value) : undefined,
}))

// Name and price lead in all compact variants. Labels and legend come from
// the same column definitions as the values, including the derived stock status.
function compactFields(columns, omit) {
  const name = columns.find(column => column.key === 'name')
  const price = columns.find(column => column.key === 'price')
  const rest = columns.filter(column => !['name', 'price', 'status', omit].includes(column.key))
  return [name, columns.find(column => column.key === 'status') ?? { key: 'status', label: 'Status' }, price, ...rest].filter(Boolean)
}

function CompactItem({ columns, row, omit, treatment = 'plain', fields }) {
  const price = columns.find(column => column.key === 'price')
  const rest = columns.filter(column => !['name', 'price', 'status', omit].includes(column.key))
  const status = row.status ?? stockStatus(row.stock)
  const prefix = key => {
    const index = fields.findIndex(column => column.key === key)
    const label = fields[index]?.label
    if (treatment === 'labels') return <strong>{label}: </strong>
    if (treatment === 'legend') return <span className="a1-sr-only">{label}: </span>
    return null
  }
  return (
    <Stack gap={4}>
      <Stack direction="row" justify="between" align="baseline" gap={12} wrap>
        <Stack direction="row" align="center" gap={8} wrap>
          <Paragraph size="md">{prefix('name')}<strong>{row.name}</strong></Paragraph>
          {treatment === 'plain' ? statusBadge(status) : <Stack direction="row" align="center" gap={4}>
            <Paragraph as="span" size="sm" color="muted">{prefix('status')}</Paragraph>{statusBadge(status)}
          </Stack>}
        </Stack>
        {price && <Paragraph size="md">{prefix('price')}{cellText(price, row)}</Paragraph>}
      </Stack>
      <Paragraph size="sm" color="muted">{rest.map((column, index) => <React.Fragment key={column.key}>
        {index > 0 && ' · '}{prefix(column.key)}{treatment === 'plain' ? inlineText(column, row) : cellText(column, row)}
      </React.Fragment>)}</Paragraph>
    </Stack>
  )
}

function CompactList({ columns, rows, label, omit, treatment = 'plain' }) {
  const legendId = useId()
  const fields = compactFields(columns, omit)
  return (
    <Stack gap={12}>
      {treatment === 'legend' && <Card><Stack as="section" aria-labelledby={legendId} gap={8}>
        <Heading as="h2" size="xs" id={legendId}>Field legend</Heading>
        <Paragraph size="sm" color="muted">{fields.map(column => column.label).join(' · ')}</Paragraph>
      </Stack></Card>}
      <List variant="divider" aria-label={label}>
        {rows.map(row => <ListItem key={row.id}><CompactItem columns={columns} row={row} omit={omit} treatment={treatment} fields={fields} /></ListItem>)}
      </List>
    </Stack>
  )
}

function PickColumn({ dataset }) {
  const choices = dataset.columns.slice(1)
  const [key, setKey] = useState(choices.find(column => column.key === 'price')?.key ?? choices[0].key)
  const chosen = choices.find(column => column.key === key)
  return (
    <Stack gap={12}>
      <SelectField label="Show column" size="compact" value={key} onChange={event => setKey(event.target.value)}
        options={choices.map(column => ({ value: column.key, label: column.label }))} />
      <DataTable caption="Inventory" columns={toTableColumns([dataset.columns[0], chosen])} rows={dataset.rows}
        getRowId={getRowId} mobileLayout="table" pageSize={PAGE_SIZE} />
    </Stack>
  )
}

function MobilePattern({ pattern, dataset }) {
  const { columns, rows } = dataset
  switch (pattern) {
    case 'cards':
      return <DataTable caption="Inventory" columns={toTableColumns(columns)} rows={rows} getRowId={getRowId} mobileLayout="cards" pageSize={PAGE_SIZE} />
    case 'compact':
      return <CompactList columns={columns} rows={rows} label="Inventory" />
    case 'compact-labels':
      return <CompactList columns={columns} rows={rows} label="Inventory" treatment="labels" />
    case 'compact-legend':
      return <CompactList columns={columns} rows={rows} label="Inventory" treatment="legend" />
    case 'scroll':
      return <DataTable caption="Inventory" columns={toTableColumns(columns)} rows={rows} getRowId={getRowId} mobileLayout="table" scrollable pageSize={PAGE_SIZE} />
    case 'frozen':
      return <DataTable className="a1-mt-frozen" caption="Inventory" columns={toTableColumns(columns)} rows={rows} getRowId={getRowId} mobileLayout="table" scrollable pageSize={PAGE_SIZE} />
    case 'expand':
      return (
        <div>
          {rows.map(row => {
            const price = columns.find(column => column.key === 'price')
            const status = row.status ?? stockStatus(row.stock)
            return (
              <Accordion key={row.id} label={row.name} subtext={`${cellText(price, row)} · ${status}`} size="sm" divider>
                <DefinitionList size="sm" direction="row" labelWidth="fixed"
                  items={columns.slice(1).map(column => ({ label: column.label, value: column.type === 'badge' ? statusBadge(row[column.key]) : cellText(column, row) }))} />
              </Accordion>
            )
          })}
        </div>
      )
    case 'pick':
      return <PickColumn dataset={dataset} />
    case 'grouped': {
      const key = columns.some(column => column.key === 'category') ? 'category' : 'status'
      const groups = groupRows(key === 'status' ? rows.map(row => ({ ...row, status: stockStatus(row.stock) })) : rows, key)
      return (
        <Stack gap={16}>
          {groups.map(group => (
            <section key={group.label} className="a1-mt-group" aria-labelledby={`group-${group.label}`}>
              <Heading as="h3" size="xs" id={`group-${group.label}`} className="a1-mt-group__heading">{group.label} ({group.rows.length})</Heading>
              <CompactList columns={columns} rows={group.rows} label={group.label} omit={key} />
            </section>
          ))}
        </Stack>
      )
    }
    default:
      return null
  }
}

/** The chosen mobile pattern below md; the standard A1 Data Table from md up. */
export function ResponsiveInventory({ pattern, dataset }) {
  return (
    <>
      <div className="a1-mt-narrow"><MobilePattern pattern={pattern} dataset={dataset} /></div>
      <div className="a1-mt-wide">
        <DataTable caption="Inventory" columns={toTableColumns(dataset.columns)} rows={dataset.rows} getRowId={getRowId} pageSize={PAGE_SIZE} />
      </div>
    </>
  )
}
