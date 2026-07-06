import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Chip,
  ChipGroup,
  Code,
  Heading,
  Link,
  Paragraph,
  SearchField,
  Section,
  SegmentedControl,
  SideNav,
  Stack,
  TreeMenu,
  useLabel,
} from '@gtivr4/a1-design-system-react'
import detailedReleaseNotesMarkdown from '../../CHANGELOG.md?raw'
import publicReleaseNotesMarkdown from './publicReleaseNotes.md?raw'
import reactReleaseNotesMarkdown from '../../../../packages/react/CHANGELOG.md?raw'
import publicReactReleaseNotesMarkdown from './publicReactReleaseNotes.md?raw'
import reactNativeReleaseNotesMarkdown from '../../../../packages/react-native/CHANGELOG.md?raw'
import webComponentsReleaseNotesMarkdown from '../../../../packages/web-components/CHANGELOG.md?raw'
import pureReleaseNotesMarkdown from '../../../../packages/pure/CHANGELOG.md?raw'
import eslintPluginReleaseNotesMarkdown from '../../../../packages/eslint-plugin-a1/CHANGELOG.md?raw'
import { PageTitleArea } from './PageTitleArea.jsx'

const RELEASE_NOTE_MODES = {
  simplified: 'simplified',
  detailed: 'detailed',
}

const DEFAULT_RELEASE_NOTE_MODE = RELEASE_NOTE_MODES.simplified

function createReleaseNoteSources({
  appLabel,
  reactLabel,
  reactNativeLabel,
  webComponentsLabel,
  pureLabel,
  eslintPluginLabel,
}) {
  return [
    {
      id: 'a1-web',
      label: appLabel,
      icon: 'web',
      markdownByMode: {
        [RELEASE_NOTE_MODES.simplified]: publicReleaseNotesMarkdown,
        [RELEASE_NOTE_MODES.detailed]: detailedReleaseNotesMarkdown,
      },
    },
    {
      id: 'react',
      label: reactLabel,
      icon: 'deployed_code',
      markdownByMode: {
        [RELEASE_NOTE_MODES.simplified]: publicReactReleaseNotesMarkdown,
        [RELEASE_NOTE_MODES.detailed]: reactReleaseNotesMarkdown,
      },
    },
    {
      id: 'react-native',
      label: reactNativeLabel,
      icon: 'phone_iphone',
      markdownByMode: {
        [RELEASE_NOTE_MODES.detailed]: reactNativeReleaseNotesMarkdown,
      },
    },
    {
      id: 'web-components',
      label: webComponentsLabel,
      icon: 'widgets',
      markdownByMode: {
        [RELEASE_NOTE_MODES.detailed]: webComponentsReleaseNotesMarkdown,
      },
    },
    {
      id: 'pure',
      label: pureLabel,
      icon: 'css',
      markdownByMode: {
        [RELEASE_NOTE_MODES.detailed]: pureReleaseNotesMarkdown,
      },
    },
    {
      id: 'eslint-plugin',
      label: eslintPluginLabel,
      icon: 'rule_settings',
      markdownByMode: {
        [RELEASE_NOTE_MODES.detailed]: eslintPluginReleaseNotesMarkdown,
      },
    },
  ]
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia?.(query).matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener?.('change', update)
    return () => mql.removeEventListener?.('change', update)
  }, [query])

  return matches
}

function createReleaseId(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseReleaseHeading(title) {
  const match = title.match(/^(.+?)\s+[—-]\s+(.+)$/)
  if (!match) return { version: title, date: null }

  return {
    version: match[1].trim(),
    date: match[2].trim(),
  }
}

function parsePromptGroups(body) {
  return body
    .split(/^### /m)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const lines = section.split('\n')
      // A `### ` group leads with its heading text. A flat preamble has none:
      // its first line is usually a bullet, so treat every line as content.
      const hasTitle = lines[0] && !lines[0].trim().startsWith('- ')
      const title = hasTitle ? lines[0].replace(/^Prompt:\s*/i, '').trim() : ''
      const content = (hasTitle ? lines.slice(1) : lines)
        .map((line) => line.trim())
        .filter(Boolean)

      return { title, content }
    })
}

function versionParts(version) {
  return version.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0)
}

function compareReleases(a, b) {
  if (a.id.endsWith('-upcoming')) return -1
  if (b.id.endsWith('-upcoming')) return 1
  if (a.date && b.date) { if (a.date !== b.date) return a.date < b.date ? 1 : -1 }
  else if (a.date) return -1
  else if (b.date) return 1
  const pa = versionParts(a.version)
  const pb = versionParts(b.version)
  for (let i = 0; i < 3; i += 1) {
    if ((pb[i] || 0) !== (pa[i] || 0)) return (pb[i] || 0) - (pa[i] || 0)
  }
  return 0
}

function parseChangelog(markdown, source) {
  const releases = markdown
    .split(/^## /m)
    .slice(1)
    .map((section) => {
      const [rawTitle = '', ...lines] = section.split('\n')
      const title = rawTitle.trim()
      const body = lines.join('\n').trim()
      const isUnreleased = title.toLowerCase() === 'unreleased'
      const hasReleaseNotes = body && !/^no unreleased changes\.$/i.test(body)

      if (!hasReleaseNotes) return null

      const { version, date } = isUnreleased
        ? { version: 'Upcoming', date: null }
        : parseReleaseHeading(title)
      return {
        id: `${source.id}-${isUnreleased ? 'upcoming' : createReleaseId(version)}`,
        source,
        title,
        version,
        date,
        groups: parsePromptGroups(body),
      }
    })
    .filter(Boolean)
    .sort(compareReleases)

  const seen = new Map()
  for (const release of releases) {
    const count = (seen.get(release.id) ?? 0) + 1
    seen.set(release.id, count)
    if (count > 1) release.id = `${release.id}-${count}`
  }

  return releases
}

function releaseMarkdownForSource(source, mode) {
  return source.markdownByMode[mode]
    ?? source.markdownByMode[RELEASE_NOTE_MODES.detailed]
    ?? source.markdownByMode[RELEASE_NOTE_MODES.simplified]
    ?? ''
}

function normalizedText(value) {
  return String(value ?? '').toLowerCase()
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matchesTokens(value, tokens) {
  const text = normalizedText(value)
  return tokens.every((token) => text.includes(token))
}

function filterGroup(group, tokens) {
  const groupText = [group.title, ...group.content].join(' ')
  if (!matchesTokens(groupText, tokens)) return null
  if (matchesTokens(group.title, tokens)) return group

  const content = group.content.filter((line) => matchesTokens(line, tokens))
  return { ...group, content }
}

function filterRelease(release, tokens) {
  if (tokens.length === 0) return release

  const releaseHeadingText = [release.source?.label, release.title, release.version, release.date].join(' ')
  if (matchesTokens(releaseHeadingText, tokens)) return release

  const groups = release.groups
    .map((group) => filterGroup(group, tokens))
    .filter(Boolean)

  return groups.length ? { ...release, groups } : null
}

function useReleaseSources() {
  const appLabel = useLabel('app.page.releaseAppLabel', 'A1 web')
  const reactLabel = useLabel('app.page.releaseReactPackageLabel', 'React package')
  const reactNativeLabel = useLabel('app.page.releaseReactNativePackageLabel', 'React Native package')
  const webComponentsLabel = useLabel('app.page.releaseWebComponentsPackageLabel', 'Web Components package')
  const pureLabel = useLabel('app.page.releasePurePackageLabel', 'Pure CSS package')
  const eslintPluginLabel = useLabel('app.page.releaseEslintPluginPackageLabel', 'ESLint plugin')

  return useMemo(
    () => createReleaseNoteSources({
      appLabel,
      reactLabel,
      reactNativeLabel,
      webComponentsLabel,
      pureLabel,
      eslintPluginLabel,
    }),
    [appLabel, eslintPluginLabel, pureLabel, reactLabel, reactNativeLabel, webComponentsLabel],
  )
}

function useReleaseView(mode, query, sourceId) {
  const releaseSources = useReleaseSources()
  const activeSources = useMemo(
    () => releaseSources.filter((source) => Object.keys(source.markdownByMode).length > 0),
    [releaseSources],
  )
  const activeSourceId = activeSources.some((source) => source.id === sourceId)
    ? sourceId
    : activeSources[0]?.id ?? null
  const releases = useMemo(
    () => activeSources.flatMap((source) => parseChangelog(releaseMarkdownForSource(source, mode), source)),
    [activeSources, mode],
  )
  const sourceReleases = useMemo(
    () => releases.filter((release) => release.source.id === activeSourceId),
    [activeSourceId, releases],
  )
  const searchTokens = useMemo(
    () => normalizedText(query).split(/\s+/).filter(Boolean),
    [query],
  )
  const filteredReleases = useMemo(
    () => sourceReleases.map((release) => filterRelease(release, searchTokens)).filter(Boolean),
    [sourceReleases, searchTokens],
  )

  return { activeSources, activeSourceId, releases: sourceReleases, filteredReleases, searchTokens }
}

function renderHighlightedText(value, searchTokens = [], keyPrefix = 'text') {
  const text = String(value ?? '')
  const uniqueTokens = Array.from(new Set(searchTokens.filter(Boolean))).sort((a, b) => b.length - a.length)
  if (uniqueTokens.length === 0) return text

  const pattern = new RegExp(`(${uniqueTokens.map(escapeRegExp).join('|')})`, 'gi')
  const nodes = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index))
    nodes.push(<mark key={`${keyPrefix}-${match.index}-${match[0]}`}>{match[0]}</mark>)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex))
  return nodes
}

function appendText(nodes, value, searchTokens, keyPrefix) {
  const highlighted = renderHighlightedText(value, searchTokens, keyPrefix)
  if (Array.isArray(highlighted)) nodes.push(...highlighted)
  else nodes.push(highlighted)
}

function renderInlineMarkdown(value, searchTokens = []) {
  const text = String(value ?? '')
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g
  const nodes = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      appendText(nodes, text.slice(lastIndex, match.index), searchTokens, `text-${match.index}`)
    }

    const token = match[0]
    const key = `${match.index}-${token}`
    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{renderInlineMarkdown(token.slice(2, -2), searchTokens)}</strong>)
    } else if (token.startsWith('*')) {
      nodes.push(<em key={key}>{renderInlineMarkdown(token.slice(1, -1), searchTokens)}</em>)
    } else if (token.startsWith('`')) {
      nodes.push(<Code key={key} variant="inline">{renderHighlightedText(token.slice(1, -1), searchTokens, key)}</Code>)
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (linkMatch) {
        nodes.push(
          <Link key={key} href={linkMatch[2]}>
            {renderInlineMarkdown(linkMatch[1], searchTokens)}
          </Link>,
        )
      } else {
        nodes.push(token)
      }
    }

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    appendText(nodes, text.slice(lastIndex), searchTokens, `text-${lastIndex}`)
  }
  return nodes
}

function useReleaseLabels(mode) {
  const releaseViewLabel = useLabel('app.page.releaseViewLabel', 'Release notes version')
  const simplifiedLabel = useLabel('app.page.releaseSimplifiedLabel', 'Simplified')
  const detailedLabel = useLabel('app.page.releaseDetailedLabel', 'Detailed')
  const packageFilterLabel = useLabel('app.page.releasePackageFilterLabel', 'Package')
  const releaseTreeLabel = useLabel('app.page.releaseTreeLabel', 'Release versions')
  const releaseOpenNavLabel = useLabel('app.page.releaseOpenNavLabel', 'Browse releases')
  const simplifiedDescription = useLabel(
    'app.page.releasePublicDescription',
    'Public summaries of A1 product and design-system changes, written for people using the system.',
  )
  const detailedDescription = useLabel(
    'app.page.releaseDetailedDescription',
    'Detailed release notes with implementation and maintenance context.',
  )
  const emptyDescription = useLabel(
    'app.page.releasePublicEmptyDescription',
    'No public release notes are available yet.',
  )
  const searchLabel = useLabel('app.page.releaseSearchLabel', 'Search release notes')
  const emptyTitle = useLabel('app.page.releaseSearchEmptyTitle', 'No release notes found')
  const emptyBody = useLabel('app.page.releaseSearchEmptyBody', 'No release notes match "{query}".')
  const releaseDescription = mode === RELEASE_NOTE_MODES.detailed
    ? detailedDescription
    : simplifiedDescription
  const releaseModeOptions = useMemo(
    () => [
      { value: RELEASE_NOTE_MODES.simplified, label: simplifiedLabel },
      { value: RELEASE_NOTE_MODES.detailed, label: detailedLabel },
    ],
    [detailedLabel, simplifiedLabel],
  )

  return {
    emptyBody,
    emptyDescription,
    emptyTitle,
    releaseDescription,
    releaseModeOptions,
    releaseOpenNavLabel,
    packageFilterLabel,
    releaseTreeLabel,
    releaseViewLabel,
    searchLabel,
  }
}

function ReleaseItemCard({ line, searchTokens = [] }) {
  const text = line.replace(/^-\s+/, '')
  const isSubheading = text.startsWith('#### ')

  return (
    <Card shadow="xs">
      {isSubheading ? (
        <Heading as="h4" size="xs">
          {renderInlineMarkdown(text.replace(/^####\s+/, ''), searchTokens)}
        </Heading>
      ) : (
        <Paragraph size="sm" color="muted">
          {renderInlineMarkdown(text, searchTokens)}
        </Paragraph>
      )}
    </Card>
  )
}

function ReleaseGroup({ group, searchTokens = [] }) {
  return (
    <Stack direction="column" gap="sm">
      {group.title && <Heading as="h3" size="sm">{renderInlineMarkdown(group.title, searchTokens)}</Heading>}
      {group.content.map((line, index) => (
        <ReleaseItemCard key={`${index}-${line}`} line={line} searchTokens={searchTokens} />
      ))}
    </Stack>
  )
}

function ReleaseSection({ release, searchTokens = [] }) {
  return (
    <Stack direction="column" gap="md">
      <Stack direction="column" gap="xs">
        {release.source?.label && (
          <Paragraph size="xs" color="muted">
            {renderHighlightedText(release.source.label, searchTokens, `${release.id}-source`)}
          </Paragraph>
        )}
        <Heading as="h2" size={{ xs: 'md', md: 'lg' }}>
          {renderInlineMarkdown(release.version, searchTokens)}
        </Heading>
        {release.date && (
          <Paragraph size="sm" color="muted">
            Released {renderHighlightedText(release.date, searchTokens, `${release.id}-date`)}
          </Paragraph>
        )}
      </Stack>
      <Stack direction="column" gap="md">
        {release.groups.map((group) => (
          <ReleaseGroup key={group.title || group.content.join('|')} group={group} searchTokens={searchTokens} />
        ))}
      </Stack>
    </Stack>
  )
}

export function ReleasesSidebar({
  mode = DEFAULT_RELEASE_NOTE_MODE,
  sourceId,
  onSourceChange,
  search = '',
  onSearchChange,
  selectedReleaseId,
  onSelectRelease,
  open = false,
  onClose,
}) {
  const {
    packageFilterLabel,
    releaseTreeLabel,
    searchLabel,
  } = useReleaseLabels(mode)
  const { activeSources, activeSourceId, filteredReleases } = useReleaseView(mode, search, sourceId)
  const releaseTreeItems = useMemo(
    () => filteredReleases.map((release) => ({
      id: release.id,
      label: release.version,
      icon: release.id.endsWith('-upcoming') ? 'schedule' : 'new_releases',
    })),
    [filteredReleases],
  )

  function handleSourceChange(nextSourceId) {
    onSourceChange?.(nextSourceId)
    onSelectRelease?.(null)
  }

  const header = (
    <Stack direction="column" gap="sm">
      {activeSources.length > 1 && (
        <ChipGroup
          label={packageFilterLabel}
          selectionMode="single"
          value={activeSourceId}
          onChange={handleSourceChange}
          size="sm"
        >
          {activeSources.map((source) => (
            <Chip key={source.id} value={source.id} icon={source.icon}>
              {source.label}
            </Chip>
          ))}
        </ChipGroup>
      )}
      <SearchField
        data-a1-page-search=""
        aria-label={searchLabel}
        size="compact"
        value={search}
        onChange={(event) => onSearchChange?.(event.target.value)}
      />
    </Stack>
  )

  return (
    <SideNav
      className="a1-web-releases-tree"
      header={header}
      open={open}
      onClose={onClose}
      collapsed={false}
      collapseButtonPlacement="none"
    >
      <TreeMenu
        aria-label={releaseTreeLabel}
        items={releaseTreeItems}
        selectedId={selectedReleaseId}
        onSelect={onSelectRelease}
      />
    </SideNav>
  )
}

export function Releases({
  onNavigate,
  mode = DEFAULT_RELEASE_NOTE_MODE,
  onModeChange,
  sourceId,
  onSourceChange,
  search = '',
  selectedReleaseId,
  onSelectRelease,
  onOpenSidebar,
}) {
  const [localSelectedReleaseId, setLocalSelectedReleaseId] = useState(null)
  const activeRelease = selectedReleaseId ?? localSelectedReleaseId
  const {
    emptyBody,
    emptyDescription,
    emptyTitle,
    releaseModeOptions,
    releaseOpenNavLabel,
    releaseDescription,
    releaseViewLabel,
  } = useReleaseLabels(mode)
  const { activeSourceId, releases, filteredReleases, searchTokens } = useReleaseView(mode, search, sourceId)
  const isSearching = searchTokens.length > 0
  const visibleRelease = filteredReleases.find((release) => release.id === activeRelease) ?? filteredReleases[0] ?? null
  const visibleReleases = isSearching ? filteredReleases : (visibleRelease ? [visibleRelease] : [])
  const sideNavIsOverlay = useMediaQuery('(max-width: 1024px)')

  function updateSelectedRelease(id) {
    if (selectedReleaseId === undefined) setLocalSelectedReleaseId(id)
    onSelectRelease?.(id)
  }

  useEffect(() => {
    if (activeSourceId !== sourceId) onSourceChange?.(activeSourceId)
    if (filteredReleases.length === 0) {
      updateSelectedRelease(null)
      return
    }
    if (!filteredReleases.some((release) => release.id === activeRelease)) {
      updateSelectedRelease(filteredReleases[0].id)
    }
  }, [activeRelease, activeSourceId, filteredReleases, sourceId])

  if (releases.length === 0) {
    return (
      <PageTitleArea
        contentWidth="md"
        headingId="releases-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Releases' },
        ]}
        title="Releases"
        description={emptyDescription}
        actions={(
          <>
            <SegmentedControl
              aria-label={releaseViewLabel}
              size="compact"
              value={mode}
              onChange={onModeChange}
              options={releaseModeOptions}
            />
            {sideNavIsOverlay && onOpenSidebar ? (
              <Button icon="menu_open" variant="secondary" onClick={onOpenSidebar}>
                {releaseOpenNavLabel}
              </Button>
            ) : null}
          </>
        )}
      />
    )
  }

  return (
    <>
      <PageTitleArea
        contentWidth="md"
        headingId="releases-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Releases' },
        ]}
        title="Releases"
        description={releaseDescription}
        actions={(
          <>
            <SegmentedControl
              aria-label={releaseViewLabel}
              size="compact"
              value={mode}
              onChange={onModeChange}
              options={releaseModeOptions}
            />
            {sideNavIsOverlay && onOpenSidebar ? (
              <Button icon="menu_open" variant="secondary" onClick={onOpenSidebar}>
                {releaseOpenNavLabel}
              </Button>
            ) : null}
          </>
        )}
      />

      <Section padding="sm" contentWidth="md" aria-label="Release notes">
        {visibleReleases.length === 0 ? (
          <Card shadow="xs">
            <Stack direction="column" gap="xs">
              <Heading as="h2" size="sm">{emptyTitle}</Heading>
              <Paragraph size="sm" color="muted">
                {emptyBody.replace('{query}', search.trim())}
              </Paragraph>
            </Stack>
          </Card>
        ) : (
          <Stack direction="column" gap="md">
            {visibleReleases.map((release) => (
              <ReleaseSection key={release.id} release={release} searchTokens={searchTokens} />
            ))}
          </Stack>
        )}
      </Section>
    </>
  )
}
