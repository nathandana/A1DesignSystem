import { useT } from '../../labels/useT.js'
import { useEffect, useMemo, useState } from 'react'
import {
  SearchField,
  SideNav,
  Stack,
  Toolbar,
  ToolbarToggle,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
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

// The category page id that owns the given active page, if any.
function activeCategoryId(catalog, activePage) {
  const category = catalog.categories.find(
    (cat) =>
      activePage === catalog.categoryPageId(cat.id) ||
      cat.items.some((item) => activePage === catalog.itemPageId(item.id)),
  )
  return category ? catalog.categoryPageId(category.id) : null
}

function exampleIdFromDetailTab(detailTab) {
  return detailTab?.startsWith('example:') ? detailTab.slice('example:'.length) : null
}

function exampleTreeId(itemPageId, exampleId) {
  return `${itemPageId}::example::${exampleId}`
}

function sortByTitle(items) {
  return [...items].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
}

function getSearchMatches(catalog, query) {
  return catalog.all
    .map((item, index) => ({ item, index, score: catalog.scoreSearch(item, query) }))
    .filter((entry) => entry.score > 0)
}

function CatalogTree({ catalog, activePage, detailTab, onNavigate, onSelectDetailTab, search, view }) {
  const t = useT()
  const query = search.trim()
  const activeExampleId = exampleIdFromDetailTab(detailTab)
  const selectedId = catalog.isItemPage(activePage) && activeExampleId
    ? exampleTreeId(activePage, activeExampleId)
    : activePage
  const titleOf = (item) => (item.titleKey ? t(item.titleKey, item.title) : item.title)

  const visibleCategories = useMemo(
    () => {
      if (!query) return catalog.categories

      return catalog.categories
        .map((category, categoryIndex) => {
          const items = catalog.all
            .filter((item) => item.categoryId === category.id)
            .map((item, index) => ({ item, index, score: catalog.scoreSearch(item, query) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score || a.index - b.index)
            .map((entry) => entry.item)

          return {
            ...category,
            categoryIndex,
            searchScore: items.reduce((best, item) => Math.max(best, catalog.scoreSearch(item, query)), 0),
            items,
          }
        })
        .filter((category) => category.items.length > 0)
        .sort((a, b) => b.searchScore - a.searchScore || a.categoryIndex - b.categoryIndex)
    },
    [catalog, query],
  )

  const visibleAzItems = useMemo(() => {
    const items = query
      ? getSearchMatches(catalog, query).map((entry) => entry.item)
      : catalog.all
    return sortByTitle(items)
  }, [catalog, query])

  // TreeMenu item model: the overview + one branch per category whose
  // children are the items in it (components may also list their examples).
  const items = useMemo(
    () => {
      const root = { id: catalog.rootId, label: t(...catalog.labels.all), icon: catalog.icon }
      if (view === 'az') {
        return [
          root,
          ...visibleAzItems.map((item) => ({
            id: catalog.itemPageId(item.id),
            label: titleOf(item),
            icon: item.icon,
          })),
        ]
      }

      return [
        root,
        ...visibleCategories.map((category) => ({
          id: catalog.categoryPageId(category.id),
          label: category.title,
          icon: category.icon,
          children: category.items.map((item) => {
            const examples = catalog.hasExamples ? componentExamples[item.id] ?? [] : []
            const itemPageId = catalog.itemPageId(item.id)
            return {
              id: itemPageId,
              label: titleOf(item),
              icon: item.icon,
              ...(examples.length
                ? {
                    children: examples.map((example) => ({
                      id: exampleTreeId(itemPageId, example.id),
                      label: example.title,
                      icon: 'view_carousel',
                    })),
                  }
                : null),
            }
          }),
        })),
      ]
    },
    [catalog, view, visibleAzItems, visibleCategories, t], // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Expanded branches are controlled so we can auto-open categories that match a
  // search or contain the active page, while still honouring manual toggles.
  const [expandedIds, setExpandedIds] = useState(() => {
    const active = activeCategoryId(catalog, activePage)
    return active ? [active] : []
  })

  useEffect(() => {
    if (query) {
      // Searching: reveal every matching category so the results are visible.
      setExpandedIds((prev) =>
        Array.from(new Set([...prev, ...visibleCategories.map((category) => catalog.categoryPageId(category.id))])),
      )
      return
    }
    // Not searching: make sure the active page's category is open (additive —
    // never collapse what the user opened).
    const active = activeCategoryId(catalog, activePage)
    const activeItem = catalog.isItemPage(activePage) ? activePage : null
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (active) next.add(active)
      if (activeItem && exampleIdFromDetailTab(detailTab)) next.add(activeItem)
      return [...next]
    })
  }, [catalog, query, activePage, detailTab, visibleCategories])

  function handleSelect(id) {
    if (id.includes('::example::')) {
      const [itemPageId, exampleId] = id.split('::example::')
      onSelectDetailTab?.(`example:${exampleId}`)
      onNavigate?.(itemPageId, {
        path: getComponentExamplePath(itemPageId.slice(catalog.itemPrefix.length), exampleId),
      })
      return
    }
    if (catalog.isItemPage(id)) onSelectDetailTab?.('configure')
    onNavigate?.(id)
  }

  return (
    <TreeMenu
      aria-label={t(...catalog.labels.tree)}
      items={items}
      selectedId={selectedId}
      onSelect={handleSelect}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
    />
  )
}

/** The left column of a catalogue: search, tree / A–Z toggle and the item tree. */
export function CatalogSidebar({ catalog = componentsCatalog, activePage, detailTab, onNavigate, onSelectDetailTab, search, setSearch }) {
  const t = useT()
  const [view, setView] = useState(() => readStoredView(catalog.sidebarViewKey))
  const azEnabled = view === 'az'

  useEffect(() => {
    storeView(catalog.sidebarViewKey, view)
  }, [catalog.sidebarViewKey, view])

  const searchField = (
    <Stack direction="row" gap="xs" align="end">
      <SearchField
        data-a1-page-search=""
        data-1p-ignore="true"
        data-bwignore="true"
        data-form-type="other"
        data-lpignore="true"
        aria-label={t(...catalog.labels.search)}
        autoComplete="off"
        name={`a1-${catalog.kind}s-sidebar-search`}
        size="compact"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Toolbar aria-label={t(...catalog.labels.listView)}>
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
      <CatalogTree
        catalog={catalog}
        activePage={activePage}
        detailTab={detailTab}
        onNavigate={onNavigate}
        onSelectDetailTab={onSelectDetailTab}
        search={search}
        view={view}
      />
    </SideNav>
  )
}

export function ComponentsSidebar(props) {
  return <CatalogSidebar catalog={componentsCatalog} {...props} />
}
