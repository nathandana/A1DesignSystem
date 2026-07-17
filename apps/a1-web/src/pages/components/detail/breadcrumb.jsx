import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  Button,
  Code,
  Divider,
  IconButton,
  Paragraph,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'

const ITEM_BEHAVIOR_OPTIONS = ['link', 'button', 'static']

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// Tab labels: full label for a few items; clamp once the strip gets crowded.
function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}…` : text
}

function createItem(label, behavior = 'link', href = '#') {
  return {
    id: `breadcrumb-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    behavior,
    href,
  }
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function escapeJsxString(value) {
  return String(value ?? '').replaceAll('"', '&quot;')
}

function normalizeItems(items) {
  return Array.isArray(items) && items.length > 0
    ? items
    : [createItem('Breadcrumb', 'static', '')]
}

function previewItems(config) {
  const items = normalizeItems(config.items)

  return items.map((item, index) => {
    const isLast = index === items.length - 1
    if (isLast || item.behavior === 'static') return { label: item.label || 'Untitled' }
    if (item.behavior === 'button') return { label: item.label || 'Untitled', onClick: () => {} }
    return { label: item.label || 'Untitled', href: item.href || '#' }
  })
}

function snippetItem(item, isLast) {
  const label = escapeJsString(item.label || 'Untitled')
  if (isLast || item.behavior === 'static') return `{ label: '${label}' }`
  if (item.behavior === 'button') return `{ label: '${label}', onClick: () => console.log('${label}') }`

  return `{ label: '${label}', href: '${escapeJsString(item.href || '#')}' }`
}

function buildBreadcrumbSnippet(config, utilityClass = '') {
  const items = normalizeItems(config.items)
  const itemLines = items
    .map((item, index) => `    ${snippetItem(item, index === items.length - 1)},`)
    .join('\n')
  const backLabelProp = config.backLabel && config.backLabel !== 'Back'
    ? `\n  backLabel="${escapeJsxString(config.backLabel)}"`
    : ''
  const classNameProp = utilityClass ? `\n  className="${escapeJsxString(utilityClass)}"` : ''

  return `<Breadcrumb${classNameProp}${backLabelProp}
  items={[
${itemLines}
  ]}
/>`
}

export function getDefaultConfig() {
  return {
    backLabel: 'Back',
    items: [
      { id: 'breadcrumb-home', label: 'Home', behavior: 'link', href: '/' },
      { id: 'breadcrumb-components', label: 'Components', behavior: 'link', href: '/components' },
      { id: 'breadcrumb-navigation', label: 'Navigation', behavior: 'button', href: '' },
      { id: 'breadcrumb-current', label: 'Breadcrumb', behavior: 'static', href: '' },
    ],
  }
}

export function Preview({ config, utilityClass = '' }) {
  return (
    <Breadcrumb
      className={utilityClass || undefined}
      backLabel={config.backLabel || 'Back'}
      items={previewItems(config)}
    />
  )
}

// Per-item editor shown inside a tab. The last item is the current page (static).
function ItemEditor({ item, isLast, canRemove, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton icon="delete" variant="destructive" size="sm" aria-label="Remove item" disabled={!canRemove} onClick={onRemove} />
      </Stack>
      <TextField
        label={isLast ? 'Current page label' : 'Label'}
        size="compact"
        value={item.label}
        onChange={(e) => onChange({ label: e.target.value })}
      />
      {!isLast && (
        <Choice
          label="Behavior"
          size="compact"
          hideIndicator
          columns={3}
          value={item.behavior}
          onChange={(behavior) => onChange({ behavior })}
          options={ITEM_BEHAVIOR_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
        />
      )}
      {!isLast && item.behavior === 'link' && (
        <TextField
          label="Href"
          size="compact"
          value={item.href}
          onChange={(e) => onChange({ href: e.target.value })}
        />
      )}
    </Stack>
  )
}

export function Controls({ config, setConfig, activeItemIndex = null, onSelectItem }) {
  const items = normalizeItems(config.items)
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  // The canvas drives the active tab when an item is clicked there.
  const externalId = activeItemIndex != null ? items[activeItemIndex]?.id : null
  useEffect(() => {
    if (externalId && externalId !== activeId) setActiveId(externalId)
  }, [externalId]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeItemId = items.some((i) => i.id === activeId) ? activeId : (items[0]?.id ?? '')

  function selectTab(id) {
    setActiveId(id)
    const idx = items.findIndex((item) => item.id === id)
    if (idx >= 0) onSelectItem?.(idx)
  }

  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: normalizeItems(current.items).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function removeItem(id) {
    const idx = items.findIndex((item) => item.id === id)
    const next = items[idx + 1]?.id ?? items[idx - 1]?.id ?? ''
    setConfig((current) => {
      const filtered = normalizeItems(current.items).filter((item) => item.id !== id)
      return { ...current, items: filtered.length > 0 ? filtered : normalizeItems(current.items) }
    })
    setActiveId(next)
  }

  // New items insert before the current (last) page, which stays the leaf.
  function addItem() {
    const currentItems = normalizeItems(config.items)
    const nextItem = createItem(`Section ${currentItems.length}`, 'link', '#')
    const insertIndex = Math.max(currentItems.length - 1, 0)
    setConfig((current) => {
      const list = normalizeItems(current.items)
      return { ...current, items: [...list.slice(0, -1), nextItem, list[list.length - 1]] }
    })
    setActiveId(nextItem.id)
    onSelectItem?.(insertIndex)
  }

  return (
    <Stack gap="lg">
      <TextField
        label="Back label"
        size="compact"
        value={config.backLabel}
        onChange={(event) => setConfig((current) => ({ ...current, backLabel: event.target.value }))}
      />

      <Divider space="none" />

      {items.length > 0 ? (
        <div className="a1-web-item-tabs">
          <Tabs value={activeItemId} onChange={selectTab} variant="line" size="compact">
            <TabList>
              {items.map((item, i) => (
                <Tab key={item.id} value={item.id}>{tabLabel(item.label, i, items.length)}</Tab>
              ))}
            </TabList>
            {items.map((item, i) => (
              <TabPanel key={item.id} value={item.id}>
                <ItemEditor
                  item={item}
                  isLast={i === items.length - 1}
                  canRemove={items.length > 1}
                  onChange={(patch) => updateItem(item.id, patch)}
                  onRemove={() => removeItem(item.id)}
                />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      ) : (
        <Paragraph size="sm" color="muted">No items. Add one below.</Paragraph>
      )}

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
        Add item
      </Button>
    </Stack>
  )
}

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" wrapping copyCode>{buildBreadcrumbSnippet(config, utilityClass)}</Code>
}

export const jsonType = 'Breadcrumb'

export function toJson(config) {
  const props = {
    items: normalizeItems(config.items).map((item, index, items) => ({
      id: item.id || `breadcrumb-item-${index + 1}`,
      label: item.label || 'Untitled',
      ...(index < items.length - 1 && item.behavior !== 'static' && item.href ? { href: item.href } : {}),
    })),
  }
  if (config.backLabel && config.backLabel !== 'Back') props.backLabel = config.backLabel
  return { node: { id: 'breadcrumb-1', type: 'Breadcrumb', props }, note: null }
}

export function fromJson(node) {
  const props = node?.props && typeof node.props === 'object' ? node.props : {}
  const items = normalizeItems(props.items).map((item, index, list) => ({
    id: item.id || `breadcrumb-item-${index + 1}`,
    label: item.label || 'Untitled',
    behavior: index === list.length - 1 || !item.href ? 'static' : 'link',
    href: item.href || '',
  }))
  return {
    backLabel: typeof props.backLabel === 'string' ? props.backLabel : 'Back',
    items,
  }
}
