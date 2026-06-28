import { Breadcrumb, Heading, Paragraph, Section, Stack } from '@gtivr4/a1-design-system-react'
import { useT } from '../labels/useT'

export function Projects({ onNavigate }) {
  const t = useT()
  return (
    <Section padding="xs" contentWidth="xl" surface="panel" borderSize="sm" borderVariant="accent" borderSides="bottom">
      <Stack direction="column" gap="xs">
        <Breadcrumb
          items={[
            { label: t('label.app.page.home', 'Home'), href: '/', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
            { label: t('label.app.page.projects', 'Projects') },
          ]}
        />
        <Heading as="h1" id="projects-heading" size={{ xs: 'lg', md: 'xxl' }}>
          {t('label.app.page.projects', 'Projects')}
        </Heading>
        <Paragraph size="sm" color="muted">
          {t('label.app.projects.comingSoon', 'Coming soon.')}
        </Paragraph>
      </Stack>
    </Section>
  )
}
