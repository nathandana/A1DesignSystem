import {
  ChoiceGroup,
  Code,
  Icon,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['', 'xs', 'sm', 'lg', 'xl', 'jumbo']
const COLOR_OPTIONS = ['', 'muted', 'accent', 'inverse', 'success', 'error', 'warn', 'info']

function optionLabel(value) {
  if (!value) return 'Inherit'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function buildIconSnippet(config) {
  const props = [
    `name="${config.name || 'star'}"`,
    propString('size', config.size, ''),
    propString('color', config.color, ''),
    config.fill ? 'fill' : null,
  ].filter(Boolean).join(' ')

  return `<Icon ${props} />`
}

export function getDefaultConfig() {
  return {
    name: 'star',
    size: 'lg',
    color: '',
    fill: false,
  }
}

export function Preview({ config }) {
  return (
    <Icon
      name={config.name || 'star'}
      size={config.size || undefined}
      color={config.color || undefined}
      fill={config.fill}
    />
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <IconSelect
        value={config.name}
        onChange={(name) => set({ name })}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => set({ size })}
        options={SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Color"
        size="compact"
        hideIndicator
        columns={3}
        value={config.color}
        onChange={(color) => set({ color })}
        options={COLOR_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle
        label="Fill"
        value={config.fill}
        onChange={(fill) => set({ fill })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildIconSnippet(config)}</Code>
}
