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

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

function SpacingSwatch({ value }) {
  return <span className="a1-web-spacing-swatch" style={{ inlineSize: value }} aria-hidden="true" />
}

function toKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase()
}

function applyFiltersAndSearch(rows, filterDefs, searchCols, filters, search, searchCol) {
  let result = rows
  result = result.filter((row) =>
    filterDefs.every((f) => {
      const v = filters[f.key]
      if (!v || (Array.isArray(v) && v.length === 0)) return true
      return Array.isArray(v) ? v.includes(String(row[f.key])) : String(row[f.key]) === v
    })
  )
  if (search) {
    const q = search.toLowerCase()
    result = result.filter((row) =>
      searchCol
        ? String(row[searchCol] ?? '').toLowerCase().includes(q)
        : searchCols.some((c) => String(row[c.key] ?? '').toLowerCase().includes(q))
    )
  }
  return result
}

// ── Row data ──────────────────────────────────────────────────────────────────

const spacingRows = Object.entries(tokens.base.spacing).map(([step, value]) => ({
  id: `spacing-${step}`,
  swatch: <SpacingSwatch value={value} />,
  step,
  token: <TokenCode>{`--base-spacing-${step}`}</TokenCode>,
  tokenText: `--base-spacing-${step}`,
  value,
}))

const gapRows = Object.entries(tokens.semantic.spacing.gap).map(([step, value]) => ({
  id: `gap-${step}`,
  swatch: <SpacingSwatch value={value} />,
  step,
  token: <TokenCode>{`--semantic-spacing-gap-${toKebab(step)}`}</TokenCode>,
  tokenText: `--semantic-spacing-gap-${toKebab(step)}`,
  value,
}))

// ── Columns ───────────────────────────────────────────────────────────────────

const spacingColumns = [
  { key: 'swatch', label: 'Scale', width: 'var(--base-spacing-160)' },
  { key: 'step', label: 'Step', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const gapColumns = [
  { key: 'swatch', label: 'Scale', width: 'var(--base-spacing-160)' },
  { key: 'step', label: 'Step', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (r) => r.tokenText },
  { key: 'value', label: 'Value' },
]

const SPACING_SEARCH_COLS = [
  { key: 'step', label: 'Step' },
  { key: 'tokenText', label: 'Token' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function SizeFoundationPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('spacing')
  const [spacingSearch, setSpacingSearch] = useState('')
  const [spacingSearchCol, setSpacingSearchCol] = useState('')

  const filteredSpacingRows = applyFiltersAndSearch(
    spacingRows, [], SPACING_SEARCH_COLS, {}, spacingSearch, spacingSearchCol
  )

  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="lg"
        gap="lg"
        aria-labelledby="size-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Size' },
            ]}
          />
          <Heading as="h1" id="size-heading" type="display" size={{ xs: 'xl', md: 'xxl' }} textWrap="balance">
            Size
          </Heading>
          <Paragraph size="sm" color="muted">
            Spacing, dimensions, density, component sizing, and layout rhythm. Every spacing value in A1 traces back to a base spacing token — nothing is hardcoded.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="size-token-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <Heading as="h2" id="size-token-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Browse size tokens.
            </Heading>
            <Paragraph size="sm" color="muted">
              The base spacing scale is a fixed set of pixel values. Semantic gap tokens alias into that scale for layout use.
            </Paragraph>
          </Stack>

          <Tabs value={activeTab} onChange={setActiveTab} variant="folder">
            <TabList>
              <Tab value="spacing" icon="straighten">Spacing scale</Tab>
              <Tab value="gap" icon="space_bar">Gap scale</Tab>
            </TabList>

            <TabPanel value="spacing">
              <Stack gap="md">
                <DataTableFilters
                  searchValue={spacingSearch}
                  onSearchChange={setSpacingSearch}
                  searchColumn={spacingSearchCol}
                  onSearchColumnChange={setSpacingSearchCol}
                  searchableColumns={SPACING_SEARCH_COLS}
                />
                <DataTable
                  columns={spacingColumns}
                  rows={filteredSpacingRows}
                  getRowId={(r) => r.id}
                  density="compact"
                  scrollable
                  caption="Base spacing tokens"
                  emptyTitle="No matching tokens"
                  emptyIcon="straighten"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="gap">
              <DataTable
                columns={gapColumns}
                rows={gapRows}
                getRowId={(r) => r.id}
                density="compact"
                scrollable
                caption="Semantic gap tokens"
              />
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
