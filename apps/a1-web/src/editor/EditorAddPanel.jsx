import { useMemo, useState } from 'react'
import {
  Accordion,
  Icon,
  Paragraph,
  Stack,
  TextField,
  Toolbar,
  ToolbarDivider,
  ToolbarMenu,
  ToolbarToggle,
} from '@gtivr4/a1-design-system-react'
import { componentCategories } from '../pages/components/data.js'
import { CATALOG_ENTRIES_BY_ID, COMMON_COMPONENT_IDS } from './componentCatalog.ts'

/**
 * EditorAddPanel — component picker shown in the aside "Add" tab.
 *
 * Order, categories, labels, and icons are derived from the component registry
 * source of truth (`pages/components/data.js` `componentCategories`); the catalog
 * (`componentCatalog.ts`) supplies the addable node template for each component.
 * Components that aren't addable yet are simply omitted.
 *
 * A view toolbar lets the user switch between an icon grid and a list, and toggle
 * category grouping on or off. With grouping off, components are shown in a single
 * alphabetical list.
 */

// Build the display model once: categories (in source-of-truth order) holding the
// components that have an addable catalog entry, plus a flat alphabetical list.
function buildModel() {
  const categories = componentCategories
    .map((category) => ({
      id: category.id,
      label: category.title,
      icon: category.icon,
      items: category.components
        .filter((component) => CATALOG_ENTRIES_BY_ID[component.id])
        .map((component) => ({
          id: component.id,
          label: component.title,
          icon: component.icon,
          description: component.body,
          entry: CATALOG_ENTRIES_BY_ID[component.id],
        })),
    }))
    .filter((category) => category.items.length > 0)

  const allItems = categories
    .flatMap((category) => category.items)
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label))

  return { categories, allItems }
}

function matchesQuery(item, query) {
  return (
    item.label.toLowerCase().includes(query) ||
    (item.description ?? '').toLowerCase().includes(query)
  )
}

export function EditorAddPanel({ addTarget, onAdd }) {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid') // 'grid' | 'list'
  const [grouped, setGrouped] = useState(true)
  const [set, setSet] = useState('common') // 'common' | 'all'
  const query = search.trim().toLowerCase()

  const fullModel = useMemo(buildModel, [])

  // The "Common" set is a curated subset of the most-used components; "All"
  // reveals everything. Filtering here keeps category order and grouping intact.
  const { categories, allItems } = useMemo(() => {
    if (set === 'all') return fullModel
    const categories = fullModel.categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => COMMON_COMPONENT_IDS.has(item.id)),
      }))
      .filter((category) => category.items.length > 0)
    const allItems = categories
      .flatMap((category) => category.items)
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label))
    return { categories, allItems }
  }, [fullModel, set])

  let contextLabel
  if (addTarget?.targetId) {
    contextLabel = addTarget.position === 'into'
      ? 'Adding inside selected element'
      : 'Adding after selected element'
  } else {
    contextLabel = 'Adding to end of page'
  }

  // Drag/click handlers shared by the card and row renderers.
  function itemHandlers(item) {
    return {
      title: item.description,
      draggable: true,
      onDragStart: (e) => {
        e.dataTransfer.setData('a1-catalog-type', item.entry.type)
        e.dataTransfer.effectAllowed = 'copy'
        e.currentTarget.setAttribute('data-dragging', 'true')
      },
      onDragEnd: (e) => e.currentTarget.removeAttribute('data-dragging'),
      onClick: () => onAdd(item.entry),
    }
  }

  function renderCard(item) {
    return (
      <button key={item.id} className="a1-web-add-panel-card" type="button" {...itemHandlers(item)}>
        <Icon name={item.icon} size="sm" aria-hidden="true" />
        <span className="a1-web-add-panel-label">{item.label}</span>
      </button>
    )
  }

  function renderRow(item) {
    return (
      <button key={item.id} className="a1-web-add-panel-row" type="button" {...itemHandlers(item)}>
        <Icon name={item.icon} size="sm" aria-hidden="true" />
        <span className="a1-web-add-panel-row-text">
          <span className="a1-web-add-panel-row-label">{item.label}</span>
          {item.description && (
            <span className="a1-web-add-panel-row-desc">{item.description}</span>
          )}
        </span>
      </button>
    )
  }

  const renderItem = view === 'list' ? renderRow : renderCard
  const containerClass = view === 'list' ? 'a1-web-add-panel-list' : 'a1-web-add-panel-grid'

  // Grouped view: filter within each category, drop empties.
  const visibleCategories = grouped
    ? categories
        .map((category) => ({
          ...category,
          items: query ? category.items.filter((item) => matchesQuery(item, query)) : category.items,
        }))
        .filter((category) => category.items.length > 0)
    : []

  // Flat view: all items, alphabetical, filtered.
  const visibleFlatItems = !grouped
    ? (query ? allItems.filter((item) => matchesQuery(item, query)) : allItems)
    : []

  const isEmpty = grouped ? visibleCategories.length === 0 : visibleFlatItems.length === 0

  return (
    <Stack gap="xs">
      {contextLabel && (
        <Paragraph size="xs" color="muted" style={{ padding: 'var(--base-spacing-8) var(--base-spacing-8) 0' }}>
          {contextLabel}
        </Paragraph>
      )}

        <Stack gap="xs">
          <TextField
            size="compact"
            aria-label="Search components"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Toolbar aria-label="Component view options">
            <ToolbarMenu
              aria-label="Component set"
              label={set === 'common' ? 'Common' : 'All'}
              value={set}
              onChange={setSet}
              
              items={[
                { value: 'common', label: 'Common', icon: 'star' },
                { value: 'all', label: 'All components', icon: 'apps' },
              ]}
            />
            <ToolbarDivider />
            <ToolbarMenu
              aria-label="Layout"
              label={view === 'grid' ? 'Grid' : 'List'}
              value={view}
              onChange={setView}
              
              items={[
                { value: 'grid', label: 'Grid', icon: 'grid_view' },
                { value: 'list', label: 'List', icon: 'view_list' },
              ]}
            />
            <ToolbarDivider />
            <ToolbarToggle
              icon="category"
              label="Group by category"
              pressed={grouped}
              onChange={setGrouped}
            />
          </Toolbar>
        </Stack>

      {isEmpty && (
        <Paragraph size="sm" color="muted" style={{ padding: '0 var(--base-spacing-8)' }}>
          No components match "{search}"
        </Paragraph>
      )}

      {grouped
        ? visibleCategories.map((category) => (
            <Accordion
              key={category.id}
              label={category.label}
              defaultOpen={!!query || category.id === 'layout'}
              size="sm"
            >
              <div className={containerClass}>{category.items.map(renderItem)}</div>
            </Accordion>
          ))
        : !isEmpty && (
            <div style={{ padding: '0' }}>
              <div className={containerClass}>{visibleFlatItems.map(renderItem)}</div>
            </div>
          )}
    </Stack>
  )
}
