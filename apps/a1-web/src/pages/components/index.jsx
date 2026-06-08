import { useState } from 'react'
import {
  Breadcrumb,
  Heading,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { componentCategories } from './data.js'
import {
  allComponents,
  componentCategoryPageIds,
  componentPageIds,
  componentPageTitles,
  getBreadcrumbItems,
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
  const breadcrumbItems = getBreadcrumbItems({ category, component }, onNavigate)
  const currentComponent = component
    ? allComponents.find((item) => item.id === component.id) ?? component
    : null

  return (
    <>
      <Section padding="sm" surface="panel" gradient="accent" gradientPosition='top-right' contentWidth="xl">
        <Stack direction="column" gap="xs">
          <Breadcrumb items={breadcrumbItems} />
          <Heading as="h1" id="components-heading" size={{ xs: 'xl', md: 'xxl' }}>
            {component?.title ?? category?.title ?? 'Components'}
          </Heading>
        </Stack>
      </Section>

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
