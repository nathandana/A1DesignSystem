import {
  Code,
  Icon,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, statusOptions } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const SIZE_OPTIONS = ['', 'xs', 'sm', 'lg', 'xl', 'jumbo']
const COLOR_OPTIONS = ['', 'muted', 'accent', 'inverse', 'success', 'error', 'warn', 'info']

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function buildIconSnippet(config, utilityClass = '') {
  const props = [
    propString('className', utilityClass, ''),
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

export function Preview({ config, utilityClass = '' }) {
  return (
    <Icon
      className={utilityClass || undefined}
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
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      <Choice prop="color"
        label="Color"
        iconOnly
        value={config.color}
        onChange={(color) => set({ color })}
        options={statusOptions(COLOR_OPTIONS, { noneLabel: 'Inherit' })}
      />
      <Toggle prop="fill"
        label="Fill"
        value={config.fill}
        onChange={(fill) => set({ fill })}
      />
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildIconSnippet(config, utilityClass)}</Code>
}
