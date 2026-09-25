import {
  Blockquote, Card, Cluster, Divider, Figure, Grid, GridItem, Heading, HeadingMark, Link, List, ListItem,
  Paragraph, Section, Stack, Stat,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function FondueStudy() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>← Home</Link>
        </Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          I turned Fondue into a system teams could <HeadingMark>trust and use</HeadingMark>.
        </Heading>
        <Paragraph size="lg">The objective was to make shared components easier to find, apply and maintain across Centene’s healthcare experiences.</Paragraph>
        <Grid columns={{ xs: 1, md: 3 }} gap="lg" alignItems="center">
          <GridItem>
            <Figure src={`${getRouteBase()}/img/fondue-logo.png`} alt="Fondue Design System" />
          </GridItem>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Grid columns={{ xs: 1, sm: 2 }} gap="lg">
              <Card icon="work">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">Role</Paragraph>
                  <Paragraph size="lg"><strong>Design Systems Lead</strong></Paragraph>
                </Stack>
              </Card>
              <Card icon="calendar_month">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">Timeline</Paragraph>
                  <Paragraph size="lg"><strong>2023–2026</strong></Paragraph>
                </Stack>
              </Card>
              <Card icon="center_focus_strong">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">Focus</Paragraph>
                  <Paragraph size="lg">Figma, accessibility and adoption</Paragraph>
                </Stack>
              </Card>
                <Card>
                  <Stat size="lg" value={46} description="Components in the inventory." />
                </Card>
                {/* DRAFT / UNVERIFIED: The team count and time-saving result still need verification. */}
                <Card>
                  <Stat size="lg" value={25} description="Product teams supported by the system" />
                  <Paragraph size="sm" color="muted">Both secure and insecure experiences as well as native applications.</Paragraph>
                </Card>
                <Card>
                  <Stat size="lg" value={40} format="percent" description="Less time spent assembling common screens" />
                  <Paragraph size="sm" color="muted">*Based on an internal research study of 10 product teams.</Paragraph>
                </Card>
            </Grid>
          </GridItem>
        </Grid>
      </Section>

      <Section id="context" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">01 / The organization</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Centene’s scale makes consistency a practical requirement.</Heading>
              <Paragraph size="lg">Centene provides health coverage through Medicaid, Medicare and marketplace plans. Nate Bauer’s case study describes an organization with more than 74,000 employees, ranked No. 22 on the Fortune 500 at the time of writing.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="challenge" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">02 / The challenge</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>The library needed a clearer way to work before it could scale.</Heading>
              <Paragraph size="lg">Fondue had grown without enough structure around its components, documentation, or support model. Designers struggled to find and confidently use components, accessibility support created bottlenecks, and the system was not closely aligned with engineering. Adoption remained limited because teams lacked a shared process for working with the system.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="process" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">03 / Process</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>I established workflows that made the library easier to find, use and support.</Heading>
              <Paragraph>I reorganized the Figma library around clearer component structure and naming, then expanded documentation with usage guidance, customization options, and examples. The goal was to make the system understandable without requiring designers to rely on the design system team for every decision.</Paragraph>
              <Paragraph>I also created a more direct support model through office hours, dedicated support channels, video tutorials, and live Q&amp;A sessions. At the same time, I worked more closely with product, engineering, and accessibility partners to establish shared expectations around how components were designed, documented, implemented, and supported.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="relationships" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">04 / Relationships</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Earlier collaboration brought product, engineering and accessibility into the same component decisions.</Heading>
              <Paragraph>Design, product, engineering and accessibility often addressed component questions separately. I set up regular working sessions with the product owner and development lead to agree on priorities, clarify implementation constraints and resolve questions before handoff.</Paragraph>
              <Paragraph>Accessibility partners had often been consulted late. I brought them into component decisions earlier through regular reviews and check-ins. Designers received guidance while their work was still flexible, and accessibility concerns could be addressed before implementation.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="tokens" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">05 / Token approach</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Tokens turn design decisions into reusable system rules.</Heading>
              <Paragraph>Primitive values establish the available choices, semantic tokens give those choices meaning, and component tokens apply them consistently across Figma and code. This creates a shared foundation for color, spacing, typography, radius, elevation, and motion while making themes, brands, and modes easier to manage without rebuilding components.</Paragraph>
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Fondue’s token model later informed my work with AI.</Heading>
              <Paragraph>In A1, I expose approved token values and their semantic roles to agents. Generated interfaces can select from the system’s vocabulary instead of inventing visual decisions for each prompt.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure src={`${getRouteBase()}/img/fondue-token-architecture.png`} alt="Blue Theme A and orange Theme B feed primary.500, which maps to color.action.primary and then button.primary.background. Buttons and links inherit the active theme’s color." caption="Primitive values flow through semantic roles into component tokens, so the same components can adapt to different themes." />
      </Section>

      <Section id="components" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">06 / Component approach</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Simple components are easier to use, maintain, and trust</Heading>
              <Paragraph>I build Figma components with the least amount of structure needed to make them reliable. Unnecessary nesting, excessive variants, and clever workarounds usually create more opportunities for bugs than value. Slots make it possible to keep components like cards intentionally simple, with the component defining the container while rules and patterns govern the content inside. The same principle applies to tokens: they should be introduced when they create meaningful consistency or shared behavior, not just because another layer of abstraction is possible. It is easier to add structure later than to remove complexity once a system depends on it.</Paragraph>
              <Blockquote variant="border" cite="A consistent rule can be corrected once. Inconsistent exceptions have to be found and corrected individually.">Consistently wrong is better than inconsistently right.</Blockquote>
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Figma should reflect the product without trying to reproduce it exactly</Heading>
              <Paragraph>Component names, properties, and terminology should stay aligned with engineering wherever possible so design and development share the same vocabulary, but Figma still needs to support how designers actually work. Not every coded state, property, or component needs a direct Figma equivalent if it slows people down or adds little value. Engineering remains the source of truth for what ultimately ships, while the design system defines that contract collaboratively. The goal is alignment, not duplication: enough parity to make the system clear and predictable, with enough flexibility to keep designers moving.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/fondue-accordion-states.png`}
            alt="Fondue Accordion item variants: collapsed, expanded and expanded without padding, shown in default, hover and active states, plus a disabled collapsed item."
          caption="The Accordion item documents collapsed and expanded configurations, optional content padding and interaction states in one component set."
        />
        <Grid columns={{ xs: 1, md: 2 }} gap="lg">
          <Figure
            src={`${getRouteBase()}/img/fondue-button-v1-properties.png`}
            alt="Deprecated Button V1 properties in Figma: variant, size, state and icon alignment dropdowns; Link-Button, disabled, inverse and Show Focus toggles; and label and icon controls."
            caption="Before — Button V1’s properties panel, with a deprecation notice directing designers to Button V2."
          />
          <Figure
            src={`${getRouteBase()}/img/fondue-button-v2-properties.png`}
            alt="Button V2 properties in Figma showing variant, state, disabled, iconAlign, label, showIcon and showFocus controls. The selected variant is secondary, state is hover and icon alignment is right."
            caption="After — Button V2’s properties panel, with controls for variant, state, disabled behavior, icon alignment, label, icon visibility and focus."
          />
        </Grid>
        <Divider size="lg" />
        <Stack id="component-inventory" gap="md">
          <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Fondue’s inventory spans 46 components across four categories.</Heading>
          <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="lg">
            <Stack gap="sm">
              <Heading as="h4" size="sm">Inputs and controls</Heading>
              <List size="sm">
                <ListItem>Autocomplete</ListItem>
                <ListItem>Button</ListItem>
                <ListItem>Button Group</ListItem>
                <ListItem>Checkbox</ListItem>
                <ListItem>Date Input</ListItem>
                <ListItem>Filter</ListItem>
                <ListItem>Filter Chip</ListItem>
                <ListItem>Radio</ListItem>
                <ListItem>Rating</ListItem>
                <ListItem>Segmented Control</ListItem>
                <ListItem>Select</ListItem>
                <ListItem>Slider</ListItem>
                <ListItem>Switch</ListItem>
                <ListItem>Textarea</ListItem>
                <ListItem>Text Field</ListItem>
                <ListItem>Uploader</ListItem>
              </List>
            </Stack>
            <Stack gap="sm">
              <Heading as="h4" size="sm">Navigation and wayfinding</Heading>
              <List size="sm">
                <ListItem>Accordion</ListItem>
                <ListItem>Breadcrumbs</ListItem>
                <ListItem>Header Bar</ListItem>
                <ListItem>Link</ListItem>
                <ListItem>Menu</ListItem>
                <ListItem>Pagination</ListItem>
                <ListItem>Stepper</ListItem>
                <ListItem>Tabs</ListItem>
              </List>
            </Stack>
            <Stack gap="sm">
              <Heading as="h4" size="sm">Content and structure</Heading>
              <List size="sm">
                <ListItem>Avatar</ListItem>
                <ListItem>Badge</ListItem>
                <ListItem>Banner</ListItem>
                <ListItem>Block</ListItem>
                <ListItem>Card</ListItem>
                <ListItem>Carousel <em>(proposed AEM only)</em></ListItem>
                <ListItem>Data Table</ListItem>
                <ListItem>Description List</ListItem>
                <ListItem>Divider</ListItem>
                <ListItem>Footer</ListItem>
                <ListItem>Icon</ListItem>
                <ListItem>Image</ListItem>
                <ListItem>List</ListItem>
                <ListItem>Text</ListItem>
                <ListItem>Text List</ListItem>
              </List>
            </Stack>
            <Stack gap="sm">
              <Heading as="h4" size="sm">Feedback and overlays</Heading>
              <List size="sm">
                <ListItem>Action Sheet</ListItem>
                <ListItem>Empty State</ListItem>
                <ListItem>Icon Button</ListItem>
                <ListItem>Modal</ListItem>
                <ListItem>Progress</ListItem>
                <ListItem>Skeleton</ListItem>
                <ListItem>Snackbar</ListItem>
              </List>
            </Stack>
          </Grid>
        </Stack>
      </Section>

      <Section id="accessibility" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">07 / Accessibility</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Accessibility became part of the component conversation from the start.</Heading>
              <Paragraph>I added internal audits, component checklists and designer training to the workflow, and accessibility partners joined component reviews earlier. This gave designers a defined way to identify issues, request help and address concerns before handoff.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure src={`${getRouteBase()}/img/fondue-ally.png`} alt="Fondue components with grayscale and vision simulation overlays" caption="Figma overlays simulate grayscale, low vision and blurred vision to help teams notice issues with contrast and text size. They complement keyboard and assistive technology testing." />
      </Section>

      <Section id="documentation" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">08 / Documentation and adoption</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Examples made the system’s rules easier to apply in real work.</Heading>
              <Paragraph>I organized component documentation around usage guidance, customization options, annotated anatomy, and migration instructions. FonDos and FonDon’ts turned common recommendations into examples designers could scan and apply.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/fondue-accordion-documentation.png`}
 size="xl"
  align="center"
          alt="Fondue Accordion documentation with an overview, version 2 migration instructions and an annotated diagram identifying mandatory and optional items, interactive and expanded areas, and sizing behavior."
          caption="Accordion documentation combines usage guidance, version migration instructions and annotated component anatomy, including required content and layout behavior."
        />
        <Figure src={`${getRouteBase()}/img/fondont.png`} size="xl"
  align="center"
 alt="Fondue’s FonDos and FonDon’ts documentation comparing recommended and discouraged design choices" caption="Guidelines in Fondue are known as FonDos and FonDon'ts. They showcase examples of what to do and what not to do when using the design system. FonDos and FonDon’ts turn guidance into visual decisions a designer can scan and reuse." />
  <Divider size="lg" color="accent" />

        <Stack id="changelog" gap="md">
          <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Release notes made system changes visible.</Heading>
          <Paragraph>I maintained a changelog that recorded new recipes, fixes, page slots, and deprecations with contributors, ticket references, and modification dates. This gave teams one place to understand what changed between releases.</Paragraph>
          <Figure
           size="xl"
  align="center"

            src={`${getRouteBase()}/img/fondue-changelog.png`}
            alt="Fondue changelog organized into releases 1.260410, 1.260402, 1.260327 and 1.260320. Entries document new recipes, layout fixes, page slots and deprecated patterns, with contributors, ticket references and modification dates."
            caption="Release-by-release entries record what changed, who contributed and which patterns were added, fixed or deprecated."
          />
        </Stack>
      </Section>

      <Section id="recipes" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">09 / Recipes</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Recipes establish shared patterns for putting components together.</Heading>
              <Paragraph>A second library defines patterns built from Fondue components, including specific card types, titles, common layouts and page templates. These recipes give teams a shared starting point for recurring design needs.</Paragraph>
              <Paragraph>The CTA 7 recipe combines a section title with two vertically stacked call-to-action blocks. Each block brings together an image, title, body copy and link, with layouts defined for different screen widths.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
 size="xl"
  align="center"
          src={`${getRouteBase()}/img/fondue-recipe-cta-7.png`}
          alt="Fondue CTA 7 recipe showing its ingredient list and narrow, medium and wide layouts. Two call-to-action blocks stack vertically; each combines an image, title, body copy and link beneath a shared section title."
          caption="CTA 7 defines both the ingredients and responsive arrangement of a reusable call-to-action pattern."
        />
        <Divider size="lg" />
        <Stack gap="md">
          <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Recipe documentation defines what teams can change and what stays consistent.</Heading>
          <Figure
            src={`${getRouteBase()}/img/fondue-recipe-documentation.png`}
            size="xl"
            align="center"
            alt="Recipe media documentation showing editable icons, fixed 36-pixel and 48-pixel icon sizes, a fixed 16:9 image ratio and responsive card layouts. Extra-large icons and images move from above the content to its left at a card width of 552 pixels."
            caption="Media rules distinguish editable content from locked styling and show how icon and image layouts respond to card width."
          />
        </Stack>
      </Section>

      <Section id="templates" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">10 / Page templates</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>I turned layout guidance into a component teams could apply consistently.</Heading>
              <Paragraph>The page template component was sorely missing from the system when I joined. Each design was using slightly different spacing, breakpoints etc, despite documentation. Codifying as a component ensured that all teams were using the same template, and that it was easy to implement.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure src={`${getRouteBase()}/img/fondue-template.png`}  size="xl"
  align="center"
 alt="Fondue page templates sharing spacing and breakpoint rules across screen sizes" caption="One shared page structure makes consistent layouts easier to repeat." />
      </Section>

      <Section id="example-app" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">11 / Real-world example</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Shared components come together in a preventive care experience.</Heading>
              <Paragraph>This health to-do screen brings together navigation, task cards, buttons, switches and pagination with provider details and scheduled tasks. Shared components and layout patterns give these different parts of the experience a consistent structure.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/fondue-health-todos-example.png`}
          alt="Centene health to-do screen with preventive care task cards, appointment buttons and scheduled-state switches. A sidebar shows primary care provider details and scheduled tasks, with pagination below the task list and support links in the footer."
          caption="Fondue in context: a preventive care screen combines reusable controls, cards and page structure into one experience."
        />
      </Section>

      <Section padding="lg" contentWidth="sm" gap="sm" inverse>
        <Heading as="h2" size="xl">Fondue gave teams a clearer way to design and maintain shared experiences.</Heading>
        <Paragraph size="lg">Fondue gave teams a clearer component library, documented usage guidance, reusable recipes, shared page templates and a visible release history. Earlier accessibility reviews and regular support channels also made the system easier to maintain with product and engineering partners.</Paragraph>
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>Explore more work →</Link>
        </Cluster>
      </Section>
    </article>
  );
}
