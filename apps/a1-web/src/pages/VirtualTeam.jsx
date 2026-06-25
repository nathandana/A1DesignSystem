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
import { VirtualDesignerPanel } from '../backlog/VirtualDesignerPanel'
import { VirtualTeamPanel } from '../backlog/VirtualTeamPanel'

export function VirtualTeam({ onNavigate }) {
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
            Local, deterministic reviewers for product, information architecture, and design.
            Preview their recommendations before applying changes or filing tickets.
          </Paragraph>
        </Stack>
      </Section>

      <Section padding="md" contentWidth="xl" aria-label="Virtual team members">
        <Grid columns={{ xs: 1, lg: 2, xl: 3 }} gap="md" alignItems="start">
          <VirtualTeamPanel />
          <VirtualArchitectPanel />
          <VirtualDesignerPanel />
        </Grid>
      </Section>
    </>
  )
}
