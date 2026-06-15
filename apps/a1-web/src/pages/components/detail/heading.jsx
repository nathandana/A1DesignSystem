import {
  ChoiceGroup,
  Code,
  Heading,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'

const HEADING_ELEMENT_OPTIONS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']
const HEADING_TYPE_OPTIONS = ['heading', 'display']
const HEADING_SIZE_OPTIONS = {
  heading: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
  display: ['sm', 'md', 'lg', 'xl', 'xxl', 'jumbo', 'xJumbo'],
}

function optionLabel(value) {
  return value === 'xJumbo'
    ? 'X jumbo'
    : value.charAt(0).toUpperCase() + value.slice(1)
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

function buildHeadingSnippet(config) {
  const textWrap = config.textWrap ? 'balance' : undefined
  const props = [
    propLine('as', config.as, 'h2'),
    propLine('type', config.type, 'heading'),
    propLine('size', config.size, undefined),
    propLine('color', config.color, 'default'),
    propLine('align', config.align, 'left'),
    propLine('margin', config.margin, undefined),
    propLine('textWrap', textWrap, undefined),
  ].filter(Boolean).join(' ')

  const propsStr = props ? ` ${props}` : ''
  return `<Heading${propsStr}>\n  ${escapeJsxText(config.children || 'Heading')}\n</Heading>`
}

export function getDefaultConfig(component) {
  return {
    as: 'h2',
    type: 'heading',
    size: 'md',
    color: 'default',
    align: 'left',
    margin: '',
    textWrap: false,
    children: component.title,
  }
}

export function Preview({ component, config }) {
  const textWrap = config.textWrap ? 'balance' : undefined
  return (
    <Heading
      as={config.as}
      type={config.type}
      size={config.size}
      color={config.color}
      align={config.align}
      margin={config.margin || undefined}
      textWrap={textWrap}
    >
      {config.children || component.title}
    </Heading>
  )
}

export function Controls({ config, setConfig }) {
  const sizeOptions = HEADING_SIZE_OPTIONS[config.type] ?? HEADING_SIZE_OPTIONS.heading

  return (
    <Stack gap="lg">
      <TextField
        label="Text"
        size="compact"
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <ChoiceGroup
        label="Type"
        size="compact"
        hideIndicator
        value={config.type}
        onChange={(type) => {
          const nextSizeOptions = HEADING_SIZE_OPTIONS[type] ?? HEADING_SIZE_OPTIONS.heading
          setConfig((current) => ({
            ...current,
            type,
            size: nextSizeOptions.includes(current.size) ? current.size : nextSizeOptions[2],
          }))
        }}
        options={HEADING_TYPE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Element"
        size="compact"
        hideIndicator
        columns={4}
        value={config.as}
        onChange={(as) => setConfig((current) => ({ ...current, as }))}
        options={HEADING_ELEMENT_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={sizeOptions.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Color"
        size="compact"
        hideIndicator
        columns={3}
        value={config.color}
        onChange={(color) => setConfig((current) => ({ ...current, color }))}
        options={[
          { label: 'Default', value: 'default', swatch: 'var(--semantic-color-text-default)'      },
          { label: 'Muted',   value: 'muted',   swatch: 'var(--semantic-color-text-muted)'        },
          { label: 'Accent',  value: 'accent',  swatch: 'var(--semantic-color-action-background)' },
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
        label="Margin"
        size="compact"
        hideIndicator
        columns={4}
        value={config.margin || 'none'}
        onChange={(margin) => setConfig((current) => ({ ...current, margin: margin === 'none' ? '' : margin }))}
        options={[
          { label: 'None', value: 'none', icon: 'remove_circle', iconOnly: true },
          { label: 'Sm',   value: 'sm'                   },
          { label: 'Md',   value: 'md'                   },
          { label: 'Lg',   value: 'lg'                   },
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
  return <Code variant="block" wrapping copyCode>{buildHeadingSnippet(config)}</Code>
}
