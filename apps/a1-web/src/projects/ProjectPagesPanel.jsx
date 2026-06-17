import { useEffect, useState } from 'react'
import { ContextMenu, Dialog, Button, Paragraph, TreeMenu } from '@gtivr4/a1-design-system-react'
import { pagesToTreeItems, getPageLevel, getDescendantIds, MAX_LEVEL } from './projectStore.ts'

/**
 * The project page tree (the "Pages" tab of the editor sidebar). Renders the
 * project's pages as a draggable TreeMenu and exposes add / edit / duplicate /
 * delete through a right-click context menu, with a confirmation dialog for
 * delete. Hierarchy is set by drag-and-drop (`onMovePage`).
 */
export function ProjectPagesPanel({
  pages = [],
  activePageId,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
}) {
  const [expandedIds, setExpandedIds] = useState([])
  const [ctxMenu, setCtxMenu] = useState(null)      // { id, x, y }
  const [confirmDelete, setConfirmDelete] = useState(null) // page id

  const treeItems = pagesToTreeItems(pages)

  // Keep the active page's ancestors expanded so it stays visible in the tree.
  useEffect(() => {
    if (!activePageId) return
    const ancestors = []
    let current = pages.find((p) => p.id === activePageId)
    while (current?.parentId) { ancestors.push(current.parentId); current = pages.find((p) => p.id === current.parentId) }
    if (ancestors.length) {
      setExpandedIds((prev) => Array.from(new Set([...prev, ...ancestors])))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePageId])

  function buildItems(id) {
    const page = pages.find((p) => p.id === id)
    if (!page) return []
    const canNest = getPageLevel(pages, id) < MAX_LEVEL
    const items = []
    if (canNest) {
      items.push({
        id: 'add-inside',
        label: 'Add subpage',
        icon: 'add',
        onClick: () => onAddPage?.({ parentId: id }),
      })
    }
    items.push({
      id: 'add-below',
      label: 'Add page below',
      icon: 'add_box',
      onClick: () => onAddPage?.({ parentId: page.parentId, afterId: id }),
    })
    items.push({ type: 'divider', id: 'div-edit' })
    items.push({ id: 'edit', label: 'Edit page', icon: 'edit', onClick: () => onSelectPage?.(id) })
    items.push({ id: 'duplicate', label: 'Duplicate', icon: 'content_copy', onClick: () => onDuplicatePage?.(id) })
    items.push({ type: 'divider', id: 'div-delete' })
    items.push({
      id: 'delete',
      label: 'Delete…',
      icon: 'delete',
      variant: 'destructive',
      onClick: () => { setCtxMenu(null); setConfirmDelete(id) },
    })
    return items
  }

  const deletePage = confirmDelete ? pages.find((p) => p.id === confirmDelete) : null
  const descendantCount = confirmDelete ? getDescendantIds(pages, confirmDelete).length : 0

  return (
    <>
      <div className="a1-web-editor-sidebar__tree">
        {treeItems.length === 0 ? (
          <Paragraph size="sm" color="muted">No pages yet. Add one to get started.</Paragraph>
        ) : (
          <TreeMenu
            items={treeItems}
            selectedId={activePageId}
            onSelect={onSelectPage}
            onItemContextMenu={(id, e) => setCtxMenu({ id, x: e.clientX, y: e.clientY })}
            expandedIds={expandedIds}
            onExpandedChange={setExpandedIds}
            showExpandControls
            draggable={!!onMovePage}
            onMove={onMovePage}
            aria-label="Project pages"
          />
        )}
      </div>

      <ContextMenu
        open={!!ctxMenu}
        x={ctxMenu?.x ?? 0}
        y={ctxMenu?.y ?? 0}
        items={ctxMenu ? buildItems(ctxMenu.id) : []}
        onClose={() => setCtxMenu(null)}
        aria-label="Page options"
      />

      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        status="warn"
        title="Delete page?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="destructive"
              icon="delete"
              onClick={() => { onDeletePage?.(confirmDelete); setConfirmDelete(null) }}
            >
              Delete
            </Button>
          </>
        }
      >
        <Paragraph>
          “{deletePage?.title || 'Untitled'}”
          {descendantCount > 0 ? ` and its ${descendantCount} subpage${descendantCount === 1 ? '' : 's'}` : ''}
          {' '}will be permanently deleted.
        </Paragraph>
      </Dialog>
    </>
  )
}
