import { useRef, useState } from 'react'
import { Button, ContextMenu, Paragraph, Stack, TreeMenu } from '@gtivr4/a1-design-system-react'
import { computeDiff } from './editorVersions.ts'

const KIND_ICON = { added: '+', removed: '−', changed: '●' }

function DiffList({ diffs }) {
  if (!diffs.length) return <Paragraph size="xs" color="muted">No differences from base.</Paragraph>
  return (
    <Stack direction="column" gap={6}>
      {diffs.map((entry) => (
        <div key={entry.nodeId} className={`a1-web-diff-entry a1-web-diff-entry--${entry.kind}`}>
          <span className="a1-web-diff-kind" aria-hidden="true">{KIND_ICON[entry.kind]}</span>
          <div className="a1-web-diff-info">
            <div className="a1-web-diff-header">
              <span className="a1-web-diff-type">{entry.nodeType}</span>
              <span className="a1-web-diff-id">{entry.nodeId}</span>
            </div>
            {entry.kind === 'changed' && (
              <div className="a1-web-diff-changes">
                {entry.contentChanged && <div className="a1-web-diff-change">text changed</div>}
                {entry.propChanges.map((pc) => (
                  <div key={pc.key} className="a1-web-diff-change">
                    <code>{pc.key}</code>
                    {': '}
                    <span className="a1-web-diff-from">{pc.from === undefined ? '–' : String(pc.from)}</span>
                    {' → '}
                    <span className="a1-web-diff-to">{pc.to === undefined ? '–' : String(pc.to)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </Stack>
  )
}

export function EditorVersionsPanel({
  versions,
  activeVersionId,
  baseDef,
  currentDef,
  onSwitch,
  onAdd,
  onDelete,
  onRename,
}) {
  const [ctxMenu, setCtxMenu] = useState(null) // { id, x, y }
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const inputRef = useRef(null)

  const isBase = activeVersionId === versions[0]?.id
  const diffs = !isBase && baseDef && currentDef ? computeDiff(baseDef, currentDef) : []

  const treeItems = versions.map((v, i) => ({
    id: v.id,
    label: v.label,
    icon: i === 0 ? 'bookmark' : 'art_track',
  }))

  function handleSelect(id) {
    if (id && id !== activeVersionId) onSwitch(id)
  }

  function handleContextMenu(id, e) {
    setCtxMenu({ id, x: e.clientX, y: e.clientY })
  }

  function buildContextMenuItems(id) {
    const idx = versions.findIndex((v) => v.id === id)
    const v = versions[idx]
    if (!v) return []

    const items = [
      {
        id: 'rename',
        label: 'Rename',
        icon: 'edit',
        onClick: () => {
          setCtxMenu(null)
          setEditingId(id)
          setEditLabel(v.label)
        },
      },
      {
        id: 'duplicate',
        label: 'Duplicate',
        icon: 'content_copy',
        onClick: () => {
          setCtxMenu(null)
          onAdd(v)
        },
      },
    ]

    if (idx > 0) {
      items.push({ type: 'divider', id: 'div-delete' })
      items.push({
        id: 'delete',
        label: 'Delete',
        icon: 'delete',
        variant: 'destructive',
        onClick: () => {
          setCtxMenu(null)
          onDelete(id)
        },
      })
    }

    return items
  }

  function commitEdit(id) {
    const trimmed = editLabel.trim()
    if (trimmed) onRename(id, trimmed)
    setEditingId(null)
  }

  return (
    <Stack direction="column" gap="md">

      {/* Version tree */}
      <div className="a1-web-version-tree">
        {editingId ? (
          <input
            ref={inputRef}
            autoFocus
            className="a1-web-version-label-input"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onBlur={() => commitEdit(editingId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit(editingId)
              if (e.key === 'Escape') setEditingId(null)
            }}
          />
        ) : (
          <TreeMenu
            items={treeItems}
            selectedId={activeVersionId}
            onSelect={handleSelect}
            onItemContextMenu={handleContextMenu}
            aria-label="Versions"
          />
        )}
      </div>

      <Button
        variant="tertiary"
        icon="add"
        size="sm"
        onClick={() => onAdd(null)}
      >
        Add version
      </Button>

      <ContextMenu
        open={!!ctxMenu}
        x={ctxMenu?.x ?? 0}
        y={ctxMenu?.y ?? 0}
        items={ctxMenu ? buildContextMenuItems(ctxMenu.id) : []}
        onClose={() => setCtxMenu(null)}
        aria-label="Version options"
      />

      {/* Diff section */}
      {isBase && (
        <Paragraph size="xs" color="muted">
          This is the base version. Add a version to explore alternate designs.
        </Paragraph>
      )}

      {!isBase && (
        <Stack direction="column" gap="xs">
          <Paragraph size="xs" color="muted">
            Differences from <strong>{versions[0]?.label ?? 'Base'}</strong>
          </Paragraph>
          {currentDef ? (
            <DiffList diffs={diffs} />
          ) : (
            <Paragraph size="xs" color="muted">Invalid definition — fix the JSON to see the diff.</Paragraph>
          )}
        </Stack>
      )}

    </Stack>
  )
}
