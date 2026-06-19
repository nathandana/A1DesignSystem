import {
  Card,
  Code,
  Grid,
  Heading,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, ResponsiveControl } from './configKit.jsx'

export const bareDisplay = true

const COLUMN_OPTIONS = [1, 2, 3, 4]
const GAP_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']

function optionLabel(value) {
  if (typeof value === 'number') return String(value)
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue) return null
  if (typeof value === 'number') return `${name}={${value}}`
  return `${name}="${value}"`
}

const SAMPLE_ITEMS = [
  { title: 'Token system',   body: 'Base, semantic, and component tiers.' },
  { title: 'Component API',  body: 'Stable, platform-agnostic contracts.' },
  { title: 'Theme support',  body: 'Light, accessible, and heritage themes.' },
  { title: 'Accessibility',  body: 'WCAG AA across all components.' },
  { title: 'Breakpoints',    body: 'Responsive across xs through xl viewports.' },
  { title: 'Design rules',   body: 'Codified constraints enforced at the token level.' },
]

// columns can be a number or a responsive `{ xs, sm, md, lg, xl }` object.
function representativeColumns(value) {
  if (value && typeof value === 'object') {
    const nums = Object.values(value).map(Number).filter(Number.isFinite)
    return nums.length ? Math.max(...nums) : 2
  }
  return Number(value) || 2
}

function columnsProp(columns) {
  if (columns && typeof columns === 'object') {
    const entries = ['xs', 'sm', 'md', 'lg', 'xl']
      .filter((key) => columns[key] !== undefined)
      .map((key) => `${key}: ${columns[key]}`)
    return `columns={{ ${entries.join(', ')} }}`
  }
  return `columns={${columns}}`
}

function buildGridSnippet(config) {
  const props = [
    columnsProp(config.columns),
    propString('gap', config.gap, 'md'),
    propString('layout', config.layout, 'default'),
  ].filter(Boolean).join('\n  ')

  return `<Grid\n  ${props}\n>\n  {/* children */}\n</Grid>`
}

export function getDefaultConfig() {
  return {
    columns: 2,
    gap: 'md',
    layout: 'default',
  }
}

export function Preview({ config }) {
  const count = Math.max(representativeColumns(config.columns) * 2, 4)
  const items = SAMPLE_ITEMS.slice(0, Math.min(count, SAMPLE_ITEMS.length))

  return (
    <Grid
      columns={config.columns}
      gap={config.gap}
      layout={config.layout}
    >
      {items.map((item) => (
        <Card key={item.title}>
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="xs">{item.title}</Heading>
            <Paragraph size="sm" color="muted">{item.body}</Paragraph>
          </Stack>
        </Card>
      ))}
    </Grid>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <ResponsiveControl prop="columns"
        label="Columns"
        value={config.columns}
        onChange={(columns) => set({ columns })}
        defaultValue={2}
      >
        {(val, setVal) => (
          <Choice
            value={val}
            onChange={(v) => setVal(Number(v))}
            options={COLUMN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        )}
      </ResponsiveControl>
      <ConfigSlider prop="gap" label="Gap" values={GAP_OPTIONS} value={config.gap} onChange={(gap) => set({ gap })} />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildGridSnippet(config)}</Code>
}
