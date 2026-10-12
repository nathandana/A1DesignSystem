import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Figure, Grid, Heading, PageLayout, Paragraph, Section, SelectField, Stack } from '@gtivr4/a1-design-system-react'
import { GlobalSearchDialog } from '../../a1-web/src/search/GlobalSearchDialog.jsx'
import { AboutPage } from './AboutPage.jsx'
import { ExperimentPage } from './ExperimentPage.jsx'
import { LabsHeader } from './LabsHeader.jsx'
import { allExperiments, experimentRedirects, experiments } from './experiments.js'
import { AppearanceContext, AppearanceSettings, useAppearanceSettings } from './AppearanceSettings.jsx'
import { LabsSearchContext, useLabsSearch, useSearchShortcut } from './useSearchShortcut.js'
import { labsSearchEntries } from './labs-search.js'
import { categoryLabel, experimentSorts, filterExperiments, readExperimentFilters, typeLabel } from './experiment-filters.js'

export function App() {
  const settings = useAppearanceSettings()
  const [searchOpen, setSearchOpen] = useState(false)
  const openSearch = useCallback(() => setSearchOpen(true), [])
  const handleShortcut = useSearchShortcut(openSearch, !settings.open && !searchOpen)
  const search = useMemo(() => ({ openSearch, handleShortcut }), [openSearch, handleShortcut])
  const searchEntries = useMemo(() => labsSearchEntries.map(entry => ({
    ...entry,
    onSelect: () => window.location.assign(entry.href),
  })), [])
  let path = window.location.pathname.replace(/\/$/, '')
  if (experimentRedirects[path]) {
    window.history.replaceState(null, '', experimentRedirects[path])
    path = window.location.pathname
  }
  // Hidden experiments aren't listed, but their addresses still open them.
  const experiment = allExperiments.find(item => item.href === path)
  return (
    <AppearanceContext.Provider value={settings}>
      <LabsSearchContext.Provider value={search}>
        {path === '/about' ? <AboutPage onOpenSettings={settings.openSettings} /> : experiment
          ? <ExperimentPage experiment={experiment} onOpenSettings={settings.openSettings} appearance={settings} />
          : <ExperimentGallery onOpenSettings={settings.openSettings} />}
        <AppearanceSettings settings={settings} />
        <GlobalSearchDialog
          open={searchOpen}
          entries={searchEntries}
          onClose={() => setSearchOpen(false)}
          label="Search Labs"
          emptyDescription="Try an experiment name, a category such as forms or motion, or a related term."
        />
      </LabsSearchContext.Provider>
    </AppearanceContext.Provider>
  )
}

function ExperimentGallery({ onOpenSettings }) {
  const { handleShortcut } = useLabsSearch()
  // Sitewide search (header button or "/") replaces the old gallery filter.
  const [sort, setSort] = useState(() => readExperimentFilters(window.location.search).sort)
  const sorted = filterExperiments(experiments, { sort })

  useEffect(() => { document.title = 'A1 Labs' }, [])
  useEffect(() => {
    const url = new URL(window.location.href)
    for (const retired of ['category', 'type', 'q']) url.searchParams.delete(retired)
    url.searchParams.set('sort', sort)
    window.history.replaceState(null, '', url)
  }, [sort])
  useEffect(() => {
    const restore = () => setSort(readExperimentFilters(window.location.search).sort)
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  // The document is the only scroll region; the header stays pinned above it.
  return (
    <PageLayout stickyHeader onKeyDown={handleShortcut} header={<LabsHeader onOpenSettings={onOpenSettings} current="home" />}>
      <Section padding={{ xs: 'sm', md: 'md' }} gap="lg">
        <Stack gap={12}>
          <Heading as="h1" size="lg">All experiments</Heading>
          <Stack direction="row" align="center" justify="between" wrap gap={16}>
            <Paragraph size="sm" color="muted">{experiments.length} experiments</Paragraph>
            <SelectField aria-label="Sort experiments" size="compact" value={sort} onChange={event => setSort(event.target.value)}>
              {experimentSorts.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </SelectField>
          </Stack>
        </Stack>
        <Grid columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }} gap={24} role="group" aria-label="Experiments">
          {sorted.map(experiment => (
            <Card
              key={experiment.id}
              variant="navigation"
              href={experiment.href}
              data-experiment={experiment.id}
              aria-labelledby={experiment.id}
            >
              <Stack gap={12}>
                <Figure src={experiment.preview} alt={experiment.previewAlt} aspectRatio="16:9" radius="sm" />
                <Stack gap={8}>
                  <Paragraph size="xs" color="muted">{String(experiments.indexOf(experiment) + 1).padStart(3, '0')} · {categoryLabel(experiment.category)}</Paragraph>
                  <Heading as="h2" size="sm" id={experiment.id}>{experiment.title}</Heading>
                  <Paragraph size="sm" color="muted">{experiment.description}</Paragraph>
                  <Paragraph size="xs" color="muted"><span className="a1-sr-only">Types: </span>{experiment.types.map(typeLabel).join(' · ')}</Paragraph>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Grid>
      </Section>
    </PageLayout>
  )
}
