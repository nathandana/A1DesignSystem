import {
  ChoiceGroup,
  Code,
  List,
  ListItem,
  SelectField,
  Stack,
  TextareaField,
} from '@gtivr4/a1-design-system-react'
import { ICON_OPTIONS } from '../data.js'

const LIST_VARIANT_OPTIONS = ['unordered', 'ordered', 'icon', 'divider']
const LIST_SIZE_OPTIONS = ['xs', 'sm', 'md', 'lg', 'xl']

const SAMPLE_ITEMS = [
  '- Define tokens once in Style Dictionary',
  '- Generate themed CSS and JSON from a single source',
  '- Consume the same values in React, HTML/CSS, and Native',
].join('\n')

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsxText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

// Parse a Markdown-ish textarea into list items: one item per non-empty line,
// with leading bullet/number markers (-, *, +, 1.) stripped.
function parseItems(text) {
  return String(text ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').trim())
    .filter(Boolean)
}

function elementFor(variant) {
  return variant === 'ordered' ? 'ol' : 'ul'
}

function propLine(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function buildListSnippet(config) {
  const items = parseItems(config.children)
  const props = [
    propLine('as', elementFor(config.variant), 'ul'),
    config.variant === 'divider' ? propLine('variant', 'divider', '') : null,
    config.variant === 'icon' ? propLine('icon', config.icon, '') : null,
    propLine('size', config.size, 'md'),
    propLine('color', config.color, 'default'),
  ].filter(Boolean).join(' ')

  const propsStr = props ? ` ${props}` : ''
  const itemsStr = items.map((item) => `  <ListItem>${escapeJsxText(item)}</ListItem>`).join('\n')
  return `<List${propsStr}>\n${itemsStr}\n</List>`
}

export function getDefaultConfig() {
  return {
    variant: 'unordered',
    icon: 'check',
    size: 'md',
    color: 'default',
    children: SAMPLE_ITEMS,
  }
}

export function Preview({ config }) {
  const items = parseItems(config.children)
  const icon = config.variant === 'icon' ? config.icon : undefined
  return (
    <List
      as={elementFor(config.variant)}
      variant={config.variant}
      size={config.size}
      color={config.color}
      icon={icon}
    >
      {items.map((item, index) => (
        <ListItem key={index}>{item}</ListItem>
      ))}
    </List>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextareaField
        label="Items"
        hint="One item per line. Markdown markers (-, *, 1.) are stripped."
        size="compact"
        rows={5}
        value={config.children}
        onChange={(event) => setConfig((current) => ({ ...current, children: event.target.value }))}
      />
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={LIST_VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      {config.variant === 'icon' && (
        <SelectField
          label="Icon"
          size="compact"
          value={config.icon}
          onChange={(event) => setConfig((current) => ({ ...current, icon: event.target.value }))}
        >
          {ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </SelectField>
      )}
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={3}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={LIST_SIZE_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
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
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildListSnippet(config)}</Code>
}
