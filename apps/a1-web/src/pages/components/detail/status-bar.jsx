import {
  Code,
  Stack,
  StatusBar,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['sm', 'md', 'lg']
// An inline row of directional arrows showing where the label sits relative to the bar.
const LABEL_POSITION_OPTIONS = [
  { value: 'above', label: 'Above', icon: 'arrow_upward' },
  { value: 'below', label: 'Below', icon: 'arrow_downward' },
  { value: 'before', label: 'Before', icon: 'arrow_back' },
  { value: 'after', label: 'After', icon: 'arrow_forward' },
]

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function numberValue(value, fallback) {
  const next = Number(value)
  return Number.isFinite(next) ? next : fallback
}

function buildStatusBarSnippet(config) {
  const hasLabel = Boolean(config.label)
  const props = [
    config.indeterminate ? null : `value={${numberValue(config.value, 0)}}`,
    numberValue(config.max, 100) !== 100 ? `max={${numberValue(config.max, 100)}}` : null,
    hasLabel ? `label="${escapeJsxString(config.label)}"` : `aria-label="${escapeJsxString(config.ariaLabel || 'Progress')}"`,
    config.labelPosition !== 'above' ? `labelPosition="${config.labelPosition}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.indeterminate ? 'indeterminate' : null,
  ].filter(Boolean).join('\n  ')

  return `<StatusBar\n  ${props}\n/>`
}

export function getDefaultConfig() {
  return {
    value: 65,
    max: 100,
    label: 'Upload progress',
    ariaLabel: 'Upload progress',
    labelPosition: 'above',
    size: 'md',
    indeterminate: false,
  }
}

export function Preview({ config }) {
  return (
    <div className="a1-web-field-fill">
      <StatusBar
        value={numberValue(config.value, 0)}
        max={numberValue(config.max, 100)}
        label={config.label || undefined}
        labelPosition={config.labelPosition}
        size={config.size}
        indeterminate={config.indeterminate}
        aria-label={config.label ? undefined : (config.ariaLabel || 'Progress')}
      />
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => set({ label: event.target.value })}
      />
      {!config.label && (
        <TextField
          label="Accessible label"
          size="compact"
          value={config.ariaLabel}
          onChange={(event) => set({ ariaLabel: event.target.value })}
        />
      )}
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
      <ConfigSlider label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <Choice
        label="Label position"
        iconOnly
        value={config.labelPosition}
        onChange={(labelPosition) => set({ labelPosition })}
        options={LABEL_POSITION_OPTIONS}
      />
      <Toggle
        label="Indeterminate"
        value={config.indeterminate}
        onChange={(indeterminate) => set({ indeterminate })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildStatusBarSnippet(config)}</Code>
}
