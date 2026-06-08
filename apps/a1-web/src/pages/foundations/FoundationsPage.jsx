import {
  Breadcrumb,
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
import { foundations } from './data.js'

export function Foundations({ onNavigate }) {
  return (
    <>
      <Section
        padding="sm"
        surface="panel"
        gradient="accent"
        gradientPosition="top-right"
        contentWidth="xl"
        gap="sm"
        aria-labelledby="foundations-heading"
      >
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { label: 'Foundations' },
            ]}
          />
            <Heading
              as="h1"
              id="color-foundation-heading"
              type="heading"
              size={{ xs: 'xl', md: 'xxl' }}
              textWrap="balance"
            >
              Foundations
            </Heading>
          <Paragraph size="sm" color="muted">
            Foundations define the shared language for color, size, type, shape, motion, elevation, icons, and accessibility across every package.
          </Paragraph>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="foundation-list-heading">
        <Stack gap="lg">
          <Stack gap="sm">
            <Heading as="h2" id="foundation-list-heading" type="display" size={{ xs: 'lg', md: 'xl' }}>
              Start with the primitives.
            </Heading>
            <Paragraph size="sm" color="muted" className="a1-web-section-body">
              Each foundation gets its own page. For now, the child pages are placeholders ready for deeper documentation.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="md">
            {foundations.map((foundation) => (
              <Card
                key={foundation.id}
                variant="navigation"
                href={`/?page=${foundation.id}`}
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
