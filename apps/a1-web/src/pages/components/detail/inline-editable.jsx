import {
  Code,
  Heading,
  InlineEditable,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { Toggle } from './Toggle.jsx'

const AS_OPTIONS = [
  { value: 'text', label: 'Text', icon: 'text_fields' },
  { value: 'paragraph', label: 'Paragraph', icon: 'subject' },
  { value: 'heading', label: 'Heading', icon: 'title' },
  { value: 'button', label: 'Button', icon: 'smart_button' },
]

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

export function getDefaultConfig() {
  return {
    value: 'A1 design system',
    placeholder: 'Add a title',
    as: 'text',
    multiline: false,
    disabled: false,
    seamless: false,
    ariaLabel: 'Edit title',
  }
}

// InlineEditable is controlled and driven directly by config.value, so editing
// inline in the preview updates the Value control at the same time. Seamless
// editing inherits all typography from the surrounding component, so the same
// editable lives inside any text, heading, or button without resizing.
export function Preview({ config, setConfig, utilityClass = '' }) {
  const value = config.value
  const handleChange = (next) => setConfig?.((current) => ({ ...current, value: next }))

  // Button mode is always seamless — the point is to edit the label in place
  // while the button keeps its styling.
  const seamless = config.as === 'button' ? true : config.seamless

  const editable = (
    <InlineEditable
      className={utilityClass || undefined}
      value={value}
      onChange={handleChange}
      multiline={config.multiline}
      disabled={config.disabled}
      seamless={seamless}
      placeholder={config.placeholder || undefined}
      aria-label={config.ariaLabel || undefined}
    >
      {value || undefined}
    </InlineEditable>
  )

  if (config.as === 'heading') return <Heading as="h3" size="lg">{editable}</Heading>
  if (config.as === 'paragraph') return <Paragraph>{editable}</Paragraph>
  if (config.as === 'button') {
    return <span className="a1-button a1-button--primary">{editable}</span>
  }
  return editable
}

export function Controls({ config, setConfig }) {
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  return (
    <Stack gap="lg">
      <TextField label="Value" size="compact" value={config.value} onChange={(e) => set({ value: e.target.value })} />
      <TextField label="Placeholder" size="compact" hint="Shown when the value is empty." value={config.placeholder} onChange={(e) => set({ placeholder: e.target.value })} />
      <TextField label="Accessible label" size="compact" value={config.ariaLabel} onChange={(e) => set({ ariaLabel: e.target.value })} />
      <Choice prop="as"
        label="Display as"
        iconOnly
        value={config.as} onChange={(as) => set({ as })}
        options={AS_OPTIONS}
      />
      <Toggle prop="multiline" label="Multiline" value={config.multiline} onChange={(multiline) => set({ multiline })} />
      <Toggle prop="seamless" label="Seamless"  value={config.seamless} onChange={(seamless) => set({ seamless })} />
      <Toggle prop="disabled" label="Disabled" value={config.disabled} onChange={(disabled) => set({ disabled })} />
    </Stack>
  )
}

function buildEditable(config, seamless, indent, utilityClass = '') {
  const pad = ' '.repeat(indent)
  const props = [
    utilityClass ? `className="${escapeJsxString(utilityClass)}"` : null,
    'value={value}',
    'onChange={setValue}',
    config.multiline ? 'multiline' : null,
    seamless ? 'seamless' : null,
    config.disabled ? 'disabled' : null,
    config.placeholder ? `placeholder="${escapeJsxString(config.placeholder)}"` : null,
    config.ariaLabel ? `aria-label="${escapeJsxString(config.ariaLabel)}"` : null,
  ].filter(Boolean).map((p) => `${pad}  ${p}`).join('\n')

  // Seamless edits in place, so no children are needed; the boxed variant shows
  // the value as its display content.
  return seamless
    ? `${pad}<InlineEditable\n${props}\n${pad}/>`
    : `${pad}<InlineEditable\n${props}\n${pad}>\n${pad}  {value}\n${pad}</InlineEditable>`
}

function buildSnippet(config, utilityClass = '') {
  if (config.as === 'heading') {
    return `<Heading as="h3" size="lg">\n${buildEditable(config, config.seamless, 2, utilityClass)}\n</Heading>`
  }
  if (config.as === 'paragraph') {
    return `<Paragraph>\n${buildEditable(config, config.seamless, 2, utilityClass)}\n</Paragraph>`
  }
  if (config.as === 'button') {
    return `<span className="a1-button a1-button--primary">\n${buildEditable(config, true, 2, utilityClass)}\n</span>`
  }
  return buildEditable(config, config.seamless, 0, utilityClass)
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config, utilityClass)}</Code>
}
