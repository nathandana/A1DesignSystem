import { useState } from 'react'
import {
  Breadcrumb,
  DataTable,
  Heading,
  Icon,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../../build/json/tokens.json'
import iconUsageMarkdown from '../../../../../system/icons/icon-usage.md?raw'
import iconRegistry from '../../../../../system/icons/material-symbols.json'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

const iconSizingColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const iconSizingRows = [
  {
    id: 'optical-size',
    name: 'Optical size',
    token: <TokenCode>--base-icon-optical-size</TokenCode>,
    tokenText: '--base-icon-optical-size',
    value: String(tokens.base.icon.opticalSize),
  },
]

const categoryLabels = {
  action: 'Action',
  activities: 'Activities',
  av: 'Audio/video',
  communication: 'Communication',
  content: 'Content',
  device: 'Device',
  editor: 'Editor',
  file: 'File',
  hardware: 'Hardware',
  home: 'Home',
  image: 'Image',
  maps: 'Maps',
  navigation: 'Navigation',
  notification: 'Notification',
  places: 'Places',
  search: 'Search',
  social: 'Social',
  toggle: 'Toggle',
}

const formatCategory = (category) => (
  categoryLabels[category] ?? category.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
)

const iconRows = iconRegistry.icons.map((icon) => {
  const categories = icon.categories.map(formatCategory)

  return {
    id: icon.name,
    preview: (
      <span className="a1-web-icon-table-preview" aria-hidden="true">
        <Icon name={icon.name} />
      </span>
    ),
    name: icon.name,
    categories: categories.join(', ') || 'Uncategorized',
    categoryKeys: icon.categories,
  }
})

const iconColumns = [
  { key: 'preview', label: 'Icon', width: '72px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'categories', label: 'Categories', sortable: true },
]

const iconCategories = Array.from(
  new Set(iconRegistry.icons.flatMap((icon) => icon.categories))
).sort((a, b) => formatCategory(a).localeCompare(formatCategory(b)))

const iconFilterDefs = [
  {
    key: 'categoryKeys',
    label: 'Category',
    type: 'single',
    options: iconCategories.map((categoryKey) => ({
      value: categoryKey,
      label: formatCategory(categoryKey),
    })),
  },
]

const iconSearchColumns = [
  { key: 'name', label: 'Name' },
  { key: 'categories', label: 'Categories' },
]

function parseIconUsage(markdown) {
  const startMarker = '<!-- icon-usage-table:start -->'
  const endMarker = '<!-- icon-usage-table:end -->'
  const start = markdown.indexOf(startMarker)
  const end = markdown.indexOf(endMarker)
  if (start === -1 || end === -1 || end <= start) return []

  return markdown
    .slice(start + startMarker.length, end)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.startsWith('| Icon '))
    .map((line) => {
      const [name, scenario] = line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim())

      return { name, scenario }
    })
    .filter((row) => row.name && row.scenario)
}

const iconUsageRows = parseIconUsage(iconUsageMarkdown).map((item) => ({
  id: item.name,
  preview: (
    <span className="a1-web-icon-table-preview" aria-hidden="true">
      <Icon name={item.name} />
    </span>
  ),
  name: item.name,
  scenario: item.scenario,
}))

const iconUsageColumns = [
  { key: 'preview', label: 'Icon', width: '72px' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'scenario', label: 'Scenario', sortable: true },
]

const iconUsageSearchColumns = [
  { key: 'name', label: 'Name' },
  { key: 'scenario', label: 'Scenario' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function IconographyFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('icons')
  const [iconFilters, setIconFilters] = useState({ categoryKeys: '' })
  const [iconSearch, setIconSearch] = useState('')
  const [iconSearchColumn, setIconSearchColumn] = useState('')
  const [usageSearch, setUsageSearch] = useState('')
  const [usageSearchColumn, setUsageSearchColumn] = useState('')

  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { href: '?page=foundations', label: 'Foundations', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('foundations') } },
              { label: 'Iconography' },
            ]}
          />
          <Heading as="h1" id="iconography-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Iconography
          </Heading>
          <Paragraph size="sm" color="muted">
            A1 uses Material Symbols Outlined exclusively. Icons are passed by ligature name through the <code className="a1-web-token-code">icon</code> prop or rendered via the <code className="a1-web-token-code">Icon</code> component.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="none" contentWidth="xl" aria-label="Iconography details">
        <Stack gap="lg">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab value="icons" icon="interests" count={iconRows.length}>Icons</Tab>
              <Tab value="usage" icon="rule" count={iconUsageRows.length}>Usage</Tab>
              <Tab value="sizing" icon="straighten">Sizing tokens</Tab>
            </TabList>

            <TabPanel value="icons">
              <Stack gap="lg">

                <Stack gap="md">

                  <DataTable
                    columns={iconColumns}
                    rows={iconRows}
                    getRowId={(row) => row.id}
                    filters={iconFilterDefs}
                    filterValue={iconFilters}
                    onFilterChange={setIconFilters}
                    searchValue={iconSearch}
                    onSearchChange={setIconSearch}
                    searchColumn={iconSearchColumn}
                    onSearchColumnChange={setIconSearchColumn}
                    searchableColumns={iconSearchColumns}
                    pageSize={50}
                    size="compact"
                    scrollable
                    caption="System icon registry"
                    emptyTitle="No icons found"
                    emptyDescription="Adjust the search or category filter."
                    emptyIcon="search_off"
                  />
                </Stack>
              </Stack>
            </TabPanel>

            <TabPanel value="usage">
              <Stack gap="lg">

                <DataTable
                  columns={iconUsageColumns}
                  rows={iconUsageRows}
                  getRowId={(row) => row.id}
                  searchValue={usageSearch}
                  onSearchChange={setUsageSearch}
                  searchColumn={usageSearchColumn}
                  onSearchColumnChange={setUsageSearchColumn}
                  searchableColumns={iconUsageSearchColumns}
                  pageSize={50}
                  size="compact"
                  scrollable
                  caption="System icon usage lookup"
                  emptyTitle="No icon usage found"
                  emptyDescription="Adjust the search."
                  emptyIcon="search_off"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="sizing">
              <Stack gap="lg">
                <DataTable
                  columns={iconSizingColumns}
                  rows={iconSizingRows}
                  getRowId={(r) => r.id}
                  size="comfortable"
                  scrollable
                  caption="Icon sizing tokens"
                />
              </Stack>
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
