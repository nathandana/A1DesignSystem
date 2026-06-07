import { Heading, MessageBadge, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

export function Templates() {
  return (
    <Section padding="lg" aria-labelledby="templates-heading">
      <Stack direction="column" gap="sm">
        <MessageBadge subtle icon="dashboard_customize">Templates</MessageBadge>
        <Heading as="h1" id="templates-heading" type="display" size={{ xs: 'xl', md: 'xxl' }}>
          Templates
        </Heading>
        <Paragraph size="lg" color="muted">
          Coming soon.
        </Paragraph>
      </Stack>
    </Section>
  )
}
