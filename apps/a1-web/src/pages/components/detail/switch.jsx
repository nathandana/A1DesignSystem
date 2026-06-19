import {
  Code,
  Stack,
  Switch,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['compact', 'default', 'comfortable']
const LABEL_POSITION_OPTIONS = ['start', 'end']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

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

export function Preview({ config }) {
  return (
    <Switch
      // Remount when the default-checked control flips so the preview reflects it
      // while still being interactive (uncontrolled toggle).
      key={config.checked ? 'on' : 'off'}
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
      <Choice prop="size"
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice prop="labelPosition"
        label="Label position"
        size="compact"
        hideIndicator
        columns={2}
        value={config.labelPosition}
        onChange={(labelPosition) => setConfig((current) => ({ ...current, labelPosition }))}
        options={LABEL_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle prop="checked" label="Checked" value={config.checked} onChange={(checked) => setConfig((current) => ({ ...current, checked }))} />
      <Toggle prop="disabled" label="Disabled" value={config.disabled} onChange={(disabled) => setConfig((current) => ({ ...current, disabled }))} />
    </Stack>
  )
}

function buildSwitchSnippet(config) {
  const props = [
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

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSwitchSnippet(config)}</Code>
}
