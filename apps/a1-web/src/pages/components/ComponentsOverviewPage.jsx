import {
  Card,
  DataTable,
  Grid,
  Heading,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { ruleSourceFiles } from './data.js'
import { allComponents, getComponentPath } from './utils.js'

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
      icon: 'arrow_forward',
    },
    category: component.categoryTitle,
    updated: component.updated,
    packages: component.packages.join(', '),
    actions: [{
      label: 'Open',
      icon: 'open_in_new',
      onClick: () => onNavigate?.(`component-${component.id}`),
    }],
  }))

  return (
    <DataTable
      caption="All A1 components"
      columns={columns}
      rows={rows}
      // size="compact"
      zebra
      scrollable
      defaultSort={{ key: 'category', direction: 'asc' }}
    />
  )
}

export function ComponentsOverviewPage({ onNavigate }) {
  const overviewStats = [
    { label: 'Components', value: allComponents.length },
    { label: 'Categories', value: new Set(allComponents.map((component) => component.categoryId)).size },
    { label: 'Rule files', value: ruleSourceFiles.length },
  ]

  return (
    <Section gap="lg" padding="md" surface='panel'>
      <Grid columns={{ xs: 1, sm: 3 }} gap="md">
        {overviewStats.map((stat) => (
          <Card key={stat.label}>
            <Stack direction="column" gap="xs">
              <Heading as="h2" size="lg">{stat.value}</Heading>
              <Paragraph size="sm" color="muted">{stat.label}</Paragraph>
            </Stack>
          </Card>
        ))}
      </Grid>
      <Stack direction="column" gap="sm">
        <Heading as="h2" type="display" size={{ xs: 'lg', md: 'xl' }}>
          Component inventory
        </Heading>
        <Paragraph size="sm" color="muted" className="a1-web-section-body">
          Full list of documented components, route targets, update dates, and package availability.
        </Paragraph>
      </Stack>
      <OverviewTable onNavigate={onNavigate} />
    </Section>
  )
}
