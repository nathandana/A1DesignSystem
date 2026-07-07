import {
  Button,
  ButtonContainer,
  Canvas,
  DataTable,
  DataTableFilters,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Node,
  NodeConnector,
  Paragraph,
  Section,
  SegmentedControl,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import { useEffect, useMemo, useState } from 'react'
import tokens from '../../../../../build/json/tokens.json'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { getFoundationBreadcrumbItems } from './utils.js'

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

// ── Color utilities ────────────────────────────────────────────────────────────

function isLightColor(hex) {
  if (!hex || !hex.startsWith('#')) return true
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45
}

function parseTokenParts(cssVar) {
  if (cssVar.startsWith('--component-')) {
    const parts = cssVar.replace('--component-', '').split('-')
    // label = last segment; sublabel = everything else joined with ·
    return {
      label: parts[parts.length - 1],
      sublabel: parts.slice(0, -1).join(' · '),
    }
  }
  if (cssVar.startsWith('--semantic-color-')) {
    const parts = cssVar.replace('--semantic-color-', '').split('-')
    return {
      label: parts[parts.length - 1],
      sublabel: parts.slice(0, -1).join(' · '),
    }
  }
  if (cssVar.startsWith('--base-color-')) {
    const parts = cssVar.replace('--base-color-', '').split('-')
    return { label: parts[parts.length - 1], sublabel: parts.slice(0, -1).join(' · ') }
  }
  return { label: cssVar.replace(/-/g, ' '), sublabel: '' }
}

// ── Component token graph ─────────────────────────────────────────────────────

function ComponentTokenGraph({ compRows, semRows, primRows }) {
  const COMP_X = 760, SEM_X = 420, PRIM_X = 80
  const Y_START = 60, Y_STEP = 90

  const { nodes, connectors } = useMemo(() => {
    const ns = []
    const cs = []

    // Index semantic and primitive tokens by resolved value
    const semByValue = {}
    for (const row of semRows) {
      if (!semByValue[row.value]) semByValue[row.value] = row
    }
    const primByValue = {}
    for (const row of primRows) {
      if (!primByValue[row.value]) primByValue[row.value] = row
    }

    // Collect unique semantics and primitives referenced by the current component tokens
    const usedSemMap = {}
    const usedPrimMap = {}
    for (const row of compRows) {
      const sem = semByValue[row.value]
      if (sem) {
        usedSemMap[sem.id] = sem
        const prim = primByValue[sem.value]
        if (prim) usedPrimMap[prim.id] = prim
      }
    }

    const usedSems = Object.values(usedSemMap)
    const usedPrims = Object.values(usedPrimMap)

    // Assign y positions
    const semY = {}
    usedSems.forEach((s, i) => { semY[s.id] = Y_START + i * Y_STEP })
    const primY = {}
    usedPrims.forEach((p, i) => { primY[p.id] = Y_START + i * Y_STEP })

    // Component nodes — md size for readability; label = property, sublabel = component
    compRows.forEach((row, i) => {
      const { label, sublabel } = parseTokenParts(row.tokenText)
      ns.push({
        id: `comp-${row.id}`,
        x: COMP_X, y: Y_START + i * Y_STEP,
        label, sublabel,
        title: `${row.tokenText}\n${row.value}`,
        shape: 'rectangle', size: 'md',
        backgroundColor: row.value,
        foregroundColor: isLightColor(row.value) ? '#1a1a1a' : '#ffffff',
      })
      const sem = semByValue[row.value]
      if (sem) {
        cs.push({ id: `e-cs-${row.id}`, from: `sem-${sem.id}`, to: `comp-${row.id}`, direction: 'to' })
      }
    })

    // Semantic nodes
    usedSems.forEach((sem) => {
      const { label, sublabel } = parseTokenParts(sem.tokenText)
      ns.push({
        id: `sem-${sem.id}`,
        x: SEM_X, y: semY[sem.id],
        label, sublabel,
        title: `${sem.tokenText}\n${sem.value}`,
        shape: 'rectangle', size: 'sm',
        backgroundColor: sem.value,
        foregroundColor: isLightColor(sem.value) ? '#1a1a1a' : '#ffffff',
      })
      const prim = primByValue[sem.value]
      if (prim) {
        cs.push({ id: `e-sp-${sem.id}`, from: `prim-${prim.id}`, to: `sem-${sem.id}`, direction: 'to' })
      }
    })

    // Primitive nodes
    usedPrims.forEach((prim) => {
      const { label, sublabel } = parseTokenParts(prim.tokenText)
      ns.push({
        id: `prim-${prim.id}`,
        x: PRIM_X, y: primY[prim.id],
        label, sublabel,
        title: `${prim.tokenText}\n${prim.value}`,
        shape: 'rectangle', size: 'sm',
        backgroundColor: prim.value,
        foregroundColor: isLightColor(prim.value) ? '#1a1a1a' : '#ffffff',
      })
    })

    return { nodes: ns, connectors: cs }
  }, [compRows, semRows, primRows])

  if (compRows.length === 0) {
    return (
      <MessageEmptyState
        scale="section"
        icon="widgets"
        title="Select a component"
        description="Use the Component filter above to choose a component and see its color token graph."
      />
    )
  }

  return (
    <div style={{ height: 600 }}>
      <Canvas
        showGrid={false}
        showControls
        traceConnections
        defaultPan={{ x: 40, y: 20 }}
        aria-label="Component color token graph"
      >
        {nodes.map(n => (
          <Node key={n.id} id={n.id} x={n.x} y={n.y}
            label={n.label} sublabel={n.sublabel} title={n.title} shape={n.shape} size={n.size}
            backgroundColor={n.backgroundColor} foregroundColor={n.foregroundColor}
          />
        ))}
        {connectors.map(c => (
          <NodeConnector key={c.id} id={c.id} from={c.from} to={c.to} direction={c.direction} />
        ))}
      </Canvas>
    </div>
  )
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
  const [compView, setCompView] = useState('table')

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
      <PageTitleArea
        headingId="color-foundation-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('Color', onNavigate)}
        title="Color"
        description="Inspect the generated color system and see how token values are applied across primitives, semantic roles, and component-specific color tokens. Use the settings menu to switch the active theme and color mode."
      />

      <Section padding="sm" contentWidth="xl" aria-labelledby="color-token-browser-heading">
        <Stack gap="lg">

          <Tabs value={activeTab} onChange={setActiveTab} variant="line">
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
                  size="compact"
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
                  size="compact"
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
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--base-spacing-12)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                  </div>
                  <SegmentedControl
                    value={compView}
                    onChange={setCompView}
                    options={[
                      { value: 'table', label: 'Table', icon: 'table_rows' },
                      { value: 'nodes', label: 'Nodes', icon: 'device_hub' },
                    ]}
                    aria-label="View mode"
                  />
                </div>
                {compView === 'table' ? (
                  <DataTable
                    columns={componentColorColumns}
                    rows={filteredComponentRows}
                    getRowId={(row) => row.id}
                    size="compact"
                    scrollable
                    caption="Component color tokens"
                    emptyTitle="No matching tokens"
                    emptyDescription="Try adjusting your search or clearing some filters."
                    emptyIcon="widgets"
                  />
                ) : (
                  <ComponentTokenGraph
                    compRows={filteredComponentRows}
                    semRows={resolvedSemanticRows}
                    primRows={resolvedPrimitiveRows}
                  />
                )}
              </Stack>
            </TabPanel>

          </Tabs>
        </Stack>
      </Section>
    </>
  )
}
