import {
  Banner,
  Button,
  ButtonContainer,
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
import { getFoundationBreadcrumbItems } from './utils.js'

const FIGMA_LIBRARY_URL = 'https://www.figma.com/design/zFjqo3SwHbkXwtCOoQCVMA/A1-Design-System'

const pluginModes = [
  {
    title: 'Build & Fix',
    icon: 'construction',
    body: 'Add governed A1 assets, convert compatible selections, edit supported component properties in context, and apply focused repairs without recreating the design by hand.',
  },
  {
    title: 'Audit',
    icon: 'fact_check',
    body: 'Inspect the current selection for A1 compatibility, jump directly to affected layers, ignore intentional exceptions, or print a design-system report card onto the canvas.',
  },
  {
    title: 'Publish',
    icon: 'publish',
    body: 'Preview structured JSON in the local Playground, create responsive breakpoint views, and explicitly sync linked project pages between Figma and the local A1 workspace.',
  },
  {
    title: 'Patterns',
    icon: 'dashboard_customize',
    body: 'Import an A1 pattern as a local component set with breakpoint variants, refresh it from A1, or push the edited primary variant back into the local pattern library.',
  },
  {
    title: 'JSON workspace',
    icon: 'data_object',
    body: 'Export a supported selection, inspect or edit its A1 page-definition JSON, render it on the canvas, update a compatible selection, or open the same payload in a1-web.',
  },
]

const boundaryItems = [
  'Event handlers, navigation behavior, portals, live data, and application state remain runtime-owned.',
  'Keyboard interaction, announcements, and other browser semantics are validated in React rather than inferred from a static Figma frame.',
  'Unsupported values stay in JSON when possible and produce a visible warning instead of a silent visual approximation.',
  'Automatic merge and conflict resolution are outside the linked-page proof of concept; page sends are explicit in either direction.',
]

export function FigmaPluginFoundationPage({ onNavigate }) {
  return (
    <>
      <PageTitleArea
        headingId="figma-plugin-heading"
        breadcrumbItems={getFoundationBreadcrumbItems('A1:Figma plugin', onNavigate)}
        title="A1:Figma plugin"
        description="A practical bridge for building with A1 assets, checking design-system compatibility, and exchanging structured pages, patterns, and component data between Figma and the local A1 workspace."
      >
        <Button
          as="a"
          href={FIGMA_LIBRARY_URL}
          target="_blank"
          rel="noopener noreferrer"
          icon="open_in_new"
          iconPosition="end"
        >
          Open the Figma library
        </Button>
      </PageTitleArea>

      <Section padding="sm" contentWidth="xl" aria-labelledby="figma-plugin-modes-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="figma-plugin-modes-heading" size={{ xs: 'lg', md: 'xl' }}>
              One workbench, five focused modes
            </Heading>
            <Paragraph color="muted">
              A1:Figma keeps creation, review, publishing, and low-level JSON inspection in one plugin while making each action explicit.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="md">
            {pluginModes.map((mode) => (
              <Card key={mode.title} icon={mode.icon}>
                <Stack gap="xs">
                  <Heading as="h3" size="md">{mode.title}</Heading>
                  <Paragraph size="sm" color="muted">{mode.body}</Paragraph>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" surface="panel" aria-labelledby="figma-round-trip-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="figma-round-trip-heading" size={{ xs: 'lg', md: 'xl' }}>
              The round trip
            </Heading>
            <Paragraph color="muted">
              The shared contract is A1 page-definition JSON: a readable description of supported components, properties, content, and layout.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, md: 2 }} gap="lg">
            <Stack gap="sm">
              <MessageBadge status="info">Figma → A1</MessageBadge>
              <List as="ol" size="sm">
                <ListItem>Select an A1 component, styled text layer, Stack, Grid, or a frame containing supported content.</ListItem>
                <ListItem>Review the automatically generated node, bundle, page, or project JSON.</ListItem>
                <ListItem>Open a compatible configurator or the JSON Playground for validation and editing.</ListItem>
                <ListItem>For linked pages, send the selected Figma root back as a normal A1 page-history entry.</ListItem>
              </List>
            </Stack>

            <Stack gap="sm">
              <MessageBadge status="success">A1 → Figma</MessageBadge>
              <List as="ol" size="sm">
                <ListItem>Start the local bridge and keep the A1:Figma plugin open in the target file.</ListItem>
                <ListItem>Send validated component, page, project, pattern, or image-reference data from A1.</ListItem>
                <ListItem>Render a new composition or update a compatible selected instance in place.</ListItem>
                <ListItem>Review warnings for properties that remain owned by the browser runtime.</ListItem>
              </List>
            </Stack>
          </Grid>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" aria-labelledby="figma-plugin-boundaries-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="figma-plugin-boundaries-heading" size={{ xs: 'lg', md: 'xl' }}>
              Honest boundaries
            </Heading>
            <Paragraph color="muted">
              The plugin preserves the parts Figma can represent and names the parts that must stay with production code.
            </Paragraph>
          </Stack>

          <List icon="check" size="sm">
            {boundaryItems.map((item) => <ListItem key={item}>{item}</ListItem>)}
          </List>

          <Banner status="info" title="Local by design">
            Playground handoffs and linked-page sync use the localhost bridge. Queues are held in memory for five minutes, the plugin must be opened manually, and the bridge does not contact Figma or A1 cloud services.
          </Banner>
        </Stack>
      </Section>

      <Section padding="sm" contentWidth="xl" surface="raised" aria-labelledby="figma-plugin-development-heading">
        <Stack gap="lg">
          <Stack gap="xs">
            <Heading as="h2" id="figma-plugin-development-heading" size={{ xs: 'lg', md: 'xl' }}>
              Local development
            </Heading>
            <Paragraph color="muted">
              Import <code className="a1-web-token-code">packages/figma/plugins/a1-json/manifest.json</code> through Figma’s development plugin menu. Source lives in <code className="a1-web-token-code">src/</code>; generated plugin artifacts live in <code className="a1-web-token-code">dist/</code>.
            </Paragraph>
          </Stack>

          <Grid columns={{ xs: 1, md: 3 }} gap="md">
            <Card>
              <Stack gap="xs">
                <Heading as="h3" size="sm">Build</Heading>
                <Paragraph size="sm"><code className="a1-web-token-code">npm run build --workspace=@gtivr4/a1-design-system-figma</code></Paragraph>
              </Stack>
            </Card>
            <Card>
              <Stack gap="xs">
                <Heading as="h3" size="sm">Watch</Heading>
                <Paragraph size="sm"><code className="a1-web-token-code">npm run watch --workspace=@gtivr4/a1-design-system-figma</code></Paragraph>
              </Stack>
            </Card>
            <Card>
              <Stack gap="xs">
                <Heading as="h3" size="sm">Release check</Heading>
                <Paragraph size="sm"><code className="a1-web-token-code">npm run check --workspace=@gtivr4/a1-design-system-figma</code></Paragraph>
              </Stack>
            </Card>
          </Grid>

          <ButtonContainer align="start">
            <Button
              as="a"
              variant="secondary"
              href={FIGMA_LIBRARY_URL}
              target="_blank"
              rel="noopener noreferrer"
              icon="design_services"
            >
              View A1 in Figma
            </Button>
          </ButtonContainer>
        </Stack>
      </Section>
    </>
  )
}
