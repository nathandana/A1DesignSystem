import {
  Breadcrumb,
  Button,
  ButtonContainer,
  DataTable,
  DataTableFilters,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { useEffect, useState } from 'react'
import tokens from '../../../../../build/json/tokens.json'

const primitiveColorColumns = [
  { key: 'swatch', label: 'Applied', width: 'var(--base-spacing-96)' },
  { key: 'ramp', label: 'Ramp', sortable: true },
  { key: 'step', label: 'Step', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (row) => row.tokenText },
  { key: 'value', label: 'Value' },
]

const semanticColorColumns = [
  { key: 'swatch', label: 'Applied', width: 'var(--base-spacing-96)' },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (row) => row.tokenText },
  { key: 'value', label: 'Current value' },
]

const componentColorColumns = [
  { key: 'swatch', label: 'Applied', width: 'var(--base-spacing-96)' },
  { key: 'component', label: 'Component', sortable: true },
  { key: 'token', label: 'Token', sortable: true, sortAccessor: (row) => row.tokenText },
  { key: 'value', label: 'Current value' },
]

// ── Utilities ────────────────────────────────────────────────────────────────

function toKebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

function toCssVar(path) {
  return `--${path.map(toKebab).join('-')}`
}

function isColorValue(value) {
  return typeof value === 'string' && /^(#|rgb|hsl)/i.test(value)
}

function flattenColorTokens(value, path = []) {
  if (isColorValue(value)) {
    return [{ path, name: path.join('.'), cssVar: toCssVar(path), value }]
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.entries(value).flatMap(([key, nextValue]) =>
    flattenColorTokens(nextValue, [...path, key])
  )
}

function applyFiltersAndSearch(rows, filterDefs, searchCols, filters, searchValue, searchColumn) {
  let result = rows

  result = result.filter((row) =>
    filterDefs.every((f) => {
      const v = filters[f.key]
      if (!v || (Array.isArray(v) && v.length === 0)) return true
      if (Array.isArray(v)) return v.includes(String(row[f.key]))
      return String(row[f.key]) === v
    })
  )

  if (searchValue) {
    const q = searchValue.toLowerCase()
    result = result.filter((row) => {
      if (searchColumn) return String(row[searchColumn] ?? '').toLowerCase().includes(q)
      return searchCols.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q))
    })
  }

  return result
}

// ── Helper components ────────────────────────────────────────────────────────

function ColorSwatch({ cssVar }) {
  return (
    <span
      className="a1-web-color-swatch"
      style={{ '--a1-web-color-swatch': `var(${cssVar})` }}
      aria-hidden="true"
    />
  )
}

function TokenCode({ children }) {
  return <code className="a1-web-token-code">{children}</code>
}

// ── Hook ─────────────────────────────────────────────────────────────────────

function useResolvedColorRows(rows, theme, colorMode) {
  const [resolvedRows, setResolvedRows] = useState(rows)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setResolvedRows(rows)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      const styles = window.getComputedStyle(document.documentElement)
      setResolvedRows(rows.map((row) => ({
        ...row,
        value: styles.getPropertyValue(row.cssVar).trim() || row.fallbackValue,
      })))
    })

    return () => window.cancelAnimationFrame(frame)
  }, [rows, theme, colorMode])

  return resolvedRows
}

// ── Module-level row data ────────────────────────────────────────────────────

const primitiveColorRows = Object.entries(tokens.base.color).flatMap(([rampName, ramp]) =>
  flattenColorTokens(ramp, ['base', 'color', rampName])
    .sort((a, b) => Number(a.path[a.path.length - 1]) - Number(b.path[b.path.length - 1]))
    .map((token) => ({
      id: token.name,
      swatch: <ColorSwatch cssVar={token.cssVar} />,
      ramp: rampName,
      step: token.path[token.path.length - 1],
      token: <TokenCode>{token.cssVar}</TokenCode>,
      tokenText: token.cssVar,
      cssVar: token.cssVar,
      fallbackValue: token.value,
      value: token.value,
    }))
)

const semanticColorRows = flattenColorTokens(tokens.semantic.color, ['semantic', 'color'])
  .map((token) => ({
    id: token.name,
    swatch: <ColorSwatch cssVar={token.cssVar} />,
    role: token.path.slice(2).join(' / '),
    category: token.path[2],
    token: <TokenCode>{token.cssVar}</TokenCode>,
    tokenText: token.cssVar,
    cssVar: token.cssVar,
    fallbackValue: token.value,
    value: token.value,
  }))

const componentColorRows = flattenColorTokens(tokens.component, ['component'])
  .map((token) => ({
    id: token.name,
    swatch: <ColorSwatch cssVar={token.cssVar} />,
    component: token.path[1],
    token: <TokenCode>{token.cssVar}</TokenCode>,
    tokenText: token.cssVar,
    cssVar: token.cssVar,
    fallbackValue: token.value,
    value: token.value,
  }))

// ── Filter + search definitions ───────────────────────────────────────────────

const PRIMITIVE_FILTER_DEFS = [
  {
    key: 'ramp',
    label: 'Ramp',
    type: 'multi',
    options: [...new Set(primitiveColorRows.map((r) => r.ramp))].map((v) => ({ value: v, label: v })),
  },
  {
    key: 'step',
    label: 'Step',
    type: 'multi',
    options: [...new Set(primitiveColorRows.map((r) => r.step))]
      .sort((a, b) => Number(a) - Number(b))
      .map((v) => ({ value: v, label: v })),
  },
]
const PRIMITIVE_SEARCH_COLS = [
  { key: 'ramp', label: 'Ramp' },
  { key: 'step', label: 'Step' },
  { key: 'tokenText', label: 'Token' },
]

const SEMANTIC_FILTER_DEFS = [
  {
    key: 'category',
    label: 'Category',
    type: 'multi',
    options: [...new Set(semanticColorRows.map((r) => r.category))].sort().map((v) => ({ value: v, label: v })),
  },
]
const SEMANTIC_SEARCH_COLS = [
  { key: 'role', label: 'Role' },
  { key: 'tokenText', label: 'Token' },
]

const COMPONENT_FILTER_DEFS = [
  {
    key: 'component',
    label: 'Component',
    type: 'multi',
    options: [...new Set(componentColorRows.map((r) => r.component))].sort().map((v) => ({ value: v, label: v })),
  },
]
const COMPONENT_SEARCH_COLS = [
  { key: 'component', label: 'Component' },
  { key: 'tokenText', label: 'Token' },
]

// ── Component ────────────────────────────────────────────────────────────────

export function ColorFoundationPage({ onNavigate, theme, colorMode }) {
  const [activeTab, setActiveTab] = useState('primitives')

  const [primFilters, setPrimFilters] = useState({})
  const [primSearch, setPrimSearch] = useState('')
  const [primSearchCol, setPrimSearchCol] = useState('')

  const [semFilters, setSemFilters] = useState({})
  const [semSearch, setSemSearch] = useState('')
  const [semSearchCol, setSemSearchCol] = useState('')

  const [compFilters, setCompFilters] = useState({})
  const [compSearch, setCompSearch] = useState('')
  const [compSearchCol, setCompSearchCol] = useState('')

  const resolvedPrimitiveRows = useResolvedColorRows(primitiveColorRows, theme, colorMode)
  const resolvedSemanticRows = useResolvedColorRows(semanticColorRows, theme, colorMode)
  const resolvedComponentRows = useResolvedColorRows(componentColorRows, theme, colorMode)

  const filteredPrimitiveRows = applyFiltersAndSearch(
    resolvedPrimitiveRows, PRIMITIVE_FILTER_DEFS, PRIMITIVE_SEARCH_COLS,
    primFilters, primSearch, primSearchCol
  )
  const filteredSemanticRows = applyFiltersAndSearch(
    resolvedSemanticRows, SEMANTIC_FILTER_DEFS, SEMANTIC_SEARCH_COLS,
    semFilters, semSearch, semSearchCol
  )
  const filteredComponentRows = applyFiltersAndSearch(
    resolvedComponentRows, COMPONENT_FILTER_DEFS, COMPONENT_SEARCH_COLS,
    compFilters, compSearch, compSearchCol
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
        aria-labelledby="color-foundation-heading"
      >
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '?page=foundations', label: 'Foundations' },
              { label: 'Color' },
            ]}
          />
          <Heading
            as="h1"
            id="color-foundation-heading"
            type="display"
            size={{ xs: 'xl', md: 'xxl' }}
            textWrap="balance"
          >
            Color
          </Heading>

          <Paragraph size="sm" color="muted">
            Inspect the generated color system and see how token values are applied across primitives, semantic roles, and component-specific color tokens. Use the settings menu to switch the active theme and color mode.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-labelledby="color-token-browser-heading">
        <Stack gap="lg">
          <Stack direction="column" gap="sm">
            <Heading as="h2" id="color-token-browser-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Browse color by token layer.
            </Heading>
            <Paragraph size="sm" color="muted" className="a1-web-section-body">
              Primitive tokens define the raw ramps. Semantic tokens assign purpose. Component tokens apply color to specific interface parts.
            </Paragraph>
          </Stack>

          <Tabs value={activeTab} onChange={setActiveTab} variant="folder">
            <TabList>
              <Tab value="primitives" icon="gradient">Primitives</Tab>
              <Tab value="semantic" icon="category">Semantic</Tab>
              <Tab value="component" icon="widgets">Component</Tab>
            </TabList>

            <TabPanel value="primitives">
              <Stack gap="md">
                <DataTableFilters
                  filters={PRIMITIVE_FILTER_DEFS}
                  value={primFilters}
                  onChange={setPrimFilters}
                  searchValue={primSearch}
                  onSearchChange={setPrimSearch}
                  searchColumn={primSearchCol}
                  onSearchColumnChange={setPrimSearchCol}
                  searchableColumns={PRIMITIVE_SEARCH_COLS}
                />
                <DataTable
                  columns={primitiveColorColumns}
                  rows={filteredPrimitiveRows}
                  getRowId={(row) => row.id}
                  density="compact"
                  scrollable
                  caption="Primitive color tokens"
                  emptyTitle="No matching tokens"
                  emptyDescription="Try adjusting your search or clearing some filters."
                  emptyIcon="palette"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="semantic">
              <Stack gap="md">
                <DataTableFilters
                  filters={SEMANTIC_FILTER_DEFS}
                  value={semFilters}
                  onChange={setSemFilters}
                  searchValue={semSearch}
                  onSearchChange={setSemSearch}
                  searchColumn={semSearchCol}
                  onSearchColumnChange={setSemSearchCol}
                  searchableColumns={SEMANTIC_SEARCH_COLS}
                />
                <DataTable
                  columns={semanticColorColumns}
                  rows={filteredSemanticRows}
                  getRowId={(row) => row.id}
                  density="compact"
                  scrollable
                  caption="Semantic color tokens"
                  emptyTitle="No matching tokens"
                  emptyDescription="Try adjusting your search or clearing some filters."
                  emptyIcon="category"
                />
              </Stack>
            </TabPanel>

            <TabPanel value="component">
              <Stack gap="md">
                <DataTableFilters
                  filters={COMPONENT_FILTER_DEFS}
                  value={compFilters}
                  onChange={setCompFilters}
                  searchValue={compSearch}
                  onSearchChange={setCompSearch}
                  searchColumn={compSearchCol}
                  onSearchColumnChange={setCompSearchCol}
                  searchableColumns={COMPONENT_SEARCH_COLS}
                />
                <DataTable
                  columns={componentColorColumns}
                  rows={filteredComponentRows}
                  getRowId={(row) => row.id}
                  density="compact"
                  scrollable
                  caption="Component color tokens"
                  emptyTitle="No matching tokens"
                  emptyDescription="Try adjusting your search or clearing some filters."
                  emptyIcon="widgets"
                />
              </Stack>
            </TabPanel>
          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
