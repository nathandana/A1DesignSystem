import {
  Breadcrumb,
  DataTable,
  DataTableFilters,
  Heading,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { useState } from 'react'
import tokens from '../../../../../build/json/tokens.json'
import { getFoundationBreadcrumbItems } from './utils.js'

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

function TypeSample({ value, weight }) {
  return (
    <span
      className="a1-web-type-sample"
      style={{ fontSize: value, fontWeight: weight }}
      aria-hidden="true"
    >
      Aa
    </span>
  )
}

function applySearch(rows, searchCols, search, searchCol) {
  if (!search) return rows
  const q = search.toLowerCase()
  return rows.filter((row) =>
    searchCol
      ? String(row[searchCol] ?? '').toLowerCase().includes(q)
      : searchCols.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q))
  )
}

// ── Row data ──────────────────────────────────────────────────────────────────

const typeColumns = [
  { key: 'sample', label: 'Sample', width: 'var(--base-spacing-96)' },
  { key: 'step', label: 'Step', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const weightColumns = [
  { key: 'sample', label: 'Sample' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const SIZE_SEARCH_COLS = [
  { key: 'step', label: 'Step' },
  { key: 'tokenText', label: 'Token' },
]

const bodyRows = Object.entries(tokens.semantic.font.size.body).map(([step, value]) => ({
  id: `body-${step}`,
  sample: <TypeSample value={value} />,
  step,
  token: <TokenCode>{`--semantic-font-size-body-${step}`}</TokenCode>,
  tokenText: `--semantic-font-size-body-${step}`,
  value,
}))

const headingRows = Object.entries(tokens.semantic.font.size.heading).map(([step, value]) => ({
  id: `heading-${step}`,
  sample: <TypeSample value={value} />,
  step,
  token: <TokenCode>{`--semantic-font-size-heading-${step}`}</TokenCode>,
  tokenText: `--semantic-font-size-heading-${step}`,
  value,
}))

const displayRows = Object.entries(tokens.semantic.font.size.display).map(([step, value]) => ({
  id: `display-${step}`,
  sample: <TypeSample value={value} />,
  step,
  token: <TokenCode>{`--semantic-font-size-display-${step}`}</TokenCode>,
  tokenText: `--semantic-font-size-display-${step}`,
  value,
}))

const weightRows = Object.entries(tokens.base.font.weight).map(([name, value]) => ({
  id: `weight-${name}`,
  sample: <TypeSample value="1rem" weight={value} />,
  name,
  token: <TokenCode>{`--base-font-weight-${name}`}</TokenCode>,
  tokenText: `--base-font-weight-${name}`,
  value: String(value),
}))

// ── Component ─────────────────────────────────────────────────────────────────

export function TypeScaleFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('body')
  const [search, setSearch] = useState('')
  const [searchCol, setSearchCol] = useState('')

  const filteredBodyRows = applySearch(bodyRows, SIZE_SEARCH_COLS, search, searchCol)
  const filteredHeadingRows = applySearch(headingRows, SIZE_SEARCH_COLS, search, searchCol)
  const filteredDisplayRows = applySearch(displayRows, SIZE_SEARCH_COLS, search, searchCol)

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
            items={getFoundationBreadcrumbItems('Type scale', onNavigate)}
          />
          <Heading as="h1" id="type-scale-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Type scale
          </Heading>
          <Paragraph size="sm" color="muted">
            Body, heading, and display sizes — plus font weight and line-height tokens. Every typographic decision in A1 components is driven by a semantic token, never a hardcoded value.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="type-token-heading">
        <Stack gap="lg">

          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
            <TabList>
              <Tab value="body" icon="text_fields">Body</Tab>
              <Tab value="heading" icon="title">Heading</Tab>
              <Tab value="display" icon="format_size">Display</Tab>
              <Tab value="weight" icon="line_weight">Weight</Tab>
            </TabList>

            <TabPanel value="body">
              <Stack gap="md">
                <DataTable
                  columns={typeColumns}
                  rows={filteredBodyRows}
                  getRowId={(r) => r.id}
                  size="default"
                  scrollable
                  caption="Body size tokens"
                  emptyTitle="No matching tokens"
                  emptyIcon="text_fields"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="heading">
              <Stack gap="md">
                <DataTable
                  columns={typeColumns}
                  rows={filteredHeadingRows}
                  getRowId={(r) => r.id}
                  size="default"
                  scrollable
                  caption="Heading size tokens"
                  emptyTitle="No matching tokens"
                  emptyIcon="title"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="display">
              <Stack gap="md">
                <DataTable
                  columns={typeColumns}
                  rows={filteredDisplayRows}
                  getRowId={(r) => r.id}
                  size="default"
                  scrollable
                  caption="Display size tokens"
                  emptyTitle="No matching tokens"
                  emptyIcon="format_size"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="weight">
              <DataTable
                columns={weightColumns}
                rows={weightRows}
                getRowId={(r) => r.id}
                size="default"
                scrollable
                caption="Font weight tokens"
              />
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
