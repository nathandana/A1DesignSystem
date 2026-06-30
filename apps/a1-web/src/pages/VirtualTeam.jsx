import {
  Breadcrumb,
  Grid,
  Heading,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { VirtualArchitectPanel } from '../backlog/VirtualArchitectPanel'
import { VirtualDataPanel } from '../backlog/VirtualDataPanel'
import { VirtualDesignerPanel } from '../backlog/VirtualDesignerPanel'
import { VirtualIconPanel } from '../backlog/VirtualIconPanel'
import { VirtualTeamPanel } from '../backlog/VirtualTeamPanel'
import { useT } from '../labels/useT'

export function VirtualTeam({ onNavigate, onOpenProject }) {
  const t = useT()
  return (
    <>
      <Section
        padding="xs"
        contentWidth="xl"
        surface="panel"
        borderSize="sm"
        borderVariant="accent"
        borderSides="bottom"
      >
        <Stack gap="xs">
          <Breadcrumb
            items={[
              { label: t('label.app.page.home', 'Home'), href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
              { label: t('label.app.page.virtualTeam', 'Virtual team') },
            ]}
          />
          <Stack direction="row" gap="sm" align="center" wrap>
            <Heading as="h1" size={{ xs: 'lg', md: 'xxl' }}>{t('label.app.page.virtualTeam', 'Virtual team')}</Heading>
            <MessageBadge status="warn" subtle size="sm">{t('label.app.virtualTeam.devOnly', 'Dev only')}</MessageBadge>
          </Stack>
          <Paragraph size="sm" color="muted">
            {t('label.app.virtualTeam.subtitle', 'Local teammates for product, information architecture, design, and project data. Preview their recommendations before applying changes or filing tickets.')}
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="md" contentWidth="xl" aria-label={t('label.app.virtualTeam.membersLabel', 'Virtual team members')}>
        <Grid columns={{ xs: 1, lg: 2 }} gap="md" alignItems="start">
          <VirtualTeamPanel />
          <VirtualArchitectPanel />
          <VirtualDesignerPanel />
          <VirtualDataPanel onOpenProject={onOpenProject} />
          <VirtualIconPanel />
        </Grid>
      </Section>
    </>
  )
}
