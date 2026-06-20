import {
  Code,
  NumberField,
  Paragraph,
  Stack,
  TextareaField,
  Toolbar,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const CODE_VARIANT_OPTIONS = ['block', 'inline']

const SAMPLE_INLINE_CODE = '--semantic-color-action-background'
const SAMPLE_BLOCK_CODE = `import { Button, Code } from '@gtivr4/a1-design-system-react'

export function Example() {
  return (
    <Button icon="arrow_forward">
      Continue
    </Button>
  )
}`

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function sampleForVariant(variant) {
  return variant === 'block' ? SAMPLE_BLOCK_CODE : SAMPLE_INLINE_CODE
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeTemplateLiteral(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${')
}

function propString(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function propBoolean(name, value) {
  return value ? name : null
}

function propExpression(name, value) {
  if (value === undefined || value === null || value === '') return null
  return `${name}={${JSON.stringify(value)}}`
}

function codeProps(config) {
  const isInline = config.variant === 'inline'
  return [
    propString('variant', config.variant, 'inline'),
    !isInline ? propBoolean('wrapping', config.wrapping) : null,
    !isInline ? propBoolean('editable', config.editable) : null,
    !isInline ? propBoolean('copyCode', config.copyCode) : null,
    !isInline ? propExpression('copyText', config.copyText) : null,
    !isInline && !config.editable ? propBoolean('collapsible', config.collapsible) : null,
    !isInline && !config.editable && config.collapsible && config.collapsedLines !== 14
      ? propExpression('collapsedLines', config.collapsedLines) : null,
  ].filter(Boolean).join(' ')
}

function indentChildren(value) {
  return escapeJsxText(value).split('\n').map((line) => `  ${line}`).join('\n')
}

function buildCodeSnippet(config) {
  const children = config.children || sampleForVariant(config.variant)
  const props = codeProps(config)
  const propsStr = props ? ` ${props}` : ''
  const isCompactInline = config.variant === 'inline' && !children.includes('\n')

  if (isCompactInline) {
    return `<Code>${escapeJsxText(children)}</Code>`
  }

  if (children.includes('\n') || children.includes('{') || children.includes('}')) {
    return `<Code${propsStr}>\n  {\`${escapeTemplateLiteral(children)}\`}\n</Code>`
  }

  return `<Code${propsStr}>\n${indentChildren(children)}\n</Code>`
}

export function getDefaultConfig() {
  return {
    variant: 'block',
    wrapping: true,
    editable: false,
    copyCode: false,
    copyText: '',
    collapsible: false,
    collapsedLines: 14,
    children: SAMPLE_BLOCK_CODE,
  }
}

export function Preview({ config }) {
  const children = config.children || sampleForVariant(config.variant)
  const copyText = config.copyText || undefined

  if (config.variant === 'inline') {
    return (
      <Paragraph>
        Set the token value with{' '}
        <Code>{children}</Code>
        {' '}in your CSS.
      </Paragraph>
    )
  }

  return (
    <Code
      variant={config.variant}
      wrapping={config.wrapping}
      editable={config.editable}
      copyCode={config.copyCode}
      copyText={copyText}
      collapsible={config.collapsible}
      collapsedLines={config.collapsedLines}
    >
      {children}
    </Code>
  )
}

export function Controls({ config, setConfig }) {
  const isInline = config.variant === 'inline'

  function handleVariantChange(variant) {
    setConfig((current) => {
      const hasSampleCode = current.children === SAMPLE_INLINE_CODE || current.children === SAMPLE_BLOCK_CODE
      return {
        ...current,
        variant,
        children: hasSampleCode ? sampleForVariant(variant) : current.children,
        // reset block-only props when switching to inline
        ...(variant === 'inline' ? { wrapping: false, editable: false, copyCode: false, copyText: '', collapsible: false } : {}),
      }
    })
  }

  return (
    <Stack gap="lg">
      <TextareaField
        label="Code"
        size="compact"
        rows={config.variant === 'block' || config.copyCode ? 8 : 3}
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <Choice prop="variant"
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={handleVariantChange}
        options={CODE_VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {!isInline && (
        <>
          <Toolbar label="Options">
            <ToolbarToggle icon="wrap_text" label="Wrapping" pressed={config.wrapping} onChange={(wrapping) => setConfig((current) => ({ ...current, wrapping }))} />
            <ToolbarToggle icon="edit" label="Editable" pressed={config.editable} onChange={(editable) => setConfig((current) => ({ ...current, editable, ...(editable ? { collapsible: false } : {}) }))} />
            <ToolbarToggle icon="content_copy" label="Copy button" pressed={config.copyCode} onChange={(copyCode) => setConfig((current) => ({ ...current, copyCode }))} />
            <ToolbarToggle icon="unfold_less" label="Collapsible" disabled={config.editable} pressed={config.collapsible && !config.editable} onChange={(collapsible) => setConfig((current) => ({ ...current, collapsible }))} />
          </Toolbar>
          {config.collapsible && !config.editable && (
            <NumberField
              label="Collapsed lines"
              hint="Approximate lines shown before the Show more toggle."
              size="compact"
              value={config.collapsedLines}
              onChange={(event) => setConfig((current) => ({ ...current, collapsedLines: Number(event.target.value) || 14 }))}
            />
          )}
          {config.copyCode && (
            <TextareaField
              label="Clipboard text"
              hint="Optional override. Leave empty to copy the rendered code."
              size="compact"
              rows={3}
              value={config.copyText}
              onChange={(event) => setConfig((current) => ({ ...current, copyText: event.target.value }))}
            />
          )}
        </>
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildCodeSnippet(config)}</Code>
}
