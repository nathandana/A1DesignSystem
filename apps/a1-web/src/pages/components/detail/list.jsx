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
  '  - Base, semantic, and component tiers',
  '- Generate themed CSS and JSON from one source',
  '- Consume the same values everywhere',
  '  - React',
  '  - HTML/CSS',
  '  - React Native',
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

function elementFor(variant) {
  return variant === 'ordered' ? 'ol' : 'ul'
}

// Parse a Markdown-ish textarea into a nested item tree. One item per non-empty
// line; leading bullet/number markers (-, *, +, 1.) are stripped. Indentation
// (2 spaces or a tab per level) creates nested lists.
function parseTree(text) {
  const root = { children: [] }
  const stack = [{ depth: -1, node: root }]

  for (const raw of String(text ?? '').split('\n')) {
    if (!raw.trim()) continue
    const indent = raw.match(/^[ \t]*/)[0].replace(/\t/g, '  ').length
    const depth = Math.floor(indent / 2)
    const content = raw.replace(/^[ \t]*(?:[-*+]|\d+\.)\s+/, '').trim()
    if (!content) continue

    const item = { text: content, children: [] }
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop()
    stack[stack.length - 1].node.children.push(item)
    stack.push({ depth, node: item })
  }

  return root.children
}

function propLine(name, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue || value === '') return null
  return `${name}="${value}"`
}

function listProps(config) {
  return [
    propLine('as', elementFor(config.variant), 'ul'),
    config.variant === 'divider' ? propLine('variant', 'divider', '') : null,
    config.variant === 'icon' ? propLine('icon', config.icon, '') : null,
    propLine('size', config.size, 'md'),
    propLine('color', config.color, 'default'),
  ].filter(Boolean).join(' ')
}

function buildItems(items, config, indent) {
  const pad = '  '.repeat(indent)
  const propsStr = listProps(config) ? ` ${listProps(config)}` : ''
  return items
    .map((item) => {
      if (item.children.length > 0) {
        const inner = buildItems(item.children, config, indent + 2)
        return `${pad}<ListItem>\n${pad}  ${escapeJsxText(item.text)}\n${pad}  <List${propsStr}>\n${inner}\n${pad}  </List>\n${pad}</ListItem>`
      }
      return `${pad}<ListItem>${escapeJsxText(item.text)}</ListItem>`
    })
    .join('\n')
}

function buildListSnippet(config) {
  const tree = parseTree(config.children)
  const propsStr = listProps(config) ? ` ${listProps(config)}` : ''
  return `<List${propsStr}>\n${buildItems(tree, config, 1)}\n</List>`
}

function renderItems(items, config) {
  const icon = config.variant === 'icon' ? config.icon : undefined
  return items.map((item, index) => (
    <ListItem key={index}>
      {item.text}
      {item.children.length > 0 && (
        <List
          as={elementFor(config.variant)}
          variant={config.variant}
          size={config.size}
          color={config.color}
          icon={icon}
        >
          {renderItems(item.children, config)}
        </List>
      )}
    </ListItem>
  ))
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
  const icon = config.variant === 'icon' ? config.icon : undefined
  return (
    <List
      as={elementFor(config.variant)}
      variant={config.variant}
      size={config.size}
      color={config.color}
      icon={icon}
    >
      {renderItems(parseTree(config.children), config)}
    </List>
  )
}

export function Controls({ config, setConfig }) {
  return (
    <Stack gap="lg">
      <TextareaField
        label="Items"
        hint="One item per line. Indent two spaces to nest. Markdown markers (-, *, 1.) are stripped."
        size="compact"
        rows={6}
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
