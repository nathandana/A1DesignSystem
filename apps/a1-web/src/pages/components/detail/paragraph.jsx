import {
  Code,
  Paragraph,
  Stack,
  TextareaField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider, Lockable, ResponsiveControl, responsiveProp } from './configKit.jsx'

const PARAGRAPH_ELEMENT_OPTIONS = ['p', 'span', 'div']
const PARAGRAPH_SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']
const WEIGHT_OPTIONS = ['regular', 'medium', 'semibold', 'bold']

const SAMPLE_TEXT =
  'A1 is a token-driven design system that keeps React, HTML/CSS, and React Native in sync. Every colour, space, and type ramp traces back to a single source of truth, so the same decision renders consistently across every platform and theme.'

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function propLine(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `  ${name}="${value}"`
}

function buildParagraphSnippet(config, utilityClass = '') {
  const textWrap = config.textWrap ? 'balance' : undefined
  const props = [
    propLine('className', utilityClass, ''),
    propLine('as', config.as, 'p'),
    config.size && typeof config.size === 'object' ? `  ${responsiveProp('size', config.size)}` : propLine('size', config.size, 'md'),
    propLine('color', config.color, 'default'),
    propLine('weight', config.weight, 'regular'),
    propLine('align', config.align, 'left'),
    propLine('textWrap', textWrap, undefined),
  ].filter(Boolean).join(' ')

  const propsStr = props ? ` ${props}` : ''
  return `<Paragraph${propsStr}>\n  ${escapeJsxText(config.children || 'Paragraph')}\n</Paragraph>`
}

export function getDefaultConfig(component) {
  return {
    as: 'p',
    size: 'md',
    color: 'default',
    weight: 'regular',
    align: 'left',
    textWrap: false,
    children: SAMPLE_TEXT,
  }
}

// ── Page-definition JSON (the configurator's JSON view, A1-1651) ─────────────
// `color: "muted"` is the portable A1 token selector for the semantic
// `text/muted` color. JSON deliberately never carries a resolved hex value.
export const jsonType = 'Paragraph'

const PARAGRAPH_COLOR_VALUES = ['default', 'muted']
const PARAGRAPH_ALIGN_VALUES = ['left', 'center', 'right', 'start', 'end']

function validResponsiveSize(value, fallback = 'md') {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const responsive = {}
    for (const breakpoint of ['xs', 'sm', 'md', 'lg', 'xl']) {
      if (PARAGRAPH_SIZE_OPTIONS.includes(value[breakpoint])) responsive[breakpoint] = value[breakpoint]
    }
    return Object.keys(responsive).length > 0 ? responsive : fallback
  }
  return PARAGRAPH_SIZE_OPTIONS.includes(value) ? value : fallback
}

export function toJson(config) {
  const props = {}
  if (config.as && config.as !== 'p') props.as = config.as
  if (typeof config.size === 'object') props.size = config.size
  else if (config.size && config.size !== 'md') props.size = config.size
  if (config.color && config.color !== 'default') props.color = config.color
  if (config.weight && config.weight !== 'regular') props.weight = config.weight
  if (config.align && config.align !== 'left') props.align = config.align
  if (config.textWrap) props.textWrap = 'balance'
  const node = {
    id: 'paragraph-1',
    type: jsonType,
    content: { fallback: config.children || 'Paragraph' },
  }
  if (Object.keys(props).length > 0) node.props = props
  return { node, note: null }
}

export function fromJson(node) {
  const config = getDefaultConfig({ title: 'Paragraph' })
  const props = node.props ?? {}
  config.as = PARAGRAPH_ELEMENT_OPTIONS.includes(props.as) ? props.as : 'p'
  config.size = validResponsiveSize(props.size)
  config.color = PARAGRAPH_COLOR_VALUES.includes(props.color) ? props.color : 'default'
  config.weight = WEIGHT_OPTIONS.includes(props.weight) ? props.weight : 'regular'
  config.align = PARAGRAPH_ALIGN_VALUES.includes(props.align) ? props.align : 'left'
  config.textWrap = props.textWrap === 'balance'
  if (typeof node.content?.fallback === 'string') config.children = node.content.fallback
  return config
}

export function Preview({ component, config, utilityClass = '' }) {
  const textWrap = config.textWrap ? 'balance' : undefined
  return (
    <Paragraph
      className={utilityClass || undefined}
      as={config.as}
      size={config.size}
      color={config.color}
      weight={config.weight}
      align={config.align}
      textWrap={textWrap}
    >
      {config.children || component.title}
    </Paragraph>
  )
}

export function Controls({ config, setConfig, textAction = null }) {
  return (
    <Stack gap="lg">
      <Stack direction="row" gap="xs" align="end">
        <TextareaField
          label="Text"
          size="compact"
          rows={5}
          value={config.children}
          onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
        />
        {textAction}
      </Stack>
      <Choice prop="as"
        label="As"
        size="compact"
        hideIndicator
        columns={3}
        value={config.as}
        onChange={(as) => setConfig((current) => ({ ...current, as }))}
        options={PARAGRAPH_ELEMENT_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
      />
      <ResponsiveControl prop="size" label="Size" value={config.size} onChange={(size) => setConfig((current) => ({ ...current, size }))} defaultValue="md">
        {(val, setVal) => <ConfigSlider values={PARAGRAPH_SIZE_OPTIONS} value={val} onChange={setVal} />}
      </ResponsiveControl>
      <Choice prop="color"
        label="Color"
        size="compact"
        hideIndicator
        columns={2}
        value={config.color}
        onChange={(color) => setConfig((current) => ({ ...current, color }))}
        options={[
          { label: 'Default', value: 'default', swatch: 'var(--semantic-color-text-default)' },
          { label: 'Muted',   value: 'muted',   swatch: 'var(--semantic-color-text-muted)'   },
        ]}
      />
      <Choice prop="weight"
        label="Weight"
        value={config.weight}
        onChange={(weight) => setConfig((current) => ({ ...current, weight }))}
        options={WEIGHT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Lockable prop="align"><Toolbar label="Align">
        <ToolbarGroup
          aria-label="Align"
          value={config.align}
          onChange={(align) => setConfig((current) => ({ ...current, align }))}
          options={[
            { icon: 'align_horizontal_left',   label: 'Left',   value: 'left'   },
            { icon: 'align_horizontal_center',  label: 'Center', value: 'center' },
            { icon: 'align_horizontal_right',   label: 'Right',  value: 'right'  },
          ]}
        />
        <ToolbarDivider />
        <ToolbarToggle icon="wrap_text" label="Balance text wrap" pressed={config.textWrap} onChange={(textWrap) => setConfig((current) => ({ ...current, textWrap }))} />
      </Toolbar></Lockable>
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildParagraphSnippet(config, utilityClass)}</Code>
}
