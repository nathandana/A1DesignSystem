import { Breadcrumb, Heading, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'

export function Projects({ onNavigate }) {
  return (
    <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
      <Stack direction="column" gap="xs">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
            { label: 'Projects' },
          ]}
        />
        <Heading as="h1" id="projects-heading" size={{ xs: 'lg', md: 'xxl' }}>
          Projects
        </Heading>
        <Paragraph size="sm" color="muted">
          Coming soon.
        </Paragraph>
      </Stack>
    </Section>
  )
}
