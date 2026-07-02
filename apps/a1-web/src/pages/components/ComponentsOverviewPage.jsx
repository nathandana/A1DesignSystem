import {
  Card,
  DataTable,
  Grid,
  Heading,
  Section,
  Stat,
} from '@gtivr4/a1-design-system-react'
import { useMemo, useState } from 'react'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { ruleSourceFiles } from './data.js'
import { allComponents, getComponentPath, navigateCard, rankComponentsForSearch, scoreComponentSearch } from './utils.js'

function OverviewTable({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState({ key: 'category', direction: 'asc' })
  const hasSearch = searchQuery.trim().length > 0
  const rankedComponents = useMemo(
    () => (hasSearch ? rankComponentsForSearch(allComponents, searchQuery) : allComponents),
    [hasSearch, searchQuery],
  )

  const columns = [
    { key: 'component', label: 'Component', type: 'link', sortable: true, sortAccessor: (row) => row.component.label },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'updated', label: 'Last updated', sortable: true },
    { key: 'packages', label: 'Packages' },
    // { key: 'actions', label: 'Open', type: 'actions' },
  ]

  const rows = rankedComponents.map((component) => ({
    id: component.id,
    component: {
      href: getComponentPath(`component-${component.id}`),
      label: component.title,
      icon: component.icon ?? 'arrow_forward',
    },
    category: component.categoryTitle,
    updated: component.updated,
    packages: component.packages.join(', '),
    packageValues: component.packages, // array — for the Package filter
    smartSearch: component.searchText,
    actions: [{
      label: 'Open',
      icon: 'open_in_new',
      onClick: () => onNavigate?.(`component-${component.id}`),
    }],
  }))

  const categoryOptions = Array.from(new Set(allComponents.map((c) => c.categoryTitle)))
    .sort()
    .map((c) => ({ value: c, label: c }))
  const packageOptions = Array.from(new Set(allComponents.flatMap((c) => c.packages)))
    .sort()
    .map((p) => ({ value: p, label: p }))

  return (
    <DataTable
      caption="All A1 components"
      columns={columns}
      rows={rows}
      // size="compact"
      zebra
      scrollable
      sort={hasSearch ? null : sort}
      onSortChange={setSort}
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      searchableColumns={[
        {
          key: 'smartSearch',
          label: 'Component',
          searchAccessor: (row) => row.smartSearch,
          searchMatcher: (row, query) => {
            const component = allComponents.find((item) => item.id === row.id)
            return component ? scoreComponentSearch(component, query) > 0 : false
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

export function ComponentsOverviewPage({ onNavigate }) {
  const overviewStats = [
    { label: 'Components', value: allComponents.length, icon: 'widgets' },
    { label: 'Categories', value: new Set(allComponents.map((component) => component.categoryId)).size, icon: 'folder' },
    { label: 'Rule files', value: ruleSourceFiles.length, icon: 'rule' },
  ]

  return (
    <>
      <PageTitleArea
        headingId="component-inventory-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => navigateCard(e, onNavigate, 'home') },
          { label: 'Components' },
        ]}
        title="Component inventory"
        description="Full list of documented components, route targets, update dates, and package availability."
      />
      <Section padding="sm" contentWidth="xl" gap="md" aria-labelledby="component-inventory-heading">
        <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
          {overviewStats.map((stat) => (
            <Card className="a1-p-8" key={stat.label}>
              <Stat title={stat.label} value={stat.value} icon={stat.icon} size="lg" />
            </Card>
          ))}
          <Card
            variant="navigation"
            href={getComponentPath('kitchen-sink')}
            onClick={(e) => navigateCard(e, onNavigate, 'kitchen-sink')}
          >
            <Heading as="h2" size="xs">Kitchen sink page</Heading>
          </Card>
        </Grid>


        <OverviewTable onNavigate={onNavigate} />
      </Section>
    </>
  )
}
