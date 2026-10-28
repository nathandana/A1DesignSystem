import { useT } from '../../labels/useT.js'
import {
  Card,
  DataTable,
  Grid,
  Heading,
  PageTitle,
  Section,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { useMemo, useState } from 'react'
import { componentsCatalog } from './catalog.js'
import { getComponentPath, navigateCard } from './utils.js'

function OverviewTable({ catalog, onNavigate }) {
  const t = useT()
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState({ key: 'category', direction: 'asc' })
  const hasSearch = searchQuery.trim().length > 0
  const rankedItems = useMemo(
    () => (hasSearch ? catalog.rankForSearch(catalog.all, searchQuery) : catalog.all),
    [catalog, hasSearch, searchQuery],
  )
  const columnLabel = t(...catalog.labels.column)

  const columns = [
    { key: 'item', label: columnLabel, type: 'link', sortable: true, sortAccessor: (row) => row.item.label },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'updated', label: 'Last updated', sortable: true },
    { key: 'packages', label: 'Packages' },
  ]

  const rows = rankedItems.map((item) => ({
    id: item.id,
    item: {
      href: item.path,
      label: item.titleKey ? t(item.titleKey, item.title) : item.title,
      icon: item.icon ?? 'arrow_forward',
    },
    category: item.categoryTitle,
    updated: item.updated,
    packages: item.packages.join(', '),
    packageValues: item.packages, // array — for the Package filter
    smartSearch: item.searchText,
    actions: [{
      label: 'Open',
      icon: 'open_in_new',
      onClick: () => onNavigate?.(item.pageId),
    }],
  }))

  const categoryOptions = Array.from(new Set(catalog.all.map((item) => item.categoryTitle)))
    .sort()
    .map((c) => ({ value: c, label: c }))
  const packageOptions = Array.from(new Set(catalog.all.flatMap((item) => item.packages)))
    .sort()
    .map((p) => ({ value: p, label: p }))

  return (
    <DataTable
      caption={t(...catalog.labels.tableCaption)}
      columns={columns}
      rows={rows}
      zebra
      scrollable
      sort={hasSearch ? null : sort}
      onSortChange={setSort}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchableColumns={[
        {
          key: 'smartSearch',
          label: columnLabel,
          searchAccessor: (row) => row.smartSearch,
          searchMatcher: (row, query) => {
            const item = catalog.all.find((candidate) => candidate.id === row.id)
            return item ? catalog.scoreSearch(item, query) > 0 : false
          },
        },
        { key: 'category', label: 'Category' },
        { key: 'packages', label: 'Packages' },
      ]}
      filters={[
        { key: 'category', label: 'Category', type: 'single', options: categoryOptions },
        { key: 'packageValues', label: 'Package', type: 'multi', options: packageOptions },
      ]}
    />
  )
}

/** A catalogue overview: counts, then the sortable, filterable table of every item. */
export function CatalogOverviewPage({ catalog = componentsCatalog, onNavigate }) {
  const t = useT()
  const headingId = `${catalog.kind}-inventory-heading`
  const overviewStats = [
    { label: t(...catalog.labels.countLabel), value: catalog.all.length, icon: catalog.icon },
    { label: t(...catalog.labels.categoriesLabel), value: catalog.categories.length, icon: 'folder' },
    ...(catalog.labels.ruleFilesLabel
      ? [{ label: t(...catalog.labels.ruleFilesLabel), value: catalog.rulesCount, icon: 'rule' }]
      : []),
  ]

  return (
    <>
      <PageTitle
        titleId={headingId}
        breadcrumb={catalog.getBreadcrumbItems({}, onNavigate, t)}
        title={t(...catalog.labels.overviewTitle)}
        description={t(...catalog.labels.overviewDescription)}
      />
      <Section padding="sm" contentWidth="xl" gap="md" aria-labelledby={headingId}>
        <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          {overviewStats.map((stat) => (
            <Card className="a1-p-8" key={stat.label}>
              <Stat title={stat.label} value={stat.value} icon={stat.icon} size="lg" />
            </Card>
          ))}
          {catalog.kind === 'component' && (
            <Card
              variant="navigation"
              href={getComponentPath('kitchen-sink')}
              onClick={(e) => navigateCard(e, onNavigate, 'kitchen-sink')}
            >
              <Heading as="h2" size="xs">Kitchen sink page</Heading>
            </Card>
          )}
        </Grid>

        <OverviewTable catalog={catalog} onNavigate={onNavigate} />
      </Section>
    </>
  )
}

export function ComponentsOverviewPage(props) {
  return <CatalogOverviewPage catalog={componentsCatalog} {...props} />
}
