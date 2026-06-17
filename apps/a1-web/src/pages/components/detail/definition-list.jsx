import { useState } from 'react'
import {
  Accordion,
  Button,
  Code,
  DefinitionList,
  Divider,
  Paragraph,
  Stack,
  TextField,
  Toolbar,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { Choice, ConfigSlider } from './configKit.jsx'

function uid() {
  return `dl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

const DIRECTION_OPTIONS = [
  { value: 'row', label: 'Row', icon: 'view_column' },
  { value: 'column', label: 'Column', icon: 'view_agenda' },
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
    const parts = [
      `label: "${esc(item.label)}"`,
      `value: "${esc(item.value)}"`,
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
      { id: uid(), label: 'Account ID', value: 'A1-849204',      copyValue: true },
      { id: uid(), label: 'Plan',       value: 'Enterprise' },
      { id: uid(), label: 'Renewal',    value: 'June 30, 2026' },
    ],
  }
}

export function Preview({ config }) {
  const items = config.items.map(({ id: _id, ...rest }) => rest)
  return (
    <DefinitionList
      direction={config.direction}
      size={config.size}
      labelWidth={config.direction === 'row' ? config.labelWidth : undefined}
      items={items}
    />
  )
}

function ItemEditor({ item, onChange, onRemove, isOpen, onToggleOpen }) {
  const hasHeading = !!item.valueHeadingProps?.size

  return (
    <Accordion label={item.label || 'Untitled'} size="sm" open={isOpen} onChange={onToggleOpen}>
      <Stack gap="sm">
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
            icon="content_copy"
            label="Copy button"
            pressed={!!item.copyValue}
            onChange={(v) => onChange({ copyValue: v || undefined })}
          />
        </Toolbar>
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

        <Button type="button" variant="destructive" size="sm" icon="delete" onClick={onRemove}>
          Remove
        </Button>
      </Stack>
    </Accordion>
  )
}

export function Controls({ config, setConfig }) {
  const [openIds, setOpenIds] = useState([])
  const set = (patch) => setConfig((current) => ({ ...current, ...patch }))

  function updateItem(id, patch) {
    setConfig((c) => ({ ...c, items: c.items.map((item) => item.id === id ? { ...item, ...patch } : item) }))
  }

  function removeItem(id) {
    setConfig((c) => ({ ...c, items: c.items.filter((item) => item.id !== id) }))
    setOpenIds((prev) => prev.filter((x) => x !== id))
  }

  function addItem() {
    const id = uid()
    setConfig((c) => ({ ...c, items: [...c.items, { id, label: 'Label', value: 'Value' }] }))
    setOpenIds((prev) => [...prev, id])
  }

  function toggleOpen(id) {
    setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <Stack gap="lg">
      <Choice
        label="Direction"
        iconOnly
        value={config.direction}
        onChange={(direction) => set({ direction })}
        options={DIRECTION_OPTIONS}
      />
      <ConfigSlider label="Size" values={SIZE_OPTIONS} value={config.size} onChange={(size) => set({ size })} />
      {config.direction === 'row' && (
        <Choice
          label="Label width"
          iconOnly
          value={config.labelWidth}
          onChange={(labelWidth) => set({ labelWidth })}
          options={LABEL_WIDTH_OPTIONS}
        />
      )}

      <Divider space="none" />

      <Stack gap="xs">
        {config.items.map((item) => (
          <ItemEditor
            key={item.id}
            item={item}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            isOpen={openIds.includes(item.id)}
            onToggleOpen={() => toggleOpen(item.id)}
          />
        ))}
        {config.items.length === 0 && (
          <Paragraph size="sm" color="muted">No items. Add one below.</Paragraph>
        )}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
        Add item
      </Button>
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
