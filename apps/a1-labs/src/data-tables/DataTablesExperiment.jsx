import React, { useMemo, useState } from 'react'
import { DataTable, Inset, Section, Stack, Switch, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { createDataset } from '../sample-data/datasets.js'
import { DatasetSize } from '../sample-data/DatasetSize.jsx'
import { DATASET_SIZES } from '../sample-data/sizes.js'
import { TABLE_TYPES, tableColumns } from './table-samples.js'

const getRowId = row => row.id
const typeIcons = { inventory: 'inventory_2', directory: 'group', invoices: 'receipt_long' }
export function DataTablesExperiment({ experiment, onOpenSettings }) {
  const [type, setType] = useState('inventory')
  const [position, setPosition] = useState('bottom')
  const [paginationSize, setPaginationSize] = useState('md')
  const [count, setCount] = useState(DATASET_SIZES.medium)
  const [detail, setDetail] = useState('standard')
  const [density, setDensity] = useState('default')
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)
  const [zebra, setZebra] = useState(false)
  const rows = useMemo(() => createDataset(type, count), [type, count])
  const columns = useMemo(() => tableColumns(type, detail, search), [type, detail, search])
  const configuration = <Inset space={16}><Stack gap={24}>
    <Toolbar label="Position"><ToolbarGroup aria-label="Pagination position" value={position} onChange={setPosition} showLabels options={[{ value: 'top', label: 'Above' }, { value: 'bottom', label: 'Below' }, { value: 'both', label: 'Both' }, { value: 'inline', label: 'Inline' }]} /></Toolbar>
    <Toolbar label="Size"><ToolbarGroup aria-label="Pagination size" value={paginationSize} onChange={setPaginationSize} showLabels options={[{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }]} /></Toolbar>
    <Toolbar label="Type"><ToolbarGroup aria-label="Table type" value={type} onChange={setType} labelMode="selected" options={TABLE_TYPES.map(option => ({ ...option, icon: typeIcons[option.value] }))} /></Toolbar>
    <DatasetSize value={count} onChange={setCount} />
    <Toolbar label="Columns"><ToolbarGroup aria-label="Columns" value={detail} onChange={setDetail} showLabels options={[{ value: 'simple', label: '3' }, { value: 'standard', label: '5' }, { value: 'detailed', label: '8' }]} /></Toolbar>
    <Toolbar label="Density"><ToolbarGroup aria-label="Density" value={density} onChange={setDensity} labelMode="selected" options={[{ value: 'auto', label: 'Responsive', icon: 'width' }, { value: 'compact', label: 'Compact', icon: 'density_small' }, { value: 'default', label: 'Default', icon: 'density_medium' }, { value: 'comfortable', label: 'Comfortable', icon: 'density_large' }]} /></Toolbar>
    <Switch label="Search" checked={search} onChange={setSearch} />
    <Switch label="Zebra rows" checked={zebra} onChange={setZebra} />
  </Stack></Inset>
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={configuration}>
    <Section padding="none"><Stack gap={16} className="a1-data-tables-lab">
      <DataTable key={`${type}-${count}-${detail}-${search}`} caption={TABLE_TYPES.find(item => item.value === type).label} rows={rows} columns={columns} getRowId={getRowId}
        size={density === 'auto' ? undefined : density} zebra={zebra} scrollable
        paginationPosition={position} paginationSize={paginationSize} pageSize={pageSize} pageSizeOptions={[5, 7, 10, 25, 50]} onPageSizeChange={setPageSize}
        emptyTitle="No matching records" emptyDescription="Clear the filters or try another search." />
    </Stack></Section>
  </ExperimentLayout>
}
