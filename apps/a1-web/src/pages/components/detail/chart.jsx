import {
  Accordion,
  AreaChart,
  BarChart,
  Code,
  ComposedChart,
  FunnelChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  ScatterChart,
  Stack,
  SunburstChart,
  TextField,
  TreemapChart,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, FieldState, statusOptions, Toggle } from './configKit.jsx'

const CHART_TYPES = [
  'line',
  'bar',
  'area',
  'composed',
  'pie',
  'scatter',
  'radar',
  'radial-bar',
  'funnel',
  'treemap',
  'sankey',
  'sunburst',
]

const CHART_COMPONENTS = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
  composed: ComposedChart,
  pie: PieChart,
  scatter: ScatterChart,
  radar: RadarChart,
  'radial-bar': RadialBarChart,
  funnel: FunnelChart,
  treemap: TreemapChart,
  sankey: SankeyChart,
  sunburst: SunburstChart,
}

const CHART_COMPONENT_NAMES = {
  line: 'LineChart',
  bar: 'BarChart',
  area: 'AreaChart',
  composed: 'ComposedChart',
  pie: 'PieChart',
  scatter: 'ScatterChart',
  radar: 'RadarChart',
  'radial-bar': 'RadialBarChart',
  funnel: 'FunnelChart',
  treemap: 'TreemapChart',
  sankey: 'SankeyChart',
  sunburst: 'SunburstChart',
}

const CHART_COPY = {
  line: {
    title: 'Monthly performance',
    description: 'Revenue, expenses, and forecast for the first half of the year.',
  },
  bar: {
    title: 'Quarterly pipeline',
    description: 'Open and committed pipeline by month.',
  },
  area: {
    title: 'Capacity allocation',
    description: 'Stacked area chart using A1 semantic series tones.',
  },
  composed: {
    title: 'Plan against actuals',
    description: 'Bars show revenue and expenses; the line shows forecast.',
  },
  pie: {
    title: 'Traffic mix',
    description: 'Channel share grouped by source.',
  },
  scatter: {
    title: 'Opportunity quality',
    description: 'Deal value compared with confidence score.',
  },
  radar: {
    title: 'Capability profile',
    description: 'Current and target scores by capability.',
  },
  'radial-bar': {
    title: 'Goal progress',
    description: 'Progress by team against the same target.',
  },
  funnel: {
    title: 'Conversion funnel',
    description: 'Prospects remaining at each lifecycle stage.',
  },
  treemap: {
    title: 'Portfolio allocation',
    description: 'Nested allocation by business area.',
  },
  sankey: {
    title: 'User journey flow',
    description: 'Movement between acquisition, product, and outcome stages.',
  },
  sunburst: {
    title: 'Product taxonomy',
    description: 'Hierarchical share across product families.',
  },
}

const HEIGHT_OPTIONS = ['sm', 'md', 'lg']
const CURVE_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'monotone', label: 'Monotone' },
  { value: 'natural', label: 'Natural' },
  { value: 'step', label: 'Step' },
]
const SERIES_TYPE_OPTIONS = [
  { value: 'line', label: 'Line', icon: 'show_chart' },
  { value: 'bar', label: 'Bar', icon: 'bar_chart' },
  { value: 'area', label: 'Area', icon: 'area_chart' },
]
const TONE_OPTIONS = statusOptions(['accent', 'info', 'success', 'warn', 'error', 'neutral'])

export const CARTESIAN_DATA = [
  { month: 'Jan', revenue: 32, expenses: 18, forecast: 26 },
  { month: 'Feb', revenue: 40, expenses: 22, forecast: 30 },
  { month: 'Mar', revenue: 36, expenses: 24, forecast: 34 },
  { month: 'Apr', revenue: 48, expenses: 28, forecast: 39 },
  { month: 'May', revenue: 56, expenses: 32, forecast: 45 },
  { month: 'Jun', revenue: 64, expenses: 36, forecast: 52 },
]

const CATEGORICAL_DATA = [
  { name: 'Organic', value: 420, tone: 'accent' },
  { name: 'Referral', value: 280, tone: 'info' },
  { name: 'Partner', value: 190, tone: 'success' },
  { name: 'Paid', value: 120, tone: 'warn' },
  { name: 'Other', value: 80, tone: 'neutral' },
]

const SCATTER_SERIES = [
  {
    key: 'enterprise',
    label: 'Enterprise',
    tone: 'accent',
    data: [
      { x: 42, y: 64, z: 18 },
      { x: 58, y: 72, z: 24 },
      { x: 67, y: 82, z: 28 },
      { x: 76, y: 86, z: 34 },
    ],
  },
  {
    key: 'midmarket',
    label: 'Midmarket',
    tone: 'info',
    data: [
      { x: 30, y: 48, z: 16 },
      { x: 44, y: 58, z: 20 },
      { x: 56, y: 62, z: 22 },
      { x: 70, y: 74, z: 26 },
    ],
  },
]

const RADAR_DATA = [
  { capability: 'Reach', current: 76, target: 88 },
  { capability: 'Quality', current: 82, target: 90 },
  { capability: 'Speed', current: 68, target: 84 },
  { capability: 'Retention', current: 72, target: 86 },
  { capability: 'Expansion', current: 64, target: 80 },
]

const TREEMAP_DATA = [
  {
    name: 'Acquisition',
    children: [
      { name: 'Organic', value: 420 },
      { name: 'Paid', value: 180 },
      { name: 'Partner', value: 240 },
    ],
  },
  {
    name: 'Product',
    children: [
      { name: 'Core', value: 360 },
      { name: 'Add-ons', value: 170 },
      { name: 'Services', value: 120 },
    ],
  },
]

const SUNBURST_DATA = {
  name: 'Products',
  children: [
    {
      name: 'Platform',
      children: [
        { name: 'Core', value: 360 },
        { name: 'Automation', value: 180 },
      ],
    },
    {
      name: 'Services',
      children: [
        { name: 'Strategy', value: 140 },
        { name: 'Support', value: 220 },
      ],
    },
  ],
}

const SANKEY_DATA = {
  nodes: [
    { name: 'Visit' },
    { name: 'Trial' },
    { name: 'Demo' },
    { name: 'Active' },
    { name: 'Lost' },
  ],
  links: [
    { source: 0, target: 1, value: 340 },
    { source: 0, target: 2, value: 220 },
    { source: 1, target: 3, value: 190 },
    { source: 1, target: 4, value: 150 },
    { source: 2, target: 3, value: 140 },
    { source: 2, target: 4, value: 80 },
  ],
}

const CARTESIAN_SERIES_FIELDS = [
  { id: 'revenue', label: 'Revenue', showKey: 'showRevenue', keyKey: 'revenueKey', labelKey: 'revenueLabel', toneKey: 'revenueTone', typeKey: 'revenueType' },
  { id: 'expenses', label: 'Expenses', showKey: 'showExpenses', keyKey: 'expensesKey', labelKey: 'expensesLabel', toneKey: 'expensesTone', typeKey: 'expensesType' },
  { id: 'forecast', label: 'Forecast', showKey: 'showForecast', keyKey: 'forecastKey', labelKey: 'forecastLabel', toneKey: 'forecastTone', typeKey: 'forecastType' },
]

const RADAR_SERIES_FIELDS = [
  { id: 'current', label: 'Current', showKey: 'showCurrent', keyKey: 'currentKey', labelKey: 'currentLabel', toneKey: 'currentTone' },
  { id: 'target', label: 'Target', showKey: 'showTarget', keyKey: 'targetKey', labelKey: 'targetLabel', toneKey: 'targetTone' },
]

const SCATTER_SERIES_FIELDS = [
  { id: 'enterprise', label: 'Enterprise', showKey: 'showEnterprise', labelKey: 'enterpriseLabel', toneKey: 'enterpriseTone', data: SCATTER_SERIES[0].data },
  { id: 'midmarket', label: 'Midmarket', showKey: 'showMidmarket', labelKey: 'midmarketLabel', toneKey: 'midmarketTone', data: SCATTER_SERIES[1].data },
]

function chartTypeFromConfig(config) {
  return CHART_TYPES.includes(config?.chartType) ? config.chartType : 'line'
}

function propString(name, value, defaultValue) {
  if (value == null || value === '' || value === defaultValue) return null
  return `${name}="${String(value).replaceAll('"', '&quot;')}"`
}

function boolProp(name, value, defaultValue) {
  return value === defaultValue ? null : `${name}={${value ? 'true' : 'false'}}`
}

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

function supportsCartesianSeries(type) {
  return type === 'line' || type === 'bar' || type === 'area' || type === 'composed'
}

function supportsCurve(type) {
  return type === 'line' || type === 'area' || type === 'composed'
}

function supportsStacking(type) {
  return type === 'bar' || type === 'area' || type === 'composed'
}

function supportsSeriesType(type) {
  return type === 'composed'
}

function usesCategoricalData(type) {
  return type === 'pie' || type === 'radial-bar' || type === 'funnel'
}

function usesHierarchyData(type) {
  return type === 'treemap' || type === 'sunburst'
}

function defaultDataForType(type) {
  if (type === 'scatter') return []
  if (type === 'radar') return RADAR_DATA
  if (usesCategoricalData(type)) return CATEGORICAL_DATA
  if (type === 'treemap') return TREEMAP_DATA
  if (type === 'sunburst') return SUNBURST_DATA
  if (type === 'sankey') return SANKEY_DATA
  return CARTESIAN_DATA
}

export function seriesFromConfig(config) {
  const type = chartTypeFromConfig(config)
  const fields = type === 'radar' ? RADAR_SERIES_FIELDS : CARTESIAN_SERIES_FIELDS
  return fields
    .filter((field) => config[field.showKey])
    .map((field) => {
      const series = {
        key: config[field.keyKey] || field.id,
        label: config[field.labelKey] || field.label,
        tone: config[field.toneKey],
      }
      if (supportsSeriesType(type)) series.type = config[field.typeKey]
      return series
    })
}

export function scatterSeriesFromConfig(config) {
  return SCATTER_SERIES_FIELDS
    .filter((field) => config[field.showKey])
    .map((field) => ({
      key: field.id,
      label: config[field.labelKey] || field.label,
      tone: config[field.toneKey],
      data: field.data,
    }))
}

function hydrateSeriesConfig(config, series, fields, { includeType = false } = {}) {
  if (!Array.isArray(series) || series.length === 0) return config

  fields.forEach((field, index) => {
    const item = series.find((candidate) => candidate?.key === field.id) ?? series[index]
    config[field.showKey] = Boolean(item)
    if (!item) return
    if (field.keyKey) config[field.keyKey] = item.key ?? field.id
    config[field.labelKey] = item.label ?? field.label
    config[field.toneKey] = item.tone ?? config[field.toneKey]
    if (includeType && field.typeKey) config[field.typeKey] = item.type ?? config[field.typeKey]
  })

  return config
}

export function configFromChartProps(type = 'line', props = {}) {
  const config = { ...getDefaultConfig(type), ...(props ?? {}) }
  const resolvedType = chartTypeFromConfig(config)

  if (supportsCartesianSeries(resolvedType)) {
    hydrateSeriesConfig(config, props?.series, CARTESIAN_SERIES_FIELDS, { includeType: supportsSeriesType(resolvedType) })
  } else if (resolvedType === 'radar') {
    hydrateSeriesConfig(config, props?.series, RADAR_SERIES_FIELDS)
  } else if (resolvedType === 'scatter') {
    hydrateSeriesConfig(config, props?.series, SCATTER_SERIES_FIELDS)
  }

  delete config.series
  return config
}

function displaySummary(config) {
  const type = chartTypeFromConfig(config)
  const items = [optionLabel(type), optionLabel(config.height || 'md')]
  if (config.variant === 'subtle') items.push('Subtle')
  if (supportsStacking(type) && config.stacked) items.push('Stacked')
  if (config.showLegend === false) items.push('No legend')
  return items.join(' / ')
}

function guideSummary(config) {
  const type = chartTypeFromConfig(config)
  const visible = [
    config.showGrid && (type === 'radar' ? 'Grid rings' : 'Grid'),
    config.showXAxis && 'Horizontal axis',
    config.showYAxis && 'Value axis',
    config.showAngleAxis && 'Angle axis',
    config.showRadiusAxis && 'Radius axis',
    config.showLegend && 'Legend',
    config.showTooltip && 'Tooltip',
  ].filter(Boolean)
  return visible.length ? visible.join(' / ') : 'All guides hidden'
}

export function chartPropsFromConfig(config) {
  const type = chartTypeFromConfig(config)
  const common = {
    title: config.title || undefined,
    description: config.description || undefined,
    height: config.height || 'md',
    variant: config.variant === 'subtle' ? 'subtle' : undefined,
    showTooltip: config.showTooltip !== false,
  }

  if (supportsCartesianSeries(type)) {
    const props = {
      ...common,
      data: Array.isArray(config.data) ? config.data : CARTESIAN_DATA,
      xKey: config.xKey || 'month',
      series: Array.isArray(config.series) && config.series.length > 0
        ? config.series
        : seriesFromConfig(config),
      stacked: supportsStacking(type) ? Boolean(config.stacked) : false,
      showGrid: config.showGrid !== false,
      showLegend: config.showLegend !== false,
      showXAxis: config.showXAxis !== false,
      showYAxis: config.showYAxis !== false,
    }
    if (supportsCurve(type)) props.curve = config.curve || 'monotone'
    return props
  }

  if (type === 'scatter') {
    return {
      ...common,
      xKey: config.xKey || 'x',
      yKey: config.yKey || 'y',
      zKey: config.zKey || 'z',
      series: Array.isArray(config.series) && config.series.length > 0 ? config.series : scatterSeriesFromConfig(config),
      showGrid: config.showGrid !== false,
      showLegend: config.showLegend !== false,
      showXAxis: config.showXAxis !== false,
      showYAxis: config.showYAxis !== false,
    }
  }

  if (type === 'radar') {
    return {
      ...common,
      data: Array.isArray(config.data) ? config.data : RADAR_DATA,
      axisKey: config.axisKey || 'capability',
      series: Array.isArray(config.series) && config.series.length > 0 ? config.series : seriesFromConfig(config),
      showGrid: config.showGrid !== false,
      showLegend: config.showLegend !== false,
      showAngleAxis: config.showAngleAxis !== false,
      showRadiusAxis: config.showRadiusAxis !== false,
    }
  }

  if (usesCategoricalData(type)) {
    return {
      ...common,
      data: Array.isArray(config.data) ? config.data : CATEGORICAL_DATA,
      nameKey: config.nameKey || 'name',
      valueKey: config.valueKey || 'value',
      showLegend: config.showLegend !== false,
    }
  }

  if (usesHierarchyData(type)) {
    return {
      ...common,
      data: config.data ?? defaultDataForType(type),
      nameKey: config.nameKey || 'name',
      valueKey: config.valueKey || 'value',
    }
  }

  if (type === 'sankey') {
    return {
      ...common,
      data: config.data ?? SANKEY_DATA,
    }
  }

  return common
}

function snippetDataLines(type, props) {
  if (type === 'sankey') {
    return [`const chartData = ${JSON.stringify(props.data, null, 2)}`]
  }
  if (type === 'scatter') {
    return [`const chartSeries = ${JSON.stringify(props.series, null, 2)}`]
  }
  if (type === 'radar' || supportsCartesianSeries(type)) {
    const lines = [`const chartData = ${JSON.stringify(props.data ?? defaultDataForType(type), null, 2)}`]
    if (props.series) lines.push(`const chartSeries = ${JSON.stringify(props.series, null, 2)}`)
    return lines
  }
  return [`const chartData = ${JSON.stringify(props.data, null, 2)}`]
}

function buildSnippet(config, utilityClass = '') {
  const type = chartTypeFromConfig(config)
  const componentName = CHART_COMPONENT_NAMES[type]
  const props = chartPropsFromConfig(config)
  const snippetProps = [
    utilityClass ? `className="${utilityClass.replaceAll('"', '&quot;')}"` : null,
    type === 'scatter' ? null : 'data={chartData}',
    props.xKey ? propString('xKey', props.xKey, type === 'scatter' ? 'x' : 'month') : null,
    props.yKey ? propString('yKey', props.yKey, 'y') : null,
    props.zKey ? propString('zKey', props.zKey, 'z') : null,
    props.axisKey ? propString('axisKey', props.axisKey, 'capability') : null,
    props.nameKey ? propString('nameKey', props.nameKey, 'name') : null,
    props.valueKey ? propString('valueKey', props.valueKey, 'value') : null,
    props.series ? 'series={chartSeries}' : null,
    propString('title', props.title),
    propString('description', props.description),
    propString('height', props.height, 'md'),
    propString('variant', props.variant, 'default'),
    supportsCurve(type) ? propString('curve', props.curve, 'monotone') : null,
    supportsStacking(type) ? boolProp('stacked', props.stacked, false) : null,
    props.showGrid != null ? boolProp('showGrid', props.showGrid, true) : null,
    props.showLegend != null ? boolProp('showLegend', props.showLegend, true) : null,
    boolProp('showTooltip', props.showTooltip, true),
    props.showXAxis != null ? boolProp('showXAxis', props.showXAxis, true) : null,
    props.showYAxis != null ? boolProp('showYAxis', props.showYAxis, true) : null,
    props.showAngleAxis != null ? boolProp('showAngleAxis', props.showAngleAxis, true) : null,
    props.showRadiusAxis != null ? boolProp('showRadiusAxis', props.showRadiusAxis, true) : null,
  ].filter(Boolean).join(' ')

  return `${snippetDataLines(type, props).join('\n\n')}

<${componentName}${snippetProps ? ` ${snippetProps}` : ''} />`
}

export function getDefaultConfig(type = 'line') {
  const resolvedType = CHART_TYPES.includes(type) ? type : 'line'
  const copy = CHART_COPY[resolvedType]
  return {
    chartType: resolvedType,
    title: copy.title,
    description: copy.description,
    xKey: resolvedType === 'scatter' ? 'x' : 'month',
    yKey: 'y',
    zKey: 'z',
    axisKey: 'capability',
    nameKey: 'name',
    valueKey: 'value',
    height: 'md',
    variant: 'default',
    curve: 'monotone',
    stacked: resolvedType === 'area',
    showGrid: true,
    showLegend: resolvedType !== 'treemap' && resolvedType !== 'sankey' && resolvedType !== 'sunburst',
    showTooltip: true,
    showXAxis: true,
    showYAxis: true,
    showAngleAxis: true,
    showRadiusAxis: true,
    showRevenue: true,
    revenueTone: 'accent',
    revenueKey: 'revenue',
    revenueLabel: 'Revenue',
    revenueType: resolvedType === 'line' ? 'line' : 'bar',
    showExpenses: true,
    expensesTone: 'warn',
    expensesKey: 'expenses',
    expensesLabel: 'Expenses',
    expensesType: resolvedType === 'area' ? 'area' : 'bar',
    showForecast: true,
    forecastTone: 'info',
    forecastKey: 'forecast',
    forecastLabel: 'Forecast',
    forecastType: resolvedType === 'composed' ? 'line' : resolvedType,
    showCurrent: true,
    currentTone: 'accent',
    currentKey: 'current',
    currentLabel: 'Current',
    showTarget: true,
    targetTone: 'info',
    targetKey: 'target',
    targetLabel: 'Target',
    showEnterprise: true,
    enterpriseTone: 'accent',
    enterpriseLabel: 'Enterprise',
    showMidmarket: true,
    midmarketTone: 'info',
    midmarketLabel: 'Midmarket',
  }
}

export function Preview({ config, utilityClass = '' }) {
  const type = chartTypeFromConfig(config)
  const Component = CHART_COMPONENTS[type]
  return (
    <Component
      className={utilityClass || undefined}
      {...chartPropsFromConfig(config)}
    />
  )
}

function KeyControls({ type, config, set }) {
  if (type === 'scatter') {
    return (
      <>
        <TextField label="Horizontal key" size="compact" value={config.xKey} onChange={(event) => set({ xKey: event.target.value })} />
        <TextField label="Value key" size="compact" value={config.yKey} onChange={(event) => set({ yKey: event.target.value })} />
        <TextField label="Size key" size="compact" value={config.zKey} onChange={(event) => set({ zKey: event.target.value })} />
      </>
    )
  }
  if (type === 'radar') {
    return <TextField label="Angle key" size="compact" value={config.axisKey} onChange={(event) => set({ axisKey: event.target.value })} />
  }
  if (usesCategoricalData(type) || usesHierarchyData(type)) {
    return (
      <>
        <TextField label="Name key" size="compact" value={config.nameKey} onChange={(event) => set({ nameKey: event.target.value })} />
        <TextField label="Value key" size="compact" value={config.valueKey} onChange={(event) => set({ valueKey: event.target.value })} />
      </>
    )
  }
  if (supportsCartesianSeries(type)) {
    return <TextField label="Horizontal key" size="compact" value={config.xKey} onChange={(event) => set({ xKey: event.target.value })} />
  }
  return null
}

function GuideControls({ type, config, set }) {
  const items = [
    (supportsCartesianSeries(type) || type === 'scatter' || type === 'radar') && { key: 'showGrid', label: type === 'radar' ? 'Grid rings' : 'Grid', icon: 'grid_3x3', value: config.showGrid },
    (supportsCartesianSeries(type) || type === 'scatter') && { key: 'showXAxis', label: 'Horizontal axis', icon: 'horizontal_rule', value: config.showXAxis },
    (supportsCartesianSeries(type) || type === 'scatter') && { key: 'showYAxis', label: 'Value axis', icon: 'vertical_distribute', value: config.showYAxis },
    type === 'radar' && { key: 'showAngleAxis', label: 'Angle axis', icon: 'radar', value: config.showAngleAxis },
    type === 'radar' && { key: 'showRadiusAxis', label: 'Radius axis', icon: 'radio_button_checked', value: config.showRadiusAxis },
    (supportsCartesianSeries(type) || type === 'scatter' || type === 'radar' || usesCategoricalData(type)) && { key: 'showLegend', label: 'Legend', icon: 'legend_toggle', value: config.showLegend },
    { key: 'showTooltip', label: 'Tooltip', icon: 'info', value: config.showTooltip },
  ].filter(Boolean)

  return (
    <Accordion label="Guides" subtext={guideSummary(config)} size="sm" divider>
      <FieldState
        label="Visible guides"
        helper="Keep legend or tooltip available so series colour is paired with text."
        items={items}
        onChange={set}
      />
    </Accordion>
  )
}

function SeriesControls({ type, config, set }) {
  if (!(supportsCartesianSeries(type) || type === 'radar' || type === 'scatter')) return null

  const fields = type === 'radar' ? RADAR_SERIES_FIELDS : type === 'scatter' ? SCATTER_SERIES_FIELDS : CARTESIAN_SERIES_FIELDS
  const visibleCount = type === 'scatter' ? scatterSeriesFromConfig(config).length : seriesFromConfig(config).length
  return (
    <Accordion label="Series" subtext={`${visibleCount} shown`} size="sm" divider>
      <Stack gap="lg">
        {fields.map((field) => (
          <Accordion key={field.id} label={field.label} subtext={config[field.showKey] ? optionLabel(config[field.toneKey]) : 'Hidden'} size="sm" divider>
            <Stack gap="md">
              <Toggle
                prop={field.showKey}
                label="Show series"
                value={config[field.showKey]}
                onChange={(value) => set({ [field.showKey]: value })}
              />
              {config[field.showKey] && (
                <>
                  {field.keyKey && (
                    <TextField
                      label="Data key"
                      size="compact"
                      value={config[field.keyKey] || field.id}
                      onChange={(event) => set({ [field.keyKey]: event.target.value })}
                    />
                  )}
                  <TextField
                    label="Label"
                    size="compact"
                    value={config[field.labelKey] || field.label}
                    onChange={(event) => set({ [field.labelKey]: event.target.value })}
                  />
                  <Choice
                    prop={field.toneKey}
                    label="Tone"
                    iconOnly
                    value={config[field.toneKey]}
                    onChange={(value) => set({ [field.toneKey]: value })}
                    options={TONE_OPTIONS}
                    helper="Series tones are A1 semantic tokens, not arbitrary chart colors."
                  />
                  {supportsSeriesType(type) && (
                    <Choice
                      prop={field.typeKey}
                      label="Series type"
                      labelMode="selected"
                      value={config[field.typeKey]}
                      onChange={(value) => set({ [field.typeKey]: value })}
                      options={SERIES_TYPE_OPTIONS}
                    />
                  )}
                </>
              )}
            </Stack>
          </Accordion>
        ))}
      </Stack>
    </Accordion>
  )
}

export function Controls({ config, setConfig }) {
  const type = chartTypeFromConfig(config)
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField label="Title" size="compact" value={config.title} onChange={(event) => set({ title: event.target.value })} />
      <TextField label="Description" size="compact" value={config.description} onChange={(event) => set({ description: event.target.value })} />
      <KeyControls type={type} config={config} set={set} />

      <Accordion label="Display" subtext={displaySummary(config)} size="sm" divider>
        <Stack gap="lg">
          <ConfigSlider prop="height" label="Height" values={HEIGHT_OPTIONS} value={config.height || 'md'} onChange={(height) => set({ height })} />
          {supportsCurve(type) && (
            <Choice prop="curve" label="Curve" value={config.curve || 'monotone'} onChange={(curve) => set({ curve })} options={CURVE_OPTIONS} />
          )}
          {supportsStacking(type) && (
            <Toggle prop="stacked" label="Stack series" value={config.stacked} onChange={(stacked) => set({ stacked })} />
          )}
        </Stack>
      </Accordion>

      <GuideControls type={type} config={config} set={set} />
      <SeriesControls type={type} config={config} set={set} />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}

function createChartDetail(type) {
  return {
    getDefaultConfig: () => getDefaultConfig(type),
    Preview,
    Controls,
    Snippet,
  }
}

export const lineChartDetail = createChartDetail('line')
export const barChartDetail = createChartDetail('bar')
export const areaChartDetail = createChartDetail('area')
export const composedChartDetail = createChartDetail('composed')
export const pieChartDetail = createChartDetail('pie')
export const scatterChartDetail = createChartDetail('scatter')
export const radarChartDetail = createChartDetail('radar')
export const radialBarChartDetail = createChartDetail('radial-bar')
export const funnelChartDetail = createChartDetail('funnel')
export const treemapChartDetail = createChartDetail('treemap')
export const sankeyChartDetail = createChartDetail('sankey')
export const sunburstChartDetail = createChartDetail('sunburst')
