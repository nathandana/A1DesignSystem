import {
  ChoiceGroup,
  Code,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'

const AS_OPTIONS = ['div', 'section', 'nav', 'form']
const DIRECTION_OPTIONS = ['column', 'row', 'column-reverse', 'row-reverse']
const GAP_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl']
const ALIGN_OPTIONS = ['start', 'center', 'end', 'stretch', 'baseline']
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
    propValue('gap', config.gap, 'md'),
    propValue('align', config.align, 'start'),
    propValue('justify', config.justify, 'start'),
    propBoolean('wrap', config.wrap, false),
  ].filter(Boolean).join('\n  ')

  return `<Stack${props ? `\n  ${props}\n` : ''}>
  {/* children */}
</Stack>`
}

export function getDefaultConfig() {
  return {
    as: 'div',
    direction: 'column',
    gap: 'md',
    align: 'start',
    justify: 'start',
    wrap: false,
    childCount: 3,
  }
}

// Blocks with different natural widths so align / justify are visually meaningful
const BLOCKS = [
  { label: '1', bg: 'var(--semantic-color-action-background)',   color: 'var(--semantic-color-text-inverse)', w: '80px',  h: '48px' },
  { label: '2', bg: 'var(--semantic-color-status-info-background)', color: 'var(--semantic-color-text-inverse)', w: '120px', h: '64px' },
  { label: '3', bg: 'var(--semantic-color-status-success-background)', color: 'var(--semantic-color-text-inverse)', w: '56px',  h: '56px' },
]

export function Preview({ config }) {
  const blocks = BLOCKS.slice(0, config.childCount ?? 3)

  return (
    <Stack
      as={config.as}
      direction={config.direction}
      gap={config.gap || undefined}
      align={config.align}
      justify={config.justify}
      wrap={config.wrap}
      style={{ width: '100%', minHeight: '160px' }}
    >
      {blocks.map((b) => (
        <div
          key={b.label}
          style={{
            background: b.bg,
            color: b.color,
            width: b.w,
            height: b.h,
            borderRadius: 'var(--base-radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 'var(--semantic-font-size-body-sm)',
            flexShrink: 0,
          }}
        >
          {b.label}
        </div>
      ))}
    </Stack>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Children"
        hint="Number of labeled blocks shown in the preview."
        size="compact"
        hideIndicator
        columns={2}
        value={config.childCount ?? 3}
        onChange={(childCount) => set({ childCount })}
        options={[
          { label: '2', value: 2 },
          { label: '3', value: 3 },
        ]}
      />
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
        columns={3}
        value={config.gap}
        onChange={(gap) => set({ gap })}
        options={GAP_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Align"
        hint="Cross-axis alignment of children."
        size="compact"
        hideIndicator
        columns={3}
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Justify"
        hint="Main-axis distribution of children."
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
