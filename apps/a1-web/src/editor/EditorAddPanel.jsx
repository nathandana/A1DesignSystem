import { useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  Grid,
  Icon,
  Paragraph,
  Stack,
  TextField,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
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

export function EditorAddPanel({ addTarget, onAdd, patternEntries = [], onAddPattern, slotFilter = null, kind: forcedKind = null }) {
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid') // 'grid' | 'list'
  const [grouped, setGrouped] = useState(true)
  // Common vs all components — remembered across sessions.
  const [set, setSet] = useState(() => localStorage.getItem('a1-add-set') || 'common') // 'common' | 'all'
  useEffect(() => { localStorage.setItem('a1-add-set', set) }, [set])
  // When the parent forces a kind (separate Add Component / Add Pattern tabs),
  // the in-panel kind toggle is hidden and `forcedKind` wins.
  const [kindState, setKind] = useState('all') // 'all' | 'components' | 'patterns'
  const kind = forcedKind ?? kindState
  const query = search.trim().toLowerCase()
  const hasPatterns = patternEntries.length > 0

  // When adding into a Slot, restrict the panel to what the slot accepts.
  const slot = slotFilter
  const slotFull = !!slot?.full
  const slotOpen = !!slot?.open // accepts anything — no allow lists set
  const allowTypes = slot && !slotOpen ? new Set(slot.allow ?? []) : null
  const allowPatternIds = slot && !slotOpen ? new Set(slot.allowPatterns ?? []) : null
  const componentPasses = (item) => !slot || slotOpen || (allowTypes?.has(item.entry.type) ?? false)
  const patternPasses = (p) => !slot || slotOpen || (allowPatternIds?.has(p.id) ?? false)

  const fullModel = useMemo(buildModel, [])

  // The "Common" set is a curated subset of the most-used components; "All"
  // reveals everything. A slot restricting to specific types forces "All" so an
  // allowed-but-uncommon component is never hidden. Filtering here keeps category
  // order and grouping intact.
  const effectiveSet = slot && !slotOpen ? 'all' : set
  const { categories, allItems } = useMemo(() => {
    if (effectiveSet === 'all') return fullModel
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
  }, [fullModel, effectiveSet])

  let contextLabel
  if (slot) {
    if (slotFull) contextLabel = `This blank area is full${slot.max != null ? ` (max ${slot.max})` : ''}`
    else if (slotOpen) contextLabel = 'Adding into blank area'
    else contextLabel = 'Showing only what this blank area accepts'
  } else if (addTarget?.targetId) {
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
  const wrapItems = (items) => view === 'list'
    ? <Stack direction="column" gap={4}>{items}</Stack>
    : <Grid columns={3} gap="sm">{items}</Grid>

  // Patterns (page editor only) — reusable compositions inserted as fresh,
  // editable copies. Click-to-add; respects the search and the grid/list view.
  // When the slot is full we still show its allowed items (rather than hiding
  // them) so an add attempt is met with a clear "full" snackbar from the editor.
  const visiblePatterns = kind === 'components'
    ? []
    : (query ? patternEntries.filter((p) => matchesQuery(p, query)) : patternEntries)
        .filter(patternPasses)

  function renderPattern(p) {
    const icon = p.icon || 'dashboard_customize'
    // Patterns drag onto the canvas through the same channel as components,
    // encoded as `pattern:<id>` so the drop handlers can tell them apart.
    const handlers = {
      title: p.description,
      draggable: true,
      onDragStart: (e) => {
        e.dataTransfer.setData('a1-catalog-type', `pattern:${p.id}`)
        e.dataTransfer.effectAllowed = 'copy'
        e.currentTarget.setAttribute('data-dragging', 'true')
      },
      onDragEnd: (e) => e.currentTarget.removeAttribute('data-dragging'),
      onClick: () => onAddPattern?.(p.id),
    }
    if (view === 'list') {
      return (
        <button key={p.id} className="a1-web-add-panel-row" type="button" {...handlers}>
          <Icon name={icon} size="sm" aria-hidden="true" />
          <span className="a1-web-add-panel-row-text">
            <span className="a1-web-add-panel-row-label">{p.label}</span>
            {p.description && <span className="a1-web-add-panel-row-desc">{p.description}</span>}
          </span>
        </button>
      )
    }
    return (
      <button key={p.id} className="a1-web-add-panel-card" type="button" {...handlers}>
        <Icon name={icon} size="sm" aria-hidden="true" />
        <span className="a1-web-add-panel-label">{p.label}</span>
      </button>
    )
  }

  // Grouped view: filter within each category (and by the slot allow-list), drop empties.
  const visibleCategories = grouped
    ? categories
        .map((category) => ({
          ...category,
          items: category.items.filter((item) => componentPasses(item) && (!query || matchesQuery(item, query))),
        }))
        .filter((category) => category.items.length > 0)
    : []

  // Flat view: all items, alphabetical, filtered.
  const visibleFlatItems = !grouped
    ? allItems.filter((item) => componentPasses(item) && (!query || matchesQuery(item, query)))
    : []

  const showComponents = kind !== 'patterns'
  const componentsEmpty = !showComponents || (grouped ? visibleCategories.length === 0 : visibleFlatItems.length === 0)
  const isEmpty = componentsEmpty && visiblePatterns.length === 0

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
          <Toolbar aria-label="Add view options">
            {hasPatterns && !forcedKind && (
              <>
                <ToolbarMenu
                  aria-label="Show"
                  label={kind === 'all' ? 'All' : kind === 'components' ? 'Components' : 'Patterns'}
                  value={kind}
                  onChange={setKind}
                  items={[
                    { value: 'all', label: 'All', icon: 'apps' },
                    { value: 'components', label: 'Components', icon: 'widgets' },
                    { value: 'patterns', label: 'Patterns', icon: 'dashboard_customize' },
                  ]}
                />
                <ToolbarDivider />
              </>
            )}
            {showComponents && !(slot && !slotOpen) && (
              <>
                <ToolbarToggle
                  icon={set === 'all' ? 'apps' : 'star'}
                  label={set === 'all' ? 'Showing all components' : 'Showing common components'}
                  pressed={set === 'all'}
                  onChange={(p) => setSet(p ? 'all' : 'common')}
                />
                <ToolbarDivider />
              </>
            )}
            <ToolbarGroup
              aria-label="Layout"
              value={view}
              onChange={setView}
              options={[
                { value: 'grid', label: 'Grid', icon: 'grid_view' },
                { value: 'list', label: 'List', icon: 'view_list' },
              ]}
            />
            {showComponents && (
              <>
                <ToolbarDivider />
                <ToolbarToggle
                  icon="category"
                  label="Group by category"
                  pressed={grouped}
                  onChange={setGrouped}
                />
              </>
            )}
          </Toolbar>
        </Stack>

      {patternEntries.length > 0 && visiblePatterns.length > 0 && (
        <Accordion label="Patterns" defaultOpen size="sm">
          {wrapItems(visiblePatterns.map(renderPattern))}
        </Accordion>
      )}

      {isEmpty && (
        <Paragraph size="sm" color="muted" style={{ padding: '0 var(--base-spacing-8)' }}>
          No {kind === 'patterns' ? 'patterns' : kind === 'components' ? 'components' : 'results'} match "{search}"
        </Paragraph>
      )}

      {showComponents && (grouped
        ? visibleCategories.map((category) => (
            <Accordion
              key={category.id}
              label={category.label}
              defaultOpen={!!query || category.id === 'layout'}
              size="sm"
            >
              {wrapItems(category.items.map(renderItem))}
            </Accordion>
          ))
        : visibleFlatItems.length > 0 && (
            <div style={{ padding: '0' }}>
              {wrapItems(visibleFlatItems.map(renderItem))}
            </div>
          ))}
    </Stack>
  )
}
