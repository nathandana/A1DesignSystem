import { Heading, MessageBadge, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

export function Components() {
  return (
    <Section padding="lg" aria-labelledby="components-heading">
      <Stack direction="column" gap="sm">
        <MessageBadge subtle icon="widgets">Components</MessageBadge>
        <Heading as="h1" id="components-heading" type="display" size={{ xs: 'xl', md: 'xxl' }}>
          Components
        </Heading>
        <Paragraph size="lg" color="muted">
          Coming soon.
        </Paragraph>
      </Stack>
    </Section>
  )
}
