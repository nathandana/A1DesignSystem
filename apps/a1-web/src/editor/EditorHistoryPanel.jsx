import { useEffect, useRef, useState } from 'react'
import { ContextMenu, Icon, Paragraph } from '@gtivr4/a1-design-system-react'

// ── Date grouping ─────────────────────────────────────────────────────────────

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function dayLabel(date) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (isSameDay(date, today)) return 'Today'
  if (isSameDay(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

// Groups entries newest-first, each with their original index for jump().
function groupByDay(entries) {
  const groups = new Map()
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i]
    const key = dayLabel(new Date(entry.timestamp))
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({ entry, originalIndex: i })
  }
  return Array.from(groups.entries())
}

// ── Inline rename input ───────────────────────────────────────────────────────

function RenameInput({ defaultValue, onCommit, onCancel }) {
  const [value, setValue] = useState(defaultValue)
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  function handleKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); onCommit(value.trim() || defaultValue) }
    if (e.key === 'Escape') { e.preventDefault(); onCancel() }
  }

  return (
    <input
      ref={ref}
      className="a1-web-history-rename-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onCommit(value.trim() || defaultValue)}
      onKeyDown={handleKeyDown}
    />
  )
}

// ── Context menu items ────────────────────────────────────────────────────────

function buildContextItems(onRename, onRestore) {
  return [
    { id: 'rename',  label: 'Rename',               icon: 'edit',    onClick: onRename },
    { id: 'restore', label: 'Restore this version',  icon: 'restore', onClick: onRestore },
  ]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EditorHistoryPanel({ entries, currentIndex, onJump, onRestore, onRename }) {
  const [ctxMenu, setCtxMenu] = useState(null)
  const [renamingId, setRenamingId] = useState(null)

  const groups = groupByDay(entries)

  function openCtxMenu(e, entry) {
    e.preventDefault()
    setCtxMenu({
      entryId: entry.id,
      defaultLabel: entry.label,
      x: e.clientX,
      y: e.clientY,
    })
  }

  function handleCommitRename(label) {
    if (renamingId) {
      onRename(renamingId, label)
      setRenamingId(null)
    }
  }

  const ctxItems = ctxMenu
    ? buildContextItems(
        () => { setRenamingId(ctxMenu.entryId); setCtxMenu(null) },
        () => { onRestore(ctxMenu.entryId); setCtxMenu(null) },
      )
    : []

  if (entries.length <= 1) {
    return (
      <Paragraph size="sm" color="muted">
        No history yet. Make a change to start tracking.
      </Paragraph>
    )
  }

  return (
    <>
      <div className="a1-web-history-list">
        {groups.map(([day, items]) => (
          <div key={day} className="a1-web-history-group">
            <span className="a1-web-history-group__label">{day}</span>

            {items.map(({ entry, originalIndex }) => {
              const isCurrent = originalIndex === currentIndex
              const isRenaming = renamingId === entry.id
              const time = new Date(entry.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <button
                  key={entry.id}
                  type="button"
                  className={[
                    'a1-web-history-entry',
                    isCurrent    && 'a1-web-history-entry--current',
                    entry.primary && 'a1-web-history-entry--primary',
                  ].filter(Boolean).join(' ')}
                  onClick={() => !isRenaming && onJump(originalIndex)}
                  onDoubleClick={() => setRenamingId(entry.id)}
                  onContextMenu={(e) => openCtxMenu(e, entry)}
                  title="Click to restore · Double-click to rename · Right-click for options"
                >
                  {entry.primary && (
                    <Icon
                      name="bookmark"
                      size="xs"
                      className="a1-web-history-entry__bookmark"
                      aria-hidden="true"
                    />
                  )}

                  {isRenaming ? (
                    <RenameInput
                      defaultValue={entry.label}
                      onCommit={handleCommitRename}
                      onCancel={() => setRenamingId(null)}
                    />
                  ) : (
                    <span className="a1-web-history-entry__label">{entry.label}</span>
                  )}

                  {!isRenaming && (
                    <span className="a1-web-history-entry__time">{time}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <ContextMenu
        open={!!ctxMenu}
        x={ctxMenu?.x ?? 0}
        y={ctxMenu?.y ?? 0}
        items={ctxItems}
        onClose={() => setCtxMenu(null)}
        aria-label="History entry actions"
      />
    </>
  )
}
