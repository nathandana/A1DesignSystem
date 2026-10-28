import {
  Grid,
  PageTitle,
  Section,
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
      <PageTitle
        breadcrumb={[
          { label: t('label.app.page.home', 'Home'), href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
          { label: t('label.app.page.virtualTeam', 'Virtual team') },
        ]}
        title={t('label.app.page.virtualTeam', 'Virtual team')}
        meta={[{ label: t('label.app.virtualTeam.devOnly', 'Dev only'), status: 'warn' }]}
        description={t('label.app.virtualTeam.subtitle', 'Local teammates for product, information architecture, design, and project data. Preview their recommendations before applying changes or filing tickets.')}
      />

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
