import { componentCategories } from './data.js'
import {
  allComponents,
  componentCategoryPageIds,
  componentPageIds,
  componentPageTitles,
  getComponentEntry,
} from './utils.js'
import { ComponentDocsShell } from './ComponentDocsShell.jsx'
import { ComponentCategoryPage } from './ComponentCategoryPage.jsx'
import { ComponentDetailPage } from './ComponentDetailPage.jsx'
import { ComponentsOverviewPage } from './ComponentsOverviewPage.jsx'
import { ComponentsSidebar } from './ComponentsSidebar.jsx'

export { componentCategories }
export { componentCategoryPageIds, componentPageIds, componentPageTitles }

export function Components({ activePage = 'components', onNavigate, detailTab = 'configure', setDetailTab }) {
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

export function getComponentsSidebar({ activePage, onNavigate, search, setSearch }) {
  return (
    <ComponentsSidebar
      activePage={activePage}
      onNavigate={onNavigate}
      search={search}
      setSearch={setSearch}
    />
  )
}

/* Mount point for the component configuration panel, rendered into the
   PageLayout aside slot. Only present on a component detail page's Configure
   tab. ComponentDetailPage portals the controls into this element. */
export function getComponentsAside({ activePage, detailTab }) {
  if (!componentPageIds.includes(activePage) || detailTab !== 'configure') return null
  return <div id="a1-web-config-aside-slot" className="a1-web-config-aside" />
}
