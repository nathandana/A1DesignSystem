import React, { useEffect, useState } from 'react'
import {
  BottomSheet, Heading, IconButton, Inset, PageLayout, Paragraph,
  SearchField, Section, SideNav, Stack, TreeMenu,
} from '@gtivr4/a1-design-system-react'
import breakpoints from '../../../system/tokens/breakpoint.json'
import { categoryTreeId, experiments, experimentCategories, experimentTree } from './experiments.js'
import { useLabsSearch } from './useSearchShortcut.js'
import { LabsHeader } from './LabsHeader.jsx'

// Same responsive contract as a1-web: configuration moves to a BottomSheet
// at sm and below; SideNav owns its desktop/overlay breakpoint internally.
const sidebarOverlayQuery = `(max-width: ${breakpoints.breakpoint.md.max.$value})`
const mobileQuery = `(max-width: ${breakpoints.breakpoint.sm.max.$value})`

export function ExperimentLayout({ experiment, onOpenSettings, configuration, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { handleShortcut } = useLabsSearch()
  const [search, setSearch] = useState('')
  const [expandedIds, setExpandedIds] = useState([categoryTreeId(experiment.category)])
  const [isSidebarOverlay, setIsSidebarOverlay] = useState(() => window.matchMedia(sidebarOverlayQuery).matches)
  const [isSmDown, setIsSmDown] = useState(() => window.matchMedia(mobileQuery).matches)

  useEffect(() => {
    document.title = `${experiment.title} · A1 Labs`
    const query = window.matchMedia(mobileQuery)
    const update = event => setIsSmDown(event.matches)
    const sidebarQuery = window.matchMedia(sidebarOverlayQuery)
    const updateSidebar = event => setIsSidebarOverlay(event.matches)
    setIsSmDown(query.matches)
    setIsSidebarOverlay(sidebarQuery.matches)
    query.addEventListener('change', update)
    sidebarQuery.addEventListener('change', updateSidebar)
    return () => {
      query.removeEventListener('change', update)
      sidebarQuery.removeEventListener('change', updateSidebar)
    }
  }, [experiment.title])

  const query = search.trim().toLocaleLowerCase()
  const categories = experimentTree(search)

  function selectTreeItem(id, event) {
    if (experimentCategories.some(category => categoryTreeId(category.id) === id)) {
      setExpandedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id])
      return
    }
    setSidebarOpen(false)
    // TreeMenu handles Enter/Space itself; its onSelect owns keyboard navigation.
    if (event?.type === 'keydown') {
      const href = experiments.find(item => item.id === id)?.href
      if (href) window.location.assign(href)
    }
  }

  return (
    <PageLayout
      className="a1-labs-experiment-layout"
      onKeyDown={handleShortcut}
      stickyHeader
      viewportHeight
      header={
        <LabsHeader onOpenSettings={onOpenSettings} />
      }
      sidebar={
        <SideNav
          aria-label="Experiments"
          collapseButtonPlacement="none"
          header={
            <SearchField
              aria-label="Filter experiments"
              autoComplete="off"
              size="compact"
              value={search}
              onChange={event => {
                const value = event.target.value
                setSearch(value)
                setExpandedIds(value.trim()
                  ? experimentTree(value).map(category => category.id)
                  : [categoryTreeId(experiment.category)])
              }}
            />
          }
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <TreeMenu
            aria-label="Experiment tree"
            items={categories}
            selectedId={experiment.id}
            expandedIds={expandedIds}
            onExpandedChange={setExpandedIds}
            showExpandControls
            variant="expanded"
            onSelect={selectTreeItem}
          />
          {query && categories.length === 0 && (
            <Inset space={16}>
              <Paragraph size="sm" color="muted" role="status">No experiments found.</Paragraph>
            </Inset>
          )}
        </SideNav>
      }
      aside={isSmDown || !configuration ? undefined : (
        <div className="a1-labs-configuration">{configuration}</div>
      )}
    >
      <Section padding={{ xs: 'sm', md: 'md' }} gap={isSidebarOverlay ? 'lg' : undefined}>
        {isSidebarOverlay ? <Stack direction="row" align="center" gap={12}>
          <IconButton
            icon="view_sidebar"
            label="Open experiments"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          />
          <Heading as="h1" size="lg">{experiment.title}</Heading>
        </Stack> : <Heading as="h1" className="a1-sr-only">{experiment.title}</Heading>}
        {children}
      </Section>
      {isSmDown && configuration && (
        <BottomSheet title="Configure" detents={[0.55, 0.95]} defaultDetent={0}>
          {configuration}
        </BottomSheet>
      )}
    </PageLayout>
  )
}
