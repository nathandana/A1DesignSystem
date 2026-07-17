import { useEffect, useState } from 'react'
import {
  Accordion,
  Button,
  Code,
  Divider,
  Stack,
  TextField,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
import { Choice } from './configKit.jsx'
import { IconSelect } from './IconSelect.jsx'
import { Toggle } from './Toggle.jsx'

const VARIANT_OPTIONS = [
  { label: 'Expanded', value: 'expanded', icon: 'account_tree' },
  { label: 'Collapsed', value: 'collapsed', icon: 'view_sidebar' },
]

function uid() {
  return `tree-item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function escStr(v) {
  return String(v ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll("'", "\\'")
}

export function getDefaultConfig() {
  return {
    variant: 'collapsed',
    selectedId: 'invoices',
    expandedIds: ['account', 'billing'],
    showExpandControls: false,
    draggable: false,
    items: [
      {
        id: 'account',
        label: 'Account',
        icon: 'manage_accounts',
        openInPanel: false,
        children: [
          { id: 'profile', label: 'Profile', icon: 'person', openInPanel: false, children: [] },
          { id: 'security', label: 'Security', icon: 'lock', openInPanel: false, children: [] },
          {
            id: 'billing',
            label: 'Billing',
            icon: 'credit_card',
            openInPanel: false,
            children: [
              { id: 'invoices', label: 'Invoices', icon: 'receipt_long', openInPanel: false, children: [] },
              { id: 'payment', label: 'Payment methods', icon: 'payment', openInPanel: false, children: [] },
            ],
          },
        ],
      },
      { id: 'notifications', label: 'Notifications', icon: 'notifications', openInPanel: false, children: [] },
      { id: 'integrations', label: 'Integrations', icon: 'extension', openInPanel: false, children: [] },
    ],
  }
}

function extractItem(items, id) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) return [items[i], [...items.slice(0, i), ...items.slice(i + 1)]]
    if (items[i].children?.length) {
      const [found, rest] = extractItem(items[i].children, id)
      if (found) return [found, [...items.slice(0, i), { ...items[i], children: rest }, ...items.slice(i + 1)]]
    }
  }
  return [null, items]
}

function insertItem(items, item, targetId, position) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === targetId) {
      if (position === 'before') return [...items.slice(0, i), item, ...items.slice(i)]
      if (position === 'after')  return [...items.slice(0, i + 1), item, ...items.slice(i + 1)]
      return [...items.slice(0, i), { ...items[i], children: [...(items[i].children ?? []), item] }, ...items.slice(i + 1)]
    }
    if (items[i].children?.length) {
      const updated = insertItem(items[i].children, item, targetId, position)
      if (updated !== items[i].children)
        return [...items.slice(0, i), { ...items[i], children: updated }, ...items.slice(i + 1)]
    }
  }
  return items
}

function moveItem(items, { draggedId, targetId, position }) {
  const [found, remaining] = extractItem(items, draggedId)
  if (!found) return items
  return insertItem(remaining, found, targetId, position)
}

function stripPanelFlag(items) {
  return items.map(({ openInPanel: _op, children, ...rest }) => ({
    ...rest,
    ...(children?.length ? { children: stripPanelFlag(children) } : {}),
  }))
}

function normalizeTreeItems(items) {
  if (!Array.isArray(items)) return []
  return items
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const label = typeof item.label === 'string' && item.label.trim() ? item.label.trim() : `Item ${index + 1}`
      const normalized = {
        id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `item-${index + 1}`,
        label,
        icon: typeof item.icon === 'string' ? item.icon : '',
        openInPanel: false,
        children: normalizeTreeItems(item.children),
      }
      if (typeof item.href === 'string' && item.href) normalized.href = item.href
      if (item.disabled === true) normalized.disabled = true
      return normalized
    })
}

export const jsonType = 'TreeMenu'

export function toJson(config) {
  const props = {
    items: stripPanelFlag(config.items ?? []),
  }
  if (config.variant && config.variant !== 'expanded') props.variant = config.variant
  if (config.selectedId) props.selectedId = config.selectedId
  if (Array.isArray(config.expandedIds) && config.expandedIds.length) props.expandedIds = config.expandedIds
  if (config.showExpandControls === true) props.showExpandControls = true
  if (config.draggable === true) props.draggable = true
  return { node: { id: 'tree-menu-1', type: jsonType, props } }
}

export function fromJson(node) {
  const config = getDefaultConfig()
  const props = node.props ?? {}
  if (props.variant === 'expanded' || props.variant === 'collapsed') config.variant = props.variant
  if (typeof props.selectedId === 'string') config.selectedId = props.selectedId
  const expandedIds = Array.isArray(props.expandedIds) ? props.expandedIds : props.defaultExpandedIds
  if (Array.isArray(expandedIds)) config.expandedIds = expandedIds.filter((id) => typeof id === 'string')
  config.showExpandControls = props.showExpandControls === true
  config.draggable = props.draggable === true
  const items = normalizeTreeItems(props.items)
  if (items.length > 0) config.items = items
  return config
}

export function Preview({ config, utilityClass = '' }) {
  const [selectedId, setSelectedId] = useState(config.selectedId)
  const [expandedIds, setExpandedIds] = useState(config.expandedIds)
  const [localItems, setLocalItems] = useState(() => stripPanelFlag(config.items))

  // Sync local items when Controls edits the tree structure
  useEffect(() => {
    setLocalItems(stripPanelFlag(config.items))
  }, [config.items])

  function handleMove({ draggedId, targetId, position }) {
    setLocalItems((prev) => moveItem(prev, { draggedId, targetId, position }))
  }

  return (
    <div style={{ maxWidth: config.variant === 'collapsed' ? 'max-content' : 280 }}>
      <TreeMenu
        className={utilityClass || undefined}
        items={localItems}
        variant={config.variant}
        selectedId={selectedId}
        onSelect={setSelectedId}
        expandedIds={expandedIds}
        onExpandedChange={setExpandedIds}
        showExpandControls={config.showExpandControls}
        draggable={config.draggable}
        onMove={handleMove}
        aria-label="Settings navigation"
      />
    </div>
  )
}

function ItemEditor({ item, depth, onUpdate, onRemove, openIds, onToggle }) {
  const isOpen = openIds.includes(item.id)
  const childCount = item.children?.length ?? 0

  function updateChild(childId, patch) {
    onUpdate(item.id, {
      children: (item.children ?? []).map((c) => c.id === childId ? { ...c, ...patch } : c),
    })
  }

  function removeChild(childId) {
    onUpdate(item.id, {
      children: (item.children ?? []).filter((c) => c.id !== childId),
    })
  }

  function addChild() {
    const newChild = { id: uid(), label: 'New item', icon: '', openInPanel: false, children: [] }
    onUpdate(item.id, { children: [...(item.children ?? []), newChild] })
  }

  const indent = depth * 12

  return (
    <div style={{ marginInlineStart: indent }}>
      <Accordion
        label={`${item.label || 'Untitled'}${childCount ? ` (${childCount})` : ''}`}
        size="sm"
        open={isOpen}
        onChange={(open) => onToggle(item.id, open)}
      >
        <Stack gap="md">
          <TextField
            label="Label"
            size="compact"
            value={item.label}
            onChange={(e) => onUpdate(item.id, { label: e.target.value })}
          />
          <Toggle
            label="Icon"
            value={!!item.icon}
            onChange={(v) => onUpdate(item.id, { icon: v ? 'folder' : '' })}
          />
          {item.icon && (
            <IconSelect value={item.icon} onChange={(icon) => onUpdate(item.id, { icon })} />
          )}
          {depth < 2 && (
            <>
              <Divider space="none" />
              <Stack gap="xs">
                {(item.children ?? []).map((child) => (
                  <ItemEditor
                    key={child.id}
                    item={child}
                    depth={depth + 1}
                    onUpdate={(id, patch) => {
                      if (id === child.id) {
                        updateChild(child.id, patch)
                      }
                    }}
                    onRemove={(id) => removeChild(id)}
                    openIds={openIds}
                    onToggle={onToggle}
                  />
                ))}
              </Stack>
              <Button type="button" variant="secondary" size="sm" icon="add" onClick={addChild}>
                Add child
              </Button>
            </>
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            icon="delete"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </Button>
        </Stack>
      </Accordion>
    </div>
  )
}

export function Controls({ config, setConfig }) {
  const [openIds, setOpenIds] = useState([])

  function toggleOpen(id, open) {
    setOpenIds((prev) => open ? [...prev, id] : prev.filter((x) => x !== id))
  }

  function updateItem(id, patch) {
    function applyPatch(items) {
      return items.map((item) => {
        if (item.id === id) return { ...item, ...patch }
        if (item.children?.length) return { ...item, children: applyPatch(item.children) }
        return item
      })
    }
    setConfig((c) => ({ ...c, items: applyPatch(c.items) }))
  }

  function removeItem(id) {
    function applyRemove(items) {
      return items
        .filter((item) => item.id !== id)
        .map((item) => item.children?.length ? { ...item, children: applyRemove(item.children) } : item)
    }
    setConfig((c) => ({ ...c, items: applyRemove(c.items) }))
  }

  function addRootItem() {
    const item = { id: uid(), label: 'New item', icon: '', openInPanel: false, children: [] }
    setConfig((c) => ({ ...c, items: [...c.items, item] }))
  }

  return (
    <Stack gap="lg">
      <Choice
        prop="variant"
        label="Variant"
        labelMode="selected"
        helper="Expanded shows the full hierarchy. Collapsed shows root icons and opens each parent's children in a menu flyout."
        value={config.variant}
        onChange={(variant) => setConfig((c) => ({ ...c, variant }))}
        options={VARIANT_OPTIONS}
      />

      <TextField
        label="Selected item ID"
        hint="Set the initially selected item."
        size="compact"
        value={config.selectedId}
        onChange={(e) => setConfig((c) => ({ ...c, selectedId: e.target.value }))}
      />

      <Toggle
        prop="showExpandControls"
        label="Show expand controls"
        helper="Adds expand or collapse controls above the expanded tree, or inside a collapsed parent flyout."
        value={config.showExpandControls}
        onChange={(showExpandControls) => setConfig((c) => ({ ...c, showExpandControls }))}
      />

      <Toggle
        prop="draggable"
        label="Draggable"
        helper="Enables drag-and-drop reordering for tree rows. Root icon reordering is not exposed in collapsed mode."
        value={config.draggable ?? false}
        onChange={(draggable) => setConfig((c) => ({ ...c, draggable }))}
      />

      <Divider />

      <Stack gap="sm">
        {config.items.map((item) => (
          <ItemEditor
            key={item.id}
            item={item}
            depth={0}
            onUpdate={updateItem}
            onRemove={removeItem}
            openIds={openIds}
            onToggle={toggleOpen}
          />
        ))}
      </Stack>

      <Button type="button" variant="secondary" size="sm" icon="add" onClick={addRootItem}>
        Add item
      </Button>
    </Stack>
  )
}

function itemToSnippet(item, depth) {
  const pad = '  '.repeat(depth + 1)
  const icon = item.icon ? `, icon: '${escStr(item.icon)}'` : ''
  const children = item.children?.length
    ? `,\n${pad}  children: [\n${item.children.map((c) => itemToSnippet(c, depth + 2)).join(',\n')},\n${pad}  ]`
    : ''
  return `${pad}{ id: '${escStr(item.id)}', label: '${escStr(item.label)}'${icon}${children} }`
}

export function Snippet({ config, utilityClass = '' }) {
  const items = stripPanelFlag(config.items)
  const itemLines = items.map((item) => itemToSnippet(item, 0)).join(',\n')
  const expandedLine = config.expandedIds?.length
    ? `\n  defaultExpandedIds={['${config.expandedIds.join("', '")}']}` : ''
  const variantLine = config.variant === 'collapsed' ? '\n  variant="collapsed"' : ''
  const selectedLine = config.selectedId ? `\n  selectedId="${escStr(config.selectedId)}"` : ''
  const expandControlsLine = config.showExpandControls ? '\n  showExpandControls' : ''
  const draggableLine = config.draggable ? '\n  draggable\n  onMove={handleMove}' : ''
  const classNameLine = utilityClass ? `\n  className="${escStr(utilityClass)}"` : ''
  const moveHelperPreamble = config.draggable ? `
const [items, setItems] = useState(initialItems)

function handleMove({ draggedId, targetId, position }) {
  setItems((prev) => moveItem(prev, { draggedId, targetId, position }))
}

` : `const items = [
${itemLines},
]

`

  return (
    <Code variant="block" wrapping copyCode>{`${moveHelperPreamble}<TreeMenu
  items={items}${classNameLine}${variantLine}${selectedLine}${expandedLine}${expandControlsLine}${draggableLine}
  onSelect={(id) => console.log('selected', id)}
  aria-label="Navigation"
/>`}</Code>
  )
}
