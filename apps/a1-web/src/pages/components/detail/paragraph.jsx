import {
  ChoiceGroup,
  Code,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'

const PARAGRAPH_ELEMENT_OPTIONS = ['p', 'span', 'div']
const PARAGRAPH_SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']

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
    propLine('size', config.size, 'md'),
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
    children: component.title,
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
      <TextField
        label="Text"
        size="compact"
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <ChoiceGroup
        label="As"
        size="compact"
        hideIndicator
        columns={3}
        value={config.as}
        onChange={(as) => setConfig((current) => ({ ...current, as }))}
        options={PARAGRAPH_ELEMENT_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={PARAGRAPH_SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
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
      <ChoiceGroup
        label="Align"
        size="compact"
        hideIndicator
        iconOnly
        columns={3}
        value={config.align}
        onChange={(align) => setConfig((current) => ({ ...current, align }))}
        options={[
          { icon: 'align_horizontal_left',   label: 'Left',   value: 'left'   },
          { icon: 'align_horizontal_center',  label: 'Center', value: 'center' },
          { icon: 'align_horizontal_right',   label: 'Right',  value: 'right'  },
        ]}
      />
      <ChoiceGroup
        label="Text wrap"
        size="compact"
        hideIndicator
        columns={2}
        value={config.textWrap ? 'balance' : 'default'}
        onChange={(value) => setConfig((current) => ({ ...current, textWrap: value === 'balance' }))}
        options={[
          { label: 'Default', value: 'default' },
          { label: 'Balance', value: 'balance' },
        ]}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildParagraphSnippet(config)}</Code>
}
