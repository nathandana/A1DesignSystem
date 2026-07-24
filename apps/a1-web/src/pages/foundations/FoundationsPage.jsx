import {
  Card,
  Grid,
  Heading,
  List,
  ListItem,
  MessageBadge,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { foundations } from './data.js'

export function Foundations({ onNavigate }) {
  return (
    <>
      <PageTitleArea
        headingId="foundations-heading"
        breadcrumbItems={[
          { href: '/', label: 'Home', onClick: (e) => { e?.preventDefault?.(); onNavigate?.('home') } },
          { label: 'Foundations' },
        ]}
        title="Foundations"
        description="Foundations define the shared language for visual decisions, layout, content, accessibility, and the Figma workflows that connect design assets to implementation."
      />

      <Section padding="sm" contentWidth="xl" aria-labelledby="foundation-list-heading">
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading as="h2" id="foundation-list-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Start with the shared system.
            </Heading>
            <Paragraph size="sm" color="muted" className="a1-web-section-body">
              Explore the primitives, standards, visualizations, and cross-tool workflows that every A1 package and product surface builds on.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
            {foundations.map((foundation) => (
              <Card
                key={foundation.id}
                variant="navigation"
                href={`/foundations/${foundation.id.slice('foundation-'.length)}`}
                icon={foundation.icon}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate?.(foundation.id)
                }}
              >
                <Stack direction="column" gap="sm">
                  <Heading as="h3" size="md">
                    {foundation.title}
                  </Heading>
                  <Paragraph size="sm" color="muted">
                    {foundation.body}
                  </Paragraph>
                  <List icon="check" size="sm" color="muted">
                    {foundation.points.map((point) => (
                      <ListItem key={point}>{point}</ListItem>
                    ))}
                  </List>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>
    </>
  )
}
