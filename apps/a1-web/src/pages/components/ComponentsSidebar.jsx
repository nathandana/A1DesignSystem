import { useEffect, useMemo, useState } from 'react'
import {
  SideNav,
  TextField,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
import { componentCategories } from './data.js'

// The category id that owns the given active page, if any.
function activeCategoryId(activePage) {
  const category = componentCategories.find(
    (cat) =>
      activePage === `components-${cat.id}` ||
      cat.components.some((component) => activePage === `component-${component.id}`),
  )
  return category ? `components-${category.id}` : null
}

function ComponentTree({ activePage, onNavigate, search }) {
  const query = search.trim().toLowerCase()

  const visibleCategories = useMemo(
    () =>
      componentCategories
        .map((category) => ({
          ...category,
          components: category.components.filter(
            (component) =>
              !query ||
              component.title.toLowerCase().includes(query) ||
              component.body.toLowerCase().includes(query) ||
              category.title.toLowerCase().includes(query),
          ),
        }))
        .filter((category) => !query || category.components.length > 0),
    [query],
  )

  // TreeMenu item model: "All Components" + one branch per category whose
  // children are the components in it.
  const items = useMemo(
    () => [
      { id: 'components', label: 'All Components', icon: 'widgets' },
      ...visibleCategories.map((category) => ({
        id: `components-${category.id}`,
        label: category.title,
        icon: category.icon,
        children: category.components.map((component) => ({
          id: `component-${component.id}`,
          label: component.title,
        })),
      })),
    ],
    [visibleCategories],
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
  return (
    <SideNav>
      <TextField
        label="Search components"
        size="compact"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <ComponentTree activePage={activePage} onNavigate={onNavigate} search={search} />
    </SideNav>
  )
}
