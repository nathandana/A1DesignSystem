import { useEffect, useState } from 'react'
import {
  Accordion,
  Button,
  Code,
  DataTable,
  NumberField,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { FieldState } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'

// Density as icons: responsive (auto) plus the three density steps.
const SIZE_OPTIONS = [
  { value: 'responsive', label: 'Responsive', icon: 'width' },
  { value: 'compact', label: 'Compact', icon: 'density_small' },
  { value: 'default', label: 'Default', icon: 'density_medium' },
  { value: 'comfortable', label: 'Comfortable', icon: 'density_large' },
]

const MOBILE_LAYOUT_OPTIONS = [
  { value: 'cards', label: 'Cards', icon: 'view_agenda' },
  { value: 'table', label: 'Table', icon: 'table_chart' },
]

const COLUMN_COMPONENT_OPTIONS = [
  { value: 'text', label: 'Text', icon: 'short_text' },
  { value: 'badge', label: 'Badge', icon: 'sell' },
  { value: 'link', label: 'Link', icon: 'link' },
  { value: 'actions', label: 'Actions', icon: 'more_horiz' },
  { value: 'avatar', label: 'Avatar', icon: 'account_circle' },
  { value: 'date', label: 'Date', icon: 'calendar_month' },
  { value: 'number', label: 'Number', icon: 'tag' },
  { value: 'currency', label: 'Currency', icon: 'attach_money' },
  { value: 'slot', label: 'Slot', icon: 'view_column' },
]

const COLUMN_COMPONENT_ICONS = COLUMN_COMPONENT_OPTIONS.reduce((map, option) => {
  map[option.value] = option.icon
  return map
}, {})

function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}...` : text
}

const STATUS_MAP = {
  Active:   'success',
  Pending:  'warn',
  Draft:    'neutral',
  Archived: 'neutral',
}

const DEFAULT_COLUMNS = [
  { key: 'name',   label: 'Name',   component: 'text',   sortable: true,  filterable: false, searchable: true,  editable: true },
  { key: 'role',   label: 'Role',   component: 'text',   sortable: false, filterable: true,  searchable: true,  editable: true },
  { key: 'status', label: 'Status', component: 'badge',  sortable: false, filterable: true,  searchable: false, editable: false },
  { key: 'joined', label: 'Joined', component: 'date',   sortable: true,  filterable: false, searchable: false, editable: false },
]

const SAMPLE_ROWS = [
  { id:  '1', name: 'Alex Rivera',    role: 'Design Lead',      status: 'Active',   joined: 'Mar 14, 2023' },
  { id:  '2', name: 'Sam Chen',       role: 'Engineer',         status: 'Active',   joined: 'Jul 01, 2023' },
  { id:  '3', name: 'Jordan Kim',     role: 'Product Manager',  status: 'Pending',  joined: 'Jan 20, 2024' },
  { id:  '4', name: 'Morgan Ellis',   role: 'Engineer',         status: 'Draft',    joined: 'Apr 08, 2024' },
  { id:  '5', name: 'Casey Flores',   role: 'Design Lead',      status: 'Archived', joined: 'Nov 03, 2022' },
  { id:  '6', name: 'Taylor Nguyen',  role: 'Engineering Lead', status: 'Active',   joined: 'Jun 15, 2022' },
  { id:  '7', name: 'Riley Park',     role: 'Designer',         status: 'Active',   joined: 'Sep 22, 2023' },
  { id:  '8', name: 'Avery Santos',   role: 'Product Manager',  status: 'Active',   joined: 'Dec 05, 2021' },
  { id:  '9', name: 'Quinn Okafor',   role: 'Engineer',         status: 'Pending',  joined: 'Jun 10, 2024' },
  { id: '10', name: 'Skyler Patel',   role: 'Designer',         status: 'Draft',    joined: 'Mar 27, 2024' },
  { id: '11', name: 'Drew Martínez',  role: 'Engineering Lead', status: 'Active',   joined: 'Aug 30, 2021' },
  { id: '12', name: 'Reese Johnson',  role: 'Product Manager',  status: 'Archived', joined: 'Apr 18, 2020' },
  { id: '13', name: 'Emery Wallace',  role: 'Designer',         status: 'Active',   joined: 'Nov 07, 2023' },
  { id: '14', name: 'Blair Osei',     role: 'Engineer',         status: 'Pending',  joined: 'Jan 14, 2025' },
  { id: '15', name: 'Finley Tanaka',  role: 'Design Lead',      status: 'Active',   joined: 'Feb 09, 2022' },
]

function resolvedSize(configSize) {
  return configSize === 'responsive' ? undefined : configSize
}

function parsePageSizeOptions(value) {
  const options = String(value ?? '')
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item) && item > 0)

  return options.length > 0 ? [...new Set(options)] : [3, 5, 10]
}

function normalizeColumns(config) {
  const source = Array.isArray(config.columns) && config.columns.length > 0 ? config.columns : DEFAULT_COLUMNS
  return source.map((column) => ({
    key: column.key,
    label: column.label || column.key,
    component: column.component || column.type || 'text',
    sortable: !!column.sortable,
    filterable: !!column.filterable,
    searchable: !!column.searchable,
    editable: !!column.editable,
  }))
}

function canInlineEdit(column) {
  return ['text', 'number', 'currency', 'date', 'slot'].includes(column.component)
}

function dataTableType(column) {
  if (column.component === 'slot') return 'text'
  return column.component === 'text' ? 'text' : column.component
}

function buildColumns(config) {
  return normalizeColumns(config).map((column) => ({
    key: column.key,
    label: column.label,
    type: dataTableType(column),
    sortable: !!config.sortable && column.sortable,
    filterable: !!config.showFilters && column.filterable,
    searchable: !!config.showSearch && column.searchable,
    editable: column.editable && canInlineEdit(column),
    statusMap: column.component === 'badge' ? STATUS_MAP : undefined,
    currencySymbol: column.component === 'currency' ? '$' : undefined,
    renderCell: column.component === 'slot'
      ? ({ value }) => <strong>{value}</strong>
      : undefined,
  }))
}

function buildPreviewRows(rows, columns) {
  return rows.map((row, index) => {
    const next = { ...row }
    columns.forEach((column) => {
      if (column.component === 'link') {
        next[column.key] = { href: '#', label: String(row[column.key] ?? column.label) }
      } else if (column.component === 'actions') {
        next[column.key] = [{ label: 'Open', icon: 'open_in_new' }]
      } else if (column.component === 'number') {
        next[column.key] = Number.isFinite(Number(row[column.key])) ? Number(row[column.key]) : index + 1
      } else if (column.component === 'currency') {
        next[column.key] = Number.isFinite(Number(row[column.key])) ? Number(row[column.key]) : (index + 1) * 1200
      } else if (column.component === 'avatar') {
        next[column.key] = row[column.key] ?? row.name
      }
    })
    return next
  })
}

function moveItem(items, fromIndex, toIndex) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= items.length) return items
  const next = [...items]
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return next
}

function nextColumnKey(columns) {
  const usedKeys = new Set(columns.map((column) => column.key))
  let index = columns.length + 1
  let key = `column${index}`

  while (usedKeys.has(key)) {
    index += 1
    key = `column${index}`
  }

  return key
}

function createColumn(columns) {
  return {
    key: nextColumnKey(columns),
    label: `Column ${columns.length + 1}`,
    component: 'text',
    sortable: false,
    filterable: false,
    searchable: true,
    editable: true,
  }
}

function buildSnippet(config, utilityClass = '') {
  const pageSizeOptions = parsePageSizeOptions(config.pageSizeOptions)
  const columns = normalizeColumns(config)
  const hasEditableColumns = columns.some((column) => column.editable && canInlineEdit(column))
  const lines = [
    utilityClass ? `  className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    config.size !== 'responsive' ? `  size="${config.size}"` : null,
    config.zebra ? '  zebra' : null,
    config.scrollable ? '  scrollable' : null,
    config.mobileLayout === 'table' ? '  mobileLayout="table"' : null,
    config.sortable ? '  // Columns carry sortable flags' : null,
    config.showSearch ? '  // Columns carry searchable flags' : null,
    config.showFilters ? '  // Columns carry filterable flags' : null,
    config.showPagination && config.showPageSizeMenu
      ? `  defaultPageSize={${config.pageSize ?? 3}}`
      : null,
    config.showPagination && !config.showPageSizeMenu
      ? `  pageSize={${config.pageSize ?? 3}}`
      : null,
    config.showPagination && config.showPageSizeMenu ? `  pageSizeOptions={[${pageSizeOptions.join(', ')}]}` : null,
    config.selectable ? '  selectable' : null,
    config.selectable && config.showDeleteSelected ? '  onDeleteSelected={(rows, ids) => { /* handle delete */ }}' : null,
    hasEditableColumns ? '  onCellChange={(row, columnKey, value) => { /* update row data */ }}' : null,
    config.emptyTitle !== 'No results' ? `  emptyTitle="${config.emptyTitle}"` : null,
    config.emptyDescription ? `  emptyDescription="${config.emptyDescription}"` : null,
    config.emptyIcon !== 'inbox' ? `  emptyIcon="${config.emptyIcon}"` : null,
    `  caption="${config.caption || 'Team members'}"`,
    '  columns={columns}',
    '  rows={rows}',
    '  getRowId={(row) => row.id}',
  ].filter(Boolean).join('\n')

  return `<DataTable\n${lines}\n/>`
}

export function getDefaultConfig() {
  return {
    size: 'responsive',
    zebra: false,
    scrollable: false,
    mobileLayout: 'cards',
    caption: 'Team members',
    sortable: true,
    showSearch: false,
    showFilters: false,
    showPagination: false,
    pageSize: 3,
    showPageSizeMenu: false,
    pageSizeOptions: '3, 5, 10',
    selectable: false,
    showDeleteSelected: false,
    emptyTitle: 'No results',
    emptyDescription: '',
    emptyIcon: 'inbox',
    columns: DEFAULT_COLUMNS,
    rows: null,
  }
}

function normalizeConfigRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null
  return rows
    .filter((row) => row && typeof row === 'object')
    .map((row, index) => ({ id: String(row.id ?? `row-${index + 1}`), ...row }))
}

export const jsonType = 'DataTable'

const JSON_SIZES = ['responsive', 'compact', 'default', 'comfortable']

export function toJson(config) {
  const props = {}
  if (config.caption && config.caption !== 'Team members') props.caption = config.caption
  if (config.size && config.size !== 'responsive') props.size = config.size
  if (config.zebra) props.zebra = true
  props.columns = normalizeColumns(config).map((column) => {
    const entry = { key: column.key, label: column.label }
    if (column.sortable) entry.sortable = true
    if (column.component && column.component !== 'text') entry.component = column.component
    return entry
  })
  const rows = normalizeConfigRows(config.rows) ?? SAMPLE_ROWS
  props.rows = rows.map((row) => ({ ...row }))
  return { node: { id: 'data-table-1', type: 'DataTable', props }, note: null }
}

export function fromJson(node) {
  const config = getDefaultConfig()
  const props = node.props ?? {}
  if (typeof props.caption === 'string' && props.caption) config.caption = props.caption
  if (JSON_SIZES.includes(props.size)) config.size = props.size
  config.zebra = props.zebra === true
  const rawColumns = Array.isArray(props.columns) ? props.columns.filter((column) => column && typeof column === 'object' && column.key) : []
  if (rawColumns.length > 0) {
    config.columns = rawColumns.map((column) => ({
      key: String(column.key),
      label: typeof column.label === 'string' && column.label ? column.label : String(column.key),
      component: typeof column.component === 'string' ? column.component : 'text',
      sortable: column.sortable === true,
      filterable: false,
      searchable: false,
      editable: false,
    }))
    config.sortable = rawColumns.some((column) => column.sortable === true)
  }
  config.rows = normalizeConfigRows(props.rows)
  return config
}

export function Preview({ config, utilityClass = '' }) {
  const columnConfig = normalizeColumns(config)
  const columns = buildColumns(config)
  const pageSizeOptions = parsePageSizeOptions(config.pageSizeOptions)
  const configRows = normalizeConfigRows(config.rows)
  const configRowsKey = JSON.stringify(configRows)
  const [rows, setRows] = useState(configRows ?? SAMPLE_ROWS)
  // JSON-driven rows (handoffs, page definitions) replace the editable sample
  // set whenever the incoming data actually changes.
  useEffect(() => {
    const next = normalizeConfigRows(config.rows)
    if (next) setRows(next)
  }, [configRowsKey]) // eslint-disable-line react-hooks/exhaustive-deps
  const previewRows = buildPreviewRows(rows, columnConfig)

  return (
    <DataTable
      className={utilityClass || undefined}
      caption={config.caption || 'Team members'}
      size={resolvedSize(config.size)}
      zebra={config.zebra}
      scrollable={config.scrollable}
      mobileLayout={config.mobileLayout}
      selectable={config.selectable}
      onDeleteSelected={config.selectable && config.showDeleteSelected ? () => {} : undefined}
      pageSize={config.showPagination && !config.showPageSizeMenu ? (config.pageSize || 3) : undefined}
      defaultPageSize={config.showPagination && config.showPageSizeMenu ? (config.pageSize || 3) : undefined}
      pageSizeOptions={config.showPagination && config.showPageSizeMenu ? pageSizeOptions : undefined}
      onCellChange={(row, columnKey, value) => {
        setRows((current) => current.map((item) => (item.id === row.id ? { ...item, [columnKey]: value } : item)))
      }}
      emptyTitle={config.emptyTitle || 'No results'}
      emptyDescription={config.emptyDescription || undefined}
      emptyIcon={config.emptyIcon || 'inbox'}
      columns={columns}
      rows={previewRows}
      getRowId={(row) => row.id}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const columns = normalizeColumns(config)
  const [selectedColumnKey, setSelectedColumnKey] = useState(columns[0]?.key ?? '')
  const activeColumn = columns.find((column) => column.key === selectedColumnKey) ?? columns[0]

  const setColumns = (nextColumns) => {
    set({ columns: nextColumns })
  }

  const updateColumn = (key, patch) => {
    setColumns(columns.map((column) => (column.key === key ? { ...column, ...patch } : column)))
  }

  const moveColumn = (key, direction) => {
    const index = columns.findIndex((column) => column.key === key)
    const nextIndex = index + direction
    const nextColumns = moveItem(columns, index, nextIndex)
    setColumns(nextColumns)
  }

  const addColumn = () => {
    const column = createColumn(columns)
    setColumns([...columns, column])
    setSelectedColumnKey(column.key)
  }

  const deleteColumn = (key) => {
    if (columns.length <= 1) return

    const index = columns.findIndex((column) => column.key === key)
    const nextColumns = columns.filter((column) => column.key !== key)
    setColumns(nextColumns)

    if (selectedColumnKey === key) {
      const fallbackIndex = Math.max(0, index - 1)
      setSelectedColumnKey(nextColumns[fallbackIndex]?.key ?? nextColumns[0]?.key ?? '')
    }
  }

  return (
    <Stack gap="sm">
      <Accordion label="Table" size="sm" divider defaultOpen>
        <Stack gap="md">
          <Toolbar label="Display">
            <ToolbarGroup
              aria-label="Density"
              value={config.size}
              onChange={(size) => set({ size })}
              options={SIZE_OPTIONS}
            />
            <ToolbarDivider />
            <ToolbarToggle
              icon="table_rows"
              label="Zebra stripes"
              pressed={config.zebra}
              onChange={(zebra) => set({ zebra })}
            />
            <ToolbarToggle
              icon="swap_horiz"
              label="Scrollable"
              pressed={config.scrollable}
              onChange={(scrollable) => set({ scrollable })}
            />
          </Toolbar>

          <Toolbar label="Mobile view">
            <ToolbarGroup
              aria-label="Mobile view"
              value={config.mobileLayout ?? 'cards'}
              onChange={(mobileLayout) => set({ mobileLayout })}
              options={MOBILE_LAYOUT_OPTIONS}
            />
          </Toolbar>

          <FieldState
            label="Features"
            items={[
              { key: 'sortable', label: 'Sortable columns', icon: 'sort', value: config.sortable },
              { key: 'showSearch', label: 'Search', icon: 'search', value: config.showSearch },
              { key: 'showFilters', label: 'Filters', icon: 'filter_alt', value: config.showFilters },
              { key: 'showPagination', label: 'Pagination', icon: 'last_page', value: config.showPagination },
              ...(config.showPagination
                ? [{ key: 'showPageSizeMenu', label: 'Page size menu', icon: 'format_list_numbered', value: config.showPageSizeMenu }]
                : []),
              { key: 'selectable', label: 'Selection', icon: 'checklist', value: config.selectable },
              ...(config.selectable
                ? [{ key: 'showDeleteSelected', label: 'Delete selected', icon: 'delete', value: config.showDeleteSelected }]
                : []),
            ]}
            onChange={set}
          />
          {config.showPagination && (
            <>
              <NumberField
                label="Page size"
                size="compact"
                value={config.pageSize}
                onChange={(e) => set({ pageSize: Math.max(1, parseInt(e.target.value, 10) || 3) })}
              />
              {config.showPageSizeMenu && (
                <TextField
                  label="Page size options"
                  size="compact"
                  value={config.pageSizeOptions}
                  onChange={(e) => set({ pageSizeOptions: e.target.value })}
                />
              )}
            </>
          )}
          <TextField
            label="Caption"
            size="compact"
            value={config.caption}
            onChange={(e) => set({ caption: e.target.value })}
          />
        </Stack>
      </Accordion>

      <Accordion label="Columns" size="sm" divider>
        <Stack gap="md">
          <div className="a1-web-item-tabs">
            <Tabs value={activeColumn?.key} onChange={setSelectedColumnKey} variant="line" size="compact">
              <TabList>
                {columns.map((column, index) => (
                  <Tab
                    key={column.key}
                    value={column.key}
                    icon={COLUMN_COMPONENT_ICONS[column.component] ?? 'view_column'}
                  >
                    {tabLabel(column.label, index, columns.length)}
                  </Tab>
                ))}
              </TabList>
              {columns.map((column, index) => (
                <TabPanel key={column.key} value={column.key}>
                  <Stack gap="md">
                    <Toolbar label="Column order">
                      <ToolbarButton
                        icon="arrow_back"
                        label="Move left"
                        disabled={index <= 0}
                        onClick={() => moveColumn(column.key, -1)}
                      />
                      <ToolbarButton
                        icon="arrow_forward"
                        label="Move right"
                        disabled={index >= columns.length - 1}
                        onClick={() => moveColumn(column.key, 1)}
                      />
                    </Toolbar>
                    <TextField
                      label="Column label"
                      size="compact"
                      value={column.label}
                      onChange={(e) => updateColumn(column.key, { label: e.target.value })}
                    />
                    <Toolbar label="Column component">
                      <ToolbarGroup
                        aria-label="Column component"
                        value={column.component}
                        onChange={(component) => updateColumn(column.key, {
                          component,
                          editable: canInlineEdit({ ...column, component }) ? column.editable : false,
                        })}
                        options={COLUMN_COMPONENT_OPTIONS}
                      />
                    </Toolbar>
                    <FieldState
                      label="Column behavior"
                      items={[
                        { key: 'sortable', label: 'Sortable', icon: 'sort', value: column.sortable },
                        { key: 'filterable', label: 'Filterable', icon: 'filter_alt', value: column.filterable },
                        { key: 'searchable', label: 'Search by', icon: 'search', value: column.searchable },
                        {
                          key: 'editable',
                          label: 'Inline editable',
                          icon: 'edit',
                          value: column.editable && canInlineEdit(column),
                        },
                      ].filter((item) => item.key !== 'editable' || canInlineEdit(column))}
                      onChange={(patch) => updateColumn(column.key, patch)}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      icon="delete"
                      disabled={columns.length <= 1}
                      onClick={() => deleteColumn(column.key)}
                    >
                      Delete column
                    </Button>
                  </Stack>
                </TabPanel>
              ))}
            </Tabs>
          </div>
          <Button variant="secondary" size="sm" icon="add" onClick={addColumn}>
            Add column
          </Button>
        </Stack>
      </Accordion>


      <Accordion label="Empty state" size="sm" divider>
        <Stack gap="md">
          <TextField
            label="Empty title"
            size="compact"
            value={config.emptyTitle}
            onChange={(e) => set({ emptyTitle: e.target.value })}
          />
          <TextField
            label="Empty description"
            size="compact"
            value={config.emptyDescription}
            onChange={(e) => set({ emptyDescription: e.target.value })}
          />
          <IconSelect
            label="Empty icon"
            value={config.emptyIcon}
            onChange={(emptyIcon) => set({ emptyIcon })}
          />
        </Stack>
      </Accordion>
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
