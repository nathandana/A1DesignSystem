import {
  Card,
  Grid,
  Heading,
  Paragraph,
  Section,
  Stack,
  useLabel,
} from '@gtivr4/a1-design-system-react'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { foundations } from './data.js'

const sortedFoundations = [...foundations].sort((a, b) => a.title.localeCompare(b.title))

function shortDescription(value, maxWords = 10) {
  const words = value.trim().split(/\s+/)
  return words.length > maxWords
    ? `${words.slice(0, maxWords).join(' ').replace(/[,:;]$/, '')}…`
    : value
}

function FoundationCard({ foundation, onNavigate }) {
  const title = useLabel(
    foundation.titleLabelKey ?? `app.foundationTitle.${foundation.id}`,
    foundation.title,
  )
  const body = useLabel(
    foundation.bodyLabelKey ?? `app.foundationDescription.${foundation.id}`,
    foundation.body,
  )

  return (
    <Card
      variant="navigation"
      href={`/foundations/${foundation.id.slice('foundation-'.length)}`}
      icon={foundation.icon}
      onClick={(event) => {
        event.preventDefault()
        onNavigate?.(foundation.id)
      }}
    >
      <Stack gap="xs">
        <Heading as="h3" size="md">
          {title}
        </Heading>
        <Paragraph size="sm" color="muted">
          {shortDescription(body)}
        </Paragraph>
      </Stack>
    </Card>
  )
}

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
            {sortedFoundations.map((foundation) => (
              <FoundationCard
                key={foundation.id}
                foundation={foundation}
                onNavigate={onNavigate}
              />
            ))}
          </Grid>
        </Stack>
      </Section>
    </>
  )
}
