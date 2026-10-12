import React, { useEffect } from 'react'
import { Card, Code, Heading, List, ListItem, PageLayout, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'
import { LabsHeader } from './LabsHeader.jsx'
import { parseReleaseNotes } from './release-notes.js'
import changelog from '../CHANGELOG.md?raw'
import { version } from '../package.json'

const releases = parseReleaseNotes(changelog)

function ReleaseEntry({ text }) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>
    if (part.startsWith('`')) return <Code key={index} wrapping>{part.slice(1, -1)}</Code>
    return part
  })
}

export function ReleaseNotesPage({ onOpenSettings }) {
  useEffect(() => { document.title = 'Release notes · A1 Labs' }, [])
  return (
    <PageLayout stickyHeader header={<LabsHeader onOpenSettings={onOpenSettings} current="release-notes" />}>
      <Section contentWidth="md" padding={{ xs: 'sm', md: 'lg' }}>
        <Stack as="section" gap={24} id="release-notes" aria-labelledby="release-notes-heading">
          <Stack gap={8}>
            <Heading as="h1" size="xl" id="release-notes-heading">Release notes</Heading>
            <Paragraph color="muted">What’s changed in Labs, newest first.</Paragraph>
          </Stack>
          {releases.map(release => (
            <Card as="article" key={release.version} aria-labelledby={`release-${release.version}`}>
              <Stack gap={16}>
                <Stack gap={8}>
                  <Heading as="h2" size="md" id={`release-${release.version}`}>Version {release.version}</Heading>
                  <Paragraph size="sm" color="muted">{release.date}{release.version === version ? ' · Current version' : ''}</Paragraph>
                </Stack>
                <List size="sm">
                  {release.entries.map((entry, index) => <ListItem key={index}><ReleaseEntry text={entry} /></ListItem>)}
                </List>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Section>
    </PageLayout>
  )
}
