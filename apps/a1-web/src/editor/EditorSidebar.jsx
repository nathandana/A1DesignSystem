import { useEffect, useState } from 'react'
import { ContextMenu, Paragraph, TreeMenu } from '@gtivr4/a1-design-system-react'
import { CONVERSION_MAP, getConvertedProps } from './conversionMap.ts'

// ── Node → tree item conversion ───────────────────────────────────────────────

const TYPE_ICONS = {
  PageLayout:       'web',
  Section:          'crop_free',
  Stack:            'view_agenda',
  Grid:             'grid_view',
  Cluster:          'hub',
  Card:             'article',
  Bleed:            'open_in_full',
  Inset:            'padding',
  ButtonContainer:  'view_week',
  List:             'format_list_bulleted',
  Heading:          'title',
  Paragraph:        'notes',
  Blockquote:       'format_quote',
  Code:             'code',
  Divider:          'horizontal_rule',
  Icon:             'interests',
  Figure:           'image',
  Link:             'link',
  Button:           'smart_button',
  IconButton:       'radio_button_checked',
  Switch:           'toggle_on',
  SegmentedControl: 'linear_scale',
  Banner:           'info',
  MessageBadge:     'label',
  MessageEmptyState:'inbox',
  StatusBar:        'linear_scale',
  CircularProgress: 'donut_large',
  StepTracker:      'more_horiz',
  TextField:        'text_fields',
  TextareaField:    'subject',
  CheckboxGroup:    'check_box',
  RadioGroup:       'radio_button_checked',
  ChoiceGroup:      'grid_view',
  DefinitionList:   'format_list_numbered',
  Pagination:       'last_page',
  Accordion:        'expand_circle_down',
  Slot:             'select_all',
}

const CONTAINER_TYPES = new Set([
  'Section', 'Stack', 'Card', 'Grid', 'Cluster', 'PageLayout', 'Accordion',
  'Bleed', 'Inset', 'ButtonContainer', 'List', 'Fieldset', 'StickyActions',
  'Slot',
])

function nodeToTreeItem(node) {
  const text = node.content?.fallback
  // A custom name (set via inline rename) wins. Otherwise a pattern instance
  // shows the pattern's name; then the text content; then the component type.
  const label = node.name
    ? node.name
    : node.patternInstance
      ? node.patternInstance.name
      : text
        ? (text.length > 32 ? `${text.slice(0, 32)}…` : text)
        : node.type
  const isContainer = CONTAINER_TYPES.has(node.type)
  return {
    id: node.id,
    label,
    icon: node.patternInstance ? 'dashboard_customize' : (TYPE_ICONS[node.type] ?? 'widgets'),
    // Container types always expose children (even when empty) so the tree
    // renders them as branch nodes and allows drag-into in drag-and-drop mode.
    children: isContainer
      ? (node.children?.length ? node.children.map(nodeToTreeItem) : [])
      : (node.children?.length ? node.children.map(nodeToTreeItem) : undefined),
  }
}

function definitionToTreeItems(definition) {
  if (!definition) return []
  const regions = definition.page.layout.regions
  if (regions.length === 1) return regions[0].nodes.map(nodeToTreeItem)
  return regions.map(region => ({
    id: region.id,
    label: region.name ?? region.id,
    icon: 'space_dashboard',
    children: region.nodes.map(nodeToTreeItem),
  }))
}

// Returns array of ancestor IDs for targetId, or null if not found.
function getAncestorIds(items, targetId, path = []) {
  for (const item of items) {
    if (item.id === targetId) return path
    if (item.children?.length) {
      const found = getAncestorIds(item.children, targetId, [...path, item.id])
      if (found !== null) return found
    }
  }
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * ComponentTreePanel — the page's component (layer) tree. Rendered as the
 * "Layers" tab inside ProjectWorkspaceSidebar; it owns the TreeMenu over the
 * current page definition plus the per-node right-click context menu. The
 * SideNav chrome and the page list live in the workspace shell, not here.
 */
export function ComponentTreePanel({
  definition,
  selectedNodeId,
  onSelectNode,
  onNodeMove,
  onRequestAdd,
  onNodeAction,
  onConvertNode,
}) {
  const [expandedIds, setExpandedIds] = useState([])
  const [treeCtxMenu, setTreeCtxMenu] = useState(null) // { id, x, y }
  const [editingId, setEditingId] = useState(null) // id of the node being renamed inline

  const treeItems = definitionToTreeItems(definition)

  // When a node is selected in the canvas, expand its ancestors in the tree.
  useEffect(() => {
    if (!selectedNodeId) return
    const ancestors = getAncestorIds(treeItems, selectedNodeId)
    if (ancestors?.length) {
      setExpandedIds(prev => {
        const next = new Set(prev)
        ancestors.forEach(id => next.add(id))
        return Array.from(next)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId])

  function handleTreeHover(id) {
    const prev = document.querySelector('[data-editor-hover="true"]')
    if (prev) prev.removeAttribute('data-editor-hover')
    if (id) {
      const el = document.querySelector(`[data-editor-node="${CSS.escape(id)}"]`)
      if (el) el.setAttribute('data-editor-hover', 'true')
    }
  }

  function handleTreeSelect(id) {
    onSelectNode(id)
    if (id) {
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-editor-node="${CSS.escape(id)}"]`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }

  function handleItemContextMenu(id, e) {
    setTreeCtxMenu({ id, x: e.clientX, y: e.clientY })
  }

  function handleRenameCommit(id, label) {
    setEditingId(null)
    const node = findNode(id)
    // The label shown is derived; only persist a custom name when the user
    // actually changed it away from the current display label.
    const currentLabel = node ? nodeToTreeItem(node).label : null
    if (label !== currentLabel) onNodeAction?.({ type: 'rename', nodeId: id, name: label })
  }

  function handleRenameCancel() {
    setEditingId(null)
  }

  function findNodeById(nodes, id) {
    for (const n of nodes) {
      if (n.id === id) return n
      if (n.children) { const found = findNodeById(n.children, id); if (found) return found }
    }
    return null
  }

  function findNode(id) {
    if (!definition) return null
    for (const region of definition.page.layout.regions) {
      const found = findNodeById(region.nodes, id)
      if (found) return found
    }
    return null
  }

  function buildTreeContextMenuItems(id) {
    const node = findNode(id)
    const nodeType = node?.type ?? null
    const isContainer = CONTAINER_TYPES.has(nodeType)
    const hasChildren = !!(node?.children?.length)
    const items = []

    if (node?.patternInstance) {
      items.push({
        id: 'edit-pattern',
        label: 'Edit pattern',
        icon: 'edit',
        onClick: () => { window.location.href = `/editor?pattern=${node.patternInstance.id}` },
      })
      items.push({
        id: 'detach-pattern',
        label: 'Detach pattern',
        icon: 'link_off',
        onClick: () => onNodeAction?.({ type: 'detach', nodeId: id }),
      })
      items.push({ type: 'divider', id: 'div-edit-pattern' })
    }

    items.push({
      id: 'rename',
      label: 'Rename',
      icon: 'edit',
      onClick: () => {
        setTreeCtxMenu(null)
        setEditingId(id)
      },
    })
    items.push({ type: 'divider', id: 'div-rename' })

    if (isContainer) {
      items.push({
        id: 'add-inside',
        label: 'Add inside',
        icon: 'add',
        onClick: () => onRequestAdd?.({ targetId: id, position: 'into' }),
      })
    }
    items.push({
      id: 'add-below',
      label: 'Add below',
      icon: 'add_box',
      onClick: () => onRequestAdd?.({ targetId: id, position: 'after' }),
    })

    if (isContainer && hasChildren) {
      items.push({ type: 'divider', id: 'div-ungroup' })
      items.push({
        id: 'ungroup',
        label: 'Ungroup',
        icon: 'table_rows',
        onClick: () => {
          setTreeCtxMenu(null)
          onNodeAction?.({ type: 'ungroup', nodeId: id })
        },
      })
    }

    items.push({
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'content_copy',
      onClick: () => {
        setTreeCtxMenu(null)
        onNodeAction?.({ type: 'duplicate', nodeId: id })
      },
    })

    if (nodeType !== 'Stack') {
      items.push({
        id: 'group-as-stack',
        label: 'Group as Stack',
        icon: 'view_agenda',
        onClick: () => {
          setTreeCtxMenu(null)
          onNodeAction?.({ type: 'group-as-stack', nodeId: id })
        },
      })
    }

    items.push({ type: 'divider', id: 'div-create-pattern' })
    items.push({
      id: 'create-pattern',
      label: 'Create pattern from selection',
      icon: 'dashboard_customize',
      onClick: () => {
        setTreeCtxMenu(null)
        onNodeAction?.({ type: 'create-pattern', nodeId: id })
      },
    })

    items.push({ type: 'divider', id: 'div-pattern' })
    items.push({
      id: 'copy-pattern',
      label: 'Copy properties',
      icon: 'colorize',
      onClick: () => {
        setTreeCtxMenu(null)
        onNodeAction?.({ type: 'copy-pattern', nodeId: id })
      },
    })
    items.push({
      id: 'paste-pattern',
      label: 'Paste properties',
      icon: 'format_paint',
      onClick: () => {
        setTreeCtxMenu(null)
        onNodeAction?.({ type: 'paste-pattern', nodeId: id })
      },
    })

    const conversionTargets = onConvertNode ? (CONVERSION_MAP[nodeType] ?? []) : []
    if (conversionTargets.length > 0) {
      items.push({ type: 'divider', id: 'div-convert' })
      items.push({ type: 'group', id: 'group-convert', label: 'Convert to' })
      conversionTargets.forEach((toType) => {
        items.push({
          id: `convert-${toType}`,
          label: toType,
          icon: TYPE_ICONS[toType] ?? 'autorenew',
          onClick: () => {
            setTreeCtxMenu(null)
            onConvertNode(id, toType, getConvertedProps(nodeType, toType, node?.props))
          },
        })
      })
    }

    items.push({ type: 'divider', id: 'div-delete' })
    items.push({
      id: 'delete',
      label: 'Delete',
      icon: 'delete',
      variant: 'destructive',
      onClick: () => {
        setTreeCtxMenu(null)
        onNodeAction?.({ type: 'delete', nodeId: id })
      },
    })

    return items
  }

  return (
    <>
      <div className="a1-web-editor-sidebar__tree">
        {!definition
          ? <Paragraph size="sm" color="muted">Open a page to edit its layers.</Paragraph>
          : !treeItems.length
            ? <Paragraph size="sm" color="muted">No valid definition loaded.</Paragraph>
            : (
              <TreeMenu
                items={treeItems}
                selectedId={selectedNodeId}
                onSelect={handleTreeSelect}
                onHoverChange={handleTreeHover}
                onItemContextMenu={handleItemContextMenu}
                expandedIds={expandedIds}
                onExpandedChange={setExpandedIds}
                showExpandControls
                draggable={!!onNodeMove}
                onMove={onNodeMove}
                editingId={editingId}
                onRenameStart={setEditingId}
                onRenameCommit={handleRenameCommit}
                onRenameCancel={handleRenameCancel}
                aria-label="Page structure"
              />
            )
        }
      </div>

      <ContextMenu
        open={!!treeCtxMenu}
        x={treeCtxMenu?.x ?? 0}
        y={treeCtxMenu?.y ?? 0}
        items={treeCtxMenu ? buildTreeContextMenuItems(treeCtxMenu.id) : []}
        onClose={() => setTreeCtxMenu(null)}
        aria-label="Element options"
      />
    </>
  )
}
