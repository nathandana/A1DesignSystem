import {
  getComponentSearchText,
  rankComponentsForSearch,
  scoreComponentSearch,
} from '../components/utils.js'

/**
 * A catalogue is a browsable library of documented things — components or
 * patterns — that share the same pages: a sidebar tree, an overview table,
 * category pages and the detail page with its configurator and tabs. Each
 * catalogue describes its data, route prefixes and labels; the pages read
 * everything through this descriptor so one set of pages serves both.
 *
 * Labels are `[key, fallback]` pairs resolved with `t(...)` by the pages.
 */
export function createCatalog({
  kind,
  icon = 'widgets',
  rootId,
  rootPath,
  categoryPrefix,
  itemPrefix,
  categories,
  lastUpdated,
  lastUpdatedById = {},
  status = {},
  coverage = {},
  related = {},
  // Catalogue the related ids belong to (a pattern's related items are the
  // components it composes). Defaults to this catalogue.
  relatedCatalog = null,
  keywords = {},
  historyOf = () => [],
  routeSlugs = {},
  sidebarViewKey,
  labels,
  rulesCount = 0,
  hasExamples = false,
  // How the preview's responsive-view control renders: a dropdown menu, or an
  // exposed toolbar group that collapses only when the toolbar overflows.
  responsiveViewControl = 'menu',
}) {
  const idsByRouteSlug = Object.fromEntries(Object.entries(routeSlugs).map(([id, slug]) => [slug, id]))
  const categoryPageId = (id) => `${categoryPrefix}${id}`
  const itemPageId = (id) => `${itemPrefix}${id}`
  const routeSlug = (id) => routeSlugs[id] ?? id
  const idFromRouteSlug = (slug) => idsByRouteSlug[slug] ?? slug

  function getPath(pageId) {
    if (pageId === rootId) return rootPath
    if (pageId.startsWith(categoryPrefix)) return `${rootPath}/${pageId.slice(categoryPrefix.length)}`
    if (pageId.startsWith(itemPrefix)) return `${rootPath}/${routeSlug(pageId.slice(itemPrefix.length))}`
    return `/${pageId}`
  }

  const all = categories.flatMap((category) =>
    category.items.map((item) => {
      const enriched = {
        ...item,
        kind,
        pageId: itemPageId(item.id),
        path: getPath(itemPageId(item.id)),
        categoryId: category.id,
        categoryTitle: category.title,
        categoryIcon: category.icon,
        updated: lastUpdatedById[item.id] ?? lastUpdated,
        history: historyOf(item.id),
        packages: coverage[item.id] ?? ['React'],
        searchKeywords: keywords[item.id] ?? [],
      }
      return { ...enriched, searchText: getComponentSearchText(enriched) }
    }),
  )

  const categoryPageIds = categories.map((category) => categoryPageId(category.id))
  const itemPageIds = all.map((item) => itemPageId(item.id))
  const pageTitles = {
    [rootId]: labels.root[1],
    ...Object.fromEntries(categories.map((category) => [categoryPageId(category.id), category.title])),
    ...Object.fromEntries(all.map((item) => [itemPageId(item.id), item.title])),
  }

  function getEntry(activePage) {
    for (const category of categories) {
      if (activePage === categoryPageId(category.id)) return { category }
      const item = all.find((candidate) => candidate.categoryId === category.id && activePage === itemPageId(candidate.id))
      if (item) return { category, item }
    }
    return {}
  }

  function navigateTo(event, onNavigate, pageId) {
    if (!onNavigate) return
    event.preventDefault()
    onNavigate(pageId)
  }

  function getBreadcrumbItems({ category, item }, onNavigate, t = (_key, fallback) => fallback) {
    const home = { href: '/', label: t('app.page.home', 'Home'), onClick: (event) => navigateTo(event, onNavigate, 'home') }
    const rootLabel = t(...labels.root)
    const root = item || category
      ? { href: getPath(rootId), label: rootLabel, onClick: (event) => navigateTo(event, onNavigate, rootId) }
      : { label: rootLabel }
    if (item) {
      return [
        home,
        root,
        { href: getPath(categoryPageId(category.id)), label: category.title, onClick: (event) => navigateTo(event, onNavigate, categoryPageId(category.id)) },
        { label: item.title },
      ]
    }
    if (category) return [home, root, { label: category.title }]
    return [home, root]
  }

  const catalog = {
    kind,
    icon,
    rootId,
    rootPath,
    categoryPrefix,
    itemPrefix,
    categories,
    all,
    categoryPageIds,
    itemPageIds,
    pageIds: [rootId, ...categoryPageIds, ...itemPageIds],
    pageTitles,
    lastUpdated,
    sidebarViewKey,
    labels,
    rulesCount,
    hasExamples,
    responsiveViewControl,
    categoryPageId,
    itemPageId,
    routeSlug,
    idFromRouteSlug,
    isItemPage: (pageId) => itemPageIds.includes(pageId),
    isCategoryPage: (pageId) => categoryPageIds.includes(pageId),
    itemIdFromPage: (pageId) => (pageId?.startsWith(itemPrefix) ? pageId.slice(itemPrefix.length) : null),
    includes: (pageId) => pageId === rootId || categoryPageIds.includes(pageId) || itemPageIds.includes(pageId),
    getPath,
    getEntry,
    getBreadcrumbItems,
    getRelated: (item) => (related[item.id] ?? [])
      .map((id) => (relatedCatalog ?? catalog).all.find((candidate) => candidate.id === id))
      .filter(Boolean),
    statusOf: (id) => status[id] ?? 'beta',
    scoreSearch: scoreComponentSearch,
    rankForSearch: rankComponentsForSearch,
  }
  return catalog
}
