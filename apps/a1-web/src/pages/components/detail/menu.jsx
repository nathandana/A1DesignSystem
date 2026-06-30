import { useRef, useState } from 'react'
import {
  Accordion,
  Button,
  Code,
  Divider,
  Menu,
  MenuSection,
  MenuItem,
  Paragraph,
  Stack,
  TextField,
} from '@gtivr4/a1-design-system-react'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

export const bareDisplay = true

function uid() {
  return `mi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

function esc(s) {
  return String(s ?? '').replaceAll("'", "\\'")
}

// ── Default config ────────────────────────────────────────────────────────────

export function getDefaultConfig() {
  return {
    items: [
      { id: uid(), kind: 'item',    label: 'Edit',      icon: 'edit',         shortcut: '⌘E', destructive: false },
      { id: uid(), kind: 'item',    label: 'Duplicate', icon: 'content_copy', shortcut: '',   destructive: false },
      { id: uid(), kind: 'divider' },
      { id: uid(), kind: 'item',    label: 'Delete',    icon: 'delete',       shortcut: '',   destructive: true  },
    ],
  }
}

// ── Config → rendered items ───────────────────────────────────────────────────

function renderItems(configItems, onClose) {
  // Group items into sections
  const sections = []
  let current = { sectionLabel: null, items: [] }
  sections.push(current)

  for (const item of configItems) {
    if (item.kind === 'section') {
      current = { sectionLabel: item.label || 'Section', items: [] }
      sections.push(current)
    } else {
      current.items.push(item)
    }
  }

  return sections.map((section, si) => {
    const rendered = section.items.map((item) => {
      if (item.kind === 'divider') {
        return <Divider key={item.id} space="none" />
      }
      return (
        <MenuItem
          key={item.id}
          icon={item.icon || undefined}
          shortcut={item.shortcut || undefined}
          variant={item.destructive ? 'destructive' : undefined}
          onClick={() => onClose()}
        >
          {item.label || 'Untitled'}
        </MenuItem>
      )
    })

    if (section.sectionLabel) {
      return <MenuSection key={`s-${si}`} label={section.sectionLabel}>{rendered}</MenuSection>
    }
    return <>{rendered}</>
  })
}

// ── Snippet ───────────────────────────────────────────────────────────────────

function buildSnippet(configItems, utilityClass = '') {
  const lines = configItems.map((item) => {
    if (item.kind === 'divider') return `  <Divider />`
    if (item.kind === 'section') return `  <MenuSection label="${esc(item.label || 'Section')}">`
    const props = [
      item.icon      ? ` icon="${item.icon}"` : '',
      item.shortcut  ? ` shortcut="${esc(item.shortcut)}"` : '',
      item.destructive ? ` variant="destructive"` : '',
    ].join('')
    return `  <MenuItem${props} onClick={() => {}}>${esc(item.label || 'Untitled')}</MenuItem>`
  }).join('\n')

  return `const [open, setOpen] = useState(false)
const anchorRef = useRef(null)

<>
  <Button ref={anchorRef} onClick={() => setOpen(!open)}>
    Open menu
  </Button>
  <Menu
    open={open}
    ${utilityClass ? `className="${esc(utilityClass)}"\n    ` : ''}onClose={() => setOpen(false)}
    anchorRef={anchorRef}
    aria-label="Actions"
  >
${lines}
  </Menu>
</>`
}

// ── Preview ───────────────────────────────────────────────────────────────────

export function Preview({ config, utilityClass = '' }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  return (
    <Stack align="center">
      <Button ref={anchorRef} onClick={() => setOpen(!open)}>
        Open menu
      </Button>
      <Menu
        open={open}
        className={utilityClass || undefined}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        aria-label="Actions"
      >
        {renderItems(config.items ?? [], () => setOpen(false))}
      </Menu>
    </Stack>
  )
}

// ── Item editor ───────────────────────────────────────────────────────────────

function ItemEditor({ item, onChange, onRemove, isOpen, onToggleOpen }) {
  const heading =
    item.kind === 'divider' ? '— Divider' :
    item.kind === 'section' ? `Section: ${item.label || 'Untitled'}` :
    item.label || 'Untitled'

  return (
    <Accordion label={heading} size="sm" open={isOpen} onChange={onToggleOpen}>
      <Stack gap="sm">
        {item.kind !== 'divider' && (
          <TextField
            label={item.kind === 'section' ? 'Section label' : 'Label'}
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
              onChange={(v) => onChange({ icon: v ? 'edit' : '' })}
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
    setConfig((c) => ({ ...c, items: (c.items ?? []).map((item) => item.id === id ? { ...item, ...patch } : item) }))
  }

  function removeItem(id) {
    setConfig((c) => ({ ...c, items: (c.items ?? []).filter((item) => item.id !== id) }))
    setOpenIds((prev) => prev.filter((x) => x !== id))
  }

  function addItem() {
    const id = uid()
    setConfig((c) => ({ ...c, items: [...(c.items ?? []), { id, kind: 'item', label: 'New item', icon: '', shortcut: '', destructive: false }] }))
    setOpenIds((prev) => [...prev, id])
  }

  function addDivider() {
    setConfig((c) => ({ ...c, items: [...(c.items ?? []), { id: uid(), kind: 'divider' }] }))
  }

  function addSection() {
    const id = uid()
    setConfig((c) => ({ ...c, items: [...(c.items ?? []), { id, kind: 'section', label: 'Section' }] }))
    setOpenIds((prev) => [...prev, id])
  }

  function toggleOpen(id) {
    setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        {items.map((item) => (
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
        <Button type="button" variant="secondary" size="sm" icon="title" onClick={addSection}>
          Section
        </Button>
      </Stack>
    </Stack>
  )
}

// ── Snippet ───────────────────────────────────────────────────────────────────

export function Snippet({ config, utilityClass = '' }) {
  return <Code variant="block" copyCode wrapping>{buildSnippet(config.items ?? [], utilityClass)}</Code>
}
