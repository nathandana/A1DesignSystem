import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  SearchField,
  Section,
  SideNav,
  Stack,
  TreeMenu,
} from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT.js'
import { PageTitleArea } from './PageTitleArea.jsx'
import { DATE_OF_BIRTH_EXPERIMENTS } from '../../../a1-labs/src/date-of-birth/DateOfBirthExamples.jsx'

const LABS_EVENT = 'a1-web-labs-route'

const GENERAL_EXPERIMENTS = [
  {
    id: 'pattern-assembly-bench',
    icon: 'science',
    titleKey: 'app.labs.patternAssemblyBenchTitle',
    title: 'Pattern assembly bench',
    summaryKey: 'app.labs.patternAssemblyBenchSummary',
    summary: 'A placeholder for assembling patterns and proposed components before they become production guidance.',
    render: AssemblyBenchExperiment,
  },
]

const LAB_GROUPS = [
  {
    id: 'labs-date-of-birth',
    icon: 'cake',
    titleKey: 'app.labs.dobGroupTitle',
    title: 'Date of birth inputs',
    experiments: DATE_OF_BIRTH_EXPERIMENTS,
  },
  {
    id: 'labs-general',
    icon: 'science',
    titleKey: 'app.labs.generalGroupTitle',
    title: 'General',
    experiments: GENERAL_EXPERIMENTS,
  },
]

const LAB_EXPERIMENTS = LAB_GROUPS.flatMap((group) => group.experiments)

function labsPath(id = LAB_EXPERIMENTS[0].id) {
  return `/labs/${id}`
}

function experimentIdFromPath(pathname = window.location.pathname) {
  const path = pathname.replace(/^\/|\/$/g, '')
  if (!path || path === 'labs') return LAB_EXPERIMENTS[0].id
  if (!path.startsWith('labs/')) return LAB_EXPERIMENTS[0].id
  const id = path.slice('labs/'.length)
  return LAB_EXPERIMENTS.some((experiment) => experiment.id === id) ? id : LAB_EXPERIMENTS[0].id
}

function useLabsExperimentId() {
  const [selectedId, setSelectedId] = useState(() => experimentIdFromPath())

  useEffect(() => {
    const update = () => setSelectedId(experimentIdFromPath())
    window.addEventListener('popstate', update)
    window.addEventListener(LABS_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(LABS_EVENT, update)
    }
  }, [])

  return selectedId
}

function scoreExperiment(experiment, query, t) {
  const text = [
    t(experiment.titleKey, experiment.title),
    t(experiment.summaryKey, experiment.summary),
    experiment.id,
  ].join(' ').toLowerCase()
  const normalized = query.trim().toLowerCase()
  if (!normalized) return 1
  if (text.includes(normalized)) return 2
  return normalized.split(/\s+/).every((part) => text.includes(part)) ? 1 : 0
}

export function getLabsSidebar({ onNavigate }) {
  return <LabsSidebar onNavigate={onNavigate} />
}

function LabsSidebar({ onNavigate }) {
  const t = useT()
  const selectedId = useLabsExperimentId()
  const [search, setSearch] = useState('')
  const query = search.trim()

  const visibleGroups = useMemo(
    () => LAB_GROUPS.map((group) => ({
      ...group,
      experiments: group.experiments.filter((experiment) => scoreExperiment(experiment, query, t) > 0),
    })).filter((group) => group.experiments.length > 0),
    [query, t],
  )

  const items = useMemo(
    () => visibleGroups.map((group) => ({
      id: group.id,
      label: t(group.titleKey, group.title),
      icon: group.icon,
      children: group.experiments.map((experiment) => ({
          id: experiment.id,
          label: t(experiment.titleKey, experiment.title),
          icon: experiment.icon,
      })),
    })),
    [t, visibleGroups],
  )

  function handleSelect(id) {
    if (!LAB_EXPERIMENTS.some((experiment) => experiment.id === id)) return
    onNavigate?.('labs', { path: labsPath(id) })
    window.dispatchEvent(new CustomEvent(LABS_EVENT))
  }

  const searchField = (
    <SearchField
      data-a1-page-search=""
      data-1p-ignore="true"
      data-bwignore="true"
      data-form-type="other"
      data-lpignore="true"
      aria-label={t('app.labs.searchLabel', 'Search labs')}
      autoComplete="off"
      name="a1-labs-sidebar-search"
      size="compact"
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  )

  return (
    <SideNav className="a1-web-components-tree" header={searchField}>
      {visibleGroups.length ? (
        <TreeMenu
          aria-label={t('app.labs.treeLabel', 'Labs experiments')}
          items={items}
          selectedId={selectedId}
          defaultExpandedIds={LAB_GROUPS.map((group) => group.id)}
          onSelect={handleSelect}
        />
      ) : (
        <Section padding="xs">
          <MessageEmptyState
            icon="search_off"
            title={t('app.labs.noResultsTitle', 'No labs found')}
            description={t('app.labs.noResultsBody', 'Try a different experiment name or clear the search.')}
          />
        </Section>
      )}
    </SideNav>
  )
}

export function Labs({ onNavigate }) {
  const t = useT()
  const selectedId = useLabsExperimentId()
  const experiment = LAB_EXPERIMENTS.find((item) => item.id === selectedId) ?? LAB_EXPERIMENTS[0]
  const ExperimentBody = experiment.render ?? AssemblyBenchExperiment

  return (
    <>
      <PageTitleArea
        headingId="labs-heading"
        breadcrumbItems={[
          { label: t('app.page.home', 'Home'), href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
          { label: t('app.page.labs', 'Labs') },
        ]}
        title={t('app.page.labs', 'Labs')}
        description={t('app.labs.description', 'Explore experiments for patterns and proposed components before they become system guidance.')}
        titleAccessory={<MessageBadge status="neutral">{t('app.labs.experimentEyebrow', 'Experiment')}</MessageBadge>}
      />
      <Section padding="sm" aria-labelledby="labs-heading" contentWidth="xl">
        <Stack direction="column" gap="md">
          <Card>
            <Stack direction="column" gap="sm">
              <Stack direction="column" gap="xs">
                <Paragraph as="span" size="xs" color="muted">
                  {t('app.labs.experimentEyebrow', 'Experiment')}
                </Paragraph>
                <Heading as="h2" size="lg">
                  {t(experiment.titleKey, experiment.title)}
                </Heading>
              </Stack>
              <Paragraph color="muted">
                {t(experiment.summaryKey, experiment.summary)}
              </Paragraph>
            </Stack>
          </Card>

          <ExperimentBody t={t} />
        </Stack>
      </Section>
    </>
  )
}

function AssemblyBenchExperiment({ t }) {
  return (
    <Stack direction="column" gap="md">
      <MessageEmptyState
        icon="science"
        title={t('app.labs.placeholderTitle', 'This lab is ready for experiments')}
        description={t('app.labs.placeholderDescription', 'Use this space to assemble pattern drafts, component proposals, and interaction studies as they become ready to review.')}
      />
      <Stack direction="row" gap="md" wrap>
        <Card>
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="sm">
              {t('app.labs.whatFitsTitle', 'What belongs here')}
            </Heading>
            <Paragraph size="sm" color="muted">
              {t('app.labs.whatFitsBody', 'Draft patterns, proposed components, and exploratory workflows that need a visible review surface.')}
            </Paragraph>
          </Stack>
        </Card>
        <Card>
          <Stack direction="column" gap="xs">
            <Heading as="h3" size="sm">
              {t('app.labs.nextTitle', 'Next slice')}
            </Heading>
            <Paragraph size="sm" color="muted">
              {t('app.labs.nextBody', 'Replace this placeholder with the first real experiment and keep each experiment deep-linkable.')}
            </Paragraph>
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}
