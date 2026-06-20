import { useEffect, useState } from 'react'
import {
  Button,
  Code,
  DefinitionList,
  Divider,
  IconButton,
  Link,
  Paragraph,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Toolbar,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'

function uid() {
  return `dl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

// Tab labels: show the full label for a few items; once there are many, clamp to
// the first few characters so the tab strip stays compact.
function tabLabel(label, index, total) {
  const text = (label ?? '').trim() || `${index + 1}`
  if (total <= 4) return text
  return text.length > 4 ? `${text.slice(0, 4)}…` : text
}

const DIRECTION_OPTIONS = [
  { value: 'row', label: 'Row', icon: 'east' },
  { value: 'column', label: 'Column', icon: 'south' },
]
const SIZE_OPTIONS = ['sm', 'md', 'lg']
const LABEL_WIDTH_OPTIONS = [
  { value: 'auto', label: 'Auto', icon: 'width' },
  { value: 'fixed', label: 'Fixed', icon: 'straighten' },
]
const VALUE_HEADING_SIZES = ['sm', 'md', 'lg', 'xl']

function esc(s) {
  return String(s ?? '').replaceAll('"', '&quot;')
}

function buildSnippet(config) {
  const props = [
    config.direction !== 'row' ? `direction="${config.direction}"` : null,
    config.size !== 'md' ? `size="${config.size}"` : null,
    config.direction === 'row' && config.labelWidth !== 'auto' ? `labelWidth="${config.labelWidth}"` : null,
  ].filter(Boolean).join('\n  ')

  const itemsStr = config.items.map((item) => {
    const headingSize = item.valueHeadingProps?.size
    const valuePart = item.href != null
      ? `value: <Link href="${esc(item.href)}">${esc(item.value)}</Link>`
      : `value: "${esc(item.value)}"`
    const parts = [
      `label: "${esc(item.label)}"`,
      valuePart,
      item.copyValue ? 'copyValue: true' : null,
      item.copyText  ? `copyText: "${esc(item.copyText)}"` : null,
      item.copyLabel ? `copyLabel: "${esc(item.copyLabel)}"` : null,
      item.copiedLabel ? `copiedLabel: "${esc(item.copiedLabel)}"` : null,
      headingSize ? `valueHeadingProps: { size: "${headingSize}" }` : null,
    ].filter(Boolean).join(', ')
    return `  { ${parts} },`
  }).join('\n')

  return `<DefinitionList${props ? `\n  ${props}` : ''}
  items={[
${itemsStr}
  ]}
/>`
}

export function getDefaultConfig() {
  return {
    direction: 'row',
    size: 'md',
    labelWidth: 'fixed',
    items: [
      { id: uid(), label: 'Account ID', value: 'A1-849204' },
      { id: uid(), label: 'Plan',       value: 'Enterprise' },
      { id: uid(), label: 'Renewal',    value: 'June 30, 2026' },
    ],
  }
}

export function Preview({ config }) {
  const items = config.items.map(({ id: _id, href, value, ...rest }) => ({
    ...rest,
    value: href ? <Link href={href}>{value}</Link> : value,
  }))
  return (
    <DefinitionList
      direction={config.direction}
      size={config.size}
      labelWidth={config.direction === 'row' ? config.labelWidth : undefined}
      items={items}
    />
  )
}

function ItemEditor({ item, onChange, onRemove }) {
  const hasHeading = !!item.valueHeadingProps?.size

  return (
    <Stack gap="sm">
      <Stack direction="row" justify="end">
        <IconButton
          icon="delete"
          variant="destructive"
          size="sm"
          aria-label="Remove item"
          onClick={onRemove}
        />
      </Stack>
      <TextField
        label="Label"
        size="compact"
        value={item.label ?? ''}
        onChange={(e) => onChange({ label: e.target.value })}
      />
        <TextField
          label="Value"
          size="compact"
          value={item.value ?? ''}
          onChange={(e) => onChange({ value: e.target.value })}
        />

        <Toolbar label="Display">
          <ToolbarToggle
            icon="title"
            label="Value as heading"
            pressed={hasHeading}
            onChange={(v) => onChange({ valueHeadingProps: v ? { size: 'lg' } : undefined })}
          />
          <ToolbarToggle
            icon="link"
            label="Value as link"
            pressed={item.href != null}
            onChange={(v) => onChange({ href: v ? '#' : undefined })}
          />
          <ToolbarToggle
            icon="content_copy"
            label="Copy button"
            pressed={!!item.copyValue}
            onChange={(v) => onChange({ copyValue: v || undefined })}
          />
        </Toolbar>
        {item.href != null && (
          <TextField
            label="Link URL"
            size="compact"
            value={item.href}
            onChange={(e) => onChange({ href: e.target.value })}
          />
        )}
        {hasHeading && (
          <ConfigSlider
            label="Heading size"
            values={VALUE_HEADING_SIZES}
            value={item.valueHeadingProps.size}
            onChange={(size) => onChange({ valueHeadingProps: { ...item.valueHeadingProps, size } })}
          />
        )}
        {item.copyValue && (
          <>
            <TextField
              label="Clipboard text"
              size="compact"
              value={item.copyText ?? ''}
              onChange={(e) => onChange({ copyText: e.target.value || undefined })}
            />
            <TextField
              label="Copy label"
              hint={`Button label. Default: "Copy value"`}
              size="compact"
              value={item.copyLabel ?? ''}
              onChange={(e) => onChange({ copyLabel: e.target.value || undefined })}
            />
            <TextField
              label="Copied label"
              hint={`Confirmation label. Default: "Copied"`}
              size="compact"
              value={item.copiedLabel ?? ''}
              onChange={(e) => onChange({ copiedLabel: e.target.value || undefined })}
            />
          </>
        )}
    </Stack>
  )
}

export function Controls({ config, setConfig, activeItemIndex = null, onSelectItem }) {
  const [activeId, setActiveId] = useState(config.items[0]?.id ?? '')
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  // The canvas drives the active tab when an item is clicked there.
  const externalId = activeItemIndex != null ? config.items[activeItemIndex]?.id : null
  useEffect(() => {
    if (externalId && externalId !== activeId) setActiveId(externalId)
  }, [externalId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the active tab valid as items are added/removed.
  const activeItemId = config.items.some((i) => i.id === activeId) ? activeId : (config.items[0]?.id ?? '')

  // Switch tab + mirror the selection onto the canvas (outline that item).
  function selectTab(id) {
    setActiveId(id)
    const idx = config.items.findIndex((item) => item.id === id)
    if (idx >= 0) onSelectItem?.(idx)
  }

  function updateItem(id, patch) {
    setConfig((c) => ({ ...c, items: c.items.map((item) => item.id === id ? { ...item, ...patch } : item) }))
  }

  function removeItem(id) {
    const idx = config.items.findIndex((item) => item.id === id)
    const next = config.items[idx + 1]?.id ?? config.items[idx - 1]?.id ?? ''
    setConfig((c) => ({ ...c, items: c.items.filter((item) => item.id !== id) }))
    setActiveId(next)
  }

  function addItem() {
    const id = uid()
    const newIndex = config.items.length
    setConfig((c) => ({ ...c, items: [...c.items, { id, label: 'Label', value: 'Value' }] }))
    setActiveId(id)
    onSelectItem?.(newIndex)
  }

  return (
    <Stack gap="lg">
      <Choice prop="direction"
        label="Direction"
        iconOnly
        value={config.direction}
        onChange={(direction) => set({ direction })}
        options={DIRECTION_OPTIONS}
      />
      <ConfigSlider prop="size" label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      {config.direction === 'row' && (
        <Choice prop="labelWidth"
          label="Label width"
          iconOnly
          value={config.labelWidth}
          onChange={(labelWidth) => set({ labelWidth })}
          options={LABEL_WIDTH_OPTIONS}
        />
      )}

      <Divider space="none" />

      {config.items.length > 0 ? (
        <div className="a1-web-item-tabs">
        <Tabs value={activeItemId} onChange={selectTab} variant="line" size="compact">
          <TabList>
            {config.items.map((item, i) => (
              <Tab key={item.id} value={item.id}>{tabLabel(item.label, i, config.items.length)}</Tab>
            ))}
          </TabList>
          {config.items.map((item) => (
            <TabPanel key={item.id} value={item.id}>
              <ItemEditor
                item={item}
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

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
