import { useT } from '../../labels/useT.js'
import { useEffect, useMemo, useState } from 'react'
import { NavigationTree } from '@gtivr4/a1-design-system-react'
import componentExamples from './componentExamples.json'
import { componentsCatalog } from './catalog.js'
import { getComponentExamplePath } from './utils.js'

const SIDEBAR_VIEWS = new Set(['tree', 'az'])

function readStoredView(key) {
  if (typeof window === 'undefined') return 'tree'
  try {
    const stored = window.localStorage.getItem(key)
    return SIDEBAR_VIEWS.has(stored) ? stored : 'tree'
  } catch {
    return 'tree'
  }
}

function storeView(key, view) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, view)
  } catch {
    // Ignore storage failures; the toggle still works for the current session.
  }
}

function exampleIdFromDetailTab(detailTab) {
  return detailTab?.startsWith('example:') ? detailTab.slice('example:'.length) : null
}

function exampleTreeId(itemPageId, exampleId) {
  return `${itemPageId}::example::${exampleId}`
}

/** App adapter: routing, catalog ranking, translations and persistence stay here. */
export function CatalogSidebar({ catalog = componentsCatalog, activePage, detailTab, onNavigate, onSelectDetailTab, search, setSearch }) {
  const t = useT()
  const [view, setView] = useState(() => readStoredView(catalog.sidebarViewKey))
  useEffect(() => { storeView(catalog.sidebarViewKey, view) }, [catalog.sidebarViewKey, view])
  const activeExampleId = exampleIdFromDetailTab(detailTab)
  const selectedId = catalog.isItemPage(activePage) && activeExampleId
    ? exampleTreeId(activePage, activeExampleId) : activePage
  const items = useMemo(() => [
    { id: catalog.rootId, label: t(...catalog.labels.all), icon: catalog.icon, pinned: true },
    ...catalog.categories.map(category => ({
      id: catalog.categoryPageId(category.id), label: category.title, icon: category.icon, category: true,
      children: category.items.map(item => ({
        id: catalog.itemPageId(item.id), label: item.titleKey ? t(item.titleKey, item.title) : item.title,
        sortLabel: item.title, icon: item.icon,
        ...(catalog.hasExamples && componentExamples[item.id]?.length ? {
          children: componentExamples[item.id].map(example => ({
            id: exampleTreeId(catalog.itemPageId(item.id), example.id), label: example.title,
            icon: 'view_carousel', excludeFromAz: true,
          })),
        } : {}),
      })),
    })),
  ], [catalog, t])
  const scoreItem = useMemo(() => {
    const byId = new Map(catalog.all.map(item => [catalog.itemPageId(item.id), item]))
    return (item, query) => byId.has(item.id) ? catalog.scoreSearch(byId.get(item.id), query) : 0
  }, [catalog])

  function handleSelect(id) {
    if (id.includes('::example::')) {
      const [itemPageId, exampleId] = id.split('::example::')
      onSelectDetailTab?.(`example:${exampleId}`)
      onNavigate?.(itemPageId, { path: getComponentExamplePath(itemPageId.slice(catalog.itemPrefix.length), exampleId) })
      return
    }
    if (catalog.isItemPage(id)) onSelectDetailTab?.('configure')
    onNavigate?.(id)
  }

  return <NavigationTree
    className="a1-web-components-tree"
    items={items} selectedId={selectedId} onSelect={handleSelect}
    search={search} onSearchChange={setSearch} view={view} onViewChange={setView} scoreItem={scoreItem}
    aria-label={t(...catalog.labels.tree)} searchLabel={t(...catalog.labels.search)} listViewLabel={t(...catalog.labels.listView)}
    searchFieldProps={{
      'data-a1-page-search': '', 'data-1p-ignore': 'true', 'data-bwignore': 'true',
      'data-form-type': 'other', 'data-lpignore': 'true', name: `a1-${catalog.kind}s-sidebar-search`,
    }}
  />
}

export function ComponentsSidebar(props) {
  return <CatalogSidebar catalog={componentsCatalog} {...props} />
}
