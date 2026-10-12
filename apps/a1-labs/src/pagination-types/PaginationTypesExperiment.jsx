import React, { useMemo, useState } from 'react'
import { ChoiceGroup, DataTable, Inset, Link, Paragraph, Section, Stack, Toolbar, ToolbarGroup } from '@gtivr4/a1-design-system-react'
import { ExperimentLayout } from '../ExperimentLayout.jsx'
import { PaginationVariants } from './PaginationVariants.jsx'
import { createDataset } from '../sample-data/datasets.js'
import { DatasetSize } from '../sample-data/DatasetSize.jsx'
import { DATASET_SIZES } from '../sample-data/sizes.js'
import { PAGINATION_TYPES } from './pagination-model.js'

const columns = [
  { key: 'reference', label: 'Reference', searchable: true, sortable: true },
  { key: 'title', label: 'Request', searchable: true, sortable: true },
  { key: 'team', label: 'Team', filterable: true, sortable: true },
  { key: 'status', label: 'Status', filterable: true, type: 'badge', statusMap: { Open: 'info', 'In review': 'warn', Complete: 'success' } },
  { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
]
const getRowId = row => row.id
function PageAnnouncement({ page, rowStart, rowEnd, totalRows, children }) {
  return <Stack gap={8}>{children}<Paragraph className="a1-sr-only" role="status" aria-live="polite" aria-atomic="true">Page {page}. Rows {rowStart}–{rowEnd} of {totalRows}.</Paragraph></Stack>
}
export function PaginationTypesExperiment({ experiment, onOpenSettings }) {
  const [variant, setVariant] = useState('a1'), [position, setPosition] = useState('bottom'), [count, setCount] = useState(DATASET_SIZES.medium), [page, setPage] = useState(1)
  const rows = useMemo(() => createDataset('requests', count), [count])
  const current = PAGINATION_TYPES.find(item => item.value === variant)
  return <ExperimentLayout experiment={experiment} onOpenSettings={onOpenSettings} configuration={
    <Inset space={16}><Stack gap={24}>
      <ChoiceGroup label="Pagination type" columns={1} size="compact" value={variant} onChange={setVariant} options={PAGINATION_TYPES.map(({ value, label }) => ({ value, label }))} />
      <Paragraph size="sm" color="muted">{current.description}</Paragraph>
      <Toolbar label="Position"><ToolbarGroup aria-label="Pagination position" value={position} onChange={setPosition} showLabels options={[{ value: 'top', label: 'Above' }, { value: 'bottom', label: 'Below' }]} /></Toolbar>
      <DatasetSize value={count} onChange={value => { setCount(value); setPage(1) }} />
      <Paragraph size="sm" color="muted">Guidance: <Link href="https://design-system.service.gov.uk/components/pagination/">GOV.UK</Link> and <Link href="https://www.carbondesignsystem.com/building-blocks/core/components/pagination/guidelines">Carbon</Link>. Compare the tradeoffs with your users.</Paragraph>
    </Stack></Inset>
  }><Section padding="none"><Stack gap={16} className="a1-pagination-types-lab">
    <DataTable columns={columns} rows={rows} getRowId={getRowId} caption="Service requests" scrollable page={page} onPageChange={setPage} defaultPageSize={10} pageSizeOptions={[10, 25, 50, 100]} paginationPosition={position} paginationSize="sm"
      renderPagination={context => <PageAnnouncement {...context}><PaginationVariants {...context} variant={variant} /></PageAnnouncement>}
      emptyTitle="No matching requests" emptyDescription="Clear the filters or try a different reference." />
  </Stack></Section></ExperimentLayout>
}
