import {
  Button,
  Card,
  Grid,
  Heading,
  MessageBadge,
  MessageEmptyState,
  Paragraph,
  Section,
  Stack,
} from '@gtivr4/a1-design-system-react'
import { allComponents } from '../components/utils.js'
import { PageTitleArea } from '../PageTitleArea.jsx'
import { getFoundationBreadcrumbItems } from './utils.js'

const FIGMA_LIBRARY_URL = 'https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System'
const figmaComponents = allComponents.filter((component) => component.packages.includes('Figma'))
const figmaCategories = new Set(figmaComponents.map((component) => component.categoryId))

export function FigmaComponentsFoundationPage({ onNavigate }) {
  return (
    <>
      <PageTitleArea
        headingId="figma-components-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('Figma components', onNavigate)}
        title="Figma components"
        description="A dedicated home for embedded views from the published A1 Figma library, organized around the same component inventory used by a1-web."
      >
        <MessageBadge status="info">{figmaComponents.length} components across {figmaCategories.size} categories</MessageBadge>
      </PageTitleArea>

      <Section padding="sm" contentWidth="xl" aria-label="Figma component embeds">
        <Card>
          <MessageEmptyState
            scale="section"
            icon="design_services"
            title="Embedded component views are coming"
            description="This placeholder establishes the route and navigation. It will host focused Figma frames for component sets, properties, examples, modes, and design-to-code mappings."
            action={(
              <Button
                as="a"
                href={FIGMA_LIBRARY_URL}
                target="_blank"
                rel="noopener noreferrer"
                icon="open_in_new"
                iconPosition="end"
              >
                Browse the Figma library
              </Button>
            )}
          />
        </Card>
      </Section>

      <Section padding="sm" contentWidth="xl" surface="panel" aria-labelledby="figma-components-placeholder-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="figma-components-placeholder-heading" size={{ xs: 'lg', md: 'xl' }}>
              What this page will make visible
            </Heading>
            <Paragraph color="muted">
              The embedded views will complement the React component pages without duplicating runtime documentation.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, md: 3 }} gap="md">
            <Card icon="view_module">
              <Stack gap="xs">
                <Heading as="h3" size="md">Published assets</Heading>
                <Paragraph size="sm" color="muted">Browse the component sets and supporting assets available from the A1 Figma library.</Paragraph>
              </Stack>
            </Card>
            <Card icon="tune">
              <Stack gap="xs">
                <Heading as="h3" size="md">Properties and modes</Heading>
                <Paragraph size="sm" color="muted">Inspect variants, component properties, slots, variable bindings, and light or dark mode behavior.</Paragraph>
              </Stack>
            </Card>
            <Card icon="code">
              <Stack gap="xs">
                <Heading as="h3" size="md">Implementation mapping</Heading>
                <Paragraph size="sm" color="muted">Connect each visual asset to its React contract, Code Connect template, and documented runtime-only gaps.</Paragraph>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </Section>
    </>
  )
}
