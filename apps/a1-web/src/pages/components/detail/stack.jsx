import {
  Button,
  ChoiceGroup,
  Code,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'

const AS_OPTIONS = ['div', 'section', 'nav', 'form']
const DIRECTION_OPTIONS = ['column', 'row', 'column-reverse', 'row-reverse']
const GAP_OPTIONS = [,'none', 'xs', 'sm', 'md', 'lg', 'xl']
const ALIGN_OPTIONS = ['stretch', 'start', 'center', 'end', 'baseline']
const JUSTIFY_OPTIONS = ['start', 'center', 'end', 'between', 'around', 'evenly']

function optionLabel(value) {
  if (typeof value === 'number') return String(value)
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function propValue(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  if (typeof value === 'number') return `${name}={${value}}`
  return `${name}="${escapeJsxString(value)}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return value ? name : `${name}={false}`
}

function buildStackSnippet(config) {
  const props = [
    propValue('as', config.as, 'div'),
    propValue('direction', config.direction, 'column'),
    propValue('gap', config.gap, 16),
    propValue('align', config.align, 'stretch'),
    propValue('justify', config.justify, 'start'),
    propBoolean('wrap', config.wrap, false),
  ].filter(Boolean).join('\n  ')

  return `<Stack${props ? `\n  ${props}\n` : ''}>
</Stack>`
}

export function getDefaultConfig() {
  return {
    as: 'div',
    direction: 'column',
    gap: 16,
    align: 'stretch',
    justify: 'start',
    wrap: false,
  }
}

export function Preview({ config }) {
  return (
    <Stack
      as={config.as}
      direction={config.direction}
      gap={config.gap}
      align={config.align}
      justify={config.justify}
      wrap={config.wrap}
  style={{
    width: '100%',
  }}
    >
      <div
  style={{
    backgroundColor: 'red',
    display: 'block',
    width: '100%',
    height: '64px',
  }}
/>
      <div
  style={{
    backgroundColor: 'blue',
    display: 'block',
    width: '100%',
    height: '64px',
  }}
/>
      <div
  style={{
    backgroundColor: 'green',
    display: 'block',
    width: '100%',
    height: '64px',
  }}
/>
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Element"
        size="compact"
        hideIndicator
        columns={2}
        value={config.as}
        onChange={(as) => set({ as })}
        options={AS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Direction"
        size="compact"
        hideIndicator
        columns={2}
        value={config.direction}
        onChange={(direction) => set({ direction })}
        options={DIRECTION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Gap"
        size="compact"
        hideIndicator
        columns={5}
        value={config.gap}
        onChange={(gap) => set({ gap })}
        options={GAP_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Align"
        size="compact"
        hideIndicator
        columns={3}
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Justify"
        size="compact"
        hideIndicator
        columns={3}
        value={config.justify}
        onChange={(justify) => set({ justify })}
        options={JUSTIFY_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Toggle
        label="Wrap"
        value={config.wrap}
        onChange={(wrap) => set({ wrap })}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildStackSnippet(config)}</Code>
}
