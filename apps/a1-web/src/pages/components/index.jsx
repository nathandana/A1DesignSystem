import { componentCategories } from './data.js'
import {
  allComponents,
  componentCategoryPageIds,
  componentExamples,
  componentPageIds,
  componentPageTitles,
  componentRouteSlug,
  componentIdFromRouteSlug,
  getComponentExampleBySlug,
  getComponentEntry,
} from './utils.js'
import { ComponentDocsShell } from './ComponentDocsShell.jsx'
import { ComponentCategoryPage } from './ComponentCategoryPage.jsx'
import { ComponentDetailPage } from './ComponentDetailPage.jsx'
import { ComponentsOverviewPage } from './ComponentsOverviewPage.jsx'
import { ComponentsSidebar } from './ComponentsSidebar.jsx'

export { componentCategories }
export {
  componentCategoryPageIds,
  componentPageIds,
  componentPageTitles,
  componentRouteSlug,
  componentIdFromRouteSlug,
  getComponentExampleBySlug,
}

export function Components({ activePage = 'components', onNavigate, projectId = null, detailTab = 'configure', setDetailTab }) {
  const { category, component } = getComponentEntry(activePage)
  const currentComponent = component
    ? allComponents.find((item) => item.id === component.id) ?? component
    : null

  return (
    <>
      {currentComponent ? (
        <ComponentDetailPage
          component={currentComponent}
          category={category}
          onNavigate={onNavigate}
          projectId={projectId}
          tab={detailTab}
          onTabChange={setDetailTab}
        />
      ) : (
        <ComponentDocsShell>
          {category ? (
            <ComponentCategoryPage category={category} onNavigate={onNavigate} />
          ) : (
            <ComponentsOverviewPage onNavigate={onNavigate} />
          )}
        </ComponentDocsShell>
      )}
    </>
  )
}

export function getComponentsSidebar({ activePage, detailTab, onNavigate, onSelectDetailTab, search, setSearch }) {
  return (
    <ComponentsSidebar
      activePage={activePage}
      detailTab={detailTab}
      onNavigate={onNavigate}
      onSelectDetailTab={onSelectDetailTab}
      search={search}
      setSearch={setSearch}
    />
  )
}

/* Mount point for the component configuration panel, rendered into the
   PageLayout aside slot. Only present on a component detail page's Configure
   tab. ComponentDetailPage portals the controls into this element. */
export function getComponentsAside({ activePage, detailTab }) {
  const showsConfigurator = detailTab === 'configure' || detailTab?.startsWith('example:')
  const exampleId = detailTab?.startsWith('example:') ? detailTab.slice('example:'.length) : null
  const componentId = activePage?.startsWith('component-') ? activePage.slice('component-'.length) : null
  const example = exampleId && componentId
    ? (componentExamples[componentId] ?? []).find((item) => item.id === exampleId)
    : null
  if (example?.configurable === false) return null
  if (!componentPageIds.includes(activePage) || !showsConfigurator) return null
  return <div id="a1-web-config-aside-slot" className="a1-web-config-aside" />
}
