import { useState } from 'react'
import { Accordion, Icon, Paragraph, Stack, TextField } from '@gtivr4/a1-design-system-react'
import { COMPONENT_CATALOG } from './componentCatalog.ts'

/**
 * EditorAddPanel — component picker shown in the aside "Add" tab.
 *
 * Displays all catalog entries organized in collapsible Accordion categories.
 * Clicking any card calls onAdd with the CatalogEntry so the caller can create
 * and insert the node.
 */
export function EditorAddPanel({ addTarget, onAdd }) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()

  let contextLabel = null
  if (addTarget?.targetId) {
    contextLabel = addTarget.position === 'into'
      ? 'Adding inside selected element'
      : 'Adding after selected element'
  } else {
    contextLabel = 'Adding to end of page'
  }

  // When searching: flatten all entries and filter by label or description.
  const filteredCategories = query
    ? COMPONENT_CATALOG
        .map((cat) => ({
          ...cat,
          entries: cat.entries.filter(
            (e) =>
              e.label.toLowerCase().includes(query) ||
              e.description.toLowerCase().includes(query)
          ),
        }))
        .filter((cat) => cat.entries.length > 0)
    : COMPONENT_CATALOG

  return (
    <Stack gap="xs">
      {contextLabel && (
        <Paragraph size="xs" color="muted" style={{ padding: 'var(--base-spacing-8) var(--base-spacing-8) 0' }}>
          {contextLabel}
        </Paragraph>
      )}

      <div style={{ padding: '0 var(--base-spacing-8)' }}>
        <TextField
          size="compact"
          aria-label="Search components"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCategories.length === 0 && (
        <Paragraph size="sm" color="muted" style={{ padding: '0 var(--base-spacing-8)' }}>
          No components match "{search}"
        </Paragraph>
      )}

      {filteredCategories.map((category) => (
        <Accordion key={category.id} label={category.label} defaultOpen={!!query || category.id === 'inputs'} size="sm">
          <div className="a1-web-add-panel-grid">
            {category.entries.map((entry) => (
              <button
                key={entry.type}
                className="a1-web-add-panel-card"
                type="button"
                title={entry.description}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('a1-catalog-type', entry.type)
                  e.dataTransfer.effectAllowed = 'copy'
                  e.currentTarget.setAttribute('data-dragging', 'true')
                }}
                onDragEnd={(e) => {
                  e.currentTarget.removeAttribute('data-dragging')
                }}
                onClick={() => onAdd(entry)}
              >
                <Icon name={entry.icon} size="sm" aria-hidden="true" />
                <span className="a1-web-add-panel-label">{entry.label}</span>
              </button>
            ))}
          </div>
        </Accordion>
      ))}
    </Stack>
  )
}
