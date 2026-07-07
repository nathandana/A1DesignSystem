import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AreaChart,
  BarChart,
  Card,
  Code,
  ComposedChart,
  Canvas,
  Divider,
  FunnelChart,
  Grid,
  GridItem,
  Heading,
  IconButton,
  LineChart,
  Link,
  MessageBadge,
  Node,
  Paragraph,
  PieChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  ScatterChart,
  Stack,
  StatusBar,
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

const HEIGHT_OPTIONS = ['xs', 'sm', 'md', 'lg']
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
const LIVE_API_INCIDENT_EXAMPLE = 'live-api-incident'
const UPTIME_TIMELINE_EXAMPLE = 'uptime-timeline'
const API_MONITORING_EXAMPLE = 'api-monitoring'
const SERVICE_METRICS_EXAMPLE = 'service-metrics-card'
const REVENUE_RINGS_EXAMPLE = 'revenue-rings'
const CRYPTO_MARKET_EXAMPLE = 'crypto-market-cards'
const MATCH_TIMELINE_EXAMPLE = 'match-timeline'
const NFL_SCORIGAMI_EXAMPLE = 'nfl-scorigami'

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

const LIVE_TRAFFIC_SEED = Array.from({ length: 18 }, (_, index) => {
  const tick = index + 1
  const wave = Math.sin(tick * 0.9) * 7
  const drift = (tick % 4) - 1
  return {
    tick: String(tick),
    ms: Math.max(24, Math.min(58, Math.round(38 + wave + drift))),
  }
})

const LIVE_INCIDENT_LATENCY_PATTERN = [
  38, 42, 45, 41, 39, 44,
  48, 52, 57, 65, 78, 86,
  94, 108, 122, 116, 92, 62,
  86, 108, 122, 92, 62, 40,
]

function toneForLatency(ms) {
  if (ms >= 105) return 'error'
  if (ms >= 80) return 'warn'
  return 'success'
}

const LIVE_INCIDENT_TRAFFIC_SEED = LIVE_INCIDENT_LATENCY_PATTERN.slice(0, 18).map((ms, index) => ({
  tick: String(index + 1),
  ms,
  tone: toneForLatency(ms),
}))

const UPTIME_TIMELINE_DATA = Array.from({ length: 28 }, (_, index) => {
  const incidentDays = new Set([3, 11, 20])
  return {
    day: String(index + 1),
    healthy: incidentDays.has(index) ? 0 : 100,
    incident: incidentDays.has(index) ? 62 : 0,
  }
})

const API_MONITORING_DATA = [
  { time: '00:00', requests: 42, cache: 28, errors: 2 },
  { time: '02:00', requests: 48, cache: 32, errors: 1 },
  { time: '04:00', requests: 44, cache: 34, errors: 1 },
  { time: '06:00', requests: 61, cache: 42, errors: 3 },
  { time: '08:00', requests: 78, cache: 55, errors: 4 },
  { time: '10:00', requests: 86, cache: 63, errors: 2 },
  { time: '12:00', requests: 92, cache: 68, errors: 2 },
  { time: '14:00', requests: 88, cache: 64, errors: 5 },
  { time: '16:00', requests: 96, cache: 72, errors: 3 },
  { time: '18:00', requests: 84, cache: 61, errors: 2 },
  { time: '20:00', requests: 70, cache: 49, errors: 1 },
  { time: '22:00', requests: 56, cache: 38, errors: 1 },
]

const SERVICE_METRIC_DATA = [
  {
    key: 'requests',
    label: 'Requests',
    value: '62k',
    direction: 'up',
    tone: 'info',
    data: [
      { tick: '1', value: 34 },
      { tick: '2', value: 42 },
      { tick: '3', value: 45 },
      { tick: '4', value: 55 },
      { tick: '5', value: 59 },
      { tick: '6', value: 68 },
    ],
  },
  {
    key: 'errors',
    label: 'Errors',
    value: '0.2k',
    direction: 'up',
    tone: 'error',
    data: [
      { tick: '1', value: 22 },
      { tick: '2', value: 30 },
      { tick: '3', value: 51 },
      { tick: '4', value: 58 },
      { tick: '5', value: 63 },
      { tick: '6', value: 76 },
    ],
  },
  {
    key: 'latency',
    label: 'Latency',
    value: '7ms',
    direction: 'down',
    tone: 'accent',
    data: [
      { tick: '1', value: 44 },
      { tick: '2', value: 46 },
      { tick: '3', value: 48 },
      { tick: '4', value: 63 },
      { tick: '5', value: 66 },
      { tick: '6', value: 72 },
    ],
  },
]

const REVENUE_RING_DATA = [
  { name: 'Monthly', value: 64, tone: 'warn' },
  { name: 'Yearly', value: 88, tone: 'accent' },
]

const CRYPTO_LINE_DATA = [
  { time: '09:00', btc: 54 },
  { time: '10:00', btc: 42 },
  { time: '11:00', btc: 58 },
  { time: '12:00', btc: 48 },
  { time: '13:00', btc: 62 },
  { time: '14:00', btc: 70 },
  { time: '15:00', btc: 60 },
  { time: '16:00', btc: 66 },
  { time: '17:00', btc: 57 },
  { time: '18:00', btc: 46 },
  { time: '19:00', btc: 38 },
]

const CRYPTO_MARKET_ROWS = [
  {
    symbol: 'ETH / USD',
    value: '0.02',
    change: '15%',
    status: 'success',
    icon: 'token',
    meter: 72,
  },
  {
    symbol: 'XRP / USD',
    value: '-0.06',
    change: '-1%',
    status: 'error',
    icon: 'hub',
    meter: 18,
  },
]

const MATCH_TIMELINE_DATA = [
  { minute: 'KO', usa: 12, belgium: -26 },
  { minute: '5', usa: 28, belgium: -25 },
  { minute: '10', usa: 18, belgium: -12 },
  { minute: '15', usa: 10, belgium: -20 },
  { minute: '20', usa: 6, belgium: -9 },
  { minute: '25', usa: 4, belgium: -6 },
  { minute: '30', usa: 2, belgium: -5 },
  { minute: '35', usa: 12, belgium: -4 },
  { minute: '40', usa: 5, belgium: -24 },
  { minute: '45', usa: 2, belgium: -28 },
  { minute: 'HT', usa: 0, belgium: 0 },
  { minute: '50', usa: 30, belgium: -1 },
  { minute: '55', usa: 46, belgium: -18 },
  { minute: '60', usa: 18, belgium: -30 },
  { minute: '65', usa: 4, belgium: -7 },
  { minute: '70', usa: 16, belgium: -4 },
  { minute: '75', usa: 8, belgium: -2 },
  { minute: '80', usa: 12, belgium: -1 },
  { minute: '85', usa: 18, belgium: -3 },
  { minute: '90', usa: 38, belgium: -12 },
  { minute: 'FT', usa: 6, belgium: -4 },
]

// Source: https://nflscorigami.com/data. Historical data is credited by NFL Scorigami to Pro Football Reference.
// Top 96 final-score combinations by occurrence count, fetched July 7, 2026.
const NFL_SCORIGAMI_SCORE_COUNTS = [
  [20, 17, 302], [27, 24, 244], [23, 20, 217], [17, 14, 200],
  [24, 17, 181], [13, 10, 170], [24, 21, 161], [16, 13, 150],
  [17, 10, 150], [24, 14, 141], [24, 10, 139], [27, 20, 136],
  [23, 17, 129], [20, 10, 127], [27, 17, 125], [24, 20, 122],
  [20, 13, 121], [17, 7, 110], [17, 13, 110], [21, 17, 109],
  [27, 10, 106], [31, 17, 105], [21, 14, 101], [20, 14, 98],
  [27, 21, 97], [30, 27, 97], [27, 7, 95], [31, 14, 94],
  [31, 28, 94], [7, 0, 93], [20, 7, 92], [31, 24, 92],
  [14, 7, 90], [10, 7, 89], [14, 10, 88], [27, 14, 87],
  [16, 10, 85], [17, 16, 85], [21, 7, 85], [24, 7, 83],
  [28, 7, 83], [31, 21, 83], [31, 7, 82], [34, 31, 82],
  [6, 0, 80], [13, 7, 78], [24, 23, 78], [28, 21, 78],
  [28, 24, 78], [14, 0, 77], [27, 13, 77], [31, 10, 76],
  [0, 0, 73], [21, 20, 73], [23, 7, 72], [20, 0, 71],
  [24, 13, 70], [28, 14, 70], [34, 17, 70], [20, 16, 69],
  [21, 0, 68], [23, 10, 68], [34, 7, 67], [16, 14, 66],
  [27, 0, 66], [30, 24, 66], [13, 0, 65], [17, 3, 65],
  [20, 3, 65], [28, 17, 65], [31, 13, 65], [17, 6, 64],
  [21, 10, 64], [24, 0, 64], [24, 3, 64], [34, 24, 64],
  [19, 17, 62], [10, 0, 61], [10, 6, 61], [30, 10, 61],
  [34, 14, 61], [3, 0, 60], [26, 20, 59], [31, 27, 59],
  [38, 14, 59], [14, 13, 58], [17, 0, 58], [23, 21, 58],
  [13, 6, 57], [7, 6, 56], [19, 16, 56], [20, 6, 56],
  [30, 17, 55], [34, 27, 55], [35, 14, 55], [38, 10, 55],
]

function toneForScorigamiCount(count) {
  if (count >= 200) return 'accent'
  if (count >= 140) return 'info'
  if (count >= 100) return 'success'
  if (count >= 75) return 'warn'
  return 'neutral'
}

function apiMonitoringFrame(phase) {
  return API_MONITORING_DATA.map((point, index) => {
    const wave = Math.sin((phase + index) * 0.42) * 5
    const drift = Math.cos((phase + index) * 0.18) * 3
    const requests = Math.max(28, Math.round(point.requests + wave + drift))
    const cache = Math.max(18, Math.round(requests * (0.68 + ((index % 4) * 0.02))))
    const errors = Math.max(1, Math.round(point.errors + Math.sin((phase + index) * 0.3)))
    return {
      ...point,
      requests,
      cache,
      errors,
    }
  })
}

function nextTrafficPoint(previous) {
  const last = previous.at(-1)
  const lastTick = Number(last?.tick ?? previous.length)
  const wave = Math.sin((lastTick + 1) * 0.9) * 7
  const drift = ((lastTick + 1) % 4) - 1
  const ms = Math.max(24, Math.min(58, Math.round(38 + wave + drift)))
  return { tick: String(lastTick + 1), ms }
}

function nextIncidentTrafficPoint(previous) {
  const last = previous.at(-1)
  const lastTick = Number(last?.tick ?? previous.length)
  const nextTick = lastTick + 1
  const ms = LIVE_INCIDENT_LATENCY_PATTERN[(nextTick - 1) % LIVE_INCIDENT_LATENCY_PATTERN.length]
  return {
    tick: String(nextTick),
    ms,
    tone: toneForLatency(ms),
  }
}

function statusForLatency(ms) {
  return toneForLatency(ms)
}

function labelForLatencyStatus(status) {
  if (status === 'error') return 'Incident'
  if (status === 'warn') return 'Degraded'
  return 'Operational'
}



function LiveApiIncidentCard() {
  const [traffic, setTraffic] = useState(LIVE_INCIDENT_TRAFFIC_SEED)
  const latest = traffic.at(-1)?.ms ?? 0
  const status = statusForLatency(latest)
  const series = useMemo(() => [{ key: 'ms', label: 'Latency', tone: 'success' }], [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setTraffic((current) => [...current.slice(1), nextIncidentTrafficPoint(current)])
    }, 1200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Card status={status}>
      <Stack gap="md">
        <Stack direction="row" gap="sm" align="start" justify="between">
          <Stack gap={2}>
            <Heading as="h2" size="md">API Gateway</Heading>
            <Paragraph size="sm" color="muted"><strong>Incident Recovery</strong></Paragraph>
          </Stack>
          <MessageBadge status={status} subtle size="lg" icon={null}>{labelForLatencyStatus(status)}</MessageBadge>
        </Stack>

        <Stack gap="xs">
          <Grid columns={5} gap="sm" alignItems="end">
            <GridItem span={1}>
              <Paragraph size="sm" color="accent"><strong>{latest}ms</strong></Paragraph>
            </GridItem>
            <GridItem span={4}>
              <BarChart
                data={traffic}
                xKey="tick"
                series={series}
                height="xs"
                showGrid={false}
                showLegend={false}
                showTooltip={false}
                showXAxis={false}
                showYAxis={false}
                aria-label="Virtual live-updating API gateway latency that degrades, errors, and recovers"
              />
            </GridItem>
          </Grid>
          <Divider space="none" />
          <Stack direction="row" justify="between" align="center">
            <Paragraph size="sm" color="muted">Recovery target</Paragraph>
            <Paragraph size="sm"><strong>{status === 'success' ? 'Met' : 'Monitoring'}</strong></Paragraph>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}

function UptimeTimelineCard() {
  const series = useMemo(() => [
    { key: 'healthy', label: 'Healthy', tone: 'success' },
    { key: 'incident', label: 'Incident', tone: 'error' },
  ], [])

  return (
    <Card>
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="md" align="start" justify={{ sm: 'between' }}>
          <Stack gap="xs">
            <Heading as="h2" size="md">Authentication API v2</Heading>
            <Paragraph size="sm" color="muted"><strong>RESTFUL ENDPOINT · US-EAST-1</strong></Paragraph>
          </Stack>
          <Stack gap="xs" align={{ sm: 'end' }}>
            <MessageBadge status="success" subtle size="lg" icon={null}>Operational</MessageBadge>
            <Paragraph size="sm" color="muted"><strong>42ms latency</strong></Paragraph>
          </Stack>
        </Stack>

        <Stack gap="xs">
          <BarChart
            data={UPTIME_TIMELINE_DATA}
            xKey="day"
            series={series}
            height="xs"
            showGrid={false}
            showLegend={false}
            showTooltip={false}
            showXAxis={false}
            showYAxis={false}
            aria-label="Authentication API 90-day uptime with three incident days"
          />
          <Stack direction="row" justify="between" align="center">
            <Paragraph size="sm" color="muted">90 days ago</Paragraph>
            <Paragraph size="sm"><strong>100% Uptime Today</strong></Paragraph>
          </Stack>
        </Stack>

        <Divider space="none" />
        <Stack direction="row" justify="between" align="center">
          <Paragraph size="sm"><strong>99.99%</strong></Paragraph>
          <Link href="#" icon="arrow_forward" iconPosition="end" size="sm" weight="semibold">
            View detailed metrics
          </Link>
        </Stack>
      </Stack>
    </Card>
  )
}

function ApiMonitoringCard() {
  const [phase, setPhase] = useState(0)
  const traffic = useMemo(() => apiMonitoringFrame(phase), [phase])
  const series = useMemo(() => [
    { key: 'requests', label: 'Requests', tone: 'accent' },
    { key: 'cache', label: 'Cache hits', tone: 'success' },
    { key: 'errors', label: 'Errors', tone: 'error' },
  ], [])
  const latest = traffic.at(-1)

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((current) => current + 1)
    }, 450)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Card status="info">
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="md" align="start" justify={{ sm: 'between' }}>
          <Stack gap="xs">
            <Heading as="h2" size="md">API Monitoring</Heading>
            <Paragraph size="sm" color="muted"><strong>Gateway traffic · Last 24 hours</strong></Paragraph>
          </Stack>
          <MessageBadge status="success" subtle size="lg" icon={null}>Healthy</MessageBadge>
        </Stack>

        <Grid columns={{ xs: 1, sm: 3 }} gap="md">
          <Stack gap={2}>
            <Paragraph size="xs" color="muted">Requests</Paragraph>
            <Paragraph size="lg"><strong>{latest?.requests ?? 0}k</strong></Paragraph>
          </Stack>
          <Stack gap={2}>
            <Paragraph size="xs" color="muted">P95 latency</Paragraph>
            <Paragraph size="lg"><strong>{Math.max(32, Math.round((latest?.requests ?? 0) * 0.48))}ms</strong></Paragraph>
          </Stack>
          <Stack gap={2}>
            <Paragraph size="xs" color="muted">Error rate</Paragraph>
            <Paragraph size="lg"><strong>{(((latest?.errors ?? 0) / Math.max(1, latest?.requests ?? 1)) * 100).toFixed(2)}%</strong></Paragraph>
          </Stack>
        </Grid>

        <AreaChart
          data={traffic}
          xKey="time"
          series={series}
          height="sm"
          curve="monotone"
          stacked
          showLegend
          showTooltip
          showGrid={false}
          showYAxis={false}
          aria-label="Virtual live-updating API monitoring requests, cache hits, and errors over the last 24 hours"
        />

        <Divider space="none" />
        <Stack direction="row" justify="between" align="center">
          <Paragraph size="sm" color="muted">Updated just now</Paragraph>
          <Link href="#" icon="arrow_forward" iconPosition="end" size="sm" weight="semibold">
            View API metrics
          </Link>
        </Stack>
      </Stack>
    </Card>
  )
}

function ServiceMetricTile({ metric }) {
  const series = useMemo(() => [{ key: 'value', label: metric.label, tone: metric.tone }], [metric])
  const directionIcon = metric.direction === 'down' ? 'south_east' : 'north_east'
  const directionStatus = metric.direction === 'down' ? 'success' : metric.tone === 'error' ? 'error' : 'success'

  return (
    <Stack gap="xs">
      <Stack gap={2}>
        <Stack direction="row" gap="xs" align="center">
          <Paragraph size="lg"><strong>{metric.value}</strong></Paragraph>
          <MessageBadge status={directionStatus} subtle size="sm" icon={directionIcon}>
            {metric.direction === 'down' ? 'Down' : 'Up'}
          </MessageBadge>
        </Stack>
        <Paragraph size="xs" color="muted"><strong>{metric.label}</strong></Paragraph>
      </Stack>
      <AreaChart
        data={metric.data}
        xKey="tick"
        series={series}
        height="xs"
        curve="monotone"
        showGrid={false}
        showLegend={false}
        showTooltip={false}
        showXAxis={false}
        showYAxis={false}
        aria-label={`Salesforce ${metric.label.toLowerCase()} mini trend`}
      />
    </Stack>
  )
}

function ServiceMetricsCard() {
  return (
    <Card>
      <Stack gap="lg">
        <Stack direction="row" gap="md" align="center" justify="between">
          <Stack direction="row" gap="sm" align="center">
            <MessageBadge status="info" subtle size="lg" icon="cloud">
              SalesForce
            </MessageBadge>
            <Paragraph size="sm" color="muted">Connected service</Paragraph>
          </Stack>
          <Stack direction="row" gap="xs" align="center">
            <IconButton icon="settings" label="Service settings" size="sm" variant="secondary" />
            <IconButton icon="tune" label="Filter service metrics" size="sm" variant="secondary" />
          </Stack>
        </Stack>

        <Grid columns={{ xs: 1, sm: 3 }} gap="sm" alignItems="end">
          {SERVICE_METRIC_DATA.map((metric) => (
            <ServiceMetricTile key={metric.key} metric={metric} />
          ))}
        </Grid>
      </Stack>
    </Card>
  )
}

function RevenueRingsCard() {
  return (
    <Card>
      <Grid columns={{ xs: 1, sm: 2 }} gap="lg" alignItems="center">
        <RadialBarChart
          data={REVENUE_RING_DATA}
          nameKey="name"
          valueKey="value"
          height="sm"
          showLegend={false}
          showTooltip
          aria-label="Monthly and yearly revenue progress"
        />
        <Stack gap="lg">
          <Stack gap="xs">
            <MessageBadge status="warn" subtle size="lg" icon="radio_button_checked">
              Monthly
            </MessageBadge>
            <Heading as="h2" size="lg">24.320$</Heading>
          </Stack>
          <Stack gap="xs">
            <MessageBadge status="info" subtle size="lg" icon="radio_button_checked">
              Yearly
            </MessageBadge>
            <Heading as="h2" size="lg">94.020$</Heading>
          </Stack>
        </Stack>
      </Grid>
    </Card>
  )
}

function CryptoMarketRow({ row }) {
  const isPositive = row.status === 'success'

  return (
    <Stack gap="md">
      <Grid columns={12} gap="md" alignItems="center">
        <GridItem span={3}>
          <MessageBadge status={row.status} subtle  icon={row.icon}>
            {row.symbol.slice(0, 3)}
          </MessageBadge>
        </GridItem>
        <GridItem span={4}>
          <Stack gap={2}>
            <Heading as="h3" size="sm">{row.symbol}</Heading>
            <Paragraph color="muted">{row.value}</Paragraph>
          </Stack>
        </GridItem>
        <GridItem span={5}>
          <Stack gap="xs" align="end">
            <StatusBar
              value={row.meter}
              size="lg"
              aria-label={`${row.symbol} relative market movement`}
            />
            <MessageBadge status={row.status}  size="md" icon={isPositive ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}>
              {row.change}
            </MessageBadge>
          </Stack>
        </GridItem>
      </Grid>
      <Divider space="none" />
    </Stack>
  )
}

function CryptoMarketCards() {
  const btcSeries = useMemo(() => [{ key: 'btc', label: 'BTC / USD', tone: 'error' }], [])

  return (
    <Card>
      <Stack gap="lg">
        <Stack direction="row" justify="between" align="center">
          <Heading as="h2" size="md">BTC / USD</Heading>
          <MessageBadge status="error" subtle size="lg" icon={null}>-0.52%</MessageBadge>
        </Stack>
        <LineChart
          data={CRYPTO_LINE_DATA}
          xKey="time"
          series={btcSeries}
          height="xs"
          curve="monotone"
          showGrid={false}
          showLegend={false}
          showTooltip={false}
          showXAxis={false}
          showYAxis={false}
          aria-label="BTC to USD intraday trend"
        />
        <Divider space="none" />
        <Stack gap="md">
          {CRYPTO_MARKET_ROWS.map((row) => (
            <CryptoMarketRow key={row.symbol} row={row} />
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

function MatchTimelineCard() {
  const series = useMemo(() => [
    { key: 'usa', label: 'USA momentum', tone: 'info' },
    { key: 'belgium', label: 'Belgium momentum', tone: 'error' },
  ], [])

  return (
    <Card>
      <Stack gap="lg">
          <Stack direction="row" justify="between" align="center">
            <Heading as="h2" size="md">Match timeline & momentum</Heading>
            <IconButton icon="info" label="About match momentum" size="sm" variant="secondary" />
          </Stack>
          <Divider space="none" lineStyle="dotted" />
          <Grid columns={{ xs: 1, sm: 2 }} gap="md" alignItems="center">
            <Stack direction="row" gap="sm" align="center">
              <MessageBadge status="info" subtle size="lg" icon={null}>USA</MessageBadge>
              <Paragraph color="muted">Home pressure</Paragraph>
            </Stack>
            <Stack direction="row" gap="sm" align="center" justify="end">
              <Paragraph color="muted">Away pressure</Paragraph>
              <MessageBadge status="error" subtle size="lg" icon={null}>BEL</MessageBadge>
            </Stack>
          </Grid>
          <LineChart
            data={MATCH_TIMELINE_DATA}
            xKey="minute"
            series={series}
            height="sm"
            curve="natural"
            showGrid
            showLegend
            showTooltip
            showXAxis
            showYAxis={false}
            aria-label="Match timeline and momentum for USA and Belgium"
          />
      </Stack>
    </Card>
  )
}

function ScorigamiCanvasCard() {
  const axisScores = [0, 7, 14, 21, 28, 35, 42]
  const scoreNodes = NFL_SCORIGAMI_SCORE_COUNTS.map(([win, lose, count]) => ({
    id: `score-${win}-${lose}`,
    x: (win * 64) + 128,
    y: (lose * 64) + 128,
    win,
    lose,
    count,
    tone: toneForScorigamiCount(count),
  }))

  return (
    <Card>
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="md" align="start" justify={{ sm: 'between' }}>
          <Stack gap="xs">
            <Heading as="h2" size="md">NFL scorigami frequency</Heading>
            <Paragraph size="sm" color="muted">
              Winning score runs left to right; losing or tied score runs top to bottom.
            </Paragraph>
          </Stack>
          <MessageBadge status="info" subtle size="lg" icon="sports_football">
            Top 96
          </MessageBadge>
        </Stack>

        <Canvas
          aria-label="NFL scorigami score frequency canvas"
          background="page"
          gridType="dots"
          gridSpacing={32}
          defaultZoom={0.55}
          defaultPan={{ x: 40, y: 48 }}
          showControls
        >
          {axisScores.map((score) => (
            <Node
              key={`win-axis-${score}`}
              id={`win-axis-${score}`}
              x={(score * 64) + 128}
              y={64}
              label={`${score}`}
              sublabel="win"
              shape="rectangle"
              size="xs"
              color="neutral"
              subtle
              title={`Winning score ${score}`}
            />
          ))}
          {axisScores.map((score) => (
            <Node
              key={`lose-axis-${score}`}
              id={`lose-axis-${score}`}
              x={48}
              y={(score * 64) + 128}
              label={`${score}`}
              sublabel="lose"
              shape="rectangle"
              size="xs"
              color="neutral"
              subtle
              title={`Losing or tied score ${score}`}
            />
          ))}
          {scoreNodes.map((score) => (
            <Node
              key={score.id}
              id={score.id}
              x={score.x}
              y={score.y}
              label={`${score.count}`}
              sublabel={`${score.win}-${score.lose}`}
              shape="square"
              size="xs"
              color={score.tone}
              subtle={score.count < 140}
              title={`${score.win}-${score.lose}: ${score.count} NFL games`}
            />
          ))}
        </Canvas>

        <Paragraph size="xs" color="muted">
          Data from NFL Scorigami, which credits Pro Football Reference for historical game scores.
        </Paragraph>
      </Stack>
    </Card>
  )
}

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



function buildLiveApiIncidentSnippet() {
  return `import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Card,
  Divider,
  Grid,
  GridItem,
  Heading,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const latencyPattern = ${JSON.stringify(LIVE_INCIDENT_LATENCY_PATTERN, null, 2)}
const initialTraffic = ${JSON.stringify(LIVE_INCIDENT_TRAFFIC_SEED, null, 2)}

function toneForLatency(ms) {
  if (ms >= 105) return 'error'
  if (ms >= 80) return 'warn'
  return 'success'
}

function nextTrafficPoint(previous) {
  const last = previous.at(-1)
  const lastTick = Number(last?.tick ?? previous.length)
  const nextTick = lastTick + 1
  const ms = latencyPattern[(nextTick - 1) % latencyPattern.length]
  return {
    tick: String(nextTick),
    ms,
    tone: toneForLatency(ms),
  }
}

function statusForLatency(ms) {
  return toneForLatency(ms)
}

function labelForLatencyStatus(status) {
  if (status === 'error') return 'Incident'
  if (status === 'warn') return 'Degraded'
  return 'Operational'
}

export function ApiGatewayIncidentCard() {
  const [traffic, setTraffic] = useState(initialTraffic)
  const latest = traffic.at(-1)?.ms ?? 0
  const status = statusForLatency(latest)
  const series = useMemo(() => [{ key: 'ms', label: 'Latency', tone: 'success' }], [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setTraffic((current) => [...current.slice(1), nextTrafficPoint(current)])
    }, 1200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Card status={status}>
      <Stack gap="md">
        <Stack direction="row" gap="sm" align="start" justify="between">
          <Stack gap={2}>
            <Heading as="h2" size="md">API Gateway</Heading>
            <Paragraph size="sm" color="muted"><strong>Incident Recovery</strong></Paragraph>
          </Stack>
          <MessageBadge status={status} subtle size="lg" icon={null}>{labelForLatencyStatus(status)}</MessageBadge>
        </Stack>

        <Stack gap="xs">
          <Grid columns={5} gap="sm" alignItems="end">
            <GridItem span={1}>
              <Paragraph size="sm" color="accent"><strong>{latest}ms</strong></Paragraph>
            </GridItem>
            <GridItem span={4}>
              <BarChart
                data={traffic}
                xKey="tick"
                series={series}
                height="xs"
                showGrid={false}
                showLegend={false}
                showTooltip={false}
                showXAxis={false}
                showYAxis={false}
                aria-label="Virtual live-updating API gateway latency that degrades, errors, and recovers"
              />
            </GridItem>
          </Grid>
          <Divider space="none" />
          <Stack direction="row" justify="between" align="center">
            <Paragraph size="sm" color="muted">Recovery target</Paragraph>
            <Paragraph size="sm"><strong>{status === 'success' ? 'Met' : 'Monitoring'}</strong></Paragraph>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}`
}

function buildUptimeTimelineSnippet() {
  return `import {
  BarChart,
  Card,
  Divider,
  Heading,
  Link,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const uptimeData = ${JSON.stringify(UPTIME_TIMELINE_DATA, null, 2)}

const uptimeSeries = [
  { key: 'healthy', label: 'Healthy', tone: 'success' },
  { key: 'incident', label: 'Incident', tone: 'error' },
]

export function AuthenticationApiStatusCard() {
  return (
    <Card>
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="md" align="start" justify={{ sm: 'between' }}>
          <Stack gap="xs">
            <Heading as="h2" size="md">Authentication API v2</Heading>
            <Paragraph size="sm" color="muted"><strong>RESTFUL ENDPOINT · US-EAST-1</strong></Paragraph>
          </Stack>
          <Stack gap="xs" align={{ sm: 'end' }}>
            <MessageBadge status="success" subtle size="lg" icon={null}>Operational</MessageBadge>
            <Paragraph size="sm" color="muted"><strong>42ms latency</strong></Paragraph>
          </Stack>
        </Stack>

        <Stack gap="xs">
          <BarChart
            data={uptimeData}
            xKey="day"
            series={uptimeSeries}
            height="xs"
            showGrid={false}
            showLegend={false}
            showTooltip={false}
            showXAxis={false}
            showYAxis={false}
            aria-label="Authentication API 90-day uptime with three incident days"
          />
          <Stack direction="row" justify="between" align="center">
            <Paragraph size="sm" color="muted">90 days ago</Paragraph>
            <Paragraph size="sm"><strong>100% Uptime Today</strong></Paragraph>
          </Stack>
        </Stack>

        <Divider space="none" />
        <Stack direction="row" justify="between" align="center">
          <Paragraph size="sm"><strong>99.99%</strong></Paragraph>
          <Link href="#" icon="arrow_forward" iconPosition="end" size="sm" weight="semibold">
            View detailed metrics
          </Link>
        </Stack>
      </Stack>
    </Card>
  )
}`
}

function buildApiMonitoringSnippet() {
  return `import { useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Card,
  Divider,
  Grid,
  Heading,
  Link,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const monitoringData = ${JSON.stringify(API_MONITORING_DATA, null, 2)}

function monitoringFrame(phase) {
  return monitoringData.map((point, index) => {
    const wave = Math.sin((phase + index) * 0.42) * 5
    const drift = Math.cos((phase + index) * 0.18) * 3
    const requests = Math.max(28, Math.round(point.requests + wave + drift))
    const cache = Math.max(18, Math.round(requests * (0.68 + ((index % 4) * 0.02))))
    const errors = Math.max(1, Math.round(point.errors + Math.sin((phase + index) * 0.3)))
    return {
      ...point,
      requests,
      cache,
      errors,
    }
  })
}

export function ApiMonitoringCard() {
  const [phase, setPhase] = useState(0)
  const traffic = useMemo(() => monitoringFrame(phase), [phase])
  const monitoringSeries = useMemo(() => [
    { key: 'requests', label: 'Requests', tone: 'accent' },
    { key: 'cache', label: 'Cache hits', tone: 'success' },
    { key: 'errors', label: 'Errors', tone: 'error' },
  ], [])
  const latest = traffic.at(-1)

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((current) => current + 1)
    }, 450)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Card status="info">
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="md" align="start" justify={{ sm: 'between' }}>
          <Stack gap="xs">
            <Heading as="h2" size="md">API Monitoring</Heading>
            <Paragraph size="sm" color="muted"><strong>Gateway traffic · Last 24 hours</strong></Paragraph>
          </Stack>
          <MessageBadge status="success" subtle size="lg" icon={null}>Healthy</MessageBadge>
        </Stack>

        <Grid columns={{ xs: 1, sm: 3 }} gap="md">
          <Stack gap={2}>
            <Paragraph size="xs" color="muted">Requests</Paragraph>
            <Paragraph size="lg"><strong>{latest?.requests ?? 0}k</strong></Paragraph>
          </Stack>
          <Stack gap={2}>
            <Paragraph size="xs" color="muted">P95 latency</Paragraph>
            <Paragraph size="lg"><strong>{Math.max(32, Math.round((latest?.requests ?? 0) * 0.48))}ms</strong></Paragraph>
          </Stack>
          <Stack gap={2}>
            <Paragraph size="xs" color="muted">Error rate</Paragraph>
            <Paragraph size="lg"><strong>{(((latest?.errors ?? 0) / Math.max(1, latest?.requests ?? 1)) * 100).toFixed(2)}%</strong></Paragraph>
          </Stack>
        </Grid>

        <AreaChart
          data={traffic}
          xKey="time"
          series={monitoringSeries}
          height="sm"
          curve="monotone"
          stacked
          showLegend
          showTooltip
          showGrid={false}
          showYAxis={false}
          aria-label="Virtual live-updating API monitoring requests, cache hits, and errors over the last 24 hours"
        />

        <Divider space="none" />
        <Stack direction="row" justify="between" align="center">
          <Paragraph size="sm" color="muted">Updated just now</Paragraph>
          <Link href="#" icon="arrow_forward" iconPosition="end" size="sm" weight="semibold">
            View API metrics
          </Link>
        </Stack>
      </Stack>
    </Card>
  )
}`
}

function buildServiceMetricsSnippet() {
  return `import { useMemo } from 'react'
import {
  AreaChart,
  Card,
  Grid,
  Heading,
  IconButton,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const metrics = ${JSON.stringify(SERVICE_METRIC_DATA, null, 2)}

function ServiceMetricTile({ metric }) {
  const series = useMemo(() => [{ key: 'value', label: metric.label, tone: metric.tone }], [metric])
  const directionIcon = metric.direction === 'down' ? 'south_east' : 'north_east'
  const directionStatus = metric.direction === 'down' ? 'success' : metric.tone === 'error' ? 'error' : 'success'

  return (
    <Stack gap="xs">
      <Stack gap={2}>
        <Stack direction="row" gap="xs" align="center">
          <Paragraph size="lg"><strong>{metric.value}</strong></Paragraph>
          <MessageBadge status={directionStatus} subtle size="sm" icon={directionIcon}>
            {metric.direction === 'down' ? 'Down' : 'Up'}
          </MessageBadge>
        </Stack>
        <Paragraph size="xs" color="muted"><strong>{metric.label}</strong></Paragraph>
      </Stack>
      <AreaChart
        data={metric.data}
        xKey="tick"
        series={series}
        height="xs"
        curve="monotone"
        showGrid={false}
        showLegend={false}
        showTooltip={false}
        showXAxis={false}
        showYAxis={false}
        aria-label={\`Salesforce \${metric.label.toLowerCase()} mini trend\`}
      />
    </Stack>
  )
}

export function SalesforceServiceMetricsCard() {
  return (
    <Card>
        <Stack gap="lg">
          <Stack direction="row" gap="md" align="center" justify="between">
            <Stack direction="row" gap="sm" align="center">
              <MessageBadge status="info" subtle size="lg" icon="cloud">
                SalesForce
              </MessageBadge>
              <Paragraph size="sm" color="muted">Connected service</Paragraph>
            </Stack>
            <Stack direction="row" gap="xs" align="center">
              <IconButton icon="settings" label="Service settings" size="sm" variant="secondary" />
              <IconButton icon="tune" label="Filter service metrics" size="sm" variant="secondary" />
            </Stack>
          </Stack>

          <Grid columns={{ xs: 1, sm: 3 }} gap="sm" alignItems="end">
            {metrics.map((metric) => (
              <ServiceMetricTile key={metric.key} metric={metric} />
            ))}
          </Grid>
        </Stack>
    </Card>
  )
}`
}

function buildRevenueRingsSnippet() {
  return `import {
  Card,
  Grid,
  Heading,
  MessageBadge,
  RadialBarChart,
  Stack,
} from '@gtivr4/a1-design-system-react'

const revenueData = ${JSON.stringify(REVENUE_RING_DATA, null, 2)}

export function RevenueRingsCard() {
  return (
    <Card>
        <Grid columns={{ xs: 1, sm: 2 }} gap="lg" alignItems="center">
          <RadialBarChart
            data={revenueData}
            nameKey="name"
            valueKey="value"
            height="sm"
            showLegend={false}
            showTooltip
            aria-label="Monthly and yearly revenue progress"
          />
          <Stack gap="lg">
            <Stack gap="xs">
              <MessageBadge status="warn" subtle size="lg" icon="radio_button_checked">
                Monthly
              </MessageBadge>
              <Heading as="h2" size="lg">24.320$</Heading>
            </Stack>
            <Stack gap="xs">
              <MessageBadge status="info" subtle size="lg" icon="radio_button_checked">
                Yearly
              </MessageBadge>
              <Heading as="h2" size="lg">94.020$</Heading>
            </Stack>
          </Stack>
        </Grid>
    </Card>
  )
}`
}

function buildCryptoMarketSnippet() {
  return `import { useMemo } from 'react'
import {
  Card,
  Divider,
  Grid,
  GridItem,
  Heading,
  LineChart,
  MessageBadge,
  Paragraph,
  Stack,
  StatusBar,
} from '@gtivr4/a1-design-system-react'

const btcData = ${JSON.stringify(CRYPTO_LINE_DATA, null, 2)}
const marketRows = ${JSON.stringify(CRYPTO_MARKET_ROWS, null, 2)}

function CryptoMarketRow({ row }) {
  const isPositive = row.status === 'success'

  return (
    <Stack gap="md">
      <Grid columns={12} gap="md" alignItems="center">
        <GridItem span={3}>
          <MessageBadge status={row.status} subtle size="lg" icon={row.icon}>
            {row.symbol.slice(0, 3)}
          </MessageBadge>
        </GridItem>
        <GridItem span={4}>
          <Stack gap={2}>
            <Heading as="h3" size="sm">{row.symbol}</Heading>
            <Paragraph color="muted">{row.value}</Paragraph>
          </Stack>
        </GridItem>
        <GridItem span={5}>
          <Stack gap="xs" align="end">
            <StatusBar value={row.meter} size="sm" aria-label={\`\${row.symbol} relative market movement\`} />
            <MessageBadge status={row.status} subtle size="md" icon={isPositive ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}>
              {row.change}
            </MessageBadge>
          </Stack>
        </GridItem>
      </Grid>
      <Divider space="none" />
    </Stack>
  )
}

export function CryptoMarketCards() {
  const btcSeries = useMemo(() => [{ key: 'btc', label: 'BTC / USD', tone: 'error' }], [])

  return (
    <Card>
      <Stack gap="lg">
        <Stack direction="row" justify="between" align="center">
          <Heading as="h2" size="md">BTC / USD</Heading>
          <MessageBadge status="error" subtle size="lg" icon={null}>-0.52%</MessageBadge>
        </Stack>
        <LineChart
          data={btcData}
          xKey="time"
          series={btcSeries}
          height="xs"
          curve="monotone"
          showGrid={false}
          showLegend={false}
          showTooltip={false}
          showXAxis={false}
          showYAxis={false}
          aria-label="BTC to USD intraday trend"
        />
        <Divider space="none" />
        <Stack gap="md">
          {marketRows.map((row) => (
            <CryptoMarketRow key={row.symbol} row={row} />
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}`
}

function buildMatchTimelineSnippet() {
  return `import { useMemo } from 'react'
import {
  Card,
  Divider,
  Grid,
  Heading,
  IconButton,
  LineChart,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const matchData = ${JSON.stringify(MATCH_TIMELINE_DATA, null, 2)}

export function MatchTimelineCard() {
  const series = useMemo(() => [
    { key: 'usa', label: 'USA momentum', tone: 'info' },
    { key: 'belgium', label: 'Belgium momentum', tone: 'error' },
  ], [])

  return (
    <Card>
        <Stack gap="lg">
          <Stack direction="row" justify="between" align="center">
            <Heading as="h2" size="md">Match timeline & momentum</Heading>
            <IconButton icon="info" label="About match momentum" size="sm" variant="secondary" />
          </Stack>
          <Divider space="none" lineStyle="dotted" />
          <Grid columns={{ xs: 1, sm: 2 }} gap="md" alignItems="center">
            <Stack direction="row" gap="sm" align="center">
              <MessageBadge status="info" subtle size="lg" icon={null}>USA</MessageBadge>
              <Paragraph color="muted">Home pressure</Paragraph>
            </Stack>
            <Stack direction="row" gap="sm" align="center" justify="end">
              <Paragraph color="muted">Away pressure</Paragraph>
              <MessageBadge status="error" subtle size="lg" icon={null}>BEL</MessageBadge>
            </Stack>
          </Grid>
          <LineChart
            data={matchData}
            xKey="minute"
            series={series}
            height="sm"
            curve="natural"
            showGrid
            showLegend
            showTooltip
            showXAxis
            showYAxis={false}
            aria-label="Match timeline and momentum for USA and Belgium"
          />
        </Stack>
    </Card>
  )
}`
}

function buildScorigamiSnippet() {
  return `import {
  Canvas,
  Card,
  Heading,
  MessageBadge,
  Node,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

const scoreCounts = ${JSON.stringify(NFL_SCORIGAMI_SCORE_COUNTS, null, 2)}

function toneForCount(count) {
  if (count >= 200) return 'accent'
  if (count >= 140) return 'info'
  if (count >= 100) return 'success'
  if (count >= 75) return 'warn'
  return 'neutral'
}

export function NflScorigamiCanvas() {
  const axisScores = [0, 7, 14, 21, 28, 35, 42]
  const scoreNodes = scoreCounts.map(([win, lose, count]) => ({
    id: \`score-\${win}-\${lose}\`,
    x: (win * 64) + 128,
    y: (lose * 64) + 128,
    win,
    lose,
    count,
    tone: toneForCount(count),
  }))

  return (
    <Card>
      <Stack gap="lg">
        <Stack direction={{ xs: 'column', sm: 'row' }} gap="md" align="start" justify={{ sm: 'between' }}>
          <Stack gap="xs">
            <Heading as="h2" size="md">NFL scorigami frequency</Heading>
            <Paragraph size="sm" color="muted">
              Winning score runs left to right; losing or tied score runs top to bottom.
            </Paragraph>
          </Stack>
          <MessageBadge status="info" subtle size="lg" icon="sports_football">
            Top 96
          </MessageBadge>
        </Stack>

        <Canvas
          aria-label="NFL scorigami score frequency canvas"
          background="page"
          gridType="dots"
          gridSpacing={32}
          defaultZoom={0.55}
          defaultPan={{ x: 40, y: 48 }}
          showControls
        >
          {axisScores.map((score) => (
            <Node
              key={\`win-axis-\${score}\`}
              id={\`win-axis-\${score}\`}
              x={(score * 64) + 128}
              y={64}
              label={\`\${score}\`}
              sublabel="win"
              shape="rectangle"
              size="xs"
              color="neutral"
              subtle
              title={\`Winning score \${score}\`}
            />
          ))}
          {axisScores.map((score) => (
            <Node
              key={\`lose-axis-\${score}\`}
              id={\`lose-axis-\${score}\`}
              x={48}
              y={(score * 64) + 128}
              label={\`\${score}\`}
              sublabel="lose"
              shape="rectangle"
              size="xs"
              color="neutral"
              subtle
              title={\`Losing or tied score \${score}\`}
            />
          ))}
          {scoreNodes.map((score) => (
            <Node
              key={score.id}
              id={score.id}
              x={score.x}
              y={score.y}
              label={\`\${score.count}\`}
              sublabel={\`\${score.win}-\${score.lose}\`}
              shape="square"
              size="xs"
              color={score.tone}
              subtle={score.count < 140}
              title={\`\${score.win}-\${score.lose}: \${score.count} NFL games\`}
            />
          ))}
        </Canvas>

        <Paragraph size="xs" color="muted">
          Data from NFL Scorigami, which credits Pro Football Reference for historical game scores.
        </Paragraph>
      </Stack>
    </Card>
  )
}`
}

function buildSnippet(config, utilityClass = '') {
  if (config.example === API_MONITORING_EXAMPLE) return buildApiMonitoringSnippet()
  if (config.example === SERVICE_METRICS_EXAMPLE) return buildServiceMetricsSnippet()
  if (config.example === REVENUE_RINGS_EXAMPLE) return buildRevenueRingsSnippet()
  if (config.example === CRYPTO_MARKET_EXAMPLE) return buildCryptoMarketSnippet()
  if (config.example === MATCH_TIMELINE_EXAMPLE) return buildMatchTimelineSnippet()
  if (config.example === NFL_SCORIGAMI_EXAMPLE) return buildScorigamiSnippet()
  if (config.example === LIVE_API_INCIDENT_EXAMPLE) return buildLiveApiIncidentSnippet()
  if (config.example === UPTIME_TIMELINE_EXAMPLE) return buildUptimeTimelineSnippet()

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
  if (config.example === API_MONITORING_EXAMPLE) {
    return <ApiMonitoringCard />
  }
  if (config.example === SERVICE_METRICS_EXAMPLE) {
    return <ServiceMetricsCard />
  }
  if (config.example === REVENUE_RINGS_EXAMPLE) {
    return <RevenueRingsCard />
  }
  if (config.example === CRYPTO_MARKET_EXAMPLE) {
    return <CryptoMarketCards />
  }
  if (config.example === MATCH_TIMELINE_EXAMPLE) {
    return <MatchTimelineCard />
  }
  if (config.example === NFL_SCORIGAMI_EXAMPLE) {
    return <ScorigamiCanvasCard />
  }
  if (config.example === LIVE_API_INCIDENT_EXAMPLE) {
    return <LiveApiIncidentCard />
  }
  if (config.example === UPTIME_TIMELINE_EXAMPLE) {
    return <UptimeTimelineCard />
  }

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
