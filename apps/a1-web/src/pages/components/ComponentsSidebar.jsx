import { useEffect, useMemo, useState } from 'react'
import {
  SearchField,
  SideNav,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
import componentExamples from './componentExamples.json'
import { componentCategories } from './data.js'
import { getComponentExamplePath } from './utils.js'

// The category id that owns the given active page, if any.
function activeCategoryId(activePage) {
  const category = componentCategories.find(
    (cat) =>
      activePage === `components-${cat.id}` ||
      cat.components.some((component) => activePage === `component-${component.id}`),
  )
  return category ? `components-${category.id}` : null
}

function exampleIdFromDetailTab(detailTab) {
  return detailTab?.startsWith('example:') ? detailTab.slice('example:'.length) : null
}

function exampleTreeId(componentPageId, exampleId) {
  return `${componentPageId}::example::${exampleId}`
}

function ComponentTree({ activePage, detailTab, onNavigate, onSelectDetailTab, search }) {
  const query = search.trim().toLowerCase()
  const activeExampleId = exampleIdFromDetailTab(detailTab)
  const selectedId = activePage.startsWith('component-') && activeExampleId
    ? exampleTreeId(activePage, activeExampleId)
    : activePage

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
        children: category.components.map((component) => {
          const examples = componentExamples[component.id] ?? []
          const componentPageId = `component-${component.id}`
          return {
            id: componentPageId,
            label: component.title,
            icon: component.icon,
            ...(examples.length
              ? {
                  children: examples.map((example) => ({
                    id: exampleTreeId(componentPageId, example.id),
                    label: example.title,
                    icon: 'view_carousel',
                  })),
                }
              : null),
          }
        }),
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
    const activeComponent = activePage.startsWith('component-') ? activePage : null
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (active) next.add(active)
      if (activeComponent && exampleIdFromDetailTab(detailTab)) next.add(activeComponent)
      return [...next]
    })
  }, [query, activePage, detailTab, visibleCategories])

  function handleSelect(id) {
    if (id.includes('::example::')) {
      const [componentId, exampleId] = id.split('::example::')
      onSelectDetailTab?.(`example:${exampleId}`)
      onNavigate?.(componentId, {
        path: getComponentExamplePath(componentId.slice('component-'.length), exampleId),
      })
      return
    }
    if (id.startsWith('component-')) onSelectDetailTab?.('configure')
    onNavigate?.(id)
  }

  return (
    <TreeMenu
      aria-label="Component tree"
      items={items}
      selectedId={selectedId}
      onSelect={handleSelect}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
    />
  )
}

export function ComponentsSidebar({ activePage, detailTab, onNavigate, onSelectDetailTab, search, setSearch }) {
  const searchField = (
    <SearchField
      data-a1-page-search=""
      aria-label="Search components"
      size="compact"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  )

  return (
    <SideNav className="a1-web-components-tree" header={searchField}>
      <ComponentTree
        activePage={activePage}
        detailTab={detailTab}
        onNavigate={onNavigate}
        onSelectDetailTab={onSelectDetailTab}
        search={search}
      />
    </SideNav>
  )
}
