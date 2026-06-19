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

function buildParagraphSnippet(config) {
  const textWrap = config.textWrap ? 'balance' : undefined
  const props = [
    propLine('as', config.as, 'p'),
    config.size && typeof config.size === 'object' ? `  ${responsiveProp('size', config.size)}` : propLine('size', config.size, 'md'),
    propLine('color', config.color, 'default'),
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
    align: 'left',
    textWrap: false,
    children: SAMPLE_TEXT,
  }
}

export function Preview({ component, config }) {
  const textWrap = config.textWrap ? 'balance' : undefined
  return (
    <Paragraph
      as={config.as}
      size={config.size}
      color={config.color}
      align={config.align}
      textWrap={textWrap}
    >
      {config.children || component.title}
    </Paragraph>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextareaField
        label="Text"
        size="compact"
        rows={5}
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
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

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildParagraphSnippet(config)}</Code>
}
