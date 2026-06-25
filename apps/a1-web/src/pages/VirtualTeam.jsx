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

export function VirtualTeam({ onNavigate, onOpenProject }) {
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
              { label: 'Home', href: '/', onClick: (event) => { event?.preventDefault?.(); onNavigate?.('home') } },
              { label: 'Virtual team' },
            ]}
          />
          <Stack direction="row" gap="sm" align="center" wrap>
            <Heading as="h1" size={{ xs: 'lg', md: 'xxl' }}>Virtual team</Heading>
            <MessageBadge status="warn" subtle size="sm">Dev only</MessageBadge>
          </Stack>
          <Paragraph size="sm" color="muted">
            Local teammates for product, information architecture, design, and project data.
            Preview their recommendations before applying changes or filing tickets.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="md" contentWidth="xl" aria-label="Virtual team members">
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
