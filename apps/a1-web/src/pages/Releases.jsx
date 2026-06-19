import { useMemo, useState } from 'react'
import {
  Breadcrumb,
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
      const [rawTitle = '', ...lines] = section.split('\n')
      const title = rawTitle.replace(/^Prompt:\s*/i, '').trim()
      const content = lines
        .map((line) => line.trim())
        .filter(Boolean)

      return { title, content }
    })
}

function parseChangelog(markdown) {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((section) => {
      const [rawTitle = '', ...lines] = section.split('\n')
      const title = rawTitle.trim()
      const body = lines.join('\n').trim()
      const isUnreleased = title.toLowerCase() === 'unreleased'
      const hasReleaseNotes = body && !/^no unreleased changes\.$/i.test(body)

      if (isUnreleased || !hasReleaseNotes) return null

      const { version, date } = parseReleaseHeading(title)
      return {
        id: createReleaseId(version),
        title,
        version,
        date,
        groups: parsePromptGroups(body),
      }
    })
    .filter(Boolean)
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
        <Heading as="h3" size="sm">{group.title}</Heading>
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
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Releases' },
            ]}
          />
          <Heading as="h1" id="releases-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Releases
          </Heading>
          <Paragraph size="sm" color="muted">
            No published releases are listed in the changelog yet.
          </Paragraph>
        </Stack>
      </Section>
    )
  }

  return (
    <>
      <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
        <Stack direction="column" gap="xs">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Releases' },
            ]}
          />
          <Heading as="h1" id="releases-heading" size={{ xs: 'lg', md: 'xxl' }}>
            Releases
          </Heading>
          <Paragraph size="sm" color="muted">
            Published changes from the A1 web changelog. Each release tab is generated from
            <Code variant="inline">apps/a1-web/CHANGELOG.md</Code>.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="lg" aria-label="Release notes">
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
