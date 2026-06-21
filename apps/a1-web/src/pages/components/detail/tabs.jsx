import { useEffect, useState } from 'react'
import {
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
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

// Tab labels: full label for a few items; clamp past 4 so the strip stays compact.
function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}…` : text
}

const VARIANT_OPTIONS = ['line', 'pills', 'segment', 'progress', 'folder']
const ICON_POSITION_OPTIONS = ['start', 'above', 'end']
// Only the step states the component actually styles in the progress variant:
// default ("todo"), in-progress, and completed.
const STATUS_OPTIONS = [
  { label: 'Todo', value: 'none' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
]

function optionLabel(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function escapeJsString(value) {
  return String(value ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
    .replaceAll('\n', '\\n')
}

function createItem(label) {
  return {
    id: `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    icon: '',
    iconPosition: 'start',
    count: '',
    status: 'none',
  }
}

function normalizeItems(items) {
  return Array.isArray(items) && items.length > 0
    ? items
    : [createItem('Overview')]
}

function resolveSize(size) {
  return size === 'compact' ? 'compact' : undefined
}

export function getDefaultConfig() {
  return {
    variant: 'line',
    size: 'default',
    level: 1,
    equalHeight: false,
    labelMode: 'all',
    items: [
      { id: 'tab-overview', label: 'Overview', icon: '', iconPosition: 'start', count: '', status: 'none' },
      { id: 'tab-activity', label: 'Activity', icon: '', iconPosition: 'start', count: '12', status: 'none' },
      { id: 'tab-settings', label: 'Settings', icon: '', iconPosition: 'start', count: '', status: 'none' },
    ],
  }
}

function ItemEditor({ item, canRemove, onChange, onRemove }) {
  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton icon="delete" variant="destructive" size="sm" aria-label="Remove tab" disabled={!canRemove} onClick={onRemove} />
      </Stack>
      <TextField label="Label" size="compact" value={item.label} onChange={(e) => onChange({ label: e.target.value })} />
      <Toggle
        label="Icon"
        value={!!item.icon}
        onChange={(checked) => onChange({ icon: checked ? (item.icon || 'dashboard') : '' })}
      />
      {item.icon && (
        <>
          <IconSelect value={item.icon} onChange={(icon) => onChange({ icon })} />
          <Choice
            label="Icon position" size="compact" hideIndicator columns={3}
            value={item.iconPosition}
            onChange={(iconPosition) => onChange({ iconPosition })}
            options={ICON_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
          />
        </>
      )}
      <TextField label="Count" hint="Optional badge after the label." size="compact" value={item.count} onChange={(e) => onChange({ count: e.target.value })} />
      <Choice
        label="Status" hint="Step state, shown in the progress variant." size="compact" hideIndicator columns={3}
        value={item.status}
        onChange={(status) => onChange({ status })}
        options={STATUS_OPTIONS}
      />
    </Stack>
  )
}

export function Preview({ config }) {
  const items = normalizeItems(config.items)
  const [active, setActive] = useState(items[0]?.id)
  const activeValue = items.some((item) => item.id === active) ? active : items[0]?.id

  return (
    <Tabs
      value={activeValue}
      onChange={setActive}
      variant={config.variant}
      level={config.level}
      size={resolveSize(config.size)}
      equalHeight={config.equalHeight}
      labelMode={config.labelMode}
    >
      <TabList>
        {items.map((item) => (
          <Tab
            key={item.id}
            value={item.id}
            icon={item.icon || undefined}
            iconPosition={item.iconPosition}
            count={item.count !== '' ? item.count : undefined}
            status={item.status !== 'none' ? item.status : undefined}
          >
            {item.label || 'Untitled'}
          </Tab>
        ))}
      </TabList>
      {items.map((item) => (
        <TabPanel key={item.id} value={item.id}>
          <Paragraph size="sm" color="muted">
            {item.label || 'Untitled'} panel content.
          </Paragraph>
        </TabPanel>
      ))}
    </Tabs>
  )
}

export function Controls({ config, setConfig, activeItemIndex = null, onSelectItem }) {
  const items = normalizeItems(config.items)
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  const externalId = activeItemIndex != null ? items[activeItemIndex]?.id : null
  useEffect(() => {
    if (externalId && externalId !== activeId) setActiveId(externalId)
  }, [externalId]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeItemId = items.some((i) => i.id === activeId) ? activeId : (items[0]?.id ?? '')

  function selectTab(id) {
    setActiveId(id)
    const idx = items.findIndex((i) => i.id === id)
    if (idx >= 0) onSelectItem?.(idx)
  }

  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: normalizeItems(current.items).map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }))
  }

  function removeItem(id) {
    const idx = items.findIndex((i) => i.id === id)
    const next = items[idx + 1]?.id ?? items[idx - 1]?.id ?? ''
    setConfig((current) => {
      const filtered = normalizeItems(current.items).filter((item) => item.id !== id)
      return { ...current, items: filtered.length > 0 ? filtered : normalizeItems(current.items) }
    })
    setActiveId(next)
  }

  function addItem() {
    const item = createItem(`Tab ${items.length + 1}`)
    const newIndex = items.length
    setConfig((current) => ({ ...current, items: [...normalizeItems(current.items), item] }))
    setActiveId(item.id)
    onSelectItem?.(newIndex)
  }

  return (
    <Stack gap="lg">
      <Choice prop="variant"
        label="Variant" size="compact" hideIndicator columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <Choice prop="size"
        label="Size" size="compact" hideIndicator columns={2}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={[
          { label: 'Default', value: 'default' },
          { label: 'Compact', value: 'compact' },
        ]}
      />
      <Choice
        label="Level" size="compact" hideIndicator columns={2}
        value={String(config.level)}
        onChange={(value) => setConfig((current) => ({ ...current, level: Number(value) }))}
        options={[
          { label: 'Level 1', value: '1' },
          { label: 'Level 2', value: '2' },
        ]}
      />
      <Choice
        label="Label mode" size="compact" hideIndicator columns={2}
        helper="“Selected” shows the label only on the active tab; inactive tabs are icon-only (give each tab an icon)."
        value={config.labelMode}
        onChange={(labelMode) => setConfig((current) => ({ ...current, labelMode }))}
        options={[
          { label: 'All', value: 'all' },
          { label: 'Selected', value: 'selected' },
        ]}
      />
      <Toggle
        label="Equal height"
        helper="Reserve the tallest panel's height so switching tabs doesn't resize the container. For tabs inside a Dialog/overlay."
        value={config.equalHeight}
        onChange={(equalHeight) => setConfig((current) => ({ ...current, equalHeight }))}
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
            {items.map((item) => (
              <TabPanel key={item.id} value={item.id}>
                <ItemEditor
                  item={item}
                  canRemove={items.length > 1}
                  onChange={(patch) => updateItem(item.id, patch)}
                  onRemove={() => removeItem(item.id)}
                />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      ) : (
        <Paragraph size="sm" color="muted">No tabs. Add one below.</Paragraph>
      )}

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
        Add tab
      </Button>
    </Stack>
  )
}

function countAttr(count) {
  if (count === '' || count === undefined) return null
  return /^\d+$/.test(count) ? `count={${count}}` : `count="${escapeJsString(count)}"`
}

function tabSnippet(item) {
  const props = [
    `value="${escapeJsString(item.id)}"`,
    item.icon ? `icon="${escapeJsString(item.icon)}"` : null,
    item.icon && item.iconPosition !== 'start' ? `iconPosition="${item.iconPosition}"` : null,
    countAttr(item.count),
    item.status !== 'none' ? `status="${item.status}"` : null,
  ].filter(Boolean).join(' ')
  return `    <Tab ${props}>${escapeJsString(item.label || 'Untitled')}</Tab>`
}

function panelSnippet(item) {
  return `  <TabPanel value="${escapeJsString(item.id)}">${escapeJsString(item.label || 'Untitled')} panel content.</TabPanel>`
}

function buildTabsSnippet(config) {
  const items = normalizeItems(config.items)
  const tabsProps = [
    `value={value}`,
    `onChange={setValue}`,
    config.variant !== 'line' ? `variant="${config.variant}"` : null,
    config.size === 'compact' ? `size="compact"` : null,
    config.level !== 1 ? `level={${config.level}}` : null,
    config.equalHeight ? `equalHeight` : null,
    config.labelMode !== 'all' ? `labelMode="${config.labelMode}"` : null,
  ].filter(Boolean).join(' ')

  const tabLines = items.map(tabSnippet).join('\n')
  const panelLines = items.map(panelSnippet).join('\n')

  return `<Tabs ${tabsProps}>
  <TabList>
${tabLines}
  </TabList>
${panelLines}
</Tabs>`
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildTabsSnippet(config)}</Code>
}
