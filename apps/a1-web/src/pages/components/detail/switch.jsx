import {
  Code,
  Stack,
  Switch,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice, DensityChoice, FieldState } from './configKit.jsx'

// Label position as an icon pair: start = label leading, end = label trailing.
const LABEL_POSITION_OPTIONS = [
  { value: 'start', label: 'Start', icon: 'align_horizontal_left' },
  { value: 'end', label: 'End', icon: 'align_horizontal_right' },
]

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

export function getDefaultConfig() {
  return {
    label: 'Email notifications',
    hint: '',
    error: '',
    size: 'default',
    labelPosition: 'end',
    checked: true,
    disabled: false,
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Switch
      // Remount when the default-checked control flips so the preview reflects it
      // while still being interactive (uncontrolled toggle).
      key={config.checked ? 'on' : 'off'}
      className={utilityClass || undefined}
      label={config.label || undefined}
      hint={config.hint || undefined}
      error={config.error || undefined}
      size={config.size}
      labelPosition={config.labelPosition}
      defaultChecked={config.checked}
      disabled={config.disabled}
    />
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextField
        label="Label"
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <TextField
        label="Hint"
        size="compact"
        value={config.hint}
        onChange={(event) => setConfig((current) => ({ ...current, hint: event.target.value }))}
      />
      <TextField
        label="Error"
        size="compact"
        value={config.error}
        onChange={(event) => setConfig((current) => ({ ...current, error: event.target.value }))}
      />
      <DensityChoice value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} />
      <Choice prop="labelPosition"
        label="Label position"
        iconOnly
        labelMode="selected"
        value={config.labelPosition}
        onChange={(labelPosition) => setConfig((current) => ({ ...current, labelPosition }))}
        options={LABEL_POSITION_OPTIONS}
      />
      <FieldState
        items={[
          { key: 'checked', label: 'Checked', icon: 'check', value: config.checked },
          { key: 'disabled', label: 'Disabled', icon: 'block', value: config.disabled },
        ]}
        onChange={(patch) => setConfig((current) => ({ ...current, ...patch }))}
        
      />
    </Stack>
  )
}

function buildSwitchSnippet(config, utilityClass = '') {
  const props = [
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    config.label ? `label="${escapeJsxString(config.label)}"` : null,
    config.hint ? `hint="${escapeJsxString(config.hint)}"` : null,
    config.error ? `error="${escapeJsxString(config.error)}"` : null,
    config.size !== 'default' ? `size="${config.size}"` : null,
    config.labelPosition !== 'end' ? `labelPosition="${config.labelPosition}"` : null,
    config.checked ? 'defaultChecked' : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join('\n  ')

  return `<Switch\n  ${props}\n/>`
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSwitchSnippet(config, utilityClass)}</Code>
}
