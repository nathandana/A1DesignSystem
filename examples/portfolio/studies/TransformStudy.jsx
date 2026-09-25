import {
  Card,
  Cluster,
  Figure,
  Grid,
  GridItem,
  Heading,
  HeadingMark,
  Link,
  List,
  ListItem,
  Paragraph,
  Section,
  Stack,
  Stat,
} from "../../../packages/react/src/index.js";
import { getRouteBase, getRoutePath } from "../utils/routing.js";

export function TransformStudy() {
  return (
    <article>
      <Section padding="md" surface="raised" contentWidth="xl" gap="sm">
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>← Home</Link>
        </Cluster>
        <Heading as="h1" type="display" size={{ xs: "lg", md: "jumbo" }}>
          I grew Transform into a system built for <HeadingMark>enterprise scale</HeadingMark>.
        </Heading>
        <Paragraph size="lg">
          I built Transform from zero into an accessible, documented and adopted design system that was the
          backbone of internal software affecting the health of 20 million Americans.
        </Paragraph>
        <Grid columns={{ xs: 1, md: 3 }} gap="lg" alignItems="center">
          <GridItem>
            <Figure
              src={`${getRouteBase()}/img/transform/transform_cover.png`}
              alt="Transform Design System"
            />
          </GridItem>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Grid columns={{ xs: 1, sm: 2 }} gap="lg">
              <Card icon="work">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Role
                  </Paragraph>
                  <Paragraph size="lg">UX Architect</Paragraph>
                </Stack>
              </Card>
              <Card icon="calendar_month">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Timeline
                  </Paragraph>
                  <Paragraph size="lg">2020–2023</Paragraph>
                </Stack>
              </Card>
              <Card icon="center_focus_strong">
                <Stack gap="xs">
                  <Paragraph size="md" color="muted">
                    Focus
                  </Paragraph>
                  <Paragraph size="lg">Components, accessibility and adoption</Paragraph>
                </Stack>
              </Card>
              <Card>
                <Stat size="lg" value={20000} description="Daily users of TruCare Cloud" />
              </Card>
              <Card>
                <Stat size="lg" value={16} suffix="+" description="Applications integrated" />
              </Card>
              <Card>
                <Stat
                  size="lg"
                  value={40}
                  suffix="+"
                  description="Reusable components built and maintained"
                />
              </Card>
            </Grid>
          </GridItem>
        </Grid>
      </Section>

      <Section id="the-organization" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            01 / The organization
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                TruCare Cloud brings complex healthcare workflows into one application.
              </Heading>
              <Paragraph size="lg">
                I led the creation and evolution of Transform for TruCare Cloud, an internal application used
                for insurance authorization, work management, and long-term services and supports. About 20,000
                Centene employees used TruCare Cloud each day during this work.
              </Paragraph>
              <Paragraph size="lg">
                Transform began as a small component library. Its scope expanded to include reusable patterns,
                contribution and release processes, documentation, and support for the teams building TruCare
                Cloud.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="impact" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            02 / Impact
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Transform supported a growing community of users and product teams.
              </Heading>
              <List variant="unordered" size="lg">
                <ListItem>20,000+ daily users across a Fortune 25 enterprise</ListItem>
                <ListItem>16+ applications integrated</ListItem>
                <ListItem>40+ reusable components built and maintained</ListItem>
                <ListItem>11-person cross-functional team built from a solo effort</ListItem>
                <ListItem>30 designers supported through a dedicated liaison model</ListItem>
                <ListItem>WCAG 2.2 AA compliance achieved across the full component library</ListItem>
              </List>
            </Stack>
          </GridItem>
        </Grid>
      </Section>

      <Section id="team-formation" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            03 / Team formation
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                I grew a solo effort into an 11-person cross-functional team.
              </Heading>
              <Paragraph size="lg">
                I started Transform as the sole UX designer, defining its first components and patterns in
                Sketch. I later moved the library to Figma as the team grew. Material Design informed the early
                component model and its relationship to Angular Material.
              </Paragraph>
              <Paragraph size="lg">
                Four contract developers joined to build the components in Angular using Angular Material. I
                created their backlog, contributed to the codebase, reviewed implementation decisions, and
                helped the first sub-application integrate Transform.
              </Paragraph>
              <Paragraph size="lg">
                We then hired a development lead to manage the technical architecture and expand the team. At
                its peak, Transform had 11 contributors: me as design lead, two UX designers, a development
                lead, four developers, a product owner, a business analyst, and a scrum master. We worked in
                agile sprints with a shared backlog and release process.
              </Paragraph>
              <Figure
                src={`${getRouteBase()}/img/transform/timeline.png`}
                alt="Timeline of Transform's development"
                captionSrOnly
                caption={
                  <>
                    <strong>Transform Timeline</strong>
                    <ul>
                      <li>
                        2020 – Transform Begins
                        <ul>
                          <li>Build Sketch design library</li>
                          <li>Migrate to Figma</li>
                          <li>Initial Code in Angular</li>
                        </ul>
                      </li>
                      <li>
                        2021 – Development
                        <ul>
                          <li>Dev team hired</li>
                          <li>Initial Component Library</li>
                          <li>Rebuild of Member Dashboard</li>
                        </ul>
                      </li>
                      <li>
                        2022 – Expansion
                        <ul>
                          <li>Expanded team, hired designers and lead developer</li>
                          <li>Improved pattern library</li>
                          <li>Built out processes</li>
                        </ul>
                      </li>
                      <li>
                        2023 – Adoption
                        <ul>
                          <li>Enhanced multiple applications</li>
                          <li>Expanded and improved pattern library</li>
                          <li>V2 release</li>
                        </ul>
                      </li>
                    </ul>
                  </>
                }
              />
              <Heading as="h3" size="lg">
                The Pattern Library gave teams one place to understand and implement components.
              </Heading>
              <Paragraph size="lg">
                Users could configure components, review usage examples, read release notes, and copy
                implementation code.
              </Paragraph>
              <Paragraph size="lg">
                Developer feedback informed each release. We also prototyped a page-builder direction for
                arranging coded components into layouts.
              </Paragraph>
              <Paragraph size="lg">
                The Pattern Library used Transform itself, so maintaining it exposed component and
                documentation problems to the system team directly.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/pattern-library.png`}
          alt="Image of the Pattern Library Application interface"
          caption="The Pattern Library lets users configure components, review release notes, and copy implementation code. Building it with Transform also made the system team a direct user of the library."
        />
      </Section>

      <Section id="support-model" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            04 / Support model
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                A dedicated liaison gave every team a clear point of contact.
              </Heading>
              <Paragraph size="lg">
                I initially supported every TruCare Cloud designer directly. As the community grew, I worked
                with leadership to assign each Transform designer to a group of product teams. At its largest,
                the liaison model supported 30 designers. Each product designer had a named contact for design
                reviews, component questions, and feedback.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/support-model.png`}
          alt="Group support model assigning application teams to two Transform designers, with platform teams supported directly by Nathan Dana"
          caption="The liaison model distributed application teams between Transform designers while I continued to support the shared platform teams."
        />
      </Section>

      <Section id="accessibility" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            05 / Accessibility
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Accessibility became part of how we designed, tested and supported components.
              </Heading>
              <Paragraph size="lg">
                I created accessibility reports, added internal component testing, and developed training for
                designers. I also worked with accessibility specialists to define review expectations and apply
                their feedback to component design.
              </Paragraph>
              <Paragraph size="lg">
                Transform began before Centene had a formal accessibility support team. The component library
                later passed internal audits against WCAG 2.2 AA and enterprise requirements. I carried the
                resulting testing and review practices into my work on Fondue.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/accessibility-color-label.png`}
          alt="Comparison showing a card that communicates approved status with color alone and a card that adds an Approved text label"
          caption="This example comes from a training slide deck introducing WCAG 2.2 Success Criterion 1.4.1, Use of Color, and the principle of not using color alone to differentiate status."
        />
      </Section>

      <Section id="lessons-learned" padding="lg" contentWidth="xl" surface="page" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            06 / Lessons learned
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Relationships and adoption scope determined where Transform gained traction.
              </Heading>
              <Heading as="h3" size="lg">
                Product relationships affected adoption
              </Heading>
              <Paragraph size="lg">
                Adoption moved faster when product teams had regular contact with Transform designers. Those
                relationships gave teams a place to resolve implementation questions, request components, and
                influence the backlog. Teams without that contact were harder to support and slower to adopt
                the system.
              </Paragraph>
              <Heading as="h3" size="lg">
                Replace shared components before rebuilding applications
              </Heading>
              <Paragraph size="lg">
                Our first adoption strategy targeted one application at a time. Each migration depended on
                product, engineering, design, and leadership agreeing to prioritize a substantial rebuild. That
                alignment was difficult to sustain across applications that predated Transform.
              </Paragraph>
              <Paragraph size="lg">
                I would now begin with shared components such as buttons and replace them incrementally across
                applications. That approach asks each team for a smaller commitment and introduces the system
                without waiting for a complete application rebuild.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/changelog.png`}
          alt="Changelog Example"
          caption="The design-library changelog records component changes and releases for teams using Transform."
          size="lg"
          align="center"
        />
        <Figure
          src={`${getRouteBase()}/img/transform/cards_doc.png`}
          alt="Card Documentation Example"
          caption="Card documentation explains the component’s structure, available configurations, and usage guidance."
          size="lg"
          align="center"
        />
      </Section>

      <Section id="example-app" padding="lg" contentWidth="xl" surface="panel" gap="lg">
        <Grid columns={{ xs: 1, md: 3 }} gap="lg">
          <Heading as="h2" size="sm" color="muted">
            07 / Real-world example
          </Heading>
          <GridItem span={{ xs: 1, md: 2 }}>
            <Stack gap="md">
              <Heading as="h3" size={{ xs: "lg", md: "xl" }}>
                Transform brings complex authorization workflows into one consistent experience.
              </Heading>
              <Paragraph>
                This TruCare Cloud determinations screen brings together authorization history,
                attachments, review line items and an activity feed. Shared navigation, status cards,
                filters, expandable tables and pagination help organize a dense workflow using
                Transform’s reusable components and patterns.
              </Paragraph>
            </Stack>
          </GridItem>
        </Grid>
        <Figure
          src={`${getRouteBase()}/img/transform/trucare-determinations.png`}
          alt="TruCare Cloud determinations screen with authorization history cards, an attachments table with an expanded row, review-needed and no-review-needed line item tables, section navigation and an activity feed."
          caption="Transform in practice: TruCare Cloud combines shared components and patterns to support an authorization workflow, from reviewing history and attachments to tracking line items and activity."
          size="lg"
          align="center"
        />
      </Section>

      <Section id="outcome" padding="lg" contentWidth="sm" gap="sm" inverse>
        <Heading as="h2" size="xl">
          Transform established a foundation that carried forward into Fondue.
        </Heading>
        <Paragraph size="lg">
          I carried Transform’s component lifecycle and accessibility testing into my work on Fondue, along
          with its documentation and support practices. The experience also changed my adoption strategy:
          replace shared components incrementally before asking teams to rebuild whole applications.
        </Paragraph>
        <Figure
          src={`${getRouteBase()}/img/transform/transform-to-fondue.png`}
          alt="Transform logo with an arrow pointing to the Fondue logo"
          caption="Transform’s component lifecycle, accessibility practices, documentation and support model carried forward into Fondue."
        />
        <Cluster gap="lg">
          <Link href={getRoutePath("home")}>Explore more work →</Link>
        </Cluster>
      </Section>
    </article>
  );
}
