import {
  Blockquote,
  ChoiceGroup,
  Code,
  Stack,
  TextField,
  TextareaField,
} from '@gtivr4/a1-design-system-react'

const BLOCKQUOTE_VARIANT_OPTIONS = ['border', 'filled', 'feature', 'minimal', 'accent', 'pull', 'ruled']

const SAMPLE_QUOTE =
  'Good design tokens are invisible — you only notice them when they are missing. A1 makes the consistent choice the easy one across every platform.'
const SAMPLE_CITE = 'A1 Design System'

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

function buildBlockquoteSnippet(config) {
  const props = [
    propLine('variant', config.variant, 'border'),
    propLine('cite', config.cite, ''),
    propLine('citeUrl', config.citeUrl, ''),
  ].filter(Boolean).join(' ')

  const propsStr = props ? ` ${props}` : ''
  return `<Blockquote${propsStr}>\n  ${escapeJsxText(config.children || 'Quote')}\n</Blockquote>`
}

export function getDefaultConfig() {
  return {
    variant: 'border',
    cite: SAMPLE_CITE,
    citeUrl: '',
    children: SAMPLE_QUOTE,
  }
}

export function Preview({ config }) {
  return (
    <Blockquote
      variant={config.variant}
      cite={config.cite || undefined}
      citeUrl={config.citeUrl || undefined}
    >
      {config.children || SAMPLE_QUOTE}
    </Blockquote>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextareaField
        label="Quote"
        size="compact"
        rows={5}
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <TextField
        label="Citation"
        size="compact"
        value={config.cite}
        onChange={(event) => setConfig((current) => ({ ...current, cite: event.target.value }))}
      />
      <TextField
        label="Citation URL"
        size="compact"
        value={config.citeUrl}
        onChange={(event) => setConfig((current) => ({ ...current, citeUrl: event.target.value }))}
      />
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={BLOCKQUOTE_VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildBlockquoteSnippet(config)}</Code>
}
