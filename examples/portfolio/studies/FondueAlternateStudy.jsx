import {
  Card, Cluster, Figure, Grid, GridItem, Heading, HeadingMark, Link, List, ListItem,
  Paragraph, Section, Stack, Stat,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function FondueAlternateStudy() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg">
          <Link href={getRoutePath("alternate")}>← Home</Link>
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
                  <Paragraph size="lg">Design Systems Lead</Paragraph>
                </Stack>
              </Card>
              <Card icon="calendar_month">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">Timeline</Paragraph>
                  <Paragraph size="lg">2023–present</Paragraph>
                </Stack>
              </Card>
              <Card icon="center_focus_strong">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">Focus</Paragraph>
                  <Paragraph size="lg">Figma, accessibility and adoption</Paragraph>
                </Stack>
              </Card>
                <Card>
                  <Stat size="lg" value={46} description="Components in the inventory, including the proposed AEM-only Carousel" />
                </Card>
                {/* DRAFT / UNVERIFIED: The team count and time-saving result still need verification. */}
                <Card>
                  <Stat size="lg" value={25} description="Product teams supported by the system" />
                </Card>
                <Card>
                  <Stat size="lg" value={40} format="percent" description="Less time spent assembling common screens" />
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
              {/* Paraphrased from Nate Bauer's historical Centene summary, linked below.
                  Its rank and employee count are reference-era context, not current figures. */}
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
              <Paragraph size="lg">Components were difficult to find, documentation was incomplete and teams lacked a shared process. I reorganized the library and worked with product, engineering and accessibility partners to rebuild alignment around the system.</Paragraph>
              <Paragraph size="lg">When I joined the Fondue design system, the project was struggling with disorganization, inconsistent components, and a lack of collaboration across teams. The design system had little structure, and its adoption was minimal due to the absence of clear processes and communication. Designers faced delays in support, particularly with accessibility, and the system was not aligned with the development team's needs. My role was to play a critical part in addressing these challenges by improving processes, rebuilding relationships, and integrating accessibility. Through these efforts, Fondue has become a cohesive, well-documented, and inclusive design system that plays a central role in the organization's design and development efforts.</Paragraph>
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
              <Paragraph>The first challenge I tackled was the lack of clear processes within the design system. The Figma library was disorganized, components were incomplete, and documentation was sparse, making it difficult for teams to use the system effectively. I quickly introduced structure by establishing standardized workflows, setting clear expectations, and improving documentation.</Paragraph>
              <Paragraph>To bring order to the Figma library, I reorganized the components to make them easy to find and use. Each component was documented with detailed usage guidelines, customization options, and examples to ensure designers could confidently implement them in their work. I also created resources like video tutorials and live Q&amp;A sessions to support designers in using the system and reducing the wait time for support.</Paragraph>
              <Paragraph>Additionally, I introduced office hours and direct support channels, which allowed designers to get quick assistance and helped eliminate bottlenecks in the adoption process. These changes significantly improved efficiency, allowing the design system to become more usable and accessible to all teams.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="relationships" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">04 / Relationships</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Rebuilding trust gave product, engineering and accessibility a shared direction.</Heading>
              <Paragraph>A critical aspect of my role in Fondue was rebuilding relationships, particularly with key stakeholders such as the new product owner and development lead. When I arrived, there was a lack of alignment between design, development, and product teams, leading to confusion and inefficiencies in how the system was being implemented. There was also significant mistrust between the design and accessibility teams, which hindered collaboration.</Paragraph>
              <Paragraph>I worked closely with the newly appointed product owner and development lead to establish a shared vision for the design system. Together, we held regular meetings to ensure alignment and address concerns from all sides, ultimately leading to stronger collaboration and a clearer sense of purpose.</Paragraph>
              <Paragraph>Additionally, I worked hard to repair the relationship with the accessibility team. This team had previously felt sidelined, and their concerns were not always addressed within the system. I made it a priority to include them early in the decision-making process, ensuring that accessibility was integrated into the design from the start. Through regular check-ins and shared goals, I was able to build trust with the accessibility team, which made it easier to meet WCAG standards and provide designers with the tools they needed to create inclusive designs.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        {/* <Figure src="" alt="Shared ownership across design, the product owner, the development lead and accessibility partners" aspectRatio="16:9" caption="Image placeholder — Shared ownership across design, the product owner, the development lead and accessibility partners" /> */}
      </Section>

      <Section id="tokens" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">05 / Token approach</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Tokens turn design decisions into reusable system rules.</Heading>
              <Paragraph>Primitive values establish the available choices, semantic tokens give those choices meaning, and component tokens apply them consistently across Figma and code. This creates a shared foundation for color, spacing, typography, radius, elevation, and motion while making themes, brands, and modes easier to manage without rebuilding components.</Paragraph>
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Tokens also give AI a constrained design vocabulary.</Heading>
              <Paragraph>Instead of allowing AI to invent visual decisions each time, the system gives it approved values, roles, and component behaviors to work from. That improves consistency across generated interfaces, reduces hard-coded styling, and lowers the amount of context needed to produce system-compliant output.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure src={`${getRouteBase()}/img/fondue-token-architecture.png`} alt="Blue Theme A and orange Theme B feed primary.500, which maps to color.action.primary and then button.primary.background. Buttons and links inherit the active theme’s color." caption="Primitive values flow through semantic roles into component tokens, so the same components can adapt to different themes." />
      </Section>

      <Section id="components" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">06 / Component approach · Content placeholder</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Figma components should make the right configuration easy to find.</Heading>
              {/* DRAFT / INVENTED proposed topics, not verified Fondue implementation details.
                  Await the user's component approach and Figma optimization evidence. */}
              <Paragraph>Content to come: reducing unnecessary variants, exposing useful nested properties, simplifying layers and making auto layout behave predictably. Show how these choices improve file performance and help designers configure components without detaching them.</Paragraph>
              <Paragraph size="sm" color="muted">Evidence to add: variant and layer counts, file performance measurements and a real component before and after optimization.</Paragraph>
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
              <Paragraph>I brought accessibility partners into decisions earlier and added audits, checklists and training. Shared reviews gave designers a clearer way to identify issues and get support as they worked.</Paragraph>
              <Paragraph>When I joined Fondue, accessibility had not been adequately prioritized, which created significant gaps in the system. I knew that for the system to be truly effective and inclusive, accessibility had to be a core focus. I worked closely with the accessibility team to integrate accessibility standards into the system and ensure that all components were tested against WCAG guidelines.</Paragraph>
              <Paragraph>I conducted internal audits, created accessibility checklists, and developed training programs for designers to ensure that accessibility considerations were at the forefront of the design process. These efforts resulted in components that were not only more inclusive but also easier for designers to implement, ensuring that accessibility became an integral part of the system rather than an afterthought.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure src={`${getRouteBase()}/img/fondue-ally.png`} alt="Fondue components with grayscale and vision simulation overlays" caption="Each component is accompanied by a set of accessibility overlays. These mimic grayscale, low vision and blurry vision. They ensure we pay attention to critical accessibility issues like color contrast and text size, as well as build empathy. Shared accessibility overlays help teams notice visual issues; they complement contrast, keyboard and assistive technology checks." />
      </Section>

      <Section id="documentation" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">08 / Documentation</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Examples made the system’s rules easier to apply in real work.</Heading>
              <Paragraph>I organized guidance around component usage, customization and examples. Shared page templates translated documented spacing and breakpoint rules into a starting point teams could use directly.</Paragraph>
              <Paragraph>Another area where I made a significant impact was in improving the documentation and knowledge-sharing processes. The previous documentation was disorganized and hard to navigate, which made it difficult for teams to use the system effectively. I overhauled the documentation to create a more structured, comprehensive resource for all teams.</Paragraph>
              <Paragraph>Each component was documented with clear guidelines, usage examples, and customization options. I also created additional resources like video tutorials and live Q&amp;A sessions to help onboard new users and provide ongoing support.</Paragraph>
              <Paragraph>Additionally, by fostering a culture of knowledge sharing, I ensured that designers and developers had the resources they needed to collaborate more effectively. Regular feedback loops and shared learnings helped ensure that the system continued to improve and evolve to meet the needs of the teams using it.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/fondue-accordion-documentation.png`}
          alt="Fondue Accordion documentation with an overview, version 2 migration instructions and an annotated diagram identifying mandatory and optional items, interactive and expanded areas, and sizing behavior."
          caption="Accordion documentation combines usage guidance, version migration instructions and annotated component anatomy, including required content and layout behavior."
        />
        <Figure src={`${getRouteBase()}/img/fondont.png`} alt="Fondue’s FonDos and FonDon’ts documentation comparing recommended and discouraged design choices" caption="Guidelines in Fondue are known as FonDos and FonDon'ts. They showcase examples of what to do and what not to do when using the design system. FonDos and FonDon’ts turn guidance into visual decisions a designer can scan and reuse." />
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
          src={`${getRouteBase()}/img/fondue-recipe-cta-7.png`}
          alt="Fondue CTA 7 recipe showing its ingredient list and narrow, medium and wide layouts. Two call-to-action blocks stack vertically; each combines an image, title, body copy and link beneath a shared section title."
          caption="CTA 7 defines both the ingredients and responsive arrangement of a reusable call-to-action pattern."
        />
        <Stack gap="md">
          <Heading as="h3" size={{ xs: "lg", md: "xl" }}>Recipe documentation defines what teams can change and what stays consistent.</Heading>
          <Figure
            src={`${getRouteBase()}/img/fondue-recipe-documentation.png`}
            alt="Recipe media documentation showing editable icons, fixed 36-pixel and 48-pixel icon sizes, a fixed 16:9 image ratio and responsive card layouts. Extra-large icons and images move from above the content to its left at a card width of 552 pixels."
            caption="Media rules distinguish editable content from locked styling and show how icon and image layouts respond to card width."
          />
        </Stack>
        {/* <Grid columns={{ xs: 1, md: 2 }} gap="lg">
          <Figure src="" alt="Recipe examples for specific card types and titles, to be provided" aspectRatio="16:9" caption="Image placeholder — Card and title recipes" />
          <Figure src="" alt="Recipe examples for common layouts and page templates, to be provided" aspectRatio="16:9" caption="Image placeholder — Layout and page template recipes" />
        </Grid> */}
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
        <Figure src={`${getRouteBase()}/img/fondue-template.png`} alt="Fondue page templates sharing spacing and breakpoint rules across screen sizes" caption="One shared page structure makes consistent layouts easier to repeat." />
      </Section>

      <Section id="adoption" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">11 / Adoption</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>A usable library also needs people who can help teams adopt it.</Heading>
              <Paragraph>Office hours, direct support, video tutorials and live Q&amp;A sessions helped teams get answers and share feedback. Regular conversations with product, engineering and accessibility partners made the system a shared responsibility.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        {/* <Figure src="" alt="A support loop connecting office hours, team feedback, component reviews and release communication" aspectRatio="16:9" caption="Image placeholder — A support loop connecting office hours, team feedback, component reviews and release communication" /> */}
        <Stack id="changelog" gap="md">
          <Heading as="h3" size={{ xs: "lg", md: "xl" }}>The changelog makes additions, fixes and deprecations visible across releases.</Heading>
          <Figure
            src={`${getRouteBase()}/img/fondue-changelog.png`}
            alt="Fondue changelog organized into releases 1.260410, 1.260402, 1.260327 and 1.260320. Entries document new recipes, layout fixes, page slots and deprecated patterns, with contributors, ticket references and modification dates."
            caption="Release-by-release entries record what changed, who contributed and which patterns were added, fixed or deprecated."
          />
        </Stack>
      </Section>

      <Section id="lessons" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">12 / Lessons learned</Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>The system’s usefulness depends on how teams work together.</Heading>
              <Heading as="h3" size="lg">Clear processes and documentation make adoption easier.</Heading>
              <Paragraph>A design system without clear processes and well-organized documentation will struggle to gain adoption. By introducing structure and clarity, I was able to make the system more usable and efficient.</Paragraph>
              <Heading as="h3" size="lg">Shared goals and stronger relationships make collaboration work.</Heading>
              <Paragraph>Successful design systems are built on strong relationships. By working closely with the product owner, development lead, and accessibility team, I was able to align all stakeholders around a shared vision and build trust, which led to better outcomes.</Paragraph>
              <Heading as="h3" size="lg">Accessibility belongs in the process from the beginning.</Heading>
              <Paragraph>Accessibility is not an afterthought—it's a core part of the design process. By integrating accessibility into the system from the beginning, I ensured that the system was inclusive and usable for all users.</Paragraph>
              <Heading as="h3" size="lg">A system needs continuous feedback and improvement.</Heading>
              <Paragraph>A design system is not a static asset; it needs continuous feedback and improvement. By creating a culture of knowledge sharing and regular feedback, I was able to help Fondue evolve and meet the needs of the organization.</Paragraph>
            </Stack>
          </GridItem>
        </Grid>

      </Section>

      <Section id="example-app" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">13 / Real-world example</Heading>
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
        <Heading as="h2" size="xl">The work made Fondue easier to use, support and improve together.</Heading>
        <Paragraph size="lg">Clearer components, practical guidance and stronger relationships gave teams a more dependable starting point. The next step for this case study is to pair that story with verified adoption and efficiency measures.</Paragraph>
              <Paragraph>My involvement in the transformation of the Fondue design system was both challenging and rewarding. By improving processes, rebuilding relationships, and ensuring that accessibility was prioritized, I played a critical role in shaping a design system that is now a central part of the organization's design and development efforts.</Paragraph>
              <Paragraph>Fondue is now a robust, well-supported, and trusted system, thanks to the improvements I made in process, collaboration, and accessibility. By rebuilding relationships with key stakeholders, I was able to align the entire team around a shared vision and create a design system that truly meets the needs of the organization.</Paragraph>
        <Cluster gap="lg">
          <Link href={getRoutePath("alternate")}>Explore more work →</Link>
        </Cluster>
      </Section>
    </article>
  );
}
