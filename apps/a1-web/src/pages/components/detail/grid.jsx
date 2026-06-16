import {
  Card,
  ChoiceGroup,
  Code,
  Grid,
  Heading,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'

export const bareDisplay = true

const COLUMN_OPTIONS = [1, 2, 3, 4]
const GAP_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']
const LAYOUT_OPTIONS = ['default', 'bento']

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

function buildGridSnippet(config) {
  const props = [
    `columns={${config.columns}}`,
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
  const cols = Number(config.columns)
  const count = Math.max(cols * 2, 4)
  const items = SAMPLE_ITEMS.slice(0, Math.min(count, SAMPLE_ITEMS.length))

  return (
    <Grid
      columns={cols}
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
      <ChoiceGroup
        label="Columns"
        size="compact"
        hideIndicator
        columns={4}
        value={config.columns}
        onChange={(columns) => set({ columns: Number(columns) })}
        options={COLUMN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Gap"
        size="compact"
        hideIndicator
        columns={3}
        value={config.gap}
        onChange={(gap) => set({ gap })}
        options={GAP_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Layout"
        size="compact"
        hideIndicator
        columns={2}
        value={config.layout}
        onChange={(layout) => set({ layout })}
        options={LAYOUT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildGridSnippet(config)}</Code>
}
