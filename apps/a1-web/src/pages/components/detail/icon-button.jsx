import {
  ChoiceGroup,
  Code,
  IconButton,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

// IconButton is always a fixed, square, natural-width control — it is never
// stretched to full width. Do not add a fullWidth option here; use Button with
// fullWidth for full-width actions. See system rule `icon-button-natural-width`.
const VARIANT_OPTIONS = ['tertiary', 'secondary', 'destructive', 'success']
const SIZE_OPTIONS = ['md', 'lg']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getDefaultConfig() {
  return {
    icon: 'settings',
    label: 'Settings',
    variant: 'tertiary',
    size: 'md',
    disabled: false,
  }
}

export function Preview({ config }) {
  return (
    <IconButton
      icon={config.icon || 'help'}
      label={config.label || 'Action'}
      variant={config.variant}
      size={config.size}
      disabled={config.disabled}
    />
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <IconSelect
        value={config.icon}
        onChange={(icon) => setConfig((current) => ({ ...current, icon }))}
      />
      <TextField
        label="Accessible label"
        hint="Used as the aria-label and tooltip."
        size="compact"
        value={config.label}
        onChange={(event) => setConfig((current) => ({ ...current, label: event.target.value }))}
      />
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={2}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle label="Disabled" value={config.disabled} onChange={(disabled) => setConfig((current) => ({ ...current, disabled }))} />
    </Stack>
  )
}

function buildIconButtonSnippet(config) {
  const props = [
    `icon="${config.icon || 'help'}"`,
    `label="${String(config.label || 'Action').replaceAll('"', '&quot;')}"`,
    config.variant !== 'tertiary' ? `variant="${config.variant}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.disabled ? 'disabled' : null,
  ].filter(Boolean).join(' ')

  return `<IconButton ${props} />`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildIconButtonSnippet(config)}</Code>
}
