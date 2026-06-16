import { useState } from 'react'
import {
  Accordion,
  BottomDrawer,
  Button,
  ChoiceGroup,
  Code,
  NumberField,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { Toggle } from './Toggle.jsx'
import { IconSelect } from './IconSelect.jsx'

export const bareDisplay = true

function uid() {
  return `bd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

const DEFAULT_ITEMS = [
  { id: uid(), label: 'Home',     icon: 'home',           active: true,  badge: 0 },
  { id: uid(), label: 'Explore',  icon: 'explore',        active: false, badge: 0 },
  { id: uid(), label: 'Inbox',    icon: 'inbox',          active: false, badge: 4 },
  { id: uid(), label: 'Profile',  icon: 'account_circle', active: false, badge: 0 },
  { id: uid(), label: 'Settings', icon: 'settings',       active: false, badge: 0 },
]

function buildSnippet(config) {
  const itemsStr = config.items.map((item) => {
    const parts = [
      `id: "${item.id}"`,
      `label: "${item.label}"`,
      `icon: "${item.icon}"`,
      item.active ? 'active: true' : null,
      item.badge > 0 ? `badge: ${item.badge}` : null,
    ].filter(Boolean).join(', ')
    return `  { ${parts} },`
  }).join('\n')

  const props = [
    config.ariaLabel !== 'Primary navigation' ? `  aria-label="${config.ariaLabel}"` : null,
    `  items={[`,
    itemsStr,
    `  ]}`,
  ].filter(Boolean).join('\n')

  return `<BottomDrawer\n${props}\n/>`
}

export function getDefaultConfig() {
  return {
    items: DEFAULT_ITEMS,
    ariaLabel: 'Primary navigation',
  }
}

export function Preview({ config }) {
  const items = config.items.map(({ id: _id, ...rest }) => ({
    ...rest,
    badge: rest.badge > 0 ? rest.badge : undefined,
  }))

  return (
    <div style={{
      position: 'relative',
      transform: 'translateZ(0)',
      minHeight: '160px',
      background: 'var(--semantic-color-surface-page)',
      overflow: 'hidden',
    }}>
      <Paragraph size="sm" color="muted" style={{ padding: 'var(--base-spacing-24)' }}>
        Pinned to the bottom of the viewport on mobile screens.
      </Paragraph>
      <BottomDrawer items={items} aria-label={config.ariaLabel} />
    </div>
  )
}

function ItemEditor({ item, onChange, onRemove, onSetActive, isOpen, onToggleOpen }) {
  return (
    <Accordion label={item.label || 'Untitled'} size="sm" open={isOpen} onChange={onToggleOpen}>
      <Stack gap="sm">
        <TextField
          label="Label"
          size="compact"
          value={item.label ?? ''}
          onChange={(e) => onChange({ label: e.target.value })}
        />
        <IconSelect
          label="Icon"
          value={item.icon}
          onChange={(icon) => onChange({ icon })}
        />
        <Toggle
          label="Active"
          value={!!item.active}
          onChange={(active) => { if (active) onSetActive() }}
        />
        <NumberField
          label="Badge count"
          size="compact"
          value={item.badge ?? 0}
          onChange={(e) => onChange({ badge: Math.max(0, parseInt(e.target.value, 10) || 0) })}
        />
        <Button type="button" variant="destructive" size="sm" icon="delete" onClick={onRemove}>
          Remove
        </Button>
      </Stack>
    </Accordion>
  )
}

export function Controls({ config, setConfig }) {
  const [openIds, setOpenIds] = useState([])
  const set = (patch) => setConfig((c) => ({ ...c, ...patch }))

  const canAdd = config.items.length < 5
  const canRemove = config.items.length > 3

  function updateItem(id, patch) {
    setConfig((c) => ({ ...c, items: c.items.map((item) => item.id === id ? { ...item, ...patch } : item) }))
  }

  function setActive(id) {
    setConfig((c) => ({ ...c, items: c.items.map((item) => ({ ...item, active: item.id === id })) }))
  }

  function removeItem(id) {
    setConfig((c) => ({ ...c, items: c.items.filter((item) => item.id !== id) }))
    setOpenIds((prev) => prev.filter((x) => x !== id))
  }

  function addItem() {
    if (!canAdd) return
    const id = uid()
    setConfig((c) => ({
      ...c,
      items: [...c.items, { id, label: 'New', icon: 'star', active: false, badge: 0 }],
    }))
    setOpenIds((prev) => [...prev, id])
  }

  function toggleOpen(id) {
    setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <Stack gap="lg">
      <TextField
        label="Aria label"
        size="compact"
        value={config.ariaLabel}
        onChange={(e) => set({ ariaLabel: e.target.value })}
      />

      <Stack gap="xs">
        {config.items.map((item) => (
          <ItemEditor
            key={item.id}
            item={item}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={canRemove ? () => removeItem(item.id) : undefined}
            onSetActive={() => setActive(item.id)}
            isOpen={openIds.includes(item.id)}
            onToggleOpen={() => toggleOpen(item.id)}
          />
        ))}
      </Stack>

      {canAdd && (
        <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
          Add item
        </Button>
      )}
    </Stack>
  )
}

export function Snippet({ config }) {
  return <Code variant="block" wrapping copyCode>{buildSnippet(config)}</Code>
}
