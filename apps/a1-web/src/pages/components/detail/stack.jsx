import {
  Code,
  Stack,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, ResponsiveControl, responsiveProp } from './configKit.jsx'

const AS_OPTIONS = ['div', 'section', 'nav', 'form']
const DIRECTION_OPTIONS = [
  { value: 'column', label: 'Column', icon: 'south' },
  { value: 'row', label: 'Row', icon: 'east' },
  { value: 'column-reverse', label: 'Column reverse', icon: 'north' },
  { value: 'row-reverse', label: 'Row reverse', icon: 'west' },
]
const GAP_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl']
const ALIGN_OPTIONS = [
  { value: 'start', label: 'Start', icon: 'vertical_align_top' },
  { value: 'center', label: 'Center', icon: 'vertical_align_center' },
  { value: 'end', label: 'End', icon: 'vertical_align_bottom' },
  { value: 'stretch', label: 'Stretch', icon: 'height' },
  { value: 'baseline', label: 'Baseline', icon: 'text_fields' },
]
const JUSTIFY_OPTIONS = [
  { value: 'start', label: 'Start', icon: 'align_horizontal_left' },
  { value: 'center', label: 'Center', icon: 'align_horizontal_center' },
  { value: 'end', label: 'End', icon: 'align_horizontal_right' },
  { value: 'between', label: 'Space between', icon: 'horizontal_distribute' },
  { value: 'around', label: 'Space around', icon: 'space_bar' },
  { value: 'evenly', label: 'Space evenly', icon: 'view_week' },
]

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
    typeof config.direction === 'object' ? responsiveProp('direction', config.direction) : propValue('direction', config.direction, 'column'),
    propValue('gap', config.gap, 'md'),
    propValue('align', config.align, 'start'),
    typeof config.justify === 'object' ? responsiveProp('justify', config.justify) : propValue('justify', config.justify, 'start'),
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
      <Choice
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
      <Choice prop="as"
        label="Element"
        size="compact"
        hideIndicator
        columns={2}
        value={config.as}
        onChange={(as) => set({ as })}
        options={AS_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ResponsiveControl prop="direction" label="Direction" value={config.direction} onChange={(direction) => set({ direction })} defaultValue="column">
        {(val, setVal, bp) => (
          <Toolbar aria-label="Direction">
            <ToolbarGroup aria-label="Direction" value={val} onChange={setVal} options={DIRECTION_OPTIONS} />
            {bp == null && (
              <>
                <ToolbarDivider />
                <ToolbarToggle icon="wrap_text" label="Wrap" pressed={config.wrap} onChange={(wrap) => set({ wrap })} />
              </>
            )}
          </Toolbar>
        )}
      </ResponsiveControl>
      <ConfigSlider prop="gap" label="Gap" values={GAP_OPTIONS} value={config.gap} onChange={(gap) => set({ gap })} />
      <Choice prop="align"
        label="Align"
        iconOnly
        value={config.align}
        onChange={(align) => set({ align })}
        options={ALIGN_OPTIONS}
      />
      <ResponsiveControl prop="justify" label="Justify" value={config.justify} onChange={(justify) => set({ justify })} defaultValue="start">
        {(val, setVal) => <Choice iconOnly value={val} onChange={setVal} options={JUSTIFY_OPTIONS} />}
      </ResponsiveControl>
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildStackSnippet(config)}</Code>
}
