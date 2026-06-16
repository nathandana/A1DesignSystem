import {
  ChoiceGroup,
  Code,
  DataTable,
  Divider,
  NumberField,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'
import { IconSelect } from './IconSelect.jsx'

export const bareDisplay = true

const SIZE_OPTIONS = ['responsive', 'comfortable', 'default', 'compact']

const STATUS_MAP = {
  Active:   'success',
  Pending:  'warn',
  Draft:    'neutral',
  Archived: 'neutral',
}

const BASE_COLUMNS = [
  { key: 'name',   label: 'Name',   type: 'text' },
  { key: 'role',   label: 'Role',   type: 'text' },
  { key: 'status', label: 'Status', type: 'badge', statusMap: STATUS_MAP },
  { key: 'joined', label: 'Joined', type: 'date' },
]

const SORTABLE_COLUMNS = BASE_COLUMNS.map((col) =>
  col.key === 'name' || col.key === 'joined' ? { ...col, sortable: true } : col
)

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

const STATUS_FILTER = {
  key: 'status',
  label: 'Status',
  type: 'multi',
  options: [
    { label: 'Active',   value: 'Active' },
    { label: 'Pending',  value: 'Pending' },
    { label: 'Draft',    value: 'Draft' },
    { label: 'Archived', value: 'Archived' },
  ],
}

const SEARCHABLE_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
]

function resolvedSize(configSize) {
  return configSize === 'responsive' ? undefined : configSize
}

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function buildSnippet(config) {
  const lines = [
    config.size !== 'responsive' ? `  size="${config.size}"` : null,
    config.zebra ? '  zebra' : null,
    config.scrollable ? '  scrollable' : null,
    config.sortable ? '  // Name and Joined columns have sortable: true' : null,
    config.showSearch ? '  searchableColumns={[{ key: \'name\', label: \'Name\' }, { key: \'role\', label: \'Role\' }]}' : null,
    config.showFilters ? `  filters={[\n    { key: 'status', label: 'Status', type: 'multi', options: statusOptions }\n  ]}` : null,
    config.showPagination ? `  pageSize={${config.pageSize ?? 3}}` : null,
    config.selectable ? '  selectable' : null,
    config.selectable && config.showDeleteSelected ? '  onDeleteSelected={(rows, ids) => { /* handle delete */ }}' : null,
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
    caption: 'Team members',
    sortable: true,
    showSearch: false,
    showFilters: false,
    showPagination: false,
    pageSize: 3,
    selectable: false,
    showDeleteSelected: false,
    emptyTitle: 'No results',
    emptyDescription: '',
    emptyIcon: 'inbox',
  }
}

export function Preview({ config }) {
  const columns = config.sortable ? SORTABLE_COLUMNS : BASE_COLUMNS

  return (
    <DataTable
      caption={config.caption || 'Team members'}
      size={resolvedSize(config.size)}
      zebra={config.zebra}
      scrollable={config.scrollable}
      selectable={config.selectable}
      onDeleteSelected={config.selectable && config.showDeleteSelected ? () => {} : undefined}
      searchableColumns={config.showSearch ? SEARCHABLE_COLUMNS : undefined}
      filters={config.showFilters ? [STATUS_FILTER] : []}
      pageSize={config.showPagination ? (config.pageSize || 3) : undefined}
      emptyTitle={config.emptyTitle || 'No results'}
      emptyDescription={config.emptyDescription || undefined}
      emptyIcon={config.emptyIcon || 'inbox'}
      columns={columns}
      rows={SAMPLE_ROWS}
      getRowId={(row) => row.id}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Density"
        size="compact"
        hideIndicator
        columns={2}
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle
        label="Zebra stripes"
        value={config.zebra}
        onChange={(zebra) => set({ zebra })}
      />
      <Toggle
        label="Scrollable"
        value={config.scrollable}
        onChange={(scrollable) => set({ scrollable })}
      />
      <TextField
        label="Caption"
        size="compact"
        value={config.caption}
        onChange={(e) => set({ caption: e.target.value })}
      />

      <Divider space="none" />

      <Toggle
        label="Sortable columns"
        value={config.sortable}
        onChange={(sortable) => set({ sortable })}
      />
      <Toggle
        label="Search"
        value={config.showSearch}
        onChange={(showSearch) => set({ showSearch })}
      />
      <Toggle
        label="Filters"
        value={config.showFilters}
        onChange={(showFilters) => set({ showFilters })}
      />
      <Toggle
        label="Pagination"
        value={config.showPagination}
        onChange={(showPagination) => set({ showPagination })}
      />
      {config.showPagination && (
        <NumberField
          label="Page size"
          size="compact"
          value={config.pageSize}
          onChange={(e) => set({ pageSize: Math.max(1, parseInt(e.target.value, 10) || 3) })}
        />
      )}

      <Divider space="none" />

      <Toggle
        label="Selectable"
        value={config.selectable}
        onChange={(selectable) => set({ selectable })}
      />
      {config.selectable && (
        <Toggle
          label="Delete selected"
          value={config.showDeleteSelected}
          onChange={(showDeleteSelected) => set({ showDeleteSelected })}
        />
      )}

      <Divider space="none" />

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
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
