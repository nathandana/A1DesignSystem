import {
  CircularProgress,
  Code,
  Icon,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']
const CONTENT_OPTIONS = ['percent', 'label', 'icon', 'none']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function escapeJsxText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function numberValue(value, fallback) {
  const next = Number(value)
  return Number.isFinite(next) ? next : fallback
}

function percent(config) {
  const max = numberValue(config.max, 100)
  if (max <= 0) return 0
  return Math.round((numberValue(config.value, 0) / max) * 100)
}

function progressChildren(config) {
  if (config.content === 'percent') return `${percent(config)}%`
  if (config.content === 'label') return config.label || 'Loading'
  if (config.content === 'icon') return <Icon name={config.icon || 'check'} color="success" />
  return undefined
}

function childrenSnippet(config) {
  if (config.content === 'percent') return `${percent(config)}%`
  if (config.content === 'label') return escapeJsxText(config.label || 'Loading')
  if (config.content === 'icon') return `<Icon name="${escapeJsxString(config.icon || 'check')}" color="success" />`
  return null
}

function buildCircularProgressSnippet(config) {
  const props = [
    config.indeterminate ? null : `value={${numberValue(config.value, 0)}}`,
    numberValue(config.max, 100) !== 100 ? `max={${numberValue(config.max, 100)}}` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.indeterminate ? 'indeterminate' : null,
    `aria-label="${escapeJsxString(config.ariaLabel || (config.indeterminate ? 'Loading' : `${percent(config)}% complete`))}"`,
  ].filter(Boolean).join('\n  ')
  const child = childrenSnippet(config)

  if (!child) {
    return `<CircularProgress\n  ${props}\n/>`
  }

  return `<CircularProgress\n  ${props}\n>\n  ${child}\n</CircularProgress>`
}

export function getDefaultConfig() {
  return {
    value: 65,
    max: 100,
    size: 'md',
    indeterminate: false,
    content: 'percent',
    label: 'Loading',
    icon: 'check',
    ariaLabel: '65% complete',
  }
}

export function Preview({ config }) {
  return (
    <CircularProgress
      value={numberValue(config.value, 0)}
      max={numberValue(config.max, 100)}
      size={config.size}
      indeterminate={config.indeterminate}
      aria-label={config.ariaLabel || (config.indeterminate ? 'Loading' : `${percent(config)}% complete`)}
    >
      {progressChildren(config)}
    </CircularProgress>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Accessible label"
        size="compact"
        value={config.ariaLabel}
        onChange={(event) => set({ ariaLabel: event.target.value })}
      />
      <TextField
        label="Value"
        size="compact"
        type="number"
        value={String(config.value)}
        onChange={(event) => set({ value: event.target.value })}
      />
      <TextField
        label="Maximum"
        size="compact"
        type="number"
        value={String(config.max)}
        onChange={(event) => set({ max: event.target.value })}
      />
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="content"
        label="Inner content (Example)"
        size="compact"
        hideIndicator
        columns={2}
        value={config.content}
        onChange={(content) => set({ content })}
        options={CONTENT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle prop="indeterminate"
        label="Indeterminate"
        value={config.indeterminate}
        onChange={(indeterminate) => set({ indeterminate })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildCircularProgressSnippet(config)}</Code>
}
