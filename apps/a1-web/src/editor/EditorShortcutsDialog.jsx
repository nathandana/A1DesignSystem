import { Dialog, Paragraph, Stack } from '@gtivr4/a1-design-system-react'
import { ALT, DEL, isMac, MOD, SHIFT } from './shortcuts.ts'

const SHORTCUT_GROUPS = [
  {
    label: 'History',
    items: [
      { label: 'Undo',                keys: `${MOD}Z` },
      { label: 'Redo',                keys: isMac ? `${MOD}${SHIFT}Z` : `${MOD}${SHIFT}Z  or  Ctrl+Y` },
    ],
  },
  {
    label: 'Elements',
    items: [
      { label: 'Delete element',      keys: DEL },
      { label: 'Duplicate element',   keys: `${MOD}D` },
      { label: 'Group as Stack',       keys: `${MOD}G` },
      { label: 'Move element up',     keys: `${ALT}↑` },
      { label: 'Move element down',   keys: `${ALT}↓` },
      { label: 'Ungroup element',     keys: `${MOD}${SHIFT}G` },
    ],
  },
  {
    label: 'Style',
    items: [
      { label: 'Copy pattern (style)',  keys: `${MOD}${ALT}C` },
      { label: 'Paste pattern (style)', keys: `${MOD}${ALT}V` },
    ],
  },
  {
    label: 'General',
    items: [
      { label: 'Keyboard shortcuts',  keys: `${MOD}K` },
    ],
  },
]

export function EditorShortcutsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="Keyboard shortcuts">
      <Stack direction="column" gap="md">
        {SHORTCUT_GROUPS.map(({ label, items }) => (
          <Stack key={label} direction="column" gap="xs">
            <Paragraph size="sm" color="muted">{label}</Paragraph>
            <div className="a1-web-shortcuts-table">
              {items.map(({ label: itemLabel, keys }) => (
                <div key={itemLabel} className="a1-web-shortcuts-row">
                  <span className="a1-web-shortcuts-label">{itemLabel}</span>
                  <kbd className="a1-web-shortcuts-keys">{keys}</kbd>
                </div>
              ))}
            </div>
          </Stack>
        ))}
      </Stack>
    </Dialog>
  )
}
