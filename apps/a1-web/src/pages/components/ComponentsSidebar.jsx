import { useEffect, useMemo, useState } from 'react'
import {
  SearchField,
  SideNav,
  Stack,
  Toolbar,
  ToolbarToggle,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
import { componentCategories } from './data.js'
import { allComponents, scoreComponentSearch } from './utils.js'

const COMPONENTS_SIDEBAR_VIEW_KEY = 'a1-components-sidebar-view'
const COMPONENTS_SIDEBAR_VIEWS = new Set(['tree', 'az'])

function readStoredView() {
  if (typeof window === 'undefined') return 'tree'
  try {
    const stored = window.localStorage.getItem(COMPONENTS_SIDEBAR_VIEW_KEY)
    return COMPONENTS_SIDEBAR_VIEWS.has(stored) ? stored : 'tree'
  } catch {
    return 'tree'
  }
}

function storeView(view) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COMPONENTS_SIDEBAR_VIEW_KEY, view)
  } catch {
    // Ignore storage failures; the toggle still works for the current session.
  }
}

// The category id that owns the given active page, if any.
function activeCategoryId(activePage) {
  const category = componentCategories.find(
    (cat) =>
      activePage === `components-${cat.id}` ||
      cat.components.some((component) => activePage === `component-${component.id}`),
  )
  return category ? `components-${category.id}` : null
}

function sortComponentsByTitle(components) {
  return [...components].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}

function getSearchMatches(query) {
  return allComponents
    .map((component, index) => ({ component, index, score: scoreComponentSearch(component, query) }))
    .filter((entry) => entry.score > 0)
}

function ComponentTree({ activePage, onNavigate, search, view }) {
  const query = search.trim()

  const visibleCategories = useMemo(
    () => {
      if (!query) return componentCategories

      return componentCategories
        .map((category, categoryIndex) => {
          const components = allComponents
            .filter((component) => component.categoryId === category.id)
            .map((component, index) => ({ component, index, score: scoreComponentSearch(component, query) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score || a.index - b.index)
            .map((entry) => entry.component)

          return {
            ...category,
            categoryIndex,
            searchScore: components.reduce((best, component) => Math.max(best, scoreComponentSearch(component, query)), 0),
            components,
          }
        })
        .filter((category) => category.components.length > 0)
        .sort((a, b) => b.searchScore - a.searchScore || a.categoryIndex - b.categoryIndex)
    },
    [query],
  )

  const visibleAzComponents = useMemo(() => {
    const components = query
      ? getSearchMatches(query).map((entry) => entry.component)
      : allComponents
    return sortComponentsByTitle(components)
  }, [query])

  // TreeMenu item model: "All Components" + one branch per category whose
  // children are the components in it.
  const items = useMemo(
    () => {
      if (view === 'az') {
        return [
          { id: 'components', label: 'All Components', icon: 'widgets' },
          ...visibleAzComponents.map((component) => ({
            id: `component-${component.id}`,
            label: component.title,
            icon: component.icon,
          })),
        ]
      }

      return [
        { id: 'components', label: 'All Components', icon: 'widgets' },
        ...visibleCategories.map((category) => ({
          id: `components-${category.id}`,
          label: category.title,
          icon: category.icon,
          children: category.components.map((component) => ({
            id: `component-${component.id}`,
            label: component.title,
            icon: component.icon,
          })),
        })),
      ]
    },
    [view, visibleAzComponents, visibleCategories],
  )

  // Expanded branches are controlled so we can auto-open categories that match a
  // search or contain the active page, while still honouring manual toggles.
  const [expandedIds, setExpandedIds] = useState(() => {
    const active = activeCategoryId(activePage)
    return active ? [active] : []
  })

  useEffect(() => {
    if (query) {
      // Searching: reveal every matching category so the results are visible.
      setExpandedIds((prev) =>
        Array.from(new Set([...prev, ...visibleCategories.map((category) => `components-${category.id}`)])),
      )
      return
    }
    // Not searching: make sure the active page's category is open (additive —
    // never collapse what the user opened).
    const active = activeCategoryId(activePage)
    if (active) setExpandedIds((prev) => (prev.includes(active) ? prev : [...prev, active]))
  }, [query, activePage, visibleCategories])

  return (
    <TreeMenu
      aria-label="Component tree"
      items={items}
      selectedId={activePage}
      onSelect={(id) => onNavigate?.(id)}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
    />
  )
}

export function ComponentsSidebar({ activePage, onNavigate, search, setSearch }) {
  const [view, setView] = useState(readStoredView)
  const azEnabled = view === 'az'

  useEffect(() => {
    storeView(view)
  }, [view])

  const searchField = (
    <Stack direction="row" gap="xs" align="end">
      <SearchField
        aria-label="Search components"
        size="compact"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Toolbar aria-label="Component list view">
        <ToolbarToggle
          icon="sort_by_alpha"
          label="A-Z"
          pressed={azEnabled}
          onChange={(pressed) => setView(pressed ? 'az' : 'tree')}
        />
      </Toolbar>
    </Stack>
  )

  return (
    <SideNav className="a1-web-components-tree" header={searchField}>
      <ComponentTree activePage={activePage} onNavigate={onNavigate} search={search} view={view} />
    </SideNav>
  )
}
