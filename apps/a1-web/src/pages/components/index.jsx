import { useState } from 'react'
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

export function Components({ activePage = 'components', onNavigate }) {
  const [detailTab, setDetailTab] = useState('configure')
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
