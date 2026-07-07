import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Card,
  FunnelChart,
  Grid,
  GridItem,
  Heading,
  MessageBadge,
  Paragraph,
  PieChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  Section,
  SegmentedControl,
  Stack,
  Stat,
  TreemapChart,
} from '@gtivr4/a1-design-system-react'
import tokens from '../../../../build/json/tokens.json'
import appLabels from '../../../../system/labels/app.json'
import actionLabels from '../../../../system/labels/action.json'
import backlogLabels from '../../../../system/labels/backlog.json'
import calendarLabels from '../../../../system/labels/calendar.json'
import codeLabels from '../../../../system/labels/code.json'
import fieldLabels from '../../../../system/labels/field.json'
import statusBarLabels from '../../../../system/labels/status-bar.json'
import treeMenuLabels from '../../../../system/labels/tree-menu.json'
import { useBacklog } from '../backlog/BacklogContext.jsx'
import { getLabels, subscribeLabels } from '../labels/labelStore.js'
import { listAllRules, subscribeRules } from '../rules/ruleStore.ts'
import {
  PRIORITIES,
  PRIORITY_LABELS,
  STATUS_FLOW,
  STATUS_LABELS,
  TERMINAL_STATUSES,
  TYPE_LABELS,
} from '../services/backlog/types'
import {
  COMPONENT_STATUS,
  PACKAGE_COLUMNS,
  PACKAGE_COVERAGE,
  componentCategories,
} from './components/data.js'
import { PageTitleArea } from './PageTitleArea.jsx'

const TONES = ['accent', 'info', 'success', 'warn', 'error']
const SYSTEM_SIGNALS = [
  {
    key: 'components',
    label: 'Components',
    tone: 'accent',
    color: 'var(--semantic-color-action-background)',
    icon: 'widgets',
  },
  {
    key: 'tokens',
    label: 'Tokens',
    tone: 'info',
    color: 'var(--semantic-color-status-info-background)',
    icon: 'token',
  },
  {
    key: 'rules',
    label: 'Rules',
    tone: 'success',
    color: 'var(--semantic-color-status-success-background)',
    icon: 'gavel',
  },
  {
    key: 'labels',
    label: 'Labels',
    tone: 'warn',
    color: 'var(--semantic-color-status-warn-background)',
    icon: 'translate',
  },
]
const SYSTEM_LABEL_SOURCES = [
  { name: 'App', data: appLabels },
  { name: 'Action', data: actionLabels },
  { name: 'Backlog', data: backlogLabels },
  { name: 'Calendar', data: calendarLabels },
  { name: 'Code', data: codeLabels },
  { name: 'Field', data: fieldLabels },
  { name: 'Status bar', data: statusBarLabels },
  { name: 'Tree menu', data: treeMenuLabels },
]

function number(value) {
  return new Intl.NumberFormat().format(value)
}

function percent(value, total) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

function countBy(items, getter) {
  return items.reduce((counts, item) => {
    const key = getter(item) || 'Unknown'
    counts[key] = (counts[key] ?? 0) + 1
    return counts
  }, {})
}

function rowsFromCounts(counts, labels = {}) {
  return Object.entries(counts)
    .map(([key, value], index) => ({
      key,
      name: labels[key] ?? key,
      value,
      tone: TONES[index % TONES.length],
    }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
}

function orderedRows(keys, counts, labels = {}) {
  return keys.map((key, index) => ({
    key,
    name: labels[key] ?? key,
    value: counts[key] ?? 0,
    tone: TONES[index % TONES.length],
  }))
}

function flattenTokenLeaves(node, path = [], out = []) {
  if (node == null) return out
  if (typeof node !== 'object' || Array.isArray(node)) {
    out.push({ path, value: node })
    return out
  }
  for (const [key, value] of Object.entries(node)) {
    flattenTokenLeaves(value, [...path, key], out)
  }
  return out
}

function inferTokenKind(value) {
  if (typeof value !== 'string') return 'Number'
  if (/^#|rgb|hsl|oklch|color-mix|currentColor/.test(value)) return 'Color'
  if (/^-?\d*\.?\d+(rem|em|px|%)$/.test(value)) return 'Dimension'
  if (/^-?\d*\.?\d+(ms|s)$/.test(value)) return 'Motion'
  if (value.includes('shadow')) return 'Shadow'
  if (value.includes(',')) return 'Stack'
  return 'Value'
}

function countLabelLeaves(node) {
  if (!node || typeof node !== 'object') return 0
  if (Object.hasOwn(node, '$value')) return 1
  return Object.values(node).reduce((count, value) => count + countLabelLeaves(value), 0)
}

function countLocaleEntries(node) {
  if (!node || typeof node !== 'object') return 0
  const own = node.locale && typeof node.locale === 'object' ? Object.keys(node.locale).length : 0
  return own + Object.values(node).reduce((count, value) => count + countLocaleEntries(value), 0)
}

function compactLabel(value) {
  return value
    .replace(/_/g, ' ')
    .replace(/^\w/, (letter) => letter.toUpperCase())
}

function DashboardCard({ title, description, view, onViewChange, options, children }) {
  return (
    <Card>
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} gap="sm" justify={{ md: 'between' }} align="start">
          <Stack gap="xs">
            <Heading as="h2" size="md">{title}</Heading>
            {description ? <Paragraph size="sm" color="muted">{description}</Paragraph> : null}
          </Stack>
          {options?.length ? (
            <SegmentedControl
              aria-label={`${title} view`}
              size="sm"
              labelMode="selected"
              options={options}
              value={view}
              onChange={onViewChange}
            />
          ) : null}
        </Stack>
        {children}
      </Stack>
    </Card>
  )
}

function BigStatCard({ label, value, icon, color, description }) {
  return (
    <Card status="neutral" style={color ? { '--a1-card-status-color': color } : undefined}>
      <Stack gap="sm">
        <Stat title={label} value={value} icon={icon} size="xl" />
        {description ? <Paragraph size="sm" color="muted">{description}</Paragraph> : null}
      </Stack>
    </Card>
  )
}

function SystemPulseCard({ componentCount, rules, tokenCount, labels }) {
  const systemRows = [
    {
      name: 'A1',
      components: componentCount,
      tokens: tokenCount,
      rules: rules.length,
      labels: labels.total,
    },
  ]

  return (
    <Card status="info">
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} gap="md" justify={{ md: 'between' }} align="start">
          <Stack gap="xs">
            <MessageBadge status="info" size="lg" subtle icon={null}>
              System pulse
            </MessageBadge>
            <Heading as="h2" size="lg">A1 operating pulse</Heading>
            <Paragraph color="muted">Actual design-system volume across components, rules, tokens, and labels.</Paragraph>
          </Stack>
        </Stack>

        <BarChart
          data={systemRows}
          xKey="name"
          series={SYSTEM_SIGNALS.map(({ key, label, tone }) => ({ key, label, tone }))}
          height="md"
          showLegend
          showGrid={false}
          showYAxis={false}
          aria-label="A1 system volume across components, tokens, rules, and labels"
        />
      </Stack>
    </Card>
  )
}

function TokenFlowCard() {
  const leaves = useMemo(() => flattenTokenLeaves(tokens), [])
  const tierRows = rowsFromCounts(countBy(leaves, (item) => compactLabel(item.path[0] ?? 'Other')))

  return (
    <DashboardCard
      title="Token tiers"
      description="Actual token volume by source tier."
    >
      <BarChart
        data={tierRows}
        xKey="name"
        series={[{ key: 'value', label: 'Tokens', tone: 'info' }]}
        height="sm"
        showLegend={false}
        showGrid={false}
        showYAxis={false}
        aria-label="Actual token volume by source tier"
      />
    </DashboardCard>
  )
}

function BacklogCard({ items }) {
  const [view, setView] = useState('status')
  const statusRows = orderedRows([...STATUS_FLOW, ...TERMINAL_STATUSES], countBy(items, (item) => item.status), STATUS_LABELS)
  const priorityRows = orderedRows(PRIORITIES, countBy(items, (item) => item.priority ?? 'Unprioritized'), PRIORITY_LABELS)
  const scopeRows = rowsFromCounts(countBy(items, (item) => item.scopeKind), {})
  const typeRows = rowsFromCounts(countBy(items, (item) => item.type), TYPE_LABELS)
  const trendRows = statusRows.map((row) => ({ name: row.name, tickets: row.value }))
  const chart = view === 'priority'
    ? <PieChart title="Tickets by priority" data={priorityRows} height="sm" />
    : view === 'scope'
      ? <BarChart title="Tickets by category" data={scopeRows} xKey="name" series={[{ key: 'value', label: 'Tickets', tone: 'accent' }]} height="sm" showLegend={false} />
      : view === 'type'
        ? <FunnelChart title="Tickets by type" data={typeRows} height="sm" />
        : <BarChart title="Tickets by workflow status" data={trendRows} xKey="name" series={[{ key: 'tickets', label: 'Tickets', tone: 'accent' }]} height="sm" showLegend={false} />

  return (
    <DashboardCard
      title="Backlog"
      description="Work by workflow health, priority, type, and product category."
      view={view}
      onViewChange={setView}
      options={[
        { value: 'status', label: 'Status', icon: 'view_kanban' },
        { value: 'priority', label: 'Priority', icon: 'priority_high' },
        { value: 'scope', label: 'Category', icon: 'category' },
        { value: 'type', label: 'Type', icon: 'label' },
      ]}
    >
      {chart}
    </DashboardCard>
  )
}

function ComponentsCard() {
  const [view, setView] = useState('category')
  const components = componentCategories.flatMap((category) => (
    category.components.map((component) => ({ ...component, category: category.title, categoryId: category.id }))
  ))
  const categoryRows = componentCategories.map((category, index) => ({
    name: category.title,
    value: category.components.length,
    tone: TONES[index % TONES.length],
  }))
  const packageRows = PACKAGE_COLUMNS.map((name, index) => ({
    name,
    value: components.filter((component) => (PACKAGE_COVERAGE[component.id] ?? ['React']).includes(name)).length,
    tone: TONES[index % TONES.length],
  }))
  const statusRows = rowsFromCounts(countBy(components, (component) => COMPONENT_STATUS[component.id] ?? 'beta'), {
    beta: 'Beta',
    experimental: 'Experimental',
    stable: 'Stable',
    deprecated: 'Deprecated',
  })
  const chart = view === 'package'
    ? <BarChart title="Components by package" data={packageRows} xKey="name" series={[{ key: 'value', label: 'Components', tone: 'accent' }]} height="sm" showLegend={false} />
    : view === 'status'
      ? <PieChart title="Components by maturity" data={statusRows} height="sm" />
      : <TreemapChart title="Components by category" data={categoryRows} height="sm" />

  return (
    <DashboardCard
      title="Components"
      description="Registry size, category spread, package coverage, and maturity."
      view={view}
      onViewChange={setView}
      options={[
        { value: 'category', label: 'Category', icon: 'category' },
        { value: 'package', label: 'Package', icon: 'inventory_2' },
        { value: 'status', label: 'Status', icon: 'science' },
      ]}
    >
      {chart}
    </DashboardCard>
  )
}

function TokensCard() {
  const [view, setView] = useState('tier')
  const leaves = useMemo(() => flattenTokenLeaves(tokens), [])
  const tierRows = rowsFromCounts(countBy(leaves, (item) => compactLabel(item.path[0] ?? 'Other')))
  const kindRows = rowsFromCounts(countBy(leaves, (item) => inferTokenKind(item.value)))
  const componentRows = rowsFromCounts(countBy(leaves.filter((item) => item.path[0] === 'component'), (item) => item.path[1] ?? 'Other')).slice(0, 10)
  const chart = view === 'kind'
    ? <PieChart title="Tokens by value kind" data={kindRows} height="sm" />
    : view === 'component'
      ? <BarChart title="Component token density" data={componentRows} xKey="name" series={[{ key: 'value', label: 'Tokens', tone: 'info' }]} height="sm" showLegend={false} />
      : <BarChart title="Tokens by tier" data={tierRows} xKey="name" series={[{ key: 'value', label: 'Tokens', tone: 'info' }]} height="sm" showLegend={false} />

  return (
    <DashboardCard
      title="Tokens"
      description="Generated token output by tier, inferred value kind, and component density."
      view={view}
      onViewChange={setView}
      options={[
        { value: 'tier', label: 'Tier', icon: 'layers' },
        { value: 'kind', label: 'Kind', icon: 'data_object' },
        { value: 'component', label: 'Component', icon: 'widgets' },
      ]}
    >
      {chart}
    </DashboardCard>
  )
}

function SystemMapCard({ items, rules, labels, tokenCount }) {
  const [view, setView] = useState('flow')
  const componentCount = componentCategories.reduce((total, category) => total + category.components.length, 0)
  const released = items.filter((item) => item.status === 'done' || item.status === 'released').length
  const active = items.filter((item) => !TERMINAL_STATUSES.includes(item.status)).length
  const flowData = {
    nodes: [
      { name: 'Tokens' },
      { name: 'Themes' },
      { name: 'Components' },
      { name: 'Rules' },
      { name: 'Labels' },
      { name: 'A1 web' },
      { name: 'Backlog' },
    ],
    links: [
      { source: 0, target: 1, value: Math.max(1, Math.round(tokenCount / 12)) },
      { source: 0, target: 2, value: Math.max(1, componentCount) },
      { source: 2, target: 3, value: Math.max(1, rules.length) },
      { source: 4, target: 5, value: Math.max(1, labels.total) },
      { source: 3, target: 5, value: Math.max(1, Math.round(rules.length / 2)) },
      { source: 5, target: 6, value: Math.max(1, active) },
    ],
  }
  const healthData = [
    { area: 'Backlog progress', score: percent(released, items.length) },
    { area: 'Component coverage', score: percent(componentCount, componentCount) },
    { area: 'Rule coverage', score: percent(rules.length, componentCount) },
    { area: 'Label coverage', score: percent(labels.system, labels.total || 1) },
    { area: 'Token depth', score: Math.min(100, Math.round(tokenCount / 15)) },
  ]
  const volumeData = [
    { name: 'Components', value: componentCount, tone: 'accent' },
    { name: 'Rules', value: rules.length, tone: 'info' },
    { name: 'Labels', value: labels.total, tone: 'success' },
    { name: 'Tickets', value: items.length, tone: 'warn' },
    { name: 'Token groups', value: Object.keys(tokens).length, tone: 'error' },
  ]
  const chart = view === 'health'
    ? <RadarChart title="System health signals" data={healthData} axisKey="area" series={[{ key: 'score', label: 'Score', tone: 'success' }]} height="sm" showLegend={false} />
    : view === 'volume'
      ? <RadialBarChart title="System volume" data={volumeData} height="sm" />
      : <SankeyChart title="System flow" data={flowData} height="sm" />

  return (
    <DashboardCard
      title="System map"
      description="How tokens, themes, components, rules, labels, and work planning feed the product."
      view={view}
      onViewChange={setView}
      options={[
        { value: 'flow', label: 'Flow', icon: 'schema' },
        { value: 'health', label: 'Health', icon: 'monitor_heart' },
        { value: 'volume', label: 'Volume', icon: 'donut_large' },
      ]}
    >
      {chart}
    </DashboardCard>
  )
}

function RulesCard({ rules }) {
  const [view, setView] = useState('applies')
  const appliesRows = rowsFromCounts(countBy(rules.flatMap((rule) => rule.appliesTo.length ? rule.appliesTo : ['General']), (item) => compactLabel(item))).slice(0, 8)
  const componentRows = rowsFromCounts(countBy(rules, (rule) => rule.component)).slice(0, 10)
  const enforcementRows = [
    { name: 'Documented', value: rules.length, tone: 'accent' },
    { name: 'ESLint', value: rules.filter((rule) => rule.enforcement?.eslint).length, tone: 'info' },
    { name: 'CSS gate', value: rules.filter((rule) => rule.enforcement?.css).length, tone: 'success' },
    { name: 'User-authored', value: rules.filter((rule) => rule.source === 'user').length, tone: 'warn' },
  ]
  const chart = view === 'component'
    ? <BarChart title="Rules by component" data={componentRows} xKey="name" series={[{ key: 'value', label: 'Rules', tone: 'warn' }]} height="sm" showLegend={false} />
    : view === 'enforcement'
      ? <PieChart title="Rules by enforcement" data={enforcementRows} height="sm" />
      : <BarChart title="Rules by category" data={appliesRows} xKey="name" series={[{ key: 'value', label: 'Rules', tone: 'warn' }]} height="sm" showLegend={false} />

  return (
    <DashboardCard
      title="Rules"
      description="Governance coverage across accessibility, layout, content, tokens, and enforcement."
      view={view}
      onViewChange={setView}
      options={[
        { value: 'applies', label: 'Category', icon: 'category' },
        { value: 'component', label: 'Component', icon: 'widgets' },
        { value: 'enforcement', label: 'Enforcement', icon: 'verified' },
      ]}
    >
      {chart}
    </DashboardCard>
  )
}

function LabelsCard({ labels }) {
  const [view, setView] = useState('source')
  const sourceRows = [
    ...SYSTEM_LABEL_SOURCES.map((source, index) => ({
      name: source.name,
      value: countLabelLeaves(source.data.label),
      tone: TONES[index % TONES.length],
    })),
    { name: 'Workspace', value: labels.workspace, tone: 'error' },
  ].filter((row) => row.value > 0)
  const localeRows = [
    { name: 'System translations', value: labels.localeEntries, tone: 'accent' },
    { name: 'Workspace rows', value: labels.workspace, tone: 'info' },
    { name: 'Locales', value: labels.locales, tone: 'success' },
  ]
  const categoryRows = rowsFromCounts(countBy(labels.workspaceItems, (item) => item.key?.split('.')?.[0] ?? 'Workspace'))
  const chart = view === 'locale'
    ? <RadialBarChart title="Label localization" data={localeRows} height="sm" />
    : view === 'workspace'
      ? <BarChart title="Workspace labels by namespace" data={categoryRows.length ? categoryRows : [{ name: 'Workspace', value: 0, tone: 'accent' }]} xKey="name" series={[{ key: 'value', label: 'Labels', tone: 'accent' }]} height="sm" showLegend={false} />
      : <PieChart title="Labels by source" data={sourceRows} height="sm" />

  return (
    <DashboardCard
      title="Labels"
      description="Bundled system labels plus workspace-authored localization rows."
      view={view}
      onViewChange={setView}
      options={[
        { value: 'source', label: 'Source', icon: 'source' },
        { value: 'locale', label: 'Locale', icon: 'language' },
        { value: 'workspace', label: 'Workspace', icon: 'edit_note' },
      ]}
    >
      {chart}
    </DashboardCard>
  )
}

export function SystemDashboard({ onNavigate }) {
  const backlog = useBacklog()
  const [rules, setRules] = useState(() => listAllRules())
  const [workspaceLabels, setWorkspaceLabels] = useState(() => getLabels())
  const tokenCount = useMemo(() => flattenTokenLeaves(tokens).length, [])
  const labelSummary = useMemo(() => {
    const system = SYSTEM_LABEL_SOURCES.reduce((total, source) => total + countLabelLeaves(source.data.label), 0)
    const localeEntries = SYSTEM_LABEL_SOURCES.reduce((total, source) => total + countLocaleEntries(source.data.label), 0)
    const workspaceItems = Array.isArray(workspaceLabels.items) ? workspaceLabels.items : []
    return {
      system,
      workspace: workspaceItems.length,
      workspaceItems,
      locales: Array.isArray(workspaceLabels.locales) ? workspaceLabels.locales.length : 0,
      localeEntries,
      total: system + workspaceItems.length,
    }
  }, [workspaceLabels])

  useEffect(() => subscribeRules(() => setRules(listAllRules())), [])
  useEffect(() => subscribeLabels(setWorkspaceLabels), [])

  const items = backlog?.items ?? []
  const componentCount = componentCategories.reduce((total, category) => total + category.components.length, 0)

  return (
    <>
      <PageTitleArea
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Dashboard' },
        ]}
        title="System dashboard"
        description="A live operating view of A1: backlog health, component coverage, token volume, system flow, rules, and labels. Switch each card to inspect a different lens, then jump into the source area for details."
        headingId="dashboard-heading"
      />
      <Section padding="sm" contentWidth="xxl" aria-labelledby="dashboard-heading">
        <Grid columns={{ xs: 1, lg: 4 }} gap="md" alignItems="stretch">
          <GridItem span={{ xs: 'full', lg: 3 }}>
            <SystemPulseCard componentCount={componentCount} rules={rules} tokenCount={tokenCount} labels={labelSummary} />
          </GridItem>
          <GridItem span={{ xs: 'full', lg: 1 }}>
            <Stack gap="md">
              <BigStatCard
                label="Components"
                value={componentCount}
                icon={SYSTEM_SIGNALS[0].icon}
                color={SYSTEM_SIGNALS[0].color}
                description={`${componentCategories.length} categories`}
              />
              <BigStatCard
                label="Tokens"
                value={number(tokenCount)}
                icon={SYSTEM_SIGNALS[1].icon}
                color={SYSTEM_SIGNALS[1].color}
                description="Generated tokens"
              />
              <BigStatCard
                label="Rules"
                value={rules.length}
                icon={SYSTEM_SIGNALS[2].icon}
                color={SYSTEM_SIGNALS[2].color}
                description="Governance checks"
              />
              <BigStatCard
                label="Labels"
                value={labelSummary.total}
                icon={SYSTEM_SIGNALS[3].icon}
                color={SYSTEM_SIGNALS[3].color}
                description={`${labelSummary.locales} locales`}
              />
            </Stack>
          </GridItem>

          <GridItem span={{ xs: 'full', lg: 2 }}>
            <SystemMapCard items={items} rules={rules} labels={labelSummary} tokenCount={tokenCount} />
          </GridItem>
          <GridItem span={{ xs: 'full', lg: 2 }}>
            <ComponentsCard />
          </GridItem>
          <GridItem span={{ xs: 'full', lg: 2 }}>
            <TokenFlowCard />
          </GridItem>
          <GridItem span={{ xs: 'full', lg: 2 }}>
            <BacklogCard items={items} />
          </GridItem>
        </Grid>
      </Section>
    </>
  )
}
