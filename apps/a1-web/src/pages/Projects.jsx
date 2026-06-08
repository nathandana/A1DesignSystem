import { Heading, MessageBadge, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

export function Projects() {
  return (
    <Section padding="lg" aria-labelledby="projects-heading">
      <Stack direction="column" gap="sm">
        <MessageBadge subtle icon="folder">Projects</MessageBadge>
        <Heading as="h1" id="projects-heading" type="display" size={{ xs: 'xl', md: 'xxl' }}>
          Projects
        </Heading>
        <Paragraph size="lg" color="muted">
          Coming soon.
        </Paragraph>
      </Stack>
    </Section>
  )
}
