import { useState } from 'react'
import {
  Accordion,
  Button,
  ChoiceGroup,
  Code,
  Paragraph,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

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
    items: [
      { id: 'tab-overview', label: 'Overview', icon: '', iconPosition: 'start', count: '', status: 'none' },
      { id: 'tab-activity', label: 'Activity', icon: '', iconPosition: 'start', count: '12', status: 'none' },
      { id: 'tab-settings', label: 'Settings', icon: '', iconPosition: 'start', count: '', status: 'none' },
    ],
    openItems: [],
  }
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

export function Controls({ config, setConfig }) {
  const items = normalizeItems(config.items)
  const openItems = Array.isArray(config.openItems) ? config.openItems : []

  function updateItem(id, patch) {
    setConfig((current) => ({
      ...current,
      items: normalizeItems(current.items).map((item) => (
        item.id === id ? { ...item, ...patch } : item
      )),
    }))
  }

  function toggleItem(id, open) {
    setConfig((current) => {
      const currentOpenItems = Array.isArray(current.openItems) ? current.openItems : []
      return {
        ...current,
        openItems: open
          ? Array.from(new Set([...currentOpenItems, id]))
          : currentOpenItems.filter((itemId) => itemId !== id),
      }
    })
  }

  function removeItem(id) {
    setConfig((current) => {
      const nextItems = normalizeItems(current.items).filter((item) => item.id !== id)
      return {
        ...current,
        items: nextItems.length > 0 ? nextItems : normalizeItems(current.items),
        openItems: (current.openItems ?? []).filter((itemId) => itemId !== id),
      }
    })
  }

  function addItem() {
    setConfig((current) => {
      const currentItems = normalizeItems(current.items)
      const nextItem = createItem(`Tab ${currentItems.length + 1}`)
      return {
        ...current,
        items: [...currentItems, nextItem],
        openItems: Array.from(new Set([...(current.openItems ?? []), nextItem.id])),
      }
    })
  }

  return (
    <Stack gap="lg">
      <ChoiceGroup
        label="Variant"
        size="compact"
        hideIndicator
        columns={2}
        value={config.variant}
        onChange={(variant) => setConfig((current) => ({ ...current, variant }))}
        options={VARIANT_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
      />
      <ChoiceGroup
        label="Size"
        size="compact"
        hideIndicator
        columns={2}
        value={config.size}
        onChange={(size) => setConfig((current) => ({ ...current, size }))}
        options={[
          { label: 'Default', value: 'default' },
          { label: 'Compact', value: 'compact' },
        ]}
      />
      <ChoiceGroup
        label="Level"
        size="compact"
        hideIndicator
        columns={2}
        value={String(config.level)}
        onChange={(value) => setConfig((current) => ({ ...current, level: Number(value) }))}
        options={[
          { label: 'Level 1', value: '1' },
          { label: 'Level 2', value: '2' },
        ]}
      />

      <Stack gap="sm">
        {items.map((item, index) => {
          const label = item.label || 'Untitled tab'
          return (
            <Accordion
              key={item.id}
              label={`${index + 1}. ${label}`}
              size="sm"
              open={openItems.includes(item.id)}
              onChange={(open) => toggleItem(item.id, open)}
            >
              <Stack gap="md">
                <TextField
                  label="Label"
                  size="compact"
                  value={item.label}
                  onChange={(event) => updateItem(item.id, { label: event.target.value })}
                />

                <Toggle
                  label="Icon"
                  value={!!item.icon}
                  onChange={(checked) => updateItem(item.id, { icon: checked ? (item.icon || 'dashboard') : '' })}
                />

                {item.icon && (
                  <>
                    <IconSelect
                      value={item.icon}
                      onChange={(icon) => updateItem(item.id, { icon })}
                    />
                    <ChoiceGroup
                      label="Icon position"
                      size="compact"
                      hideIndicator
                      columns={3}
                      value={item.iconPosition}
                      onChange={(iconPosition) => updateItem(item.id, { iconPosition })}
                      options={ICON_POSITION_OPTIONS.map((opt) => ({ label: optionLabel(opt), value: opt }))}
                    />
                  </>
                )}

                <TextField
                  label="Count"
                  hint="Optional badge after the label."
                  size="compact"
                  value={item.count}
                  onChange={(event) => updateItem(item.id, { count: event.target.value })}
                />

                <ChoiceGroup
                  label="Status"
                  hint="Step state, shown in the progress variant."
                  size="compact"
                  hideIndicator
                  columns={3}
                  value={item.status}
                  onChange={(status) => updateItem(item.id, { status })}
                  options={STATUS_OPTIONS}
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon="delete"
                  disabled={items.length <= 1}
                  onClick={() => removeItem(item.id)}
                >
                  Remove tab
                </Button>
              </Stack>
            </Accordion>
          )
        })}
      </Stack>

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
