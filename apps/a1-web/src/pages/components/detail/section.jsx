import {
  Accordion,
  Code,
  Heading,
  Paragraph,
  Section,
  Slider,
  Stack,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'
import { ResponsiveControl, responsiveProp } from './configKit.jsx'
import { Lockable } from './configKit.jsx'

const BORDER_SIDES = ['top', 'right', 'bottom', 'left']

// Spacing/size scales shown as compact Sliders. The slider works in index space;
// map the index back to the string value (the lowest stop is '' or 'none').
const PADDING_VALUES = ['none', 'xs', 'sm', 'md', 'lg']
const GAP_VALUES = ['', 'xs', 'sm', 'md', 'lg', 'xl']
const CONTENT_WIDTH_VALUES = ['', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
const BORDER_SIZE_VALUES = ['', 'xs', 'sm', 'md', 'lg']
const RADIUS_VALUES = ['none', 'sm', 'md', 'lg', 'xl']

export const bareDisplay = true

function optionLabel(value) {
  if (!value) return 'None'
  // Padding / gap / content width can be a responsive object ({ xs, md, … }).
  if (typeof value === 'object') return 'Responsive'
  if (typeof value !== 'string') return String(value)
  return value.charAt(0).toUpperCase() + value.slice(1).replaceAll('-', ' ')
}

// Join the applied (truthy) parts into a collapsed-accordion summary.
const summarize = (parts) => parts.filter(Boolean).join(' · ')

// Plain labelled options (none value renders as "None").
const labelItems = (values) => values.map((value) => ({ value, label: optionLabel(value) }))

const AS_ITEMS = labelItems(['section', 'div', 'main', 'header', 'footer'])
// Surface options preview the actual surface colours via Toolbar swatches.
const SURFACE_ITEMS = [
  { value: '', label: 'None' },
  { value: 'page', label: 'Page', swatch: 'var(--semantic-color-surface-page)' },
  { value: 'panel', label: 'Panel', swatch: 'var(--semantic-color-surface-panel)' },
  { value: 'raised', label: 'Raised', swatch: 'var(--semantic-color-surface-raised)' },
]
// Slider detents (index space). The lowest/none stop renders as "--".
const sliderDetents = (values) => values.map((value, index) => ({ value: index, label: (value && value !== 'none') ? optionLabel(value) : '--' }))
const PADDING_DETENTS = sliderDetents(PADDING_VALUES)
const GAP_DETENTS = sliderDetents(GAP_VALUES)
const CONTENT_WIDTH_DETENTS = sliderDetents(CONTENT_WIDTH_VALUES)
const BORDER_SIZE_DETENTS = sliderDetents(BORDER_SIZE_VALUES)
const RADIUS_DETENTS = sliderDetents(RADIUS_VALUES)

const HEIGHT_ITEMS = labelItems(['', 'hero', 'screen'])
// Gradient + border variant preview their colours via Toolbar swatches.
const GRADIENT_ITEMS = [
  { value: '', label: 'None' },
  { value: 'accent', label: 'Accent', swatch: 'var(--semantic-color-action-background)' },
  { value: 'highlight', label: 'Highlight', swatch: 'var(--base-color-highlited-200)' },
  { value: 'info', label: 'Info', swatch: 'var(--semantic-color-status-info-background)' },
  { value: 'success', label: 'Success', swatch: 'var(--semantic-color-status-success-background)' },
  { value: 'warn', label: 'Warn', swatch: 'var(--semantic-color-status-warn-background)' },
]
// Material Symbols has no distinct solid/dashed/dotted line glyphs, so these stay labelled.
const BORDER_STYLE_ITEMS = labelItems(['solid', 'dashed', 'dotted'])
const BORDER_VARIANT_ITEMS = [
  { value: 'subtle', label: 'Subtle', swatch: 'var(--semantic-color-border-subtle)' },
  { value: 'strong', label: 'Strong', swatch: 'var(--semantic-color-border-strong)' },
  { value: 'accent', label: 'Accent', swatch: 'var(--semantic-color-text-accent)' },
]

// Icon-only groups. The none value (no icon) auto-uses the standard Toolbar
// none icon in icon-only mode.
const ALIGN_ITEMS = [
  { value: '', label: 'None' },
  { value: 'left', label: 'Left', icon: 'align_horizontal_left' },
  { value: 'center', label: 'Center', icon: 'align_horizontal_center' },
  { value: 'right', label: 'Right', icon: 'align_horizontal_right' },
]

// Arrows point inward (toward the centre) to indicate where the gradient is anchored.
const GRADIENT_POSITION_ICONS = {
  center: 'center_focus_strong',
  top: 'south',
  'top-right': 'south_west',
  right: 'west',
  'bottom-right': 'north_west',
  bottom: 'north',
  'bottom-left': 'north_east',
  left: 'east',
  'top-left': 'south_east',
}
const GRADIENT_POSITION_ITEMS = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'].map(
  (value) => ({ value, label: optionLabel(value), icon: GRADIENT_POSITION_ICONS[value] }),
)

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${escapeJsxString(value)}"`
}

function propBoolean(name, value, defaultValue) {
  if (value === defaultValue) return null
  return value ? name : `${name}={false}`
}

function buildSectionSnippet(config) {
  const props = [
    propString('as', config.as, 'section'),
    typeof config.padding === 'object' ? responsiveProp('padding', config.padding) : propString('padding', config.padding, 'md'),
    propString('surface', config.surface, ''),
    propString('gap', config.gap, ''),
    propString('contentWidth', config.contentWidth, ''),
    propString('height', config.height, ''),
    typeof config.align === 'object' ? responsiveProp('align', config.align) : propString('align', config.align, ''),
    propString('gradient', config.gradient, ''),
    config.gradient ? propString('gradientPosition', config.gradientPosition, 'center') : null,
    propString('borderSize', config.borderSize, ''),
    propString('borderStyle', config.borderStyle, 'solid'),
    propString('borderVariant', config.borderVariant, 'subtle'),
    // Border sides — omit when all four (the default "all").
    config.borderSize && config.borderSides.length !== 4
      ? `borderSides={[${config.borderSides.map((side) => `'${side}'`).join(', ')}]}`
      : null,
    propString('radius', config.radius, 'none'),
    propBoolean('inverse', config.inverse, false),
  ].filter(Boolean).join('\n  ')

  return `<Section${props ? `\n  ${props}\n` : ' '}/>`
}

export function getDefaultConfig() {
  return {
    as: 'section',
    padding: 'md',
    surface: 'panel',
    gap: 'sm',
    contentWidth: 'md',
    height: '',
    align: '',
    gradient: '',
    gradientPosition: 'center',
    borderSize: '',
    borderStyle: 'solid',
    borderVariant: 'subtle',
    borderSides: ['top', 'right', 'bottom', 'left'],
    radius: 'none',
    inverse: false,
  }
}

export function Preview({ config }) {
  return (
    <Section
      as={config.as}
      padding={config.padding}
      surface={config.surface || undefined}
      gap={config.gap || undefined}
      contentWidth={config.contentWidth || undefined}
      height={config.height || undefined}
      align={config.align || undefined}
      gradient={config.gradient || undefined}
      gradientPosition={config.gradient ? config.gradientPosition : undefined}
      borderSize={config.borderSize || undefined}
      borderStyle={config.borderStyle}
      borderVariant={config.borderVariant}
      borderSides={config.borderSides}
      radius={config.radius}
      inverse={config.inverse}
    >
      <Heading as="h2" size="xl">
        Build with the system
      </Heading>
      <Paragraph>
        Sections create full-width content bands with tokenized surfaces, spacing, alignment, and optional responsive content width.
      </Paragraph>
    </Section>
  )
}

// A compact, subtle Slider over a string-value scale (index space ↔ value).
function DetentSlider({ label, values, detents, value, onChange, prop }) {
  return (
    <Lockable prop={prop}>
      <Slider
        size="compact"
        variant="subtle"
        label={label}
        detents={detents}
        value={Math.max(0, values.indexOf(value))}
        onChange={(index) => onChange(values[index])}
      />
    </Lockable>
  )
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))
  const toggleSide = (side) =>
    set({
      borderSides: config.borderSides.includes(side)
        ? config.borderSides.filter((s) => s !== side)
        : BORDER_SIDES.filter((s) => s === side || config.borderSides.includes(s)),
    })

  // Collapsed-state summaries of the applied properties per accordion.
  const sizingSummary = summarize([
    config.padding !== 'none' && `Padding ${optionLabel(config.padding)}`,
    config.gap && `Gap ${optionLabel(config.gap)}`,
    config.contentWidth && `Width ${optionLabel(config.contentWidth)}`,
  ])
  const backgroundSummary = summarize([
    config.inverse && 'Inverse',
    config.surface && `${optionLabel(config.surface)} surface`,
    config.gradient && `${optionLabel(config.gradient)} gradient`,
  ])
  const borderSummary = summarize([
    config.borderSize && `${optionLabel(config.borderSize)} ${config.borderVariant} border`,
    config.radius !== 'none' && `${optionLabel(config.radius)} radius`,
  ])
  const advancedSummary = summarize([
    config.height && optionLabel(config.height),
    config.align && `${optionLabel(config.align)} align`,
    config.as !== 'section' && `<${config.as}>`,
  ])

  return (
    <Stack gap="sm">
      <Accordion label="Sizing" size="sm" subtext={sizingSummary} divider defaultOpen>
        <Stack gap="md">
          <ResponsiveControl label="Padding" prop="padding" value={config.padding} onChange={(padding) => set({ padding })} defaultValue="md">
            {(val, setVal) => <DetentSlider values={PADDING_VALUES} detents={PADDING_DETENTS} value={val} onChange={setVal} />}
          </ResponsiveControl>
          <DetentSlider label="Gap" prop="gap" values={GAP_VALUES} detents={GAP_DETENTS} value={config.gap} onChange={(gap) => set({ gap })} />
          <DetentSlider label="Content width" prop="contentWidth" values={CONTENT_WIDTH_VALUES} detents={CONTENT_WIDTH_DETENTS} value={config.contentWidth} onChange={(contentWidth) => set({ contentWidth })} />
        </Stack>
      </Accordion>

      <Accordion label="Background" size="sm" subtext={backgroundSummary} divider defaultOpen>
        <Stack gap="lg">
          <Lockable prop="surface"><Toolbar label="Surface">
            <ToolbarGroup aria-label="Surface" showLabels value={config.surface} onChange={(surface) => set({ surface })} options={SURFACE_ITEMS} />
          </Toolbar></Lockable>
          <Toggle prop="inverse" label="Inverse" value={config.inverse} onChange={(inverse) => set({ inverse })} />
          <Lockable prop="gradient"><Toolbar label="Gradient">
            <ToolbarGroup aria-label="Gradient" showLabels value={config.gradient} onChange={(gradient) => set({ gradient })} options={GRADIENT_ITEMS} />
          </Toolbar></Lockable>
          {config.gradient ? (
            <Lockable prop="gradientPosition"><Toolbar label="Gradient position">
              <ToolbarGroup aria-label="Gradient position" columns={3} value={config.gradientPosition} onChange={(gradientPosition) => set({ gradientPosition })} options={GRADIENT_POSITION_ITEMS} />
            </Toolbar></Lockable>
          ) : null}
        </Stack>
      </Accordion>

      <Accordion label="Border" size="sm" subtext={borderSummary} divider>
        <Stack gap="md">
          <DetentSlider label="Border size" prop="borderSize" values={BORDER_SIZE_VALUES} detents={BORDER_SIZE_DETENTS} value={config.borderSize} onChange={(borderSize) => set({ borderSize })} />
          {config.borderSize ? (
            <>
              <Lockable prop="borderStyle"><Toolbar label="Border style">
                <ToolbarGroup aria-label="Border style" showLabels value={config.borderStyle} onChange={(borderStyle) => set({ borderStyle })} options={BORDER_STYLE_ITEMS} />
              </Toolbar></Lockable>
              <Lockable prop="borderVariant"><Toolbar label="Border variant">
                <ToolbarGroup aria-label="Border variant" showLabels value={config.borderVariant} onChange={(borderVariant) => set({ borderVariant })} options={BORDER_VARIANT_ITEMS} />
              </Toolbar></Lockable>
              <Lockable prop="borderSides"><Toolbar label="Border sides">
                <ToolbarButton icon="border_all" label="All" onClick={() => set({ borderSides: [...BORDER_SIDES] })} />
                <ToolbarDivider />
                <ToolbarToggle icon="border_top" label="Top" pressed={config.borderSides.includes('top')} onChange={() => toggleSide('top')} />
                <ToolbarToggle icon="border_right" label="Right" pressed={config.borderSides.includes('right')} onChange={() => toggleSide('right')} />
                <ToolbarToggle icon="border_bottom" label="Bottom" pressed={config.borderSides.includes('bottom')} onChange={() => toggleSide('bottom')} />
                <ToolbarToggle icon="border_left" label="Left" pressed={config.borderSides.includes('left')} onChange={() => toggleSide('left')} />
              </Toolbar></Lockable>
            </>
          ) : null}
          <DetentSlider label="Radius" prop="radius" values={RADIUS_VALUES} detents={RADIUS_DETENTS} value={config.radius} onChange={(radius) => set({ radius })} />
        </Stack>
      </Accordion>

      <Accordion label="Advanced" size="sm" subtext={advancedSummary} divider>
        <Stack gap="md">
          <Lockable prop="height"><Toolbar label="Height">
            <ToolbarGroup aria-label="Height" showLabels value={config.height} onChange={(height) => set({ height })} options={HEIGHT_ITEMS} />
          </Toolbar></Lockable>
          <ResponsiveControl label="Alignment" prop="align" value={config.align} onChange={(align) => set({ align })} defaultValue="">
            {(val, setVal) => (
              <Toolbar aria-label="Alignment">
                <ToolbarGroup aria-label="Alignment" value={val} onChange={setVal} options={ALIGN_ITEMS} />
              </Toolbar>
            )}
          </ResponsiveControl>
          <Lockable prop="as"><Toolbar label="Element">
            <ToolbarGroup aria-label="Element" showLabels value={config.as} onChange={(as) => set({ as })} options={AS_ITEMS} />
          </Toolbar></Lockable>
        </Stack>
      </Accordion>
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSectionSnippet(config)}</Code>
}
