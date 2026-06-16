import { useState } from 'react'
import {
  Accordion,
  Button,
  Code,
  ContextMenu,
  Divider,
  Paragraph,
  Section,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

function uid() {
  return `cm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function esc(s) {
  return String(s ?? '').replaceAll("'", "\\'")
}

// ── Default config ────────────────────────────────────────────────────────────

export function getDefaultConfig() {
  return {
    items: [
      { id: uid(), kind: 'item',    label: 'Open',   icon: 'folder_open',  shortcut: '',    destructive: false },
      { id: uid(), kind: 'item',    label: 'Rename', icon: 'edit',         shortcut: 'F2',  destructive: false },
      { id: uid(), kind: 'item',    label: 'Copy',   icon: 'content_copy', shortcut: '⌘C', destructive: false },
      { id: uid(), kind: 'divider' },
      { id: uid(), kind: 'item',    label: 'Delete', icon: 'delete',       shortcut: '⌦',  destructive: true  },
    ],
  }
}

// ── Config → ContextMenu items ────────────────────────────────────────────────

function toMenuItems(configItems, activeId, onActivate) {
  return configItems.map(item => {
    if (item.kind === 'divider') return { type: 'divider', id: item.id }
    if (item.kind === 'group')   return { type: 'group',   id: item.id, label: item.label || 'Group' }
    return {
      id: item.id,
      label: item.label || 'Untitled',
      icon: item.icon || undefined,
      shortcut: item.shortcut || undefined,
      variant: item.destructive ? 'destructive' : 'default',
      active: activeId !== null ? item.id === activeId : undefined,
      onClick: !item.destructive ? () => onActivate(item.id) : undefined,
    }
  })
}

// ── Snippet ───────────────────────────────────────────────────────────────────

function buildSnippet(configItems) {
  const lines = configItems.map(item => {
    if (item.kind === 'divider') return `  { type: 'divider', id: '${item.id}' },`
    if (item.kind === 'group')   return `  { type: 'group', id: '${item.id}', label: '${esc(item.label)}' },`
    const parts = [
      `id: '${item.id}'`,
      `label: '${esc(item.label || 'Untitled')}'`,
      item.icon      ? `icon: '${item.icon}'`            : null,
      item.shortcut  ? `shortcut: '${esc(item.shortcut)}'` : null,
      item.destructive ? `variant: 'destructive'`        : null,
      `onClick: () => {}`,
    ].filter(Boolean).join(', ')
    return `  { ${parts} },`
  }).join('\n')

  return `const [menu, setMenu] = useState(null)

<div onContextMenu={e => {
  e.preventDefault()
  setMenu({ x: e.clientX, y: e.clientY })
}}>
  <ContextMenu
    open={!!menu}
    x={menu?.x ?? 0}
    y={menu?.y ?? 0}
    onClose={() => setMenu(null)}
    items={[
${lines}
    ]}
  />
  {/* Your content here */}
</div>`
}

// ── Preview ───────────────────────────────────────────────────────────────────

export function Preview({ config }) {
  const [menu, setMenu] = useState(null)
  const [activeId, setActiveId] = useState(null)

  const items = config.items ?? []
  // Track active selection when the menu includes group headings (picker-style).
  const hasGroup = items.some(i => i.kind === 'group')
  const menuItems = toMenuItems(items, hasGroup ? activeId : null, setActiveId)

  return (
    <div
      onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }) }}
      style={{ cursor: 'context-menu' }}
    >
      <ContextMenu
        open={!!menu}
        x={menu?.x ?? 0}
        y={menu?.y ?? 0}
        items={menuItems}
        onClose={() => setMenu(null)}
        aria-label="Demo context menu"
      />
      <Section padding="lg" surface="panel" radius="md">
        <Paragraph color="muted">Right-click anywhere in this area to open the menu.</Paragraph>
      </Section>
    </div>
  )
}

// ── Item editor ───────────────────────────────────────────────────────────────

function ItemEditor({ item, onChange, onRemove, isOpen, onToggleOpen }) {
  const heading =
    item.kind === 'divider' ? '— Divider' :
    item.kind === 'group'   ? `Group: ${item.label || 'Untitled'}` :
    item.label || 'Untitled'

  return (
    <Accordion label={heading} size="sm" open={isOpen} onChange={onToggleOpen}>
      <Stack gap="sm">
        {item.kind !== 'divider' && (
          <TextField
            label={item.kind === 'group' ? 'Group label' : 'Label'}
            size="compact"
            value={item.label ?? ''}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        )}

        {item.kind === 'item' && (
          <>
            <Toggle
              label="Icon"
              value={!!item.icon}
              onChange={(v) => onChange({ icon: v ? 'folder' : '' })}
            />
            {item.icon !== undefined && item.icon !== '' && (
              <IconSelect value={item.icon} onChange={(icon) => onChange({ icon })} />
            )}
            <TextField
              label="Shortcut hint"
              size="compact"
              value={item.shortcut ?? ''}
              onChange={(e) => onChange({ shortcut: e.target.value })}
            />
            <Toggle
              label="Destructive"
              value={!!item.destructive}
              onChange={(v) => onChange({ destructive: v })}
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

// ── Controls ──────────────────────────────────────────────────────────────────

export function Controls({ config, setConfig }) {
  const [openIds, setOpenIds] = useState([])
  const items = config.items ?? []

  function updateItem(id, patch) {
    setConfig(c => ({ ...c, items: (c.items ?? []).map(item => item.id === id ? { ...item, ...patch } : item) }))
  }

  function removeItem(id) {
    setConfig(c => ({ ...c, items: (c.items ?? []).filter(item => item.id !== id) }))
    setOpenIds(prev => prev.filter(x => x !== id))
  }

  function addItem() {
    const id = uid()
    setConfig(c => ({ ...c, items: [...(c.items ?? []), { id, kind: 'item', label: 'New item', icon: '', shortcut: '', destructive: false }] }))
    setOpenIds(prev => [...prev, id])
  }

  function addDivider() {
    setConfig(c => ({ ...c, items: [...(c.items ?? []), { id: uid(), kind: 'divider' }] }))
  }

  function addGroup() {
    const id = uid()
    setConfig(c => ({ ...c, items: [...(c.items ?? []), { id, kind: 'group', label: 'Section heading' }] }))
    setOpenIds(prev => [...prev, id])
  }

  function toggleOpen(id) {
    setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        {items.map(item => (
          <ItemEditor
            key={item.id}
            item={item}
            onChange={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            isOpen={openIds.includes(item.id)}
            onToggleOpen={() => toggleOpen(item.id)}
          />
        ))}
        {items.length === 0 && (
          <Paragraph size="sm" color="muted">No items. Add one below.</Paragraph>
        )}
      </Stack>

      <Divider space="none" />

      <Stack direction="row" gap="sm" wrap>
        <Button type="button" variant="secondary" size="sm" icon="add" onClick={addItem}>
          Add item
        </Button>
        <Button type="button" variant="secondary" size="sm" icon="horizontal_rule" onClick={addDivider}>
          Divider
        </Button>
        <Button type="button" variant="secondary" size="sm" icon="title" onClick={addGroup}>
          Group
        </Button>
      </Stack>
    </Stack>
  )
}

// ── Snippet ───────────────────────────────────────────────────────────────────

export function Snippet({ config }) {
  return <Code variant="block" copyCode wrapping>{buildSnippet(config.items ?? [])}</Code>
}
