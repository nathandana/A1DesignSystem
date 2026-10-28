import { useT } from '../../labels/useT.js'
import { componentCategories } from './data.js'
import {
  componentCategoryPageIds,
  componentExamples,
  componentPageIds,
  componentPageTitles,
  componentRouteSlug,
  componentIdFromRouteSlug,
  getComponentExampleBySlug,
} from './utils.js'
import { componentsCatalog } from './catalog.js'
import { ComponentDocsShell } from './ComponentDocsShell.jsx'
import { CatalogCategoryPage } from './ComponentCategoryPage.jsx'
import { ComponentDetailPage } from './ComponentDetailPage.jsx'
import { CatalogOverviewPage } from './ComponentsOverviewPage.jsx'
import { CatalogSidebar } from './ComponentsSidebar.jsx'

export { componentCategories, componentsCatalog }
export {
  componentCategoryPageIds,
  componentPageIds,
  componentPageTitles,
  componentRouteSlug,
  componentIdFromRouteSlug,
  getComponentExampleBySlug,
}

/**
 * The pages of one catalogue (components or patterns): the overview, a
 * category page or an item's detail page, chosen by the active route id.
 */
export function CatalogPages({ catalog, activePage, onNavigate, projectId = null, detailTab = 'configure', setDetailTab }) {
  const t = useT()
  const { category, item } = catalog.getEntry(activePage)
  const currentItem = item
    ? catalog.all.find((candidate) => candidate.id === item.id) ?? item
    : null

  return (
    <>
      {currentItem ? (
        <ComponentDetailPage
          catalog={catalog}
          component={{
            ...currentItem,
            title: currentItem.titleKey ? t(currentItem.titleKey, currentItem.title) : currentItem.title,
            body: currentItem.bodyKey ? t(currentItem.bodyKey, currentItem.body) : currentItem.body,
          }}
          category={category}
          onNavigate={onNavigate}
          projectId={projectId}
          tab={detailTab}
          onTabChange={setDetailTab}
        />
      ) : (
        <ComponentDocsShell>
          {category ? (
            <CatalogCategoryPage catalog={catalog} category={category} onNavigate={onNavigate} />
          ) : (
            <CatalogOverviewPage catalog={catalog} onNavigate={onNavigate} />
          )}
        </ComponentDocsShell>
      )}
    </>
  )
}

export function Components(props) {
  return <CatalogPages catalog={componentsCatalog} {...props} />
}

export function getCatalogSidebar({ catalog, activePage, detailTab, onNavigate, onSelectDetailTab, search, setSearch }) {
  return (
    <CatalogSidebar
      catalog={catalog}
      activePage={activePage}
      detailTab={detailTab}
      onNavigate={onNavigate}
      onSelectDetailTab={onSelectDetailTab}
      search={search}
      setSearch={setSearch}
    />
  )
}

export function getComponentsSidebar(props) {
  return getCatalogSidebar({ catalog: componentsCatalog, ...props })
}

/* Mount point for the configuration panel, rendered into the PageLayout aside
   slot. Only present on an item's detail page on its Configure tab (or a
   configurable example). ComponentDetailPage portals the controls into it. */
export function getCatalogAside({ catalog, activePage, detailTab }) {
  const showsConfigurator = detailTab === 'configure' || detailTab?.startsWith('example:')
  const exampleId = detailTab?.startsWith('example:') ? detailTab.slice('example:'.length) : null
  const itemId = catalog.itemIdFromPage(activePage)
  const example = catalog.hasExamples && exampleId && itemId
    ? (componentExamples[itemId] ?? []).find((candidate) => candidate.id === exampleId)
    : null
  if (example?.configurable === false) return null
  if (!catalog.isItemPage(activePage) || !showsConfigurator) return null
  return <div id="a1-web-config-aside-slot" className="a1-web-config-aside" />
}

export function getComponentsAside(props) {
  return getCatalogAside({ catalog: componentsCatalog, ...props })
}
