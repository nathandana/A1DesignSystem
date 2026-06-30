import { useMemo, useState } from 'react'
import {
  Card,
  Code,
  Heading,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@gtivr4/a1-design-system-react'
import changelogMarkdown from '../../CHANGELOG.md?raw'
import { PageTitleArea } from './PageTitleArea.jsx'

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
      // A `### ` group leads with its heading text. A flat preamble (a plain
      // bullet list with no `### ` heading) has none — its first line is a
      // bullet, so don't promote it to a title; treat every line as content.
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

// Order for the release tabs: Upcoming first, then dated releases newest-first,
// then undated (legacy) entries by version descending. The changelog file isn't
// strictly ordered and mixes `vX` / `X` series, so sort rather than trust order.
function compareReleases(a, b) {
  if (a.id === 'upcoming') return -1
  if (b.id === 'upcoming') return 1
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

function parseChangelog(markdown) {
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

      // Surface the Unreleased section as an "Upcoming" tab (no date).
      const { version, date } = isUnreleased
        ? { version: 'Upcoming', date: null }
        : parseReleaseHeading(title)
      return {
        id: isUnreleased ? 'upcoming' : createReleaseId(version),
        title,
        version,
        date,
        groups: parsePromptGroups(body),
      }
    })
    .filter(Boolean)
    .sort(compareReleases)

  // De-duplicate ids (the changelog has more than one `0.2.0`) so tab values stay unique.
  const seen = new Map()
  for (const release of releases) {
    const count = (seen.get(release.id) ?? 0) + 1
    seen.set(release.id, count)
    if (count > 1) release.id = `${release.id}-${count}`
  }

  return releases
}

function renderMarkdownLine(line, index) {
  if (line.startsWith('#### ')) {
    return (
      <Heading key={index} as="h4" size="xs">
        {line.replace(/^####\s+/, '')}
      </Heading>
    )
  }

  return (
    <Paragraph key={index} size="sm" color="muted">
      {line}
    </Paragraph>
  )
}

function ReleaseGroup({ group }) {
  const bullets = group.content.filter((line) => line.startsWith('- '))
  const otherLines = group.content.filter((line) => !line.startsWith('- '))

  return (
    <Card shadow="xs">
      <Stack direction="column" gap="sm">
        {group.title && <Heading as="h3" size="sm">{group.title}</Heading>}
        {otherLines.length > 0 && (
          <Stack direction="column" gap="xs">
            {otherLines.map(renderMarkdownLine)}
          </Stack>
        )}
        {bullets.length > 0 && (
          <List>
            {bullets.map((line, index) => (
              <ListItem key={index}>{line.replace(/^-\s+/, '')}</ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Card>
  )
}

export function Releases({ onNavigate }) {
  const releases = useMemo(() => parseChangelog(changelogMarkdown), [])
  const [activeRelease, setActiveRelease] = useState(() => releases[0]?.id)

  if (releases.length === 0) {
    return (
      <PageTitleArea
        headingId="releases-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Releases' },
        ]}
        title="Releases"
        description="No published releases are listed in the changelog yet."
      />
    )
  }

  return (
    <>
      <PageTitleArea
        headingId="releases-heading"
        breadcrumbItems={[
          { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Releases' },
        ]}
        title="Releases"
        description={<>Published changes from the A1 web changelog. Each release tab is generated from <Code variant="inline">apps/a1-web/CHANGELOG.md</Code>.</>}
      />

      <Section padding="sm" contentWidth="md" aria-label="Release notes">
        <Tabs value={activeRelease} onChange={setActiveRelease}>
          <TabList>
            {releases.map((release) => (
              <Tab key={release.id} value={release.id}>
                {release.version}
              </Tab>
            ))}
          </TabList>
          {releases.map((release) => (
            <TabPanel key={release.id} value={release.id}>
              <Stack direction="column" gap="md">
                <Stack direction="column" gap="xs">
                  <Heading as="h2" size={{ xs: 'md', md: 'lg' }}>
                    {release.version}
                  </Heading>
                  {release.date && (
                    <Paragraph size="sm" color="muted">
                      Released {release.date}
                    </Paragraph>
                  )}
                </Stack>
                <Stack direction="column" gap="sm">
                  {release.groups.map((group) => (
                    <ReleaseGroup key={group.title} group={group} />
                  ))}
                </Stack>
              </Stack>
            </TabPanel>
          ))}
        </Tabs>
      </Section>
    </>
  )
}
