import {
  Breadcrumb,
  Card,
  DataTable,
  Grid,
  Heading,
  Icon,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { ruleSourceFiles } from './data.js'
import { allComponents, getComponentPath, navigateCard } from './utils.js'

function OverviewTable({ onNavigate }) {
  const columns = [
    { key: 'component', label: 'Component', type: 'link', sortable: true, sortAccessor: (row) => row.component.label },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'updated', label: 'Last updated', sortable: true },
    { key: 'packages', label: 'Packages' },
    // { key: 'actions', label: 'Open', type: 'actions' },
  ]

  const rows = allComponents.map((component) => ({
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
      defaultSort={{ key: 'category', direction: 'asc' }}
      searchableColumns={[
        { key: 'component', label: 'Component', searchAccessor: (row) => row.component.label },
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
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => navigateCard(e, onNavigate, 'home') },
              { label: 'Components' },
            ]}
          />
          <Heading as="h1" id="component-inventory-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Component inventory
          </Heading>
          <Paragraph size="sm" color="muted" className="a1-web-section-body">
            Full list of documented components, route targets, update dates, and package availability.
          </Paragraph>
        </Stack>
      </Section>
      <Section padding="sm" contentWidth="xl" gap="md" aria-labelledby="component-inventory-heading">
        <Grid columns={{ xs: 1, sm: 3 }} gap="md">
          {overviewStats.map((stat) => (
            <Card className="a1-p-8" key={stat.label}>
              <Stack direction="row" gap="sm" align='baseline'>
                <Heading as="h2" size="lg" type='display'>{stat.value}</Heading>
                <Paragraph size="md" color="muted">{stat.label}</Paragraph>
              </Stack>
            </Card>



          ))}



        </Grid>


        <OverviewTable onNavigate={onNavigate} />
      </Section>
    </>
  )
}
