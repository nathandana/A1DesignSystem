import {
  Banner,
  Cluster,
  Code,
  MessageBadge,
  Paragraph,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const GAP_OPTIONS = [4, 8, 12, 16, 24, 32]
const ALIGN_OPTIONS = ['start', 'center', 'end', 'stretch', 'baseline']
const JUSTIFY_OPTIONS = ['start', 'center', 'end', 'between', 'around', 'evenly']

function optionLabel(value) {
  if (typeof value === 'number') return String(value)
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue) return null
  if (typeof value === 'number') return `${name}={${value}}`
  return `${name}="${value}"`
}

function buildClusterSnippet(config, utilityClass = '') {
  const props = [
    propString('className', utilityClass, ''),
    propString('gap', config.gap, 8),
    propString('align', config.align, 'center'),
    propString('justify', config.justify, 'start'),
  ].filter(Boolean).join('\n  ')

  return `<Cluster${props ? `\n  ${props}\n` : ''}>
  {/* children */}
</Cluster>`
}

export function getDefaultConfig() {
  return {
    gap: 8,
    align: 'center',
    justify: 'start',
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Cluster
      className={utilityClass || undefined}
      gap={config.gap}
      align={config.align}
      justify={config.justify}
      style={{ width: '100%' }}
    >
      <MessageBadge status="info" subtle>Design</MessageBadge>
      <MessageBadge status="success" subtle>System</MessageBadge>
      <MessageBadge status="warn" subtle>Components</MessageBadge>
      <MessageBadge status="neutral" subtle>Tokens</MessageBadge>
      <MessageBadge status="error" subtle>Themes</MessageBadge>
    </Cluster>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <Banner status="warn" title="Deprecated">
        <Paragraph size="xs">
          Cluster is deprecated. Use <code>{'<Stack direction="row" wrap>'}</code> with a gap instead.
        </Paragraph>
      </Banner>
      <Choice prop="gap"
        label="Gap"
        size="compact"
        hideIndicator
        columns={3}
        value={config.gap}
        onChange={(gap) => set({ gap })}
        options={GAP_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice prop="align"
        label="Align"
        size="compact"
        hideIndicator
        columns={3}
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice prop="justify"
        label="Justify"
        size="compact"
        hideIndicator
        columns={3}
        value={config.justify}
        onChange={(justify) => set({ justify })}
        options={JUSTIFY_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildClusterSnippet(config, utilityClass)}</Code>
}
